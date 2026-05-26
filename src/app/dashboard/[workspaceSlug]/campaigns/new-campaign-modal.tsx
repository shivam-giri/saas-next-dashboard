"use client";

import { useState } from "react";
import { Plus, X, Loader2, Sparkles, Check } from "lucide-react";
import { createCampaignAction } from "@/app/actions/ai";
import { useRouter } from "next/navigation";

const CONTENT_TYPES = [
  { id: "BLOG", label: "Blog Post" },
  { id: "TWEET", label: "Twitter Thread" },
  { id: "LINKEDIN", label: "LinkedIn Post" },
  { id: "EMAIL", label: "Newsletter" }
];

export function NewCampaignModal({ workspaceId, workspaceSlug }: { workspaceId: string, workspaceSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default to all selected
  const [selectedTypes, setSelectedTypes] = useState<string[]>(CONTENT_TYPES.map(t => t.id));
  
  const router = useRouter();

  const toggleType = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedTypes.length === 0) {
      setError("Please select at least one content type to generate.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Append the selected types array to formData
    selectedTypes.forEach(type => formData.append("types", type));

    const result = await createCampaignAction(workspaceId, formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.campaignId) {
      setIsOpen(false);
      router.push(`/dashboard/${workspaceSlug}/campaigns/${result.campaignId}`);
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
                Describe your topic, select the formats you need, and our AI will automatically draft them aligned with your brand voice.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
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
                  rows={3}
                  placeholder="e.g., We are launching a new dark mode feature that saves battery life and reduces eye strain."
                  className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What should the AI generate?
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map(type => {
                    const isSelected = selectedTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => toggleType(type.id)}
                        disabled={loading}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected 
                            ? "bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30" 
                            : "bg-[#0F0F1A] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300"
                        } disabled:opacity-50`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-[#A78BFA] bg-[#8B5CF6]" : "border-slate-500"}`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-white/5">
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
                  disabled={loading || selectedTypes.length === 0}
                  className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
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
