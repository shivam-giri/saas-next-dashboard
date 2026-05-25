import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { DocumentCard } from "./document-card";

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<any>;
}) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const campaign = await prisma.campaign.findFirst({
    where: { 
      id: resolvedParams.campaignId,
      workspace: { slug: resolvedParams.workspaceSlug }
    },
    include: {
      documents: {
        orderBy: { createdAt: "asc" }
      },
      workspace: {
        include: {
          members: { where: { userId: session.user.id } }
        }
      }
    },
  });

  if (!campaign || campaign.workspace.members.length === 0) return notFound();

  const isAdmin = campaign.workspace.members[0].role === "ADMIN";

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <Link 
          href={`/dashboard/${resolvedParams.workspaceSlug}/campaigns`}
          className="inline-flex items-center text-sm font-medium text-[#9CA3AF] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Campaigns
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            campaign.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
            campaign.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-400" :
            "bg-white/10 text-[#9CA3AF]"
          }`}>
            {campaign.status}
          </span>
        </div>
        <p className="text-[#9CA3AF] max-w-3xl">
          <span className="font-semibold text-slate-300">Topic:</span> {campaign.topic}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaign.documents.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            document={doc} 
            isAdmin={isAdmin}
            workspaceId={campaign.workspaceId}
          />
        ))}
      </div>
    </div>
  );
}
