"use client";

import { useActionState, useState } from "react";
import { signInCredentialsAction, signInMagicLinkAction } from "@/app/actions/auth";

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
    const [method, setMethod] = useState<"credentials" | "magic-link">("credentials");

    const [credState, credAction, credPending] = useActionState(signInCredentialsAction, null);
    const [magicState, magicAction, magicPending] = useActionState(signInMagicLinkAction, null);

    const inputCls =
        "mt-1 block w-full px-3 py-2 border border-white/40 rounded-lg shadow-sm placeholder-slate-400 bg-[#1A1A2E] text-[#E5E7EB] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg";

    return (
        <div className="mt-8 space-y-6">
            {/* Tabs */}
            <div className="flex bg-[#1A1A2E] p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => setMethod("credentials")}
                    className={`flex-1 py-2 text-lg font-medium rounded-md transition ${method === "credentials"
                        ? "bg-[#3b3bba] shadow text-[#E5E7EB] "
                        : "text-[#9CA3AF] hover:text-[#E5E7EB] "
                        }`}
                >
                    Password
                </button>
                <button
                    type="button"
                    onClick={() => setMethod("magic-link")}
                    className={`flex-1 py-2 text-lg font-medium rounded-md transition ${method === "magic-link"
                        ? "bg-[#3b3bba] shadow text-[#E5E7EB] "
                        : "text-[#9CA3AF] hover:text-[#E5E7EB] "
                        }`}
                >
                    Magic Link
                </button>
            </div>

            {method === "credentials" && (
                <form action={credAction} className="space-y-4">
                    <input type="hidden" name="callbackUrl" value={callbackUrl} />

                    <div>
                        <label htmlFor="email-cred" className="block text-lg font-medium text-[#E5E7EB] ">
                            Email Address
                        </label>
                        <input id="email-cred" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-lg font-medium text-[#E5E7EB] ">
                                Password
                            </label>
                            <a href="#" className="text-sm font-medium text-[#22D3EE] hover:text-[#22D3EE]">
                                Forgot password?
                            </a>
                        </div>
                        <input id="password" name="password" type="password" required className={inputCls} />
                    </div>

                    {credState?.error && (
                        <div className="text-lg text-red-600 bg-red-50 py-2 px-3 rounded-md">
                            {credState.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={credPending}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {credPending ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            )}

            {method === "magic-link" && (
                <form action={magicAction} className="space-y-4">
                    <input type="hidden" name="callbackUrl" value={callbackUrl} />

                    <div>
                        <label htmlFor="email-magic" className="block text-lg font-medium text-[#E5E7EB] ">
                            Email Address
                        </label>
                        <p className="text-sm text-[#9CA3AF] mb-2 mt-1">
                            We&apos;ll email you a magic link for a password-free sign in.
                        </p>
                        <input id="email-magic" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
                    </div>

                    {magicState?.error && (
                        <div className="text-lg text-red-600 bg-red-50 py-2 px-3 rounded-md">
                            {magicState.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={magicPending}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                    >
                        {magicPending ? "Sending link…" : "Send Magic Link"}
                    </button>
                </form>
            )}
        </div>
    );
}
