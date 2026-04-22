"use client";

import { useActionState, useState } from "react";
import { signInCredentialsAction, signInMagicLinkAction } from "@/app/actions/auth";

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [method, setMethod] = useState<"credentials" | "magic-link">("credentials");

  const [credState, credAction, credPending] = useActionState(signInCredentialsAction, null);
  const [magicState, magicAction, magicPending] = useActionState(signInMagicLinkAction, null);

  const inputCls =
    "mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <div className="mt-8 space-y-6">
      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setMethod("credentials")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
            method === "credentials"
              ? "bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMethod("magic-link")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
            method === "magic-link"
              ? "bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          Magic Link
        </button>
      </div>

      {method === "credentials" && (
        <form action={credAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label htmlFor="email-cred" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input id="email-cred" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <input id="password" name="password" type="password" required className={inputCls} />
          </div>

          {credState?.error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-md">
              {credState.error}
            </div>
          )}

          <button
            type="submit"
            disabled={credPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {credPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}

      {method === "magic-link" && (
        <form action={magicAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label htmlFor="email-magic" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 mt-1">
              We&apos;ll email you a magic link for a password-free sign in.
            </p>
            <input id="email-magic" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
          </div>

          {magicState?.error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-md">
              {magicState.error}
            </div>
          )}

          <button
            type="submit"
            disabled={magicPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-50 transition"
          >
            {magicPending ? "Sending link…" : "Send Magic Link"}
          </button>
        </form>
      )}
    </div>
  );
}
