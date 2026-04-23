"use client";

import { useActionState } from "react";
import { revokeInvitationAction } from "@/app/actions/team";

interface PendingInvitation {
    id: string;
    email: string;
    role: string;
    expiresAt: Date;
    createdAt: Date;
}

interface PendingInvitationsProps {
    invitations: PendingInvitation[];
    workspaceSlug: string;
}

export function PendingInvitations({ invitations, workspaceSlug }: PendingInvitationsProps) {
    if (invitations.length === 0) return null;

    return (
        <div className="bg-[#1A1A2E] border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-amber-50/60 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9v-2h2v2zm0-4H9V6h2v3z" />
                </svg>
                <h2 className="text-lg font-semibold text-amber-800">
                    Pending Invitations ({invitations.length})
                </h2>
            </div>
            <table className="w-full text-left border-collapse text-lg">
                <thead>
                    <tr className="border-b bg-[#0F0F1A]">
                        <th className="py-3 px-6 font-semibold text-[#9CA3AF]">Email</th>
                        <th className="py-3 px-6 font-semibold text-[#9CA3AF]">Role</th>
                        <th className="py-3 px-6 font-semibold text-[#9CA3AF]">Expires</th>
                        <th className="py-3 px-6 font-semibold text-[#9CA3AF] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invitations.map((inv) => (
                        <InvitationRow key={inv.id} invitation={inv} workspaceSlug={workspaceSlug} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function InvitationRow({
    invitation,
    workspaceSlug,
}: {
    invitation: PendingInvitation;
    workspaceSlug: string;
}) {
    const [, formAction, pending] = useActionState(revokeInvitationAction, null);

    const daysLeft = Math.ceil(
        (new Date(invitation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
        <tr className="border-b last:border-b-0 hover:bg-[#0F0F1A]/50">
            <td className="py-3 px-6 text-[#E5E7EB]">{invitation.email}</td>
            <td className="py-3 px-6">
                <span
                    className={`text-sm px-2 py-1 rounded-full font-bold ${invitation.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-[#1A1A2E] text-[#E5E7EB]"
                        }`}
                >
                    {invitation.role}
                </span>
            </td>
            <td className="py-3 px-6 text-[#9CA3AF]">
                {daysLeft > 0 ? `in ${daysLeft}d` : "Today"}
            </td>
            <td className="py-3 px-6 text-right">
                <form action={formAction}>
                    <input type="hidden" name="invitationId" value={invitation.id} />
                    <input type="hidden" name="workspaceSlug" value={workspaceSlug} />
                    <button
                        type="submit"
                        disabled={pending}
                        className="text-red-500 hover:text-red-700 font-medium disabled:opacity-60 transition"
                    >
                        {pending ? "Revoking…" : "Revoke"}
                    </button>
                </form>
            </td>
        </tr>
    );
}
