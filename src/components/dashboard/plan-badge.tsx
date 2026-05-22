"use client";

import { usePlan } from "./plan-badge-context";

export function PlanBadge() {
  const isPro = usePlan();

  return (
    <div
      className={`p-1.5 w-32 absolute top-3 right-3 text-center rounded-md text-xs font-bold tracking-wide uppercase shadow-sm border ${
        isPro
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/50"
          : "bg-gray-800 text-gray-300 border-gray-700"
      }`}
    >
      {isPro ? "Pro Plan" : "Free Plan"}
    </div>
  );
}
