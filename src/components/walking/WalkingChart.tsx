"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { WalkingLog } from "@/types/models";

interface WalkingChartProps {
  logs: WalkingLog[];
}

function buildChartData(logs: WalkingLog[]) {
  const map = new Map<string, number>();
  for (const l of logs) {
    map.set(l.date, l.distanceKm);
  }

  const data: { day: string; km: number }[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    data.push({ day: label, km: map.get(key) ?? 0 });
  }

  return data;
}

export function WalkingChart({ logs }: WalkingChartProps) {
  const data = buildChartData(logs);

  return (
    <Card hover={false} className="p-5">
      <h2 className="text-lg font-semibold mb-4">Evolução — Últimos 30 dias</h2>

      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientKm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#555570", fontSize: 10 }}
              axisLine={{ stroke: "#2a2a3e" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#555570", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#12121a",
                border: "1px solid #2a2a3e",
                borderRadius: "0.75rem",
                color: "#f0f0f5",
                fontSize: "0.75rem",
              }}
              formatter={(value) => [`${value} km`, "Distância"]}
            />
            <ReferenceLine
              y={8}
              stroke="#22c55e"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: "Meta ~8km",
                fill: "#22c55e",
                fontSize: 10,
                position: "right",
              }}
            />
            <Area
              type="monotone"
              dataKey="km"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradientKm)"
              dot={{ fill: "#6366f1", r: 2.5, strokeWidth: 0 }}
              activeDot={{ fill: "#818cf8", r: 4.5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
