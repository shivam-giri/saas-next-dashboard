"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Suspense } from "react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [state, action, isPending] = useActionState(resetPasswordAction, null);

    const inputCls =
        "mt-1 block w-full px-3 py-2 border border-white/40 rounded-lg shadow-sm placeholder-slate-400 bg-[#0F0F1A] text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition";

    // No token in URL
    if (!token) {
        return (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-5 text-center space-y-3">
                <p className="text-red-400 text-sm font-medium">Invalid or missing reset link.</p>
                <Link href="/auth/forgot-password" className="inline-block text-sm text-[#22D3EE] hover:underline">
                    Request a new link
                </Link>
            </div>
        );
    }

    return (
        <form action={action} className="space-y-5">
            {/* Pass token as hidden field */}
            <input type="hidden" name="token" value={token} />

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#E5E7EB] mb-1">
                    New password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className={inputCls}
                />
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#E5E7EB] mb-1">
                    Confirm new password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Repeat your new password"
                    className={inputCls}
                />
            </div>

            {state?.error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 py-2.5 px-3.5 rounded-lg">
                    {state.error}
                    {state.error.includes("expired") && (
                        <span>
                            {" "}
                            <Link href="/auth/forgot-password" className="underline font-medium">
                                Request a new one.
                            </Link>
                        </span>
                    )}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] hover:opacity-90 disabled:opacity-50 transition"
            >
                {isPending ? "Saving…" : "Reset password"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-[#1A1A2E] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/20">

                {/* Icon + Heading */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                        <KeyRound className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#22D3EE] text-center">
                        Set new password
                    </h1>
                    <p className="mt-2 text-center text-base text-[#9CA3AF]">
                        Choose a strong password for your SaaSify account.
                    </p>
                </div>

                {/* Wrap in Suspense because useSearchParams requires it */}
                <Suspense fallback={<p className="text-center text-[#9CA3AF] text-sm">Loading…</p>}>
                    <ResetPasswordForm />
                </Suspense>

                <p className="mt-6 text-center text-sm text-[#9CA3AF]">
                    Remember it now?{" "}
                    <Link href="/auth/signin" className="font-medium text-[#22D3EE] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
