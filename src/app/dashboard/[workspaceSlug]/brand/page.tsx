import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { TopNav } from "@/components/dashboard/topnav";
import { BrandForm } from "./brand-form";

export default async function BrandSettingsPage({
  params,
}: {
  params: Promise<any>;
}) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const workspace = await prisma.workspace.findUnique({
    where: { slug: resolvedParams.workspaceSlug },
    include: {
      brandVoice: true,
      members: { where: { userId: session.user.id } },
    },
  });

  if (!workspace || workspace.members.length === 0) return notFound();

  const isAdmin = workspace.members[0].role === "ADMIN";

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
      <TopNav title="Brand Voice" />
      <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Brand Voice 🧠</h1>
          <p className="text-[#9CA3AF]">
            Configure your company's tone and audience. Our AI will automatically inject this context into every campaign generated in this workspace.
          </p>
        </div>

        <div className="bg-[#1A1A2E] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-6">
            <BrandForm 
              workspaceId={workspace.id} 
              initialData={workspace.brandVoice} 
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
