"use client";

import { useActionState } from "react";
import { createWorkspaceAction } from "@/app/actions/workspace";
import { Loader2 } from "lucide-react";

export function CreateWorkspaceForm() {
    const [state, formAction, isPending] = useActionState(createWorkspaceAction, null);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="workspaceName" className="block text-2xl font-medium text-green-100 mb-2">
                    Workspace Name
                </label>
                <input
                    type="text"
                    name="workspaceName"
                    id="workspaceName"
                    className="w-full border border-gray-300 rounded-lg px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    placeholder="e.g. Acme Corp"
                    required
                />
            </div>

            {state?.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium rounded-lg px-8 py-4 text-2xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isPending && <Loader2 className="w-6 h-6 animate-spin" />}
                {isPending ? "Creating..." : "Create Workspace"}
            </button>
        </form>
    );
}
