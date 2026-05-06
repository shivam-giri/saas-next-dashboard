"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed,
    // but do not expose it to the user.
    console.error("Caught in error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1A2E] p-8 rounded-2xl shadow-xl border border-white/10 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-500/10 flex items-center justify-center rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#E5E7EB]">
          Something went wrong
        </h2>
        
        <p className="text-[#9CA3AF]">
          We encountered an unexpected issue while processing your request. Please try again or contact support if the problem persists.
        </p>
        
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={() => reset()}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium rounded-lg px-6 py-3 transition-colors"
          >
            Try again
          </button>
          
          <Link
            href="/dashboard"
            className="w-full bg-white/5 hover:bg-white/10 text-[#E5E7EB] font-medium rounded-lg px-6 py-3 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
