"use client";

import { useActionState, useState } from "react";
import { signInCredentialsAction, signInMagicLinkAction } from "@/app/actions/auth";

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [method, setMethod] = useState<"credentials" | "magic-link">("credentials");

  const [credState, credAction, credPending] = useActionState(signInCredentialsAction, null);
  const [magicState, magicAction, magicPending] = useActionState(signInMagicLinkAction, null);

  return (
    <div className="mt-8 space-y-6">
      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setMethod("credentials")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
            method === "credentials" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setMethod("magic-link")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
            method === "magic-link" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Magic Link
        </button>
      </div>

      {method === "credentials" && (
        <form action={credAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          
          <div>
            <label htmlFor="email-cred" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email-cred"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {credState?.error && (
            <div className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md">
              {credState.error}
            </div>
          )}

          <button
            type="submit"
            disabled={credPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {credPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      )}

      {method === "magic-link" && (
        <form action={magicAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          
          <div>
            <label htmlFor="email-magic" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <p className="text-xs text-slate-500 mb-2 mt-1">We'll email you a magic link for a password-free sign in.</p>
            <input
              id="email-magic"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          {magicState?.error ? (
            <div className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-md">
              {magicState.error}
            </div>
          ) : null}

          {/* Nodemailer provider automatically handles success redirection, but if we need a UI state: */}
          <button
            type="submit"
            disabled={magicPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-zinc-800 flex-col items-center disabled:opacity-50"
          >
             {magicPending ? "Sending link..." : "Send Magic Link"}
          </button>
        </form>
      )}
    </div>
  );
}
