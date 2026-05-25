"use client";

import { useState } from "react";
import { saveBrandVoiceAction } from "@/app/actions/ai";
import { Loader2 } from "lucide-react";

export function BrandForm({
  workspaceId,
  initialData,
  isAdmin
}: {
  workspaceId: string;
  initialData: any;
  isAdmin: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await saveBrandVoiceAction(workspaceId, formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Brand voice saved successfully!" });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg border ${message.type === "error" ? "bg-red-500/10 border-red-500/50 text-red-200" : "bg-emerald-500/10 border-emerald-500/50 text-emerald-200"}`}>
          {message.text}
        </div>
      )}

      {!isAdmin && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-200 text-sm mb-6">
          You are viewing this as a Member. Only Workspace Admins can edit the Brand Voice.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Tone of Voice
        </label>
        <input
          name="tone"
          defaultValue={initialData?.tone || ""}
          disabled={!isAdmin}
          placeholder="e.g., Professional, friendly, and authoritative"
          className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Target Audience
        </label>
        <textarea
          name="targetAudience"
          defaultValue={initialData?.targetAudience || ""}
          disabled={!isAdmin}
          rows={3}
          placeholder="e.g., Enterprise IT managers and CTOs looking to secure their infrastructure."
          className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Core Values / Key Messaging
        </label>
        <textarea
          name="coreValues"
          defaultValue={initialData?.coreValues || ""}
          disabled={!isAdmin}
          rows={3}
          placeholder="e.g., We value simplicity, security, and developer experience."
          className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Do NOT Use These Words
        </label>
        <input
          name="doNotUseWords"
          defaultValue={initialData?.doNotUseWords || ""}
          disabled={!isAdmin}
          placeholder="e.g., Synergy, leverage, paradigm shift"
          className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] disabled:opacity-50"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">The AI will strictly avoid using these words in generated content.</p>
      </div>

      {isAdmin && (
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Save Brand Voice
          </button>
        </div>
      )}
    </form>
  );
}
