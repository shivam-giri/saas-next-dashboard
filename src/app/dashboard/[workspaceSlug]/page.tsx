import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopNav } from "@/components/dashboard/topnav";

// Simulate fetching data from the database (e.g. grouped by month)
const mockRevenueData = [
    { name: "Jan", revenue: 4200 },
    { name: "Feb", revenue: 5800 },
    { name: "Mar", revenue: 6100 },
    { name: "Apr", revenue: 8400 },
    { name: "May", revenue: 10200 },
    { name: "Jun", revenue: 12450 },
];

export default async function WorkspaceDashboardPage({
    params,
}: {
    params: Promise<any>;
}) {
    const resolvedParams = await params;

    return (
        <div className="flex flex-col h-full">
            <TopNav title="Overview" />
            <div className="space-y-6 p-4 md:p-8">
                <h1 className="text-3xl font-bold tracking-tight text-purple-300">Dashboard Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mock KPI Cards */}
                    <div className="bg-[#1A1A2E] p-6 rounded-xl border shadow-sm">
                        <h3 className="text-md font-medium text-gray-200 mb-1">Total Users</h3>
                        <p className="text-3xl font-bold">1,248</p>
                    </div>

                    <div className="bg-[#1A1A2E] p-6 rounded-xl border shadow-sm">
                        <h3 className="text-md font-medium text-gray-200 mb-1">Monthly Revenue</h3>
                        <p className="text-3xl font-bold">$12,450</p>
                    </div>

                    <div className="bg-[#1A1A2E] p-6 rounded-xl border shadow-sm">
                        <h3 className="text-md font-medium text-gray-200 mb-1">Active Sessions</h3>
                        <p className="text-3xl font-bold">84</p>
                    </div>
                </div>

                {/* Analytics Charts in Phase 6 */}
                <div className="bg-[#1A1A2E] rounded-xl border shadow-sm col-span-1 md:col-span-3">
                    <RevenueChart data={mockRevenueData} />
                </div>
            </div>
        </div>
    );
}

