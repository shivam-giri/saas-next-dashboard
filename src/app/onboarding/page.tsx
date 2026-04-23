import { createWorkspaceAction } from "@/app/actions/workspace";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-[#1A1A2E] rounded-xl shadow-md p-8 border">
                <h1 className="text-2xl font-bold mb-2">Welcome to SaaS Dashboard!</h1>
                <p className="text-gray-600 mb-6">
                    To get started, you need to create a Workspace for your team.
                </p>

                {/* Server Action Form: Works without JavaScript enabled! */}
                <form action={createWorkspaceAction} className="space-y-4">
                    <div>
                        <label htmlFor="workspaceName" className="block text-lg font-medium text-gray-700 mb-1">
                            Workspace Name
                        </label>
                        <input
                            type="text"
                            name="workspaceName"
                            id="workspaceName"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g. Acme Corp"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition"
                    >
                        Create Workspace
                    </button>
                </form>
            </div>
        </div>
    );
}
