"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { BodyLog } from "@/types/models";

const RADAR_METRICS = [
  { key: "weight", label: "Peso", min: 50, max: 150 },
  { key: "muscle", label: "Músculo", min: 20, max: 60 },
  { key: "bodyFat", label: "Gordura", min: 5, max: 40 },
  { key: "water", label: "Água", min: 40, max: 70 },
  { key: "protein", label: "Proteína", min: 10, max: 25 },
  { key: "bmi", label: "IMC", min: 15, max: 40 },
];

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

interface BodyRadarProps {
  current: BodyLog;
  compare?: BodyLog | null;
  compareLabel?: string;
}

export function BodyRadar({
  current,
  compare,
  compareLabel = "Anterior",
}: BodyRadarProps) {
  const data = RADAR_METRICS.map(({ key, label, min, max }) => {
    const entry: Record<string, unknown> = {
      metric: label,
      current: normalize(
        (current as unknown as Record<string, number>)[key] ?? 0,
        min,
        max,
      ),
    };
    if (compare) {
      entry.compare = normalize(
        (compare as unknown as Record<string, number>)[key] ?? 0,
        min,
        max,
      );
    }
    return entry;
  });

  return (
    <Card hover={false} className="p-5">
      <h2 className="text-lg font-semibold mb-2">Composição Corporal</h2>
      <div className="flex gap-4 text-xs text-(--text-muted) mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-indigo-500 rounded" /> Atual
        </span>
        {compare && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded" /> {compareLabel}
          </span>
        )}
      </div>
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#2a2a3e" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#8888aa", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "#12121a",
                border: "1px solid #2a2a3e",
                borderRadius: "0.75rem",
                color: "#f0f0f5",
                fontSize: "0.75rem",
              }}
            />
            <Radar
              name="Atual"
              dataKey="current"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            {compare && (
              <Radar
                name={compareLabel}
                dataKey="compare"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.1}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
