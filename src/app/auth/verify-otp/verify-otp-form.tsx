"use client";

import { useActionState } from "react";
import { verifyEmailOTPAction } from "@/app/actions/verify-email";

export function VerifyOTPForm({ email }: { email: string }) {
    const [state, formAction, pending] = useActionState(verifyEmailOTPAction, null);

    return (
        <form action={formAction} className="mt-8 space-y-6">
            <input type="hidden" name="email" value={email} />
            
            <div>
                <label htmlFor="otp" className="sr-only">
                    Verification Code
                </label>
                <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    className="block w-full rounded-lg border-0 py-3 text-center text-3xl tracking-[0.5em] text-[#E5E7EB] bg-[#0F0F1A] shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[#22D3EE] sm:leading-6"
                    placeholder="------"
                    autoFocus
                    autoComplete="one-time-code"
                />
            </div>

            {state?.error && (
                <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded">
                    {state.error}
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={pending}
                    className="group relative flex w-full justify-center rounded-lg bg-[#22D3EE] px-3 py-3 text-lg font-semibold text-[#0F0F1A] hover:bg-[#155A67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE] transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {pending ? "Verifying..." : "Verify Code"}
                </button>
            </div>
        </form>
    );
}
