"use client";

import { Check } from "lucide-react";
import type { SetLog } from "@/types/models";

interface SetLoggerProps {
  setNumber: number;
  expectedReps: string;
  value: SetLog;
  onChange: (data: Partial<SetLog>) => void;
  isPlank?: boolean;
  hasWeight?: boolean;
}

export function SetLogger({
  setNumber,
  expectedReps,
  value,
  onChange,
  isPlank = false,
  hasWeight = false,
}: SetLoggerProps) {
  const isDone = isPlank ? (value.duration ?? 0) > 0 : value.reps > 0;

  return (
    <div
      className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${
        isDone ? "bg-emerald-500/5" : "bg-(--bg-tertiary)/50"
      }`}
    >
      <span className="text-xs font-medium text-(--text-muted) w-6 shrink-0">
        S{setNumber}
      </span>

      {isPlank ? (
        <div className="flex items-center gap-1.5 flex-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder="seg"
            value={value.duration || ""}
            onChange={(e) =>
              onChange({ duration: parseInt(e.target.value) || 0 })
            }
            className="w-16 bg-(--bg-tertiary) border border-(--border) rounded-lg px-2.5 py-1.5 text-center text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
          <span className="text-xs text-(--text-muted)">seg</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder={expectedReps}
            value={value.reps || ""}
            onChange={(e) => onChange({ reps: parseInt(e.target.value) || 0 })}
            className="w-14 bg-(--bg-tertiary) border border-(--border) rounded-lg px-2.5 py-1.5 text-center text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
          <span className="text-xs text-(--text-muted)">reps</span>

          {hasWeight && (
            <>
              <input
                type="number"
                inputMode="decimal"
                placeholder="kg"
                value={value.weight || ""}
                onChange={(e) =>
                  onChange({ weight: parseFloat(e.target.value) || 0 })
                }
                className="w-14 bg-(--bg-tertiary) border border-(--border) rounded-lg px-2.5 py-1.5 text-center text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
              <span className="text-xs text-(--text-muted)">kg</span>
            </>
          )}
        </div>
      )}

      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
        {isDone && (
          <Check size={16} className="text-emerald-400 animate-scale-in" />
        )}
      </div>
    </div>
  );
}
