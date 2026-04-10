"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RevenueData = {
  name: string;
  revenue: number;
};

export function RevenueChart({ data }: { data: RevenueData[] }) {
  return (
    <div className="w-full h-full p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Overview (Trailing 6 Months)</h3>
      <div className="h-72 w-full">
        {/* ResponsiveContainer makes the chart scale with the browser window */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid lines behind the chart */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            {/* The bottom X axis (e.g., Jan, Feb) */}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={10}
            />
            
            {/* The side Y axis formatting the numbers to $K format */}
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value: number) => `$${value / 1000}k`}
              dx={-10}
            />

            {/* Custom hover tooltip that appears when mousing over data points */}
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
            />

            {/* The actual filled area representing the data curve */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#1e40af" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
