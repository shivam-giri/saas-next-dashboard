import { auth, signOut } from "@/lib/auth";

export async function TopNav() {
  const session = await auth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10 transition-all">
      <div className="flex items-center">
        {/* We can put Mobile Menu Toggle or Breadcrumbs here later */}
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Overview</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-right hidden md:block">
          <p className="font-semibold text-gray-900 leading-none">{session?.user?.name}</p>
          <p className="text-xs text-gray-500 mt-1">{session?.user?.email}</p>
        </div>
        
        {/* Simple Server Action form for securely logging out */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button 
            type="submit" 
            className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
