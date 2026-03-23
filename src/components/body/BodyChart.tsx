"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { BodyLog } from "@/types/models";

const METRICS = [
  { key: "weight", label: "Peso", unit: "kg", color: "#6366f1" },
  { key: "bodyFat", label: "Gordura", unit: "%", color: "#ef4444" },
  { key: "muscle", label: "Músculo", unit: "%", color: "#22c55e" },
  { key: "bmi", label: "IMC", unit: "", color: "#f59e0b" },
  { key: "water", label: "Água", unit: "%", color: "#3b82f6" },
  { key: "protein", label: "Proteína", unit: "%", color: "#a855f7" },
] as const;

interface BodyChartProps {
  logs: BodyLog[];
}

export function BodyChart({ logs }: BodyChartProps) {
  const [activeMetric, setActiveMetric] = useState(0);
  const metric = METRICS[activeMetric];

  const data = [...logs].reverse().map((log) => ({
    date: new Date(log.date + "T12:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }),
    value: (log as unknown as Record<string, number>)[metric.key] ?? 0,
  }));

  return (
    <Card hover={false} className="p-5">
      <h2 className="text-lg font-semibold mb-4">Evolução</h2>

      {/* Tabs de métrica */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {METRICS.map((m, i) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(i)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              i === activeMetric
                ? "border"
                : "bg-(--bg-tertiary) text-(--text-muted) border border-transparent hover:text-(--text-secondary)"
            }`}
            style={
              i === activeMetric
                ? {
                    backgroundColor: `${m.color}20`,
                    color: m.color,
                    borderColor: `${m.color}30`,
                  }
                : undefined
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#555570", fontSize: 10 }}
              axisLine={{ stroke: "#2a2a3e" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#555570", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#12121a",
                border: "1px solid #2a2a3e",
                borderRadius: "0.75rem",
                color: "#f0f0f5",
                fontSize: "0.75rem",
              }}
              formatter={(value) => [
                `${value}${metric.unit ? ` ${metric.unit}` : ""}`,
                metric.label,
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={metric.color}
              strokeWidth={2}
              dot={{ fill: metric.color, r: 3, strokeWidth: 0 }}
              activeDot={{ fill: metric.color, r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
