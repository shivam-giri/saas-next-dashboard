import { TopNav } from "@/components/dashboard/topnav";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, ArrowRight, LayoutTemplate, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function WorkspaceDashboardPage({
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
            _count: {
                select: {
                    campaigns: true,
                    documents: true,
                }
            }
        }
    });

    if (!workspace) redirect("/dashboard");

    // Fetch pending approvals
    const pendingApprovalsCount = await prisma.contentDocument.count({
        where: {
            workspaceId: workspace.id,
            status: "IN_REVIEW"
        }
    });

    // Fetch recent campaigns
    const recentCampaigns = await prisma.campaign.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            _count: {
                select: { documents: true }
            }
        }
    });

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
            <TopNav title="Overview" />
            
            <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Welcome to ContentCore</h1>
                        <p className="text-[#9CA3AF]">Here is the status of your AI content operations.</p>
                    </div>
                    <Link 
                        href={`/dashboard/${resolvedParams.workspaceSlug}/campaigns`}
                        className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-lg hover:shadow-[#8B5CF6]/20"
                    >
                        <Plus className="w-5 h-5" />
                        New Campaign
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* KPI Cards */}
                    <div className="bg-[#1A1A2E] p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
                        <div className="relative z-10">
                            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4 text-blue-400" />
                                Total Campaigns
                            </h3>
                            <p className="text-4xl font-bold text-white">{workspace._count.campaigns}</p>
                        </div>
                    </div>

                    <div className="bg-[#1A1A2E] p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                        <div className="relative z-10">
                            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-400" />
                                Assets Generated
                            </h3>
                            <p className="text-4xl font-bold text-white">{workspace._count.documents}</p>
                        </div>
                    </div>

                    <div className="bg-[#1A1A2E] p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
                        <div className="relative z-10">
                            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-400" />
                                Pending Approvals
                            </h3>
                            <p className="text-4xl font-bold text-white">{pendingApprovalsCount}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Campaigns Section */}
                <div className="bg-[#1A1A2E] rounded-2xl border border-white/10 shadow-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                        <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
                        <Link 
                            href={`/dashboard/${resolvedParams.workspaceSlug}/campaigns`}
                            className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] font-medium flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    {recentCampaigns.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-400 mb-4">You haven't generated any campaigns yet.</p>
                            <Link 
                                href={`/dashboard/${resolvedParams.workspaceSlug}/campaigns`}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                            >
                                Create your first campaign
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {recentCampaigns.map((campaign) => (
                                <Link
                                    key={campaign.id}
                                    href={`/dashboard/${resolvedParams.workspaceSlug}/campaigns/${campaign.id}`}
                                    className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <div>
                                        <h3 className="text-white font-medium group-hover:text-[#8B5CF6] transition-colors mb-1">
                                            {campaign.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-3.5 h-3.5" />
                                                {campaign._count.documents} assets
                                            </span>
                                            <span>
                                                {formatDistanceToNow(campaign.createdAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            campaign.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
                                            campaign.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-400" :
                                            "bg-white/10 text-[#9CA3AF]"
                                        }`}>
                                            {campaign.status}
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
