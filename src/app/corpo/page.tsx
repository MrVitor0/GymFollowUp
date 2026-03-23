"use client";

import dynamic from "next/dynamic";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { BodyForm } from "@/components/body/BodyForm";
import { useBody } from "@/hooks/useBody";
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
} from "lucide-react";
import type { BodyLog } from "@/types/models";

const BodyChart = dynamic(
  () =>
    import("@/components/body/BodyChart").then((m) => ({
      default: m.BodyChart,
    })),
  { ssr: false, loading: () => <div className="skeleton h-72 w-full" /> },
);

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

export default function CorpoPage() {
  const { latestLog, previousLog, logs, saveLog, isLoading } = useBody();

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

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        {/* Header */}
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

        {/* Dashboard de Métricas */}
        {latestLog ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DASHBOARD_METRICS.map(
              ({ key, label, unit, icon: Icon, goodDirection }) => {
                const value = (latestLog as unknown as Record<string, number>)[
                  key
                ];
                const prevValue = previousLog
                  ? (previousLog as unknown as Record<string, number>)[key]
                  : undefined;
                const trend = getTrend(value, prevValue, goodDirection);

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

        {/* Formulário */}
        <BodyForm latestLog={latestLog} onSave={saveLog} />

        {/* Gráfico de Evolução */}
        {logs.length >= 2 && <BodyChart logs={logs} />}

        {/* Tabela de Histórico */}
        {logs.length > 0 && (
          <Card hover={false} className="overflow-hidden">
            <div className="p-4 pb-2">
              <h2 className="text-sm font-semibold text-(--text-secondary)">
                Histórico
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
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
