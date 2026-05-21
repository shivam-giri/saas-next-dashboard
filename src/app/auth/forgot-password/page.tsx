"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/app/actions/auth";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(forgotPasswordAction, null);

    const inputCls =
        "mt-1 block w-full px-3 py-2 border border-white/40 rounded-lg shadow-sm placeholder-slate-400 bg-[#0F0F1A] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-[#1A1A2E] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/20">

                {/* Back link */}
                <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#22D3EE] transition mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                </Link>

                {/* Icon + Heading */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                        <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#22D3EE] text-center">
                        Forgot password?
                    </h1>
                    <p className="mt-2 text-center text-base text-[#9CA3AF]">
                        Enter your email and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                {/* Success state */}
                {state && 'success' in state && state.success ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center space-y-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-emerald-300 text-sm font-medium">{state.success}</p>
                        <p className="text-[#9CA3AF] text-xs">
                            The link expires in <strong className="text-[#E5E7EB]">1 hour</strong>.
                            Check your spam folder if you don&apos;t see it.
                        </p>
                        <Link
                            href="/auth/signin"
                            className="inline-block mt-2 text-sm font-medium text-[#22D3EE] hover:underline"
                        >
                            Return to sign in
                        </Link>
                    </div>
                ) : (
                    <form action={action} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#E5E7EB] mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={inputCls}
                            />
                        </div>

                        {state && 'error' in state && state.error && (
                            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 py-2.5 px-3.5 rounded-lg">
                                {state.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] hover:opacity-90 disabled:opacity-50 transition"
                        >
                            {isPending ? "Sending…" : "Send reset link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
