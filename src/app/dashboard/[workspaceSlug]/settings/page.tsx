import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateWorkspaceAction, deleteWorkspaceAction } from "@/app/actions/settings";
import { redirect, notFound } from "next/navigation";
import { TopNav } from "@/components/dashboard/topnav";

export default async function SettingsPage({
    params,
  }: {
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
        include: { workspace: true },
    });

    if (!membership) return notFound();

    const isAdmin = membership.role === "ADMIN";
    const workspace = membership.workspace;

    const boundUpdateAction = async (formData: FormData) => {
        "use server";
        await updateWorkspaceAction(formData, resolvedParams.workspaceSlug);
    };

    const boundDeleteAction = async (formData: FormData) => {
        "use server";
        await deleteWorkspaceAction(formData, resolvedParams.workspaceSlug);
    };

    return (
        <div className="flex flex-col h-full">
            <TopNav title="Settings" />
            <div className="max-w-3xl mx-auto space-y-8 p-4 md:p-8 w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace Settings</h1>
                <p className="text-slate-500 mt-1">Manage {workspace.name}'s identity and dangerous configurations.</p>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold mb-1 text-slate-900">General Information</h2>
                    <p className="text-sm text-slate-500 mb-6">Update your workspace name and URL slug.</p>

                    <form action={boundUpdateAction} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Workspace Name</label>
                            <input 
                                type="text"
                                id="name"
                                name="name"
                                required
                                defaultValue={workspace.name}
                                disabled={!isAdmin}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${!isAdmin && 'bg-slate-50 text-slate-500 cursor-not-allowed'}`}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 bg-slate-50 text-slate-500 sm:text-sm">
                                    /dashboard/
                                </span>
                                <input 
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    required
                                    defaultValue={workspace.slug}
                                    disabled={!isAdmin}
                                    className={`flex-1 w-full px-4 py-2 border rounded-none rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none ${!isAdmin && 'bg-slate-50 text-slate-500 cursor-not-allowed'}`}
                                />
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="pt-2">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        )}
                        {!isAdmin && (
                            <p className="text-sm text-slate-500 italic mt-2">Only administrators can modify these settings.</p>
                        )}
                    </form>
                </div>
            </div>

            {/* DANGER ZONE */}
            {isAdmin && (
                <div className="border border-red-200 rounded-xl overflow-hidden shadow-sm bg-red-50/30">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-red-600 mb-1">Danger Zone</h2>
                        <p className="text-sm text-slate-600 mb-6">Permanently delete this workspace and all of its associated data including members, subscriptions, and settings. This cannot be undone.</p>

                        <form action={boundDeleteAction} className="bg-white border border-red-100 p-5 rounded-lg space-y-4">
                            <div>
                                <label htmlFor="confirmText" className="block text-sm font-medium text-slate-700 mb-1">
                                    To verify, type <span className="font-bold">{workspace.name}</span> below:
                                </label>
                                <input 
                                    type="text"
                                    id="confirmText"
                                    name="confirmText"
                                    required
                                    className="w-full px-4 py-2 border border-red-300 focus:border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                            
                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-sm w-full md:w-auto">
                                Delete Workspace
                            </button>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
