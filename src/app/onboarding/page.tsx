import { createWorkspaceAction } from "@/app/actions/workspace";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-lg bg-[#1A1A2E] rounded-xl shadow-md p-8 border border-white/40 ">
                <h1 className="text-3xl font-bold mb-2">Welcome to SaaSify!</h1>
                <p className="text-gray-200 mb-6">
                    To get started, you need to create a Workspace for your team.
                </p>

                {/* Server Action Form: Works without JavaScript enabled! */}
                <form action={createWorkspaceAction} className="space-y-4">
                    <div>
                        <label htmlFor="workspaceName" className="block text-2xl font-medium text-green-100 mb-2">
                            Workspace Name
                        </label>
                        <input
                            type="text"
                            name="workspaceName"
                            id="workspaceName"
                            className="w-full border border-gray-300 rounded-lg px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g. Acme Corp"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium rounded-lg px-8 py-4 text-2xl transition"
                    >
                        Create Workspace
                    </button>
                </form>
            </div>
        </div>
    );
}
