"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { BodyForm } from "@/components/body/BodyForm";
import { useBody } from "@/hooks/useBody";
import { queryDocuments } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import {
  Scale,
  TrendingDown,
  TrendingUp,
  Minus,
  Dumbbell,
  Droplets,
  Flame,
  Zap,
  Activity,
  Pencil,
  Save,
  Check,
  Plus,
  ArrowRight,
  Trash2,
} from "lucide-react";
import type { BodyLog, WalkingLog, WorkoutLog } from "@/types/models";

const BodyChart = dynamic(
  () =>
    import("@/components/body/BodyChart").then((m) => ({
      default: m.BodyChart,
    })),
  { ssr: false, loading: () => <div className="skeleton h-72 w-full" /> },
);

const BodyRadar = dynamic(
  () =>
    import("@/components/body/BodyRadar").then((m) => ({
      default: m.BodyRadar,
    })),
  { ssr: false, loading: () => <div className="skeleton h-72 w-full" /> },
);

const ActivitySummary = dynamic(
  () =>
    import("@/components/body/ActivitySummary").then((m) => ({
      default: m.ActivitySummary,
    })),
  { ssr: false },
);

/* ── Period filter ─────────────────────────────────────── */

type Period = "7d" | "14d" | "30d" | "90d" | "all";

const PERIODS: { id: Period; label: string }[] = [
  { id: "7d", label: "7 dias" },
  { id: "14d", label: "14 dias" },
  { id: "30d", label: "30 dias" },
  { id: "90d", label: "90 dias" },
  { id: "all", label: "Tudo" },
];

function getPeriodStart(period: Period): string {
  if (period === "all") return "2000-01-01";
  const days = { "7d": 7, "14d": 14, "30d": 30, "90d": 90 }[period];
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDate(d);
}

function getPeriodLabel(period: Period): string {
  return {
    "7d": "Últimos 7 dias",
    "14d": "Últimas 2 semanas",
    "30d": "Último mês",
    "90d": "Últimos 3 meses",
    all: "Todo o período",
  }[period];
}

/* ── Metrics config ────────────────────────────────────── */

const DASHBOARD_METRICS = [
  {
    key: "weight",
    label: "Peso",
    unit: "kg",
    icon: Scale,
    goodDirection: "down" as const,
  },
  {
    key: "bodyFat",
    label: "Gordura",
    unit: "%",
    icon: Flame,
    goodDirection: "down" as const,
  },
  {
    key: "muscle",
    label: "Músculo",
    unit: "%",
    icon: Dumbbell,
    goodDirection: "up" as const,
  },
  {
    key: "water",
    label: "Água",
    unit: "%",
    icon: Droplets,
    goodDirection: "up" as const,
  },
  {
    key: "protein",
    label: "Proteína",
    unit: "%",
    icon: Zap,
    goodDirection: "up" as const,
  },
  {
    key: "bmi",
    label: "IMC",
    unit: "",
    icon: Activity,
    goodDirection: "down" as const,
  },
];

const BODY_EDIT_FIELDS = [
  { key: "weight", label: "Peso (kg)", placeholder: "85.4" },
  { key: "bodyFat", label: "Gordura (%)", placeholder: "22.1" },
  { key: "muscle", label: "Músculo (%)", placeholder: "42.3" },
  { key: "water", label: "Água (%)", placeholder: "53.8" },
  { key: "protein", label: "Proteína (%)", placeholder: "18.5" },
  { key: "bmi", label: "IMC", placeholder: "26.2" },
] as const;

function getTrend(
  current: number | undefined,
  previous: number | undefined,
  goodDirection: "up" | "down",
) {
  if (current == null || previous == null || previous === 0) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.01)
    return { icon: Minus, color: "text-(--text-muted)", label: "=" };
  const isUp = diff > 0;
  const isGood = goodDirection === "up" ? isUp : !isUp;
  return {
    icon: isUp ? TrendingUp : TrendingDown,
    color: isGood ? "text-emerald-400" : "text-red-400",
    label: `${isUp ? "+" : ""}${diff.toFixed(1)}`,
  };
}

/* ── Page ──────────────────────────────────────────────── */

