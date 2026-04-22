import Link from "next/link";
import { SignUpForm } from "./signup-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme toggle — top-right corner */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-700">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition"
            >
              Sign in
            </Link>
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
