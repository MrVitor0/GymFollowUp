"use client";

import { useState, useEffect, useCallback } from "react";
import { setDocument, queryDocuments } from "@/lib/firestore";
import { today } from "@/lib/utils";
import type { BodyLog } from "@/types/models";

function findNumber(
  obj: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    for (const [k, v] of Object.entries(obj)) {
      if (k.toLowerCase() === key.toLowerCase()) {
        if (typeof v === "number") return v;
        if (typeof v === "string") {
          const n = parseFloat(v);
          if (!isNaN(n)) return n;
        }
      }
    }
  }
  return undefined;
}

export function parseRelaxFitJson(
  json: Record<string, unknown>,
): Partial<BodyLog> {
  return {
    weight: findNumber(json, ["weight", "peso"]),
    bodyFat: findNumber(json, [
      "bodyFat",
      "body_fat",
      "fat",
      "gordura",
      "bodyFatRate",
    ]),
    muscle: findNumber(json, ["muscle", "musculo", "muscleRate"]),
    water: findNumber(json, ["water", "agua", "waterRate"]),
    protein: findNumber(json, ["protein", "proteina", "proteinRate"]),
    bmi: findNumber(json, ["bmi", "imc"]),
    salt: findNumber(json, ["salt", "sal"]),
    visceralFat: findNumber(json, [
      "visceralFat",
      "visceral_fat",
      "visceralFatLevel",
    ]),
    boneMass: findNumber(json, ["boneMass", "bone_mass"]),
    metabolicAge: findNumber(json, ["metabolicAge", "metabolic_age"]),
    bmr: findNumber(json, ["bmr", "basal"]),
  };
}

export function useBody() {
  const [logs, setLogs] = useState<BodyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await queryDocuments<BodyLog>("bodyLogs", {
        orderByField: "date",
        orderDirection: "desc",
        limitCount: 100,
      });
      if (!cancelled) {
        setLogs(results);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const latestLog = logs[0] ?? null;
  const previousLog = logs[1] ?? null;

  const saveLog = useCallback(async (data: Partial<BodyLog>) => {
    const dateId = today();
    const logData = {
      date: dateId,
      weight: data.weight ?? 0,
      bodyFat: data.bodyFat ?? 0,
      muscle: data.muscle ?? 0,
      water: data.water ?? 0,
      protein: data.protein ?? 0,
      bmi: data.bmi ?? 0,
      ...(data.salt != null && { salt: data.salt }),
      ...(data.visceralFat != null && { visceralFat: data.visceralFat }),
      ...(data.boneMass != null && { boneMass: data.boneMass }),
      ...(data.metabolicAge != null && { metabolicAge: data.metabolicAge }),
      ...(data.bmr != null && { bmr: data.bmr }),
      ...(data.rawJson && { rawJson: data.rawJson }),
    };

    await setDocument("bodyLogs", dateId, logData);

    const saved: BodyLog = { id: dateId, ...logData };
    setLogs((prev) => {
      const filtered = prev.filter((l) => l.id !== dateId);
      return [saved, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
  }, []);

  return { latestLog, previousLog, logs, saveLog, isLoading };
}
