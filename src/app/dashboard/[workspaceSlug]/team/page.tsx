import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inviteUserAction, removeMemberAction } from "@/app/actions/team";
import { redirect } from "next/navigation";

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

    const allMembers = await prisma.workspaceMember.findMany({
        where: {
            workspaceId: membership.workspaceId,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    // Create safe server actions dynamically bound to the current slug
    const boundInviteAction = async (formData: FormData) => {
        "use server";
        await inviteUserAction(formData, resolvedParams.workspaceSlug);
    };

    const boundRemoveAction = async (formData: FormData) => {
        "use server";
        const memberId = formData.get("memberId") as string;
        await removeMemberAction(memberId, resolvedParams.workspaceSlug);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Members</h1>
                    <p className="text-slate-500 mt-1">Manage who has access to {membership.workspace.name}.</p>
                </div>
            </div>

            {isAdmin && (
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900">Invite New Member</h2>
                    <form action={boundInviteAction} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="email" className="sr-only">Email Address</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email"
                                required
                                placeholder="colleague@company.com" 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label htmlFor="role" className="sr-only">Role</label>
                            <select 
                                id="role"
                                name="role"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                                <option value="MEMBER">Member</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition">
                            Send Invite
                        </button>
                    </form>
                    <p className="text-sm text-slate-500 mt-3">
                        *Users must have already signed in at least once via Google to be added via email.
                    </p>
                </div>
            )}

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b">
                            <th className="py-3 px-6 font-semibold text-sm text-slate-600">User</th>
                            <th className="py-3 px-6 font-semibold text-sm text-slate-600">Role</th>
                            <th className="py-3 px-6 font-semibold text-sm text-slate-600">Joined</th>
                            {isAdmin && <th className="py-3 px-6 font-semibold text-sm text-slate-600 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {allMembers.map((member) => (
                            <tr key={member.id} className="border-b last:border-b-0 hover:bg-slate-50/50">
                                <td className="py-4 px-6 flex items-center">
                                    <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold mr-3 overflow-hidden">
                                        {member.user.image ? (
                                            <img src={member.user.image} alt={member.user.name || "User"} className="h-full w-full object-cover" />
                                        ) : (
                                            (member.user.name || member.user.email || "U").charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{member.user.name || "Anonymous User"}</div>
                                        <div className="text-sm text-slate-500">{member.user.email}</div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {member.role}
                                    </span>
                                    {member.userId === session.user?.id && (
                                        <span className="ml-2 text-xs text-slate-400 font-medium">(You)</span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm text-slate-500">
                                    {new Date(member.createdAt).toLocaleDateString()}
                                </td>
                                {isAdmin && (
                                    <td className="py-4 px-6 text-right">
                                        {member.id !== membership.id && (
                                            <form action={boundRemoveAction}>
                                                <input type="hidden" name="memberId" value={member.id} />
                                                <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium transition">
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
                    <div className="p-8 text-center text-slate-500">No members found.</div>
                )}
            </div>
        </div>
    );
}
