"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { queryDocuments, setDocument } from "@/lib/firestore";
import type { WorkoutLog } from "@/types/models";

interface HistoryStats {
  monthCount: number;
  totalCount: number;
  avgPerWeek: number;
  streak: number;
}

function calcStreak(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const hasLog = logs.some((l) => l.date === dateStr && l.completedAt);
    // Domingo pula (dia de descanso)
    if (d.getDay() === 0) continue;
    if (hasLog) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function useHistory() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [filter, setFilter] = useState<"A" | "B" | "C" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const options: Parameters<typeof queryDocuments>[1] = {
        orderByField: "date",
        orderDirection: "desc",
        limitCount: 100,
      };
      if (filter) {
        options.whereClause = {
          field: "workoutType",
          op: "==",
          value: filter,
        };
      }
      const results = await queryDocuments<WorkoutLog>("workoutLogs", options);
      if (!cancelled) {
        setLogs(results);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 20);
  }, []);

  const stats = useMemo<HistoryStats>(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const allCompleted = logs.filter((l) => l.completedAt);
    const oldest = allCompleted[allCompleted.length - 1]?.date;
    const weeksSinceFirst = oldest
      ? Math.max(
          1,
          Math.ceil(
            (now.getTime() - new Date(oldest).getTime()) /
              (7 * 24 * 60 * 60 * 1000),
          ),
        )
      : 1;

    return {
      monthCount: allCompleted.filter((l) => l.date.startsWith(monthKey))
        .length,
      totalCount: allCompleted.length,
      avgPerWeek:
        allCompleted.length > 0
          ? Math.round((allCompleted.length / weeksSinceFirst) * 10) / 10
          : 0,
      streak: calcStreak(logs),
    };
  }, [logs]);

  const updateLog = useCallback(async (updated: WorkoutLog) => {
    const { id, ...rest } = updated;
    const data = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
    await setDocument("workoutLogs", id, data);
    setLogs((prev) => prev.map((l) => (l.id === id ? updated : l)));
  }, []);

  return {
    logs: logs.slice(0, displayCount),
    hasMore: logs.length > displayCount,
    filter,
    setFilter,
    stats,
    isLoading,
    loadMore,
    updateLog,
  };
}
