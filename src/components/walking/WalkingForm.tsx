"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { calcAvgSpeed } from "@/lib/utils";
import { Save, Check } from "lucide-react";
import type { WalkingLog } from "@/types/models";

interface WalkingFormProps {
  todayLog: WalkingLog | null;
  onSave: (data: {
    distanceKm: number;
    durationMin: number;
    notes?: string;
  }) => Promise<void>;
  isSaving: boolean;
}

export function WalkingForm({ todayLog, onSave, isSaving }: WalkingFormProps) {
  const [distance, setDistance] = useState(
    todayLog ? String(todayLog.distanceKm) : "",
  );
  const [duration, setDuration] = useState(
    todayLog ? String(todayLog.durationMin) : "",
  );
  const [notes, setNotes] = useState(todayLog?.notes ?? "");
  const [saved, setSaved] = useState(false);

  const distNum = parseFloat(distance) || 0;
  const durNum = parseInt(duration) || 0;
  const avgSpeed = calcAvgSpeed(distNum, durNum);
  const isValid = distNum > 0 && durNum > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    await onSave({
      distanceKm: distNum,
      durationMin: durNum,
      notes: notes || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card hover={false} className="p-5">
      <h2 className="text-lg font-semibold mb-4">
        {todayLog ? "Editar Caminhada — Hoje" : "Registrar Caminhada — Hoje"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Distância (km)"
            id="distance"
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="8.5"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <Input
            label="Duração (min)"
            id="duration"
            type="number"
            inputMode="numeric"
            placeholder="120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {distNum > 0 && durNum > 0 && (
          <p className="text-sm text-(--text-secondary)">
            Vel. média:{" "}
            <span className="text-indigo-400 font-medium">{avgSpeed} km/h</span>
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="notes"
            className="text-sm font-medium text-(--text-secondary)"
          >
            Observações (opcional)
          </label>
          <textarea
            id="notes"
            placeholder="Ex: caminhada leve, inclinação 5%..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-(--bg-tertiary) border border-(--border) rounded-xl px-4 py-2.5 text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 resize-none"
          />
        </div>

        <Button type="submit" disabled={!isValid || isSaving}>
          {saved ? (
            <>
              <Check size={16} /> Salvo!
            </>
          ) : isSaving ? (
            "Salvando..."
          ) : (
            <>
              <Save size={16} /> Salvar Caminhada
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
