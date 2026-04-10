import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  // 1. Verify user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // 2. Fetch the user's first workspace membership
  const firstMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      workspace: true,
    },
  });

  // 3. Routing Logic:
  // If they belong to a workspace, magically teleport them to it.
  // If they don't, lock them out of the dashboard and redirect to /onboarding
  if (firstMembership) {
    redirect(`/dashboard/${firstMembership.workspace.slug}`);
  } else {
    redirect("/onboarding");
  }
}
