import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/topnav";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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
    include: {
      workspace: true,
    },
  });

  if (!membership) {
    return notFound(); 
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Client Component Sidebar (Handles Active Routes via URL) */}
      <Sidebar 
        workspaceName={membership.workspace.name} 
        workspaceSlug={resolvedParams.workspaceSlug} 
        role={membership.role} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Server Component Top Navigation (Handles Auth & Logout) */}
        <TopNav />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
