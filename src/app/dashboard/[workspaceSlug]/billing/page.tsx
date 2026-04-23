import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/stripe";
import { createCheckoutSession } from "@/app/actions/billing";
import { notFound, redirect } from "next/navigation";
import { TopNav } from "@/components/dashboard/topnav";

export default async function BillingPage({
    params,
}: {
    params: Promise<any>;
}) {
    const resolvedParams = await params;
    const session = await auth();
    if (!session?.user?.id) redirect("/api/auth/signin");

    const membership = await prisma.workspaceMember.findFirst({
        where: {
            userId: session!.user.id,
            workspace: { slug: resolvedParams.workspaceSlug },
        },
        include: { workspace: true },
    });

    if (!membership) return notFound();

    const workspace = membership.workspace;
    const isPro = hasActiveSubscription(workspace.stripeSubscriptionId, workspace.stripeCurrentPeriodEnd);

    // We bind the server action safely with the exact workspace ID
    const checkoutAction = createCheckoutSession.bind(null, workspace.id);

    return (
        <div className="flex flex-col h-full">
            <TopNav title="Billing & Plans" />
            <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 w-full">
                <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">Billing & Plans</h1>

                {/* Feature Gating Example inside the UI */}
                {isPro ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-2">🎉 You are on the Pro Plan!</h2>
                        <p>Your subscription is active until {workspace.stripeCurrentPeriodEnd?.toLocaleDateString()}.</p>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-2">Free Plan</h2>
                        <p>You are currently on the free tier. Upgrade to access premium analytics and unlimited features.</p>
                    </div>
                )}

                {/* Pricing Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

                    {/* FREE PLAN */}
                    <div className="border rounded-2xl p-8 bg-[#1A1A2E] shadow-sm opacity-60">
                        <h3 className="text-2xl font-bold">Hobby</h3>
                        <div className="mt-4 text-4xl font-extrabold">$0<span className="text-lg font-medium text-gray-500">/mo</span></div>
                        <ul className="mt-8 space-y-4">
                            <li className="flex items-center text-lg"><span className="mr-3">✅</span> Up to 3 users</li>
                            <li className="flex items-center text-lg"><span className="mr-3">✅</span> Basic analytics</li>
                            <li className="flex items-center text-lg"><span className="mr-3">❌</span> Priority support</li>
                        </ul>
                    </div>

                    {/* PRO PLAN */}
                    <div className="border-2 border-blue-600 rounded-2xl p-8 bg-[#1A1A2E] shadow-md relative">
                        <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 text-sm font-bold uppercase rounded-full tracking-wide">Most Popular</div>
                        <h3 className="text-2xl font-bold text-[#E5E7EB]">Pro</h3>
                        <div className="mt-4 text-4xl font-extrabold text-[#E5E7EB]">$29<span className="text-lg font-medium text-gray-500">/mo</span></div>
                        <ul className="mt-8 space-y-4">
                            <li className="flex items-center text-lg"><span className="mr-3">✅</span> Unlimited users</li>
                            <li className="flex items-center text-lg"><span className="mr-3">✅</span> Advanced analytics backend</li>
                            <li className="flex items-center text-lg"><span className="mr-3">✅</span> Priority support</li>
                        </ul>

                        <div className="mt-8">
                            <form action={checkoutAction}>
                                <button
                                    type="submit"
                                    disabled={isPro || membership.role !== "ADMIN"}
                                    className={`w-full font-bold py-3 px-4 rounded-xl transition ${isPro || membership.role !== "ADMIN" ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                        }`}
                                >
                                    {isPro ? "Current Plan" : membership.role !== "ADMIN" ? "Admins Only" : "Upgrade to Pro"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
