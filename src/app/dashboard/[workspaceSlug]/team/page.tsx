import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeMemberAction } from "@/app/actions/team";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/dashboard/topnav";
import { InviteForm } from "@/components/dashboard/invite-form";
import { PendingInvitations } from "@/components/dashboard/pending-invitations";

export default async function TeamPage({
    params,
}: {
    params: Promise<any>;
}) {
    const resolvedParams = await params;
    const session = await auth();
    if (!session?.user?.id) redirect("/api/auth/signin");

    const membership = await prisma.workspaceMember.findFirst({
        where: {
            userId: session.user.id,
            workspace: { slug: resolvedParams.workspaceSlug },
        },
        include: { workspace: true },
    });

    if (!membership) redirect("/onboarding");

    const isAdmin = membership.role === "ADMIN";
    const workspaceSlug = resolvedParams.workspaceSlug as string;

    const [allMembers, pendingInvitations] = await Promise.all([
        prisma.workspaceMember.findMany({
            where: { workspaceId: membership.workspaceId },
            include: { user: true },
            orderBy: { createdAt: "asc" },
        }),
        isAdmin
            ? prisma.workspaceInvitation.findMany({
                where: { workspaceId: membership.workspaceId, acceptedAt: null },
                orderBy: { createdAt: "desc" },
            })
            : Promise.resolve([]),
    ]);

    const boundRemoveAction = async (formData: FormData) => {
        "use server";
        const memberId = formData.get("memberId") as string;
        await removeMemberAction(memberId, workspaceSlug);
    };

    return (
        <div className="flex flex-col h-full">
            <TopNav title="Team Members" />
            <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">Team Members</h1>
                        <p className="text-[#445c86] mt-1 text-md">Manage who has access to {membership.workspace.name}.</p>
                    </div>
                </div>

                {/* ── Invite form (admin only) ──────────────────────────────────── */}
                {isAdmin && <InviteForm workspaceSlug={workspaceSlug} />}

                {/* ── Pending invitations (admin only) ─────────────────────────── */}
                {isAdmin && (
                    <PendingInvitations
                        invitations={pendingInvitations}
                        workspaceSlug={workspaceSlug}
                    />
                )}

                {/* ── Members table ─────────────────────────────────────────────── */}
                <div className="bg-[#1A1A2E] border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0F0F1A] border-b">
                                <th className="py-3 px-6 font-semibold text-lg text-[#9CA3AF]">User</th>
                                <th className="py-3 px-6 font-semibold text-lg text-[#9CA3AF]">Role</th>
                                <th className="py-3 px-6 font-semibold text-lg text-[#9CA3AF]">Joined</th>
                                {isAdmin && (
                                    <th className="py-3 px-6 font-semibold text-lg text-[#9CA3AF] text-right">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {allMembers.map((member) => (
                                <tr key={member.id} className="border-b last:border-b-0 hover:bg-[#0F0F1A]/50">
                                    <td className="py-4 px-6 flex items-center">
                                        <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-[#9CA3AF] font-bold mr-3 overflow-hidden">
                                            {member.user.image ? (
                                                <img
                                                    src={member.user.image}
                                                    alt={member.user.name || "User"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                (member.user.name || member.user.email || "U").charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-[#E5E7EB]">
                                                {member.user.name || "Anonymous User"}
                                            </div>
                                            <div className="text-lg text-[#9CA3AF]">{member.user.email}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`text-sm px-2 py-1 rounded-full font-bold ${member.role === "ADMIN"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-[#1A1A2E] text-[#E5E7EB]"
                                                }`}
                                        >
                                            {member.role}
                                        </span>
                                        {member.userId === session.user?.id && (
                                            <span className="ml-2 text-sm text-[#9CA3AF] font-medium">(You)</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-lg text-[#9CA3AF]">
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </td>
                                    {isAdmin && (
                                        <td className="py-4 px-6 text-right">
                                            {member.id !== membership.id && (
                                                <form action={boundRemoveAction}>
                                                    <input type="hidden" name="memberId" value={member.id} />
                                                    <button
                                                        type="submit"
                                                        className="text-red-500 hover:text-red-700 text-lg font-medium transition"
                                                    >
                                                        Remove
                                                    </button>
                                                </form>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allMembers.length === 0 && (
                        <div className="p-8 text-center text-[#9CA3AF]">No members found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
