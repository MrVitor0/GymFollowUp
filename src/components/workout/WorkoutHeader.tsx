"use client";

import { Badge, workoutTypeToBadgeVariant } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getWorkoutLabel, getDayName } from "@/lib/utils";

const typeColor: Record<string, "orange" | "blue" | "purple"> = {
  A: "orange",
  B: "blue",
  C: "purple",
};

interface WorkoutHeaderProps {
  workoutType: "A" | "B" | "C";
  progress: { completed: number; total: number };
}

export function WorkoutHeader({ workoutType, progress }: WorkoutHeaderProps) {
  const dayName = getDayName();
  const label = getWorkoutLabel(workoutType);
  const color = typeColor[workoutType] ?? "indigo";
  const allDone = progress.completed === progress.total && progress.total > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{dayName}</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-0.5">
            Treino {workoutType}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{label}</p>
        </div>
        <Badge variant={workoutTypeToBadgeVariant(workoutType)}>
          {workoutType === "A" ? "Push" : workoutType === "B" ? "Pull" : "Legs"}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <ProgressBar
          value={progress.completed}
          max={progress.total}
          color={allDone ? "green" : color}
          className="flex-1"
        />
        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
          {progress.completed}/{progress.total}
        </span>
      </div>
    </div>
  );
}
