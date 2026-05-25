"use client";

import { useState } from "react";
import { updateDocumentStatusAction } from "@/app/actions/ai";
import { Loader2, CheckCircle2, Clock, Edit3, Type, Mail, MessageCircle, Share2 } from "lucide-react";

export function DocumentCard({
  document,
  isAdmin,
  workspaceId
}: {
  document: any;
  isAdmin: boolean;
  workspaceId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status: "DRAFT" | "IN_REVIEW" | "APPROVED") {
    setLoading(true);
    await updateDocumentStatusAction(document.id, status, workspaceId);
    setLoading(false);
  }

  const icons = {
    BLOG: Type,
    EMAIL: Mail,
    TWEET: MessageCircle,
    LINKEDIN: Share2,
  };
  const Icon = icons[document.type as keyof typeof icons] || Type;

  return (
    <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-lg">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="font-semibold text-white">{document.title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {document.status === "DRAFT" && (
            <span className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-300">
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Draft
            </span>
          )}
          {document.status === "IN_REVIEW" && (
            <span className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
              <Clock className="w-3.5 h-3.5 mr-1" /> In Review
            </span>
          )}
          {document.status === "APPROVED" && (
            <span className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 bg-[#0F0F1A]">
        <textarea
          readOnly
          defaultValue={document.content}
          className="w-full h-64 bg-transparent text-[#E5E7EB] text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-white/10"
        />
      </div>

      <div className="p-4 border-t border-white/10 bg-[#1A1A2E] flex items-center justify-between">
        <div className="text-xs text-[#9CA3AF]">
          Word count: {document.content.split(/\s+/).length}
        </div>
        
        <div className="flex gap-2">
          {document.status === "DRAFT" && (
            <button
              onClick={() => handleStatusChange("IN_REVIEW")}
              disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit for Review
            </button>
          )}

          {document.status === "IN_REVIEW" && isAdmin && (
            <>
              <button
                onClick={() => handleStatusChange("DRAFT")}
                disabled={loading}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusChange("APPROVED")}
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Approve
              </button>
            </>
          )}

          {document.status === "APPROVED" && (
            <button
              className="px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm font-medium rounded-lg flex items-center cursor-default"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Ready to Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
