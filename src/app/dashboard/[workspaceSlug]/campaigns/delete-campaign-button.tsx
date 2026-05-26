"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCampaignAction } from "@/app/actions/ai";
import { useRouter } from "next/navigation";

export function DeleteCampaignButton({ campaignId, workspaceId }: { campaignId: string, workspaceId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigating to the campaign details page
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this entire campaign and all its assets? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    await deleteCampaignAction(campaignId, workspaceId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ml-2 flex-shrink-0 disabled:opacity-50"
      title="Delete Campaign"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