export default function CorpoPage() {
  const { latestLog, logs, saveLog, deleteLog, isLoading } = useBody();

  const [period, setPeriod] = useState<Period>("30d");
  const [showForm, setShowForm] = useState(false);

  // Edit modal state
  const [editingLog, setEditingLog] = useState<BodyLog | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editSaved, setEditSaved] = useState(false);

  // Cross-data: walking + workout
  const [walkingLogs, setWalkingLogs] = useState<WalkingLog[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    Promise.all([
      queryDocuments<WalkingLog>("walkingLogs", {
        orderByField: "date",
        orderDirection: "desc",
        limitCount: 100,
      }),
      queryDocuments<WorkoutLog>("workoutLogs", {
        orderByField: "date",
        orderDirection: "desc",
        limitCount: 100,
      }),
    ]).then(([w, wo]) => {
      setWalkingLogs(w);
      setWorkoutLogs(wo);
    });
  }, []);

  // Period filtering
  const periodStart = getPeriodStart(period);
  const filteredLogs = useMemo(
    () => logs.filter((l) => l.date >= periodStart),
    [logs, periodStart],
  );
  const filteredWalking = useMemo(
    () => walkingLogs.filter((l) => l.date >= periodStart),
    [walkingLogs, periodStart],
  );
  const filteredWorkouts = useMemo(
    () => workoutLogs.filter((l) => l.date >= periodStart),
    [workoutLogs, periodStart],
  );

  // Comparison: latest vs oldest in period
  const periodOldest =
    filteredLogs.length > 1 ? filteredLogs[filteredLogs.length - 1] : null;

  /* ── Edit helpers ──────────────────────────────────── */

  function openEdit(log: BodyLog) {
    setEditingLog(log);
    setEditFields({
      weight: String(log.weight),
      bodyFat: String(log.bodyFat),
      muscle: String(log.muscle),
      water: String(log.water),
      protein: String(log.protein),
      bmi: String(log.bmi),
    });
    setEditSaved(false);
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingLog) return;
    const data: Partial<BodyLog> = {};
    for (const { key } of BODY_EDIT_FIELDS) {
      const val = parseFloat(editFields[key] ?? "");
      if (!isNaN(val) && val > 0) {
        (data as Record<string, number>)[key] = val;
      }
    }
    if (!data.weight) return;
    setEditSaving(true);
    await saveLog(data, editingLog.date);
    setEditSaving(false);
    setEditSaved(true);
    setTimeout(() => {
      setEditingLog(null);
      setEditSaved(false);
    }, 800);
  }

  /* ── Loading skeleton ──────────────────────────────── */

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-4">
          <div className="skeleton h-10 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-24" />
            ))}
          </div>
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-72 w-full" />
        </div>
      </PageContainer>
    );
  }

  /* ── Render ────────────────────────────────────────── */

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Composição Corporal
            </h1>
            <p className="text-(--text-secondary) text-sm mt-1">
              {latestLog
                ? `Último registro: ${new Date(latestLog.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`
                : "Importe dados ou registre manualmente"}
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Registrar Medição
          </Button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {PERIODS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                period === id
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-(--bg-tertiary) text-(--text-muted) border border-transparent hover:text-(--text-secondary)"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dashboard de Métricas */}
        {latestLog ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DASHBOARD_METRICS.map(
              ({ key, label, unit, icon: Icon, goodDirection }) => {
                const value = (latestLog as unknown as Record<string, number>)[
                  key
                ];
                const compareValue = periodOldest
                  ? (periodOldest as unknown as Record<string, number>)[key]
                  : undefined;
                const trend = getTrend(value, compareValue, goodDirection);

                return (
                  <Card
                    key={key}
                    hover={false}
                    className="p-3 flex flex-col items-center gap-1 text-center"
                  >
                    <Icon size={16} className="text-indigo-400" />
                    <span className="text-xl font-bold">{value ?? "–"}</span>
                    <span className="text-[10px] text-(--text-muted)">
                      {unit ? `${unit} · ` : ""}
                      {label}
                    </span>
                    {trend && (
                      <div
                        className={`flex items-center gap-0.5 text-[10px] ${trend.color}`}
                      >
                        <trend.icon size={10} />
                        <span>{trend.label}</span>
                      </div>
                    )}
                  </Card>
                );
              },
            )}
          </div>
        ) : (
          <Card className="p-6 flex flex-col items-center gap-3 text-center">
            <Scale size={32} className="text-(--text-muted)" />
            <p className="text-sm text-(--text-secondary)">
              Nenhum registro encontrado
            </p>
            <p className="text-xs text-(--text-muted)">
              Importe um JSON da Relax Fit ou insira dados manualmente
            </p>
          </Card>
        )}

        {/* Charts Row: Evolução + Radar */}
        {filteredLogs.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <BodyChart
              logs={filteredLogs}
              title={`Evolução — ${getPeriodLabel(period)}`}
            />
            {latestLog && (
              <BodyRadar
                current={latestLog}
                compare={periodOldest}
                compareLabel={
                  periodOldest
                    ? new Date(
                        periodOldest.date + "T12:00:00",
                      ).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "Anterior"
                }
              />
            )}
          </div>
        )}

        {/* Comparativo do Período */}
        {latestLog && periodOldest && latestLog.id !== periodOldest.id && (
          <Card hover={false} className="p-5">
            <h2 className="text-lg font-semibold mb-4">
              Comparativo do Período
            </h2>
            <div className="flex items-center gap-2 text-xs text-(--text-muted) mb-4">
              <span>
                {new Date(periodOldest.date + "T12:00:00").toLocaleDateString(
                  "pt-BR",
                  {
                    day: "2-digit",
                    month: "short",
                  },
                )}
              </span>
              <ArrowRight size={12} />
              <span>
                {new Date(latestLog.date + "T12:00:00").toLocaleDateString(
                  "pt-BR",
                  { day: "2-digit", month: "short" },
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DASHBOARD_METRICS.map(({ key, label, unit, goodDirection }) => {
                const current = (
                  latestLog as unknown as Record<string, number>
                )[key];
                const old = (periodOldest as unknown as Record<string, number>)[
                  key
                ];
                const trend = getTrend(current, old, goodDirection);
                return (
                  <div
                    key={key}
                    className="bg-(--bg-tertiary)/50 rounded-xl p-3"
                  >
                    <p className="text-[10px] text-(--text-muted) mb-1">
                      {label}
                    </p>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-(--text-muted)">
                          {old ?? "–"}
                        </span>
                        <span className="text-(--text-muted) mx-1">→</span>
                        <span className="text-sm font-bold">
                          {current ?? "–"}
                        </span>
                        {unit && (
                          <span className="text-[10px] text-(--text-muted) ml-0.5">
                            {unit}
                          </span>
                        )}
                      </div>
                      {trend && (
                        <span className={`text-xs font-medium ${trend.color}`}>
                          {trend.label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Atividade Física */}
        {(filteredWalking.length > 0 || filteredWorkouts.length > 0) && (
          <ActivitySummary
            walkingLogs={filteredWalking}
            workoutLogs={filteredWorkouts}
            periodLabel={getPeriodLabel(period)}
          />
        )}

        {/* Tabela de Histórico */}
        {filteredLogs.length > 0 && (
          <Card hover={false} className="overflow-hidden">
            <div className="p-4 pb-2">
              <h2 className="text-sm font-semibold text-(--text-secondary)">
                Histórico — {getPeriodLabel(period)}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-125">
                <thead>
                  <tr className="border-b border-(--border)/30 text-(--text-muted)">
                    <th className="text-left px-4 py-2 font-medium">Data</th>
                    <th className="text-right px-3 py-2 font-medium">Peso</th>
                    <th className="text-right px-3 py-2 font-medium">Gord.</th>
                    <th className="text-right px-3 py-2 font-medium">Musc.</th>
                    <th className="text-right px-3 py-2 font-medium">Água</th>
                    <th className="text-right px-3 py-2 font-medium">IMC</th>
                    <th className="w-16" />
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-(--border)/10 hover:bg-(--bg-tertiary)/30 transition-colors"
                    >
                      <td className="px-4 py-2 text-(--text-secondary)">
                        {new Date(log.date + "T12:00:00").toLocaleDateString(
                          "pt-BR",
                          { day: "2-digit", month: "short" },
                        )}
                      </td>
                      <td className="text-right px-3 py-2 font-mono text-(--text-primary)">
                        {log.weight}
                      </td>
                      <td className="text-right px-3 py-2 font-mono text-(--text-primary)">
                        {log.bodyFat}
                      </td>
                      <td className="text-right px-3 py-2 font-mono text-(--text-primary)">
                        {log.muscle}
                      </td>
                      <td className="text-right px-3 py-2 font-mono text-(--text-primary)">
                        {log.water}
                      </td>
                      <td className="text-right px-3 py-2 font-mono text-indigo-400">
                        {log.bmi}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEdit(log)}
                            className="p-1.5 rounded-lg text-(--text-muted) hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Apagar este registro?"))
                                deleteLog(log.id);
                            }}
                            className="p-1.5 rounded-lg text-(--text-muted) hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Modal: Registrar Medição */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Registrar Medição"
        >
          <BodyForm
            latestLog={latestLog}
            onSave={async (data, dateOverride) => {
              await saveLog(data, dateOverride);
              setShowForm(false);
            }}
            embedded
          />
        </Modal>

        {/* Modal de Edição */}
        <Modal
          isOpen={!!editingLog}
          onClose={() => setEditingLog(null)}
          title={
            editingLog
              ? `Editar — ${new Date(editingLog.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}`
              : ""
          }
        >
          <form onSubmit={handleEditSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {BODY_EDIT_FIELDS.map(({ key, label, placeholder }) => (
                <Input
                  key={key}
                  label={label}
                  id={`edit-body-${key}`}
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder={placeholder}
                  value={editFields[key] ?? ""}
                  onChange={(e) =>
                    setEditFields((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              ))}
            </div>
            <Button
              type="submit"
              disabled={
                !(parseFloat(editFields.weight ?? "") > 0) || editSaving
              }
            >
              {editSaved ? (
                <>
                  <Check size={16} /> Salvo!
                </>
              ) : editSaving ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={16} /> Salvar Alterações
                </>
              )}
            </Button>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
}
