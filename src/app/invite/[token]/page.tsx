import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // ── 1. Look up the invitation ──────────────────────────────────────────────
  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { token },
    include: { workspace: true },
  });

  // ── 2. Invalid / already used ──────────────────────────────────────────────
  if (!invitation) {
    return <InviteError message="This invitation link is invalid or has already been used." />;
  }

  if (invitation.acceptedAt) {
    return <InviteError message="This invitation has already been accepted." />;
  }

  if (invitation.expiresAt < new Date()) {
    return <InviteError message="This invitation link has expired. Please ask for a new one." />;
  }

  // ── 3. Check if the visitor is signed in ──────────────────────────────────
  const session = await auth();

  if (!session?.user?.id) {
    // Not signed in — redirect to Google with this page as the callbackUrl
    const callbackUrl = encodeURIComponent(`/invite/${token}`);
    redirect(`/api/auth/signin?callbackUrl=${callbackUrl}`);
  }

  // ── 4. Accept the invitation ───────────────────────────────────────────────
  const workspace = invitation.workspace;

  // Check if already a member
  const existingMembership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: session.user.id,
        workspaceId: workspace.id,
      },
    },
  });

  if (!existingMembership) {
    await prisma.workspaceMember.create({
      data: {
        userId: session.user.id,
        workspaceId: workspace.id,
        role: invitation.role,
      },
    });
  }

  // Mark the invitation as accepted (single-use)
  await prisma.workspaceInvitation.update({
    where: { id: invitation.id },
    data: { acceptedAt: new Date() },
  });

  // ── 5. Redirect to the workspace ──────────────────────────────────────────
  redirect(`/dashboard/${workspace.slug}`);
}

// ── Error card component ──────────────────────────────────────────────────────
function InviteError({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white border border-red-100 rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Invitation Unavailable</h1>
        <p className="text-slate-500 text-sm mb-6">{message}</p>
        <a
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition text-sm"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
