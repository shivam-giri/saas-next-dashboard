import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/stripe";
import { CreateWorkspaceForm } from "./create-workspace-form";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Check workspace limit
    const memberships = await prisma.workspaceMember.findMany({
        where: { userId: session.user.id },
        include: { workspace: true },
        orderBy: { lastAccessedAt: "desc" },
    });

    if (memberships.length >= 3) {
        const hasPro = memberships.some(m => hasActiveSubscription(m.workspace.stripeSubscriptionId, m.workspace.stripeCurrentPeriodEnd));
        if (!hasPro) {
            redirect(`/dashboard/${memberships[0].workspace.slug}/billing`);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-lg bg-[#1A1A2E] rounded-xl shadow-md p-8 border border-white/40 ">
                <h1 className="text-3xl font-bold mb-2">Welcome to SaaSify!</h1>
                <p className="text-gray-200 mb-6">
                    To get started, you need to create a Workspace for your team.
                </p>

                <CreateWorkspaceForm />
            </div>
        </div>
    );
}
