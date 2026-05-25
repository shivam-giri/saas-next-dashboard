"use client";

import { useState } from "react";
import { Plus, X, Loader2, Sparkles } from "lucide-react";
import { createCampaignAction } from "@/app/actions/ai";
import { useRouter } from "next/navigation";

export function NewCampaignModal({ workspaceId, workspaceSlug }: { workspaceId: string, workspaceSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createCampaignAction(workspaceId, formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.campaignId) {
      setIsOpen(false);
      router.push(`/dashboard/${workspaceSlug}/campaigns/${result.campaignId}`);
      // Note: workspaceSlug vs workspaceId might be different if slug is used in URL.
      // We will assume a hard refresh or use router.push carefully.
      // Wait, the router push should go to the current path + /campaignId.
      // A better way: just refresh and let the user click it, or construct the URL safely.
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-lg hover:shadow-[#8B5CF6]/20"
      >
        <Plus className="w-5 h-5" />
        New Campaign
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => !loading && setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#1A1A2E] rounded-2xl shadow-2xl border border-white/10 p-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => !loading && setIsOpen(false)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Generate Campaign <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
              </h2>
              <p className="text-[#9CA3AF] text-sm">
                Describe your topic, and our AI will automatically draft a blog post, social media threads, and emails perfectly aligned with your brand voice.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Campaign Name
                </label>
                <input
                  name="name"
                  required
                  disabled={loading}
                  placeholder="e.g., Q3 Feature Launch"
                  className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  What is this campaign about?
                </label>
                <textarea
                  name="topic"
                  required
                  disabled={loading}
                  rows={4}
                  placeholder="e.g., We are launching a new dark mode feature that saves battery life and reduces eye strain. It will be available for all Pro users starting next week."
                  className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    "Generate Magic"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
