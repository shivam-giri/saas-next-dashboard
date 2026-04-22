import { auth, signOut } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

type TopNavProps = {
  title: string;
};

export async function TopNav({ title }: TopNavProps) {
  const session = await auth();

  return (
    <header className="h-16 border-b bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-right hidden md:block">
          <p className="font-semibold text-gray-900 dark:text-slate-100 leading-none">
            {session?.user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {session?.user?.email}
          </p>
        </div>

        {/* Dark / Light toggle */}
        <ThemeToggle />

        {/* Sign out */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
