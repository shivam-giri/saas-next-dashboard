import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Plus, LayoutTemplate, FileText, ArrowRight } from "lucide-react";
import { NewCampaignModal } from "./new-campaign-modal";
import { formatDistanceToNow } from "date-fns";

export default async function CampaignsPage({
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
      members: { where: { userId: session.user.id } },
      campaigns: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { documents: true } }
        }
      }
    },
  });

  if (!workspace || workspace.members.length === 0) return notFound();

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Campaigns 📝</h1>
          <p className="text-[#9CA3AF]">
            Generate and manage AI-powered multi-channel content campaigns.
          </p>
        </div>
        <NewCampaignModal workspaceId={workspace.id} workspaceSlug={resolvedParams.workspaceSlug} />
      </div>

      {workspace.campaigns.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/20 rounded-3xl bg-white/5">
          <LayoutTemplate className="w-16 h-16 text-[#8B5CF6] mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-bold text-white mb-2">No campaigns yet</h3>
          <p className="text-[#9CA3AF] max-w-md mx-auto mb-6">
            Create your first campaign to automatically generate a blog post, tweets, LinkedIn post, and email newsletter all at once.
          </p>
          <NewCampaignModal workspaceId={workspace.id} workspaceSlug={resolvedParams.workspaceSlug} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspace.campaigns.map((campaign) => (
            <Link 
              key={campaign.id} 
              href={`/dashboard/${resolvedParams.workspaceSlug}/campaigns/${campaign.id}`}
              className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 hover:border-[#8B5CF6]/50 transition-all hover:shadow-lg hover:shadow-[#8B5CF6]/10 group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-xl font-semibold text-white truncate group-hover:text-[#8B5CF6] transition-colors">{campaign.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  campaign.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
                  campaign.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-400" :
                  "bg-white/10 text-[#9CA3AF]"
                }`}>
                  {campaign.status}
                </span>
              </div>
              
              <p className="text-sm text-[#9CA3AF] line-clamp-2 mb-6 flex-1">
                {campaign.topic}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center text-sm text-slate-400">
                  <FileText className="w-4 h-4 mr-1.5" />
                  {campaign._count.documents} Assets
                </div>
                <div className="text-xs text-slate-500 flex items-center">
                  {formatDistanceToNow(campaign.createdAt, { addSuffix: true })}
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
