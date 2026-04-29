"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Users, CreditCard, ChevronDown, Plus, Check } from "lucide-react";
import { useState } from "react";

type WorkspaceEntry = {
  name: string;
  slug: string;
};

export function Sidebar({
  workspaceName,
  workspaceSlug,
  role,
  allWorkspaces,
}: {
  workspaceName: string;
  workspaceSlug: string;
  role: string;
  allWorkspaces: WorkspaceEntry[];
}) {
  const pathname = usePathname();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: `/dashboard/${workspaceSlug}`, icon: LayoutDashboard },
    { name: "Team Members", href: `/dashboard/${workspaceSlug}/team`, icon: Users },
    { name: "Billing", href: `/dashboard/${workspaceSlug}/billing`, icon: CreditCard },
    { name: "Settings", href: `/dashboard/${workspaceSlug}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-90 bg-[#0F0F1A] text-slate-300 flex-col hidden md:flex border-r border-white/30">

      {/* ── Workspace Switcher ── */}
      <div className="relative border-b border-white/30">
        <button
          id="workspace-switcher-btn"
          type="button"
          onClick={() => setSwitcherOpen((prev) => !prev)}
          className="w-full h-16 flex items-center gap-3 px-4 hover:bg-white/5 transition-colors group"
          aria-haspopup="listbox"
          aria-expanded={switcherOpen}
        >
          {/* Avatar */}
          <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white text-sm font-bold shadow">
            {workspaceName.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <span className="flex-1 text-left font-semibold text-[#E5E7EB] text-lg truncate">
            {workspaceName}
          </span>

          {/* Chevron */}
          <ChevronDown
            className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${switcherOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* Dropdown panel */}
        {switcherOpen && (
          <div
            role="listbox"
            aria-label="Switch workspace"
            className="absolute top-full left-0 right-0 z-50 mt-1 mx-2 bg-[#1A1A2E] rounded-xl border border-white/30 shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Workspace list */}
            <div className="py-1.5">
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Your Workspaces
              </p>
              {allWorkspaces.map((ws) => {
                const isActive = ws.slug === workspaceSlug;
                return (
                  <Link
                    key={ws.slug}
                    href={`/dashboard/${ws.slug}`}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setSwitcherOpen(false)}
                    className={`flex items-center gap-3 mx-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                      ? "bg-[#8B5CF6]/15 text-[#E5E7EB]"
                      : "hover:bg-white/5 text-[#9CA3AF] hover:text-[#E5E7EB]"
                      }`}
                  >
                    <div
                      className={`h-6 w-6 shrink-0 rounded-md flex items-center justify-center text-white text-md font-bold ${isActive
                        ? "bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE]"
                        : "bg-[#2a2a45]"
                        }`}
                    >
                      {ws.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 truncate font-medium">{ws.name}</span>
                    {isActive && (
                      <Check className="h-3.5 w-3.5 text-[#8B5CF6] shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider + new workspace */}
            <div className="border-t border-white/30 py-1.5">
              <Link
                href="/onboarding"
                onClick={() => setSwitcherOpen(false)}
                className="flex items-center gap-3 mx-1.5 px-3 py-2 rounded-lg text-sm text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-white/5 transition-colors"
              >
                <div className="h-6 w-6 shrink-0 rounded-md border border-dashed border-white/20 flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">New Workspace</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" onClick={() => setSwitcherOpen(false)}>
        <div className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4 mt-2">
          Menu
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 text-xl py-2.5 rounded-lg transition-colors group ${isActive
                ? "bg-[#8B5CF6]/15 text-[#8B5CF6]"
                : "hover:bg-[#1A1A2E] hover:text-white"
                }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 ${isActive
                  ? "text-[#8B5CF6]"
                  : "text-[#9CA3AF] group-hover:text-slate-300"
                  }`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer Role Badge ── */}
      <div className="p-4 border-t border-white/30 flex items-center justify-between">
        <span className="text-sm font-medium text-[#9CA3AF]">Access Level</span>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold ${role === "ADMIN"
            ? "bg-[#8B5CF6]/20 text-[#8B5CF6]"
            : "bg-white/10 text-slate-300"
            }`}
        >
          {role}
        </span>
      </div>
    </aside>
  );
}
