import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/stripe";
import { redirect, notFound } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PlanBadgeProvider } from "@/components/dashboard/plan-badge-context";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  const resolvedParams = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  // Fetch the membership for the requested workspace (verifies access)
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: { slug: resolvedParams.workspaceSlug },
    },
    include: {
      workspace: true,
    },
  });

  if (!membership) {
    return notFound();
  }

  // Stamp this workspace as the most-recently-visited (fire-and-forget is fine here)
  prisma.workspaceMember
    .update({
      where: { id: membership.id },
      data: { lastAccessedAt: new Date() },
    })
    .catch(() => {
      // Non-critical; silently swallow any update error
    });

  // Fetch all workspaces this user belongs to so the sidebar can render the switcher
  const allMemberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: { workspace: true },
    orderBy: [
      { lastAccessedAt: "desc" },
      { createdAt: "asc" },
    ],
  });

  const allWorkspaces = allMemberships.map((m) => ({
    name: m.workspace.name,
    slug: m.workspace.slug,
  }));

  const isPro = hasActiveSubscription(
    membership.workspace.stripeSubscriptionId,
    membership.workspace.stripeCurrentPeriodEnd
  );

  return (
    <PlanBadgeProvider isPro={isPro}>
      <div className="flex h-screen bg-[#0F0F1A] overflow-hidden">
        {/* Client Component Sidebar (Handles Active Routes via URL) */}
        <Sidebar
          workspaceName={membership.workspace.name}
          workspaceSlug={resolvedParams.workspaceSlug}
          role={membership.role}
          allWorkspaces={allWorkspaces}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </PlanBadgeProvider>
  );
}
