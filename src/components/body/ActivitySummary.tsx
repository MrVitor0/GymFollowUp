"use client";

import { Card } from "@/components/ui/Card";
import {
  Footprints,
  Dumbbell,
  Calendar,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { WalkingLog, WorkoutLog } from "@/types/models";

interface ActivitySummaryProps {
  walkingLogs: WalkingLog[];
  workoutLogs: WorkoutLog[];
  periodLabel: string;
}

function formatDuration(min: number) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${min}min`;
}

export function ActivitySummary({
  walkingLogs,
  workoutLogs,
  periodLabel,
}: ActivitySummaryProps) {
  const totalKm =
    Math.round(walkingLogs.reduce((sum, l) => sum + l.distanceKm, 0) * 10) / 10;
  const totalWalkMin = walkingLogs.reduce((sum, l) => sum + l.durationMin, 0);
  const completedWorkouts = workoutLogs.filter((l) => l.completedAt).length;
  const totalExercises = workoutLogs.reduce(
    (sum, l) => sum + l.exercises.filter((e) => e.completed).length,
    0,
  );
  const walkingDays = walkingLogs.length;
  const avgKmPerDay =
    walkingDays > 0 ? Math.round((totalKm / walkingDays) * 10) / 10 : 0;

  const stats = [
    {
      icon: Footprints,
      label: "Km caminhados",
      value: `${totalKm} km`,
      color: "text-blue-400",
    },
    {
      icon: Timer,
      label: "Tempo caminhando",
      value: formatDuration(totalWalkMin),
      color: "text-cyan-400",
    },
    {
      icon: Dumbbell,
      label: "Treinos completos",
      value: String(completedWorkouts),
      color: "text-orange-400",
    },
    {
      icon: Calendar,
      label: "Dias caminhados",
      value: String(walkingDays),
      color: "text-emerald-400",
    },
    {
      icon: TrendingUp,
      label: "Média km/dia",
      value: `${avgKmPerDay} km`,
      color: "text-indigo-400",
    },
    {
      icon: Zap,
      label: "Exercícios feitos",
      value: String(totalExercises),
      color: "text-purple-400",
    },
  ];

  return (
    <Card hover={false} className="p-5">
      <h2 className="text-lg font-semibold mb-1">Atividade Física</h2>
      <p className="text-xs text-(--text-muted) mb-4">{periodLabel}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-(--bg-tertiary)/50 rounded-xl p-3 flex flex-col items-center gap-1 text-center"
          >
            <Icon size={16} className={color} />
            <span className="text-lg font-bold">{value}</span>
            <span className="text-[10px] text-(--text-muted)">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
