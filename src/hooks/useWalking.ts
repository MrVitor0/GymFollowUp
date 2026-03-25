"use client";

import { useState, useEffect, useCallback } from "react";
import { getDocument, setDocument, queryDocuments } from "@/lib/firestore";
import { today, calcAvgSpeed } from "@/lib/utils";
import type { WalkingLog } from "@/types/models";

interface MonthStats {
  totalKm: number;
  totalMin: number;
  avgSpeed: number;
  goalProgress: number; // 0-100
}

export function useWalking() {
  const [todayLog, setTodayLog] = useState<WalkingLog | null>(null);
  const [monthLogs, setMonthLogs] = useState<WalkingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const dateId = today();
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  useEffect(() => {
    async function load() {
      const [existing, logs] = await Promise.all([
        getDocument<WalkingLog>("walkingLogs", dateId),
        queryDocuments<WalkingLog>("walkingLogs", {
          orderByField: "date",
          orderDirection: "desc",
          limitCount: 60,
        }),
      ]);

      if (existing) setTodayLog(existing);
      setMonthLogs(logs);
      setIsLoading(false);
    }
    load();
  }, [dateId, monthStart]);

  const saveLog = useCallback(
    async (data: {
      distanceKm: number;
      durationMin: number;
      notes?: string;
    }) => {
      setIsSaving(true);
      const avgSpeedKmh = calcAvgSpeed(data.distanceKm, data.durationMin);
      const logData = {
        date: dateId,
        distanceKm: data.distanceKm,
        durationMin: data.durationMin,
        avgSpeedKmh,
        notes: data.notes ?? "",
      };

      await setDocument("walkingLogs", dateId, logData);

      const saved: WalkingLog = { id: dateId, ...logData };
      setTodayLog(saved);
      setMonthLogs((prev) => {
        const filtered = prev.filter((l) => l.id !== dateId);
        return [saved, ...filtered].sort((a, b) =>
          b.date.localeCompare(a.date),
        );
      });
      setIsSaving(false);
    },
    [dateId],
  );

  const saveLogForDate = useCallback(
    async (
      targetDate: string,
      data: { distanceKm: number; durationMin: number; notes?: string },
    ) => {
      setIsSaving(true);
      const avgSpeedKmh = calcAvgSpeed(data.distanceKm, data.durationMin);
      const logData = {
        date: targetDate,
        distanceKm: data.distanceKm,
        durationMin: data.durationMin,
        avgSpeedKmh,
        notes: data.notes ?? "",
      };

      await setDocument("walkingLogs", targetDate, logData);

      const saved: WalkingLog = { id: targetDate, ...logData };
      if (targetDate === dateId) setTodayLog(saved);
      setMonthLogs((prev) => {
        const filtered = prev.filter((l) => l.id !== targetDate);
        return [saved, ...filtered].sort((a, b) =>
          b.date.localeCompare(a.date),
        );
      });
      setIsSaving(false);
    },
    [dateId],
  );

  const currentMonthLogs = monthLogs.filter((l) => l.date >= monthStart);
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  const monthStats: MonthStats = {
    totalKm:
      Math.round(
        currentMonthLogs.reduce((sum, l) => sum + l.distanceKm, 0) * 10,
      ) / 10,
    totalMin: currentMonthLogs.reduce((sum, l) => sum + l.durationMin, 0),
    avgSpeed:
      currentMonthLogs.length > 0
        ? Math.round(
            (currentMonthLogs.reduce(
              (sum, l) => sum + (l.avgSpeedKmh ?? 0),
              0,
            ) /
              currentMonthLogs.length) *
              100,
          ) / 100
        : 0,
    // Meta: 2h/dia × dias do mês
    goalProgress:
      Math.round(
        (currentMonthLogs.reduce((sum, l) => sum + l.durationMin, 0) /
          (daysInMonth * 120)) *
          1000,
      ) / 10,
  };

  // Últimos 30 dias para gráfico
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysStr = thirtyDaysAgo.toISOString().split("T")[0];
  const recentLogs = monthLogs.filter((l) => l.date >= thirtyDaysStr);

  return {
    todayLog,
    monthLogs: currentMonthLogs,
    recentLogs,
    monthStats,
    saveLog,
    saveLogForDate,
    isLoading,
    isSaving,
  };
}
