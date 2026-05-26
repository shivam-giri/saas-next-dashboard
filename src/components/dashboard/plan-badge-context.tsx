"use client";

import { createContext, useContext } from "react";

type PlanContextType = {
  isPro: boolean;
  creditsRemaining: number;
};

// ── Context ──────────────────────────────────────────────────────────────────
const PlanBadgeContext = createContext<PlanContextType>({ isPro: false, creditsRemaining: 0 });

// ── Provider (used in the server layout, wraps children) ─────────────────────
export function PlanBadgeProvider({
  isPro,
  creditsRemaining,
  children,
}: {
  isPro: boolean;
  creditsRemaining: number;
  children: React.ReactNode;
}) {
  return (
    <PlanBadgeContext.Provider value={{ isPro, creditsRemaining }}>
      {children}
    </PlanBadgeContext.Provider>
  );
}

// ── Hook (used in TopNav) ────────────────────────────────────────────────────
export function usePlan() {
  return useContext(PlanBadgeContext);
}
