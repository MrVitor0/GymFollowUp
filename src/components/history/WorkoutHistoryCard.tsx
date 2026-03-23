"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, workoutTypeToBadgeVariant } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { WorkoutLog } from "@/types/models";

const typeColor: Record<string, "orange" | "blue" | "purple"> = {
  A: "orange",
  B: "blue",
  C: "purple",
};

const typeLabel: Record<string, string> = {
  A: "Push",
  B: "Pull",
  C: "Legs",
};

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatReps(sets: { reps: number; duration?: number }[]): string {
  return sets
    .map((s) => (s.duration ? `${s.duration}s` : String(s.reps)))
    .join("·");
}

interface WorkoutHistoryCardProps {
  log: WorkoutLog;
  previousLog?: WorkoutLog;
}

export function WorkoutHistoryCard({
  log,
  previousLog,
}: WorkoutHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const completed = log.exercises.filter((e) => e.completed).length;
  const total = log.exercises.length;
  const color = typeColor[log.workoutType] ?? "indigo";

  return (
    <Card hover={false} className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-(--text-secondary)">
              {formatDateLabel(log.date)}
            </span>
            <Badge variant={workoutTypeToBadgeVariant(log.workoutType)}>
              {typeLabel[log.workoutType]}
            </Badge>
          </div>
          <ChevronDown
            size={16}
            className={`text-(--text-muted) transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        <ProgressBar
          value={completed}
          max={total}
          color={color}
          className="mb-2"
        />

        {/* Resumo compacto */}
        <div className="flex flex-col gap-0.5">
          {log.exercises.map((ex) => (
            <div
              key={ex.exerciseId}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-(--text-secondary) truncate max-w-[55%]">
                {ex.exerciseName}
              </span>
              <span
                className={`font-mono ${ex.completed ? "text-emerald-400" : "text-(--text-muted)"}`}
              >
                {formatReps(ex.sets)}
              </span>
            </div>
          ))}
        </div>

        {log.notes && (
          <p className="text-xs text-(--text-muted) mt-2 italic">
            💬 {log.notes}
          </p>
        )}
      </button>

      {/* Detalhes expandidos */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 animate-fade-slide-up">
          <div className="border-t border-(--border)/30 my-1" />

          {log.exercises.map((ex) => {
            // Comparação com sessão anterior
            const prevEx = previousLog?.exercises.find(
              (pe) => pe.exerciseId === ex.exerciseId,
            );

            return (
              <div
                key={ex.exerciseId}
                className="bg-(--bg-tertiary)/50 rounded-xl p-3"
              >
                <p className="text-sm font-medium mb-2">{ex.exerciseName}</p>
                <div className="grid grid-cols-2 gap-1">
                  {ex.sets.map((set) => {
                    const prevSet = prevEx?.sets.find(
                      (ps) => ps.setNumber === set.setNumber,
                    );
                    const isDuration = (set.duration ?? 0) > 0;
                    const current = isDuration ? (set.duration ?? 0) : set.reps;
                    const prev = prevSet
                      ? isDuration
                        ? (prevSet.duration ?? 0)
                        : prevSet.reps
                      : null;

                    let indicator = "";
                    let indicatorColor = "text-(--text-muted)";
                    if (prev !== null && prev > 0) {
                      if (current > prev) {
                        indicator = " ↑";
                        indicatorColor = "text-emerald-400";
                      } else if (current < prev) {
                        indicator = " ↓";
                        indicatorColor = "text-red-400";
                      } else {
                        indicator = " =";
                      }
                    }

                    return (
                      <div
                        key={set.setNumber}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <span className="text-(--text-muted) w-5">
                          S{set.setNumber}
                        </span>
                        <span className="text-(--text-primary)">
                          {isDuration ? `${set.duration}s` : `${set.reps} reps`}
                          {set.weight ? ` · ${set.weight}kg` : ""}
                        </span>
                        {indicator && (
                          <span className={indicatorColor}>{indicator}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
