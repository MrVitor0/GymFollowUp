"use client";

import { useState } from "react";
import { ChevronDown, Play, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SetLogger } from "./SetLogger";
import { VideoModal } from "./VideoModal";
import type { Exercise, ExerciseLog, SetLog } from "@/types/models";

interface ExerciseCardProps {
  exercise: Omit<Exercise, "id">;
  log: ExerciseLog;
  onLogSet: (setNumber: number, data: Partial<SetLog>) => void;
  isActive: boolean;
}

const EXERCISES_WITH_WEIGHT = [
  "Supino no Chão com Halteres (Floor Press)",
  "Desenvolvimento com Halteres",
  "Elevação Lateral",
  "Tríceps Testa no Chão com Halteres",
  "Remada Curvada com Halteres",
  "Remada Serrote Unilateral",
  "Rosca Direta com Halteres",
  "Rosca Martelo com Halteres",
  "Agachamento Cálice com Kettlebell (Goblet Squat)",
  "Levantamento Terra Romeno (Stiff) com Halteres",
  "Passada/Avanço com Halteres",
];

export function ExerciseCard({
  exercise,
  log,
  onLogSet,
  isActive,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(isActive);
  const [showVideo, setShowVideo] = useState(false);

  const isCompleted = log.completed;
  const isPlank = exercise.name.includes("Prancha");
  const hasWeight = EXERCISES_WITH_WEIGHT.includes(exercise.name);

  const completedSets = log.sets.filter((s) =>
    isPlank ? (s.duration ?? 0) > 0 : s.reps > 0,
  ).length;

  return (
    <>
      <Card
        hover={false}
        className={`overflow-hidden transition-all duration-300 ${
          isCompleted ? "border-emerald-500/30 animate-pulse-green" : ""
        }`}
      >
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
        >
          <span className="w-7 h-7 rounded-lg bg-(--bg-tertiary) flex items-center justify-center text-xs font-bold text-(--text-secondary) shrink-0">
            {exercise.order}
          </span>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{exercise.name}</p>
            <p className="text-xs text-(--text-muted) mt-0.5">
              {exercise.sets} séries · {exercise.repsRange} ·{" "}
              {exercise.muscleGroup}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCompleted ? (
              <Badge variant="completed">✓</Badge>
            ) : completedSets > 0 ? (
              <Badge variant="in-progress">
                {completedSets}/{exercise.sets}
              </Badge>
            ) : (
              <Badge variant="pending">Pendente</Badge>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVideo(true);
              }}
              className="p-1.5 rounded-lg text-(--text-muted) hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
            >
              <Play size={14} />
            </button>

            <ChevronDown
              size={16}
              className={`text-(--text-muted) transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Body — expanded */}
        {expanded && (
          <div className="px-4 pb-4 flex flex-col gap-2 animate-fade-slide-up">
            <div className="border-t border-(--border)/30 my-1" />

            {log.sets.map((set) => (
              <SetLogger
                key={set.setNumber}
                setNumber={set.setNumber}
                expectedReps={exercise.repsRange}
                value={set}
                onChange={(data) => onLogSet(set.setNumber, data)}
                isPlank={isPlank}
                hasWeight={hasWeight}
              />
            ))}

            {exercise.tip && (
              <div className="flex items-start gap-2 mt-2 px-3 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <Lightbulb
                  size={14}
                  className="text-amber-400 shrink-0 mt-0.5"
                />
                <p className="text-xs text-(--text-secondary) leading-relaxed">
                  {exercise.tip}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      <VideoModal
        videoUrl={exercise.videoUrl}
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
    </>
  );
}
