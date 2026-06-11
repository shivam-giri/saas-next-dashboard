"use client";

import { useState } from "react";
import { updateDocumentStatusAction, updateDocumentContentAction, deleteDocumentAction, updateDocumentCommentAction } from "@/app/actions/ai";
import { Loader2, CheckCircle2, Clock, Edit3, Type, Mail, MessageCircle, Share2, Save, Trash2, Copy } from "lucide-react";

export function DocumentCard({
  document,
  isAdmin,
  workspaceId,
  currentUserId
}: {
  document: any;
  isAdmin: boolean;
  workspaceId: string;
  currentUserId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(document.content);
  const [adminComments, setAdminComments] = useState(document.adminComments || "");
  const [savingComment, setSavingComment] = useState(false);

  const isCreator = document.createdById === currentUserId;
  const isDraft = document.status === "DRAFT";

  async function handleStatusChange(status: "DRAFT" | "IN_REVIEW" | "APPROVED") {
    setLoading(true);
    await updateDocumentStatusAction(document.id, status, workspaceId);
    setLoading(false);
  }

  async function handleSaveContent() {
    setSaving(true);
    await updateDocumentContentAction(document.id, content, workspaceId);
    setSaving(false);
  }

  async function handleSaveComment() {
    setSavingComment(true);
    await updateDocumentCommentAction(document.id, adminComments, workspaceId);
    setSavingComment(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this draft? This cannot be undone.")) return;
    setDeleting(true);
    await deleteDocumentAction(document.id, workspaceId);
    // Note: We don't need to setDeleting(false) if it succeeds because the card will unmount.
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const icons = {
    BLOG: Type,
    EMAIL: Mail,
    TWEET: MessageCircle,
    LINKEDIN: Share2,
  };
  const Icon = icons[document.type as keyof typeof icons] || Type;

  // We only allow editing if it's a DRAFT and the current user created it.
  const canEdit = isDraft && isCreator;

  return (
    <div className={`bg-[#1A1A2E] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-lg transition-opacity ${deleting ? "opacity-50 pointer-events-none" : ""}`}>
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
          
          <button
            onClick={handleCopy}
            className="p-1.5 ml-2 bg-white/5 border border-white/10 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 bg-[#0F0F1A] relative group">
        <textarea
          readOnly={!canEdit}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full h-64 bg-transparent text-[#E5E7EB] text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-white/10 ${canEdit ? "focus:ring-2 focus:ring-[#8B5CF6]/50 rounded-lg p-2 -m-2 transition-all" : ""}`}
        />
      </div>

      <div className="p-4 border-t border-white/10 bg-[#1A1A2E] flex flex-col gap-4">
        {(isAdmin || adminComments) && (
          <div className="flex flex-col gap-2 w-full bg-[#0F0F1A] p-3 rounded-xl border border-white/5">
            <label className="text-xs font-semibold text-[#A78BFA] flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> Admin Feedback
            </label>
            <textarea
              readOnly={!isAdmin}
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              placeholder={isAdmin ? "Add comments or requested changes for the member..." : "No comments from admin yet."}
              className={`w-full h-20 bg-transparent text-[#E5E7EB] text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-white/10 ${isAdmin ? "focus:ring-2 focus:ring-[#8B5CF6]/50 rounded-lg p-2 -m-2 transition-all" : ""}`}
            />
            {isAdmin && adminComments !== (document.adminComments || "") && (
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleSaveComment}
                  disabled={savingComment}
                  className="px-3 py-1.5 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#A78BFA] text-xs font-medium rounded-lg transition-colors flex items-center disabled:opacity-50"
                >
                  {savingComment ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Save className="w-3 h-3 mr-1.5" />}
                  Save Comment
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-[#9CA3AF]">
            Word count: {content.split(/\s+/).filter(Boolean).length}
          </div>
          
          <div className="flex gap-2">
          {canEdit && (
            <>
              <button
                onClick={handleDelete}
                disabled={deleting || saving || loading}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors flex items-center disabled:opacity-50"
                title="Delete Draft"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              
              {content !== document.content && (
                <button
                  onClick={handleSaveContent}
                  disabled={saving || loading}
                  className="px-4 py-2 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-[#A78BFA] text-sm font-medium rounded-lg transition-colors flex items-center disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Edits
                </button>
              )}
            </>
          )}

          {document.status === "DRAFT" && (
            <button
              onClick={() => handleStatusChange("IN_REVIEW")}
              disabled={loading || saving || (content !== document.content)} // Prevent submit if unsaved
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center disabled:opacity-50"
              title={content !== document.content ? "Save edits before submitting" : ""}
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
    </div>
  );
}
