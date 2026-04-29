"use client";

import { useActionState } from "react";
import { signUpAction } from "@/app/actions/auth";

export function SignUpForm() {
    const [state, formAction, pending] = useActionState(signUpAction, null);

    const inputCls =
        "mt-1 block w-full px-3 py-2 border border-white/40 rounded-lg shadow-sm placeholder-slate-400 bg-[#1A1A2E] text-[#E5E7EB] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg";

    const labelCls = "block text-lg font-medium text-[#E5E7EB] ";

    return (
        <form action={formAction} className="mt-8 space-y-5">
            <div>
                <label htmlFor="name" className={labelCls}>Full Name</label>
                <input id="name" name="name" type="text" required className={inputCls} placeholder="Jane Doe" />
            </div>

            <div>
                <label htmlFor="email-signup" className={labelCls}>Email Address</label>
                <input id="email-signup" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
            </div>

            <div>
                <label htmlFor="password-signup" className={labelCls}>Password</label>
                <input id="password-signup" name="password" type="password" required className={inputCls} />
            </div>

            <div>
                <label htmlFor="confirm-password" className={labelCls}>Confirm Password</label>
                <input id="confirm-password" name="confirmPassword" type="password" required className={inputCls} />
            </div>

            {state?.error && (
                <div className="text-lg text-red-600 bg-red-50 py-2 px-3 rounded-lg">
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={pending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
                {pending ? "Creating account…" : "Create Account"}
            </button>
        </form>
    );
}
