"use client";

import { useActionState } from "react";
import { signUpAction } from "@/app/actions/auth";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, null);

  const inputCls =
    "mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300";

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
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-lg">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
      >
        {pending ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
