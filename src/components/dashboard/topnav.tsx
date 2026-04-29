import { auth, signOut } from "@/lib/auth";
import { PlanBadge } from "./plan-badge";

type TopNavProps = {
    title: string;
};

export async function TopNav({ title }: TopNavProps) {
    const session = await auth();

    return (
        <header className="h-16 border-b bg-[#1A1A2E] flex items-center justify-between p-12 shadow-sm z-10">
            <div className="flex items-center">
                <h2 className="text-xl font-bold tracking-tight">
                    {title}
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-lg text-right hidden md:block">
                    <p className="font-semibold leading-none">
                        {session?.user?.name}
                    </p>
                    <p className="text-sm mt-1 text-gray-400">
                        {session?.user?.email}
                    </p>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                    }}
                >
                    <button
                        type="submit"
                        className="text-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                        Sign Out
                    </button>
                </form>

                {/* Plan Badge */}
                <PlanBadge />
            </div>
        </header>
    );
}
