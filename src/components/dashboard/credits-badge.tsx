"use client";

import { usePlan } from "./plan-badge-context";
import { Zap } from "lucide-react";

export function CreditsBadge() {
  const { creditsRemaining } = usePlan();

  return (
    <div
      className="p-1.5 w-32 absolute top-3 right-36 flex items-center justify-center gap-1.5 rounded-md text-xs font-bold tracking-wide shadow-sm border bg-[#1A1A2E] text-yellow-400 border-yellow-500/30"
      title="Remaining AI Content Credits"
    >
      <Zap className="w-3.5 h-3.5 fill-yellow-400" />
      {creditsRemaining} Credits
    </div>
  );
}
