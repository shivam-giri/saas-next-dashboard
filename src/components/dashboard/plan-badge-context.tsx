"use client";

import { createContext, useContext } from "react";

// ── Context ──────────────────────────────────────────────────────────────────
const PlanBadgeContext = createContext<boolean>(false);

// ── Provider (used in the server layout, wraps children) ─────────────────────
export function PlanBadgeProvider({
  isPro,
  children,
}: {
  isPro: boolean;
  children: React.ReactNode;
}) {
  return (
    <PlanBadgeContext.Provider value={isPro}>
      {children}
    </PlanBadgeContext.Provider>
  );
}

// ── Hook (used in TopNav) ────────────────────────────────────────────────────
export function usePlan() {
  return useContext(PlanBadgeContext);
}
