import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  // 1. Verify user is logged in (middleware also guards this, but defence-in-depth)
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // 2. Find the most recently visited workspace, falling back to the oldest one
  const lastMembership = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id },
    include: { workspace: true },
    orderBy: [
      // NULLs (never visited) sort last; most recent visit comes first
      { lastAccessedAt: "desc" },
      { createdAt: "asc" },
    ],
  });

  // 3. Routing logic
  if (lastMembership) {
    redirect(`/dashboard/${lastMembership.workspace.slug}`);
  } else {
    // No workspace yet → guide them through onboarding
    redirect("/onboarding");
  }
}
