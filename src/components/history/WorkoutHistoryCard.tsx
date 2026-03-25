"use client";

import { useState } from "react";
import { ChevronDown, Pencil, Save, Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, workoutTypeToBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { WorkoutLog, ExerciseLog, SetLog } from "@/types/models";

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

interface WorkoutHistoryCardProps {
  log: WorkoutLog;
  previousLog?: WorkoutLog;
  onUpdate?: (updated: WorkoutLog) => Promise<void>;
}

export function WorkoutHistoryCard({
  log,
  previousLog,
  onUpdate,
}: WorkoutHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editExercises, setEditExercises] = useState<ExerciseLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const completed = log.exercises.filter((e) => e.completed).length;
  const total = log.exercises.length;
  const color = typeColor[log.workoutType] ?? "indigo";

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(true);
    setExpanded(true);
    setEditExercises(JSON.parse(JSON.stringify(log.exercises)));
  }

  function cancelEdit() {
    setEditing(false);
    setEditExercises([]);
  }

  function updateSet(
    exerciseId: string,
    setNumber: number,
    data: Partial<SetLog>,
  ) {
    setEditExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const sets = ex.sets.map((s) =>
          s.setNumber === setNumber ? { ...s, ...data } : s,
        );
        const isPlank = ex.exerciseName.includes("Prancha");
        const completed = sets.every((s) =>
          isPlank ? (s.duration ?? 0) > 0 : s.reps > 0,
        );
        return { ...ex, sets, completed };
      }),
    );
  }

  async function handleSave() {
    if (!onUpdate) return;
    setSaving(true);
    const allDone = editExercises.every((ex) => ex.completed);
    const updated: WorkoutLog = {
      ...log,
      exercises: editExercises,
      ...(allDone
        ? { completedAt: log.completedAt ?? new Date().toISOString() }
        : { completedAt: undefined }),
    };
    await onUpdate(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setEditing(false);
      setSaved(false);
    }, 800);
  }

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
          <div className="flex items-center gap-1">
            {onUpdate && !editing && (
              <span
                role="button"
                tabIndex={0}
                onClick={startEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    startEdit(e as unknown as React.MouseEvent);
                }}
                className="p-1.5 rounded-lg text-(--text-muted) hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
              >
                <Pencil size={14} />
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-(--text-muted) transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
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
          <p className="text-xs text-(--text-muted) mt-2 italic">{log.notes}</p>
        )}
      </button>

      {/* Detalhes expandidos */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3 animate-fade-slide-up">
          <div className="border-t border-(--border)/30 my-1" />

          {(editing ? editExercises : log.exercises).map((ex) => {
            const prevEx = previousLog?.exercises.find(
              (pe) => pe.exerciseId === ex.exerciseId,
            );
            const isPlank = ex.exerciseName.includes("Prancha");
            const hasWeight = EXERCISES_WITH_WEIGHT.includes(ex.exerciseName);

            return (
              <div
                key={ex.exerciseId}
                className="bg-(--bg-tertiary)/50 rounded-xl p-3"
              >
                <p className="text-sm font-medium mb-2">{ex.exerciseName}</p>
                <div
                  className={
                    editing ? "flex flex-col gap-2" : "grid grid-cols-2 gap-1"
                  }
                >
                  {ex.sets.map((set) => {
                    if (editing) {
                      const isDone = isPlank
                        ? (set.duration ?? 0) > 0
                        : set.reps > 0;
                      return (
                        <div
                          key={set.setNumber}
                          className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${isDone ? "bg-emerald-500/5" : "bg-(--bg-tertiary)/50"}`}
                        >
                          <span className="text-xs font-medium text-(--text-muted) w-6 shrink-0">
                            S{set.setNumber}
                          </span>
                          {isPlank ? (
                            <div className="flex items-center gap-1.5 flex-1">
                              <input
                                type="number"
                                inputMode="numeric"
                                placeholder="seg"
                                value={set.duration || ""}
                                onChange={(e) =>
                                  updateSet(ex.exerciseId, set.setNumber, {
                                    duration: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-16 bg-(--bg-tertiary) border border-(--border) rounded-lg px-2.5 py-1.5 text-center text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                              />
                              <span className="text-xs text-(--text-muted)">
                                seg
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="number"
                                inputMode="numeric"
                                placeholder="reps"
                                value={set.reps || ""}
                                onChange={(e) =>
                                  updateSet(ex.exerciseId, set.setNumber, {
                                    reps: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-14 bg-(--bg-tertiary) border border-(--border) rounded-lg px-2.5 py-1.5 text-center text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                              />
                              <span className="text-xs text-(--text-muted)">
                                reps
                              </span>
                              {hasWeight && (
                                <>
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="kg"
                                    value={set.weight || ""}
                                    onChange={(e) =>
                                      updateSet(ex.exerciseId, set.setNumber, {
                                        weight: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="w-14 bg-(--bg-tertiary) border border-(--border) rounded-lg px-2.5 py-1.5 text-center text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                  />
                                  <span className="text-xs text-(--text-muted)">
                                    kg
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                          {isDone && (
                            <Check
                              size={16}
                              className="text-emerald-400 shrink-0"
                            />
                          )}
                        </div>
                      );
                    }

                    // Read-only view
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

          {/* Botões de edição */}
          {editing && (
            <div className="flex gap-2 mt-1">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saved ? (
                  <>
                    <Check size={16} /> Salvo!
                  </>
                ) : saving ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save size={16} /> Salvar Alterações
                  </>
                )}
              </Button>
              <Button variant="secondary" onClick={cancelEdit}>
                <X size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
