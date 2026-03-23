"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { WORKOUT_SCHEDULE, getExercisesByType } from "@/data/exercises";
import { getDocument, setDocument } from "@/lib/firestore";
import { today, getDayOfWeek } from "@/lib/utils";
import type { WorkoutLog, SetLog } from "@/types/models";

export function useWorkout() {
  const dayOfWeek = getDayOfWeek();
  const workoutType = WORKOUT_SCHEDULE[dayOfWeek];
  const isRest = workoutType === "REST";
  const dateId = today();

  const [log, setLog] = useState<WorkoutLog | null>(null);
  const [isLoading, setIsLoading] = useState(!isRest);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load or create today's workout log
  useEffect(() => {
    if (isRest) return;

    async function load() {
      const existing = await getDocument<WorkoutLog>("workoutLogs", dateId);

      if (existing) {
        setLog(existing);
      } else {
        const exercises = getExercisesByType(workoutType as "A" | "B" | "C");
        const newLog: WorkoutLog = {
          id: dateId,
          date: dateId,
          workoutType: workoutType as "A" | "B" | "C",
          exercises: exercises.map((ex) => ({
            exerciseId: `${ex.workoutType}-${ex.order}`,
            exerciseName: ex.name,
            sets: Array.from({ length: ex.sets }, (_, i) => ({
              setNumber: i + 1,
              reps: 0,
            })),
            completed: false,
          })),
        };
        setLog(newLog);
      }

      setIsLoading(false);
    }

    load();
  }, [dateId, isRest, workoutType]);

  // Auto-save with debounce
  const persist = useCallback((updated: WorkoutLog) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const { id, ...rest } = updated;
      // Firestore rejects undefined values — strip them
      const data = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined),
      );
      setDocument("workoutLogs", id, data);
    }, 500);
  }, []);

  const logSet = useCallback(
    (exerciseId: string, setNumber: number, data: Partial<SetLog>) => {
      setLog((prev) => {
        if (!prev) return prev;

        const exercises = prev.exercises.map((ex) => {
          if (ex.exerciseId !== exerciseId) return ex;

          const sets = ex.sets.map((s) =>
            s.setNumber === setNumber ? { ...s, ...data } : s,
          );

          const completed = sets.every((s) => s.reps > 0);

          return { ...ex, sets, completed };
        });

        const allDone = exercises.every((ex) => ex.completed);
        const updated: WorkoutLog = {
          ...prev,
          exercises,
          ...(allDone
            ? { completedAt: new Date().toISOString() }
            : { completedAt: undefined }),
        };

        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const progress = log
    ? {
        completed: log.exercises.filter((e) => e.completed).length,
        total: log.exercises.length,
      }
    : { completed: 0, total: 0 };

  return {
    workoutType,
    exercises: isRest ? [] : getExercisesByType(workoutType as "A" | "B" | "C"),
    log,
    progress,
    logSet,
    isLoading,
    isRest,
  };
}
