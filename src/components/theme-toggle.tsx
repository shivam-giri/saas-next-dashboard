"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
 const { theme, setTheme } = useTheme();
 // Avoid hydration mismatch — only render after mount
 const [mounted, setMounted] = useState(false);
 useEffect(() => setMounted(true), []);

 if (!mounted) {
 // Render a placeholder with the same size so layout doesn't shift
 return (
 <div
 className={`h-9 w-9 rounded-lg border border-white/10 ${className}`}
 aria-hidden
 />
 );
 }

 const isDark = theme === "dark";

 return (
 <button
 id="theme-toggle"
 onClick={() => setTheme(isDark ? "light" : "dark")}
 aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
 className={`
 h-9 w-9 flex items-center justify-center rounded-lg border
 border-white/10 
 bg-[#1A1A2E] 
 text-[#9CA3AF] 
 hover:bg-[#1A1A2E] 
 shadow-sm transition-all
 ${className}
 `}
 >
 {isDark ? (
 <Sun className="h-4 w-4" aria-hidden />
 ) : (
 <Moon className="h-4 w-4" aria-hidden />
 )}
 </button>
 );
}
