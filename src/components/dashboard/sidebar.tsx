"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Users, CreditCard } from "lucide-react";

export function Sidebar({
    workspaceName,
    workspaceSlug,
    role,
}: {
    workspaceName: string;
    workspaceSlug: string;
    role: string;
}) {
    const pathname = usePathname();

    const navigation = [
        { name: "Overview", href: `/dashboard/${workspaceSlug}`, icon: LayoutDashboard },
        { name: "Team Members", href: `/dashboard/${workspaceSlug}/team`, icon: Users },
        { name: "Billing", href: `/dashboard/${workspaceSlug}/billing`, icon: CreditCard },
        { name: "Settings", href: `/dashboard/${workspaceSlug}/settings`, icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#0F0F1A] text-slate-300 flex-col hidden md:flex">
            {/* Workspace Branding */}
            <div className="p-4 h-16 flex items-center border-b border-white/10 bg-slate-950 ">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                    {workspaceName.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white truncate">{workspaceName}</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4 mt-2">
                    Menu
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                ? "bg-blue-600/10 text-blue-400"
                                : "hover:bg-[#1A1A2E] hover:text-white"
                                }`}
                        >
                            <Icon
                                className={`mr-3 h-5 w-5 ${isActive
                                    ? "text-blue-400"
                                    : "text-[#9CA3AF] group-hover:text-slate-300"
                                    }`}
                            />
                            <span className="font-medium text-lg">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Role Identifier */}
            <div className="p-4 border-t border-white/10 bg-slate-950/50 flex items-center justify-between">
                <span className="text-lg font-medium">Access Level</span>
                <span
                    className={`text-sm px-2 py-1 rounded-full font-bold ${role === "ADMIN"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-slate-700 text-slate-300"
                        }`}
                >
                    {role}
                </span>
            </div>
        </aside>
    );
}
