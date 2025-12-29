"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", engagement: 120 },
  { day: "Tue", engagement: 150 },
  { day: "Wed", engagement: 180 },
  { day: "Thu", engagement: 210 },
  { day: "Fri", engagement: 260 },
  { day: "Sat", engagement: 300 },
  { day: "Sun", engagement: 340 },
];

export function EngagementChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-foreground">
        Engagement over time
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Last 7 days (all platforms)
      </p>

      <div className="mt-6 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
