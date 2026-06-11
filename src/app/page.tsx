import Link from "next/link";
import { Sparkles, BrainCircuit, Layers, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0B0B13] font-sans selection:bg-[#8B5CF6]/30">
            {/* BACKGROUND GLOW */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none blur-[120px] bg-gradient-to-b from-[#8B5CF6] to-transparent rounded-full" />

            {/* NAVBAR */}
            <header className="relative z-10 w-full flex items-center justify-between px-6 sm:px-12 py-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">ContentCore</h1>
                </div>

                <Link
                    href="/dashboard"
                    className="px-6 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all border border-white/10 hover:border-white/20 backdrop-blur-md"
                >
                    Sign In
                </Link>
            </header>

            {/* HERO */}
            <main className="relative z-10 flex flex-1 flex-col items-center text-center px-4 sm:px-6 pt-24 pb-20">
                <div className="max-w-4xl flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#A78BFA] text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Next-Gen AI Content Operations
                    </div>

                    <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                        AI Content That Actually <br className="hidden sm:block" /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD]">
                            Sounds Like You.
                        </span>
                    </h2>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mt-4 leading-relaxed">
                        Stop editing generic ChatGPT output. Train our AI on your exact tone, audience, and core values to generate multi-channel campaigns in seconds.
                    </p>

                    {/* BIG CTA BUTTON */}
                    <Link
                        href="/dashboard"
                        className="mt-8 group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        Start Generating Magic
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* FEATURE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full px-4 sm:px-8">
                    
                    {/* Card 1 */}
                    <div className="p-8 rounded-3xl bg-[#131320] border border-white/5 hover:border-[#8B5CF6]/30 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-3xl group-hover:bg-[#8B5CF6]/10 transition-colors" />
                        <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20 text-[#A78BFA]">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Brand Voice Memory</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Define your tone, audience, and forbidden words just once. The AI remembers your rules and applies them to every piece of content.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-8 rounded-3xl bg-[#131320] border border-white/5 hover:border-[#8B5CF6]/30 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-3xl group-hover:bg-[#8B5CF6]/10 transition-colors" />
                        <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20 text-[#A78BFA]">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Multi-Channel Campaigns</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Enter a single topic and instantly generate a perfectly tailored Blog Post, Twitter Thread, LinkedIn update, and Newsletter.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-8 rounded-3xl bg-[#131320] border border-white/5 hover:border-[#8B5CF6]/30 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-3xl group-hover:bg-[#8B5CF6]/10 transition-colors" />
                        <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20 text-[#A78BFA]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Human-in-the-Loop</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Nothing goes live automatically. Content is generated as Drafts and must go through an Admin approval workflow before publishing.
                        </p>
                    </div>

                </div>
            </main>

            {/* FOOTER */}
            <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-8 py-8 mt-auto border-t border-white/5 bg-[#0B0B13]/80 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4 sm:mb-0 opacity-50 hover:opacity-100 transition-opacity">
                    <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                    <span className="font-semibold text-white">ContentCore</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Link href="/documentation" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                        Documentation
                    </Link>
                    <div className="text-sm text-slate-500">
                        © {new Date().getFullYear()} ContentCore AI. Built for modern brands.
                    </div>
                </div>
            </footer>
        </div>
    );
}