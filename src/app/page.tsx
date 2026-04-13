import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black font-sans">

      {/* NAVBAR */}
      <header className="w-full flex items-center justify-between px-8 py-5 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold">SaaSify</h1>

        <Link
          href="/dashboard"
          className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-80 transition"
        >
          Go to Dashboard →
        </Link>
      </header>

      {/* HERO */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl flex flex-col items-center gap-6">

          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white leading-tight">
            Build & Manage Your SaaS <br /> Faster Than Ever 🚀
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
            A modern dashboard to manage users, analytics, billing, and more —
            all in one place.
          </p>

          {/* BIG CTA BUTTON */}
          <Link
            href="/dashboard"
            className="mt-6 px-10 py-4 text-lg font-semibold rounded-full bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition-transform shadow-lg"
          >
            Open Dashboard →
          </Link>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-white">Analytics</h3>
            <p className="text-sm text-zinc-300">
              Track user activity and performance with real-time insights.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-white">User Management</h3>
            <p className="text-sm text-zinc-300">
              Manage users, roles, and permissions effortlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2 text-white">Billing</h3>
            <p className="text-sm text-zinc-300">
              Integrate subscriptions and handle payments seamlessly.
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
        © {new Date().getFullYear()} SaaSify. All rights reserved.
      </footer>
    </div>
  );
}