"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { WalkingForm } from "@/components/walking/WalkingForm";
import { WalkingChart } from "@/components/walking/WalkingChart";
import { useWalking } from "@/hooks/useWalking";
import { Footprints, Route, Clock, Gauge } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

function formatMinToHours(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${m > 0 ? `${m}m` : ""}` : `${m}m`;
}

export default function CaminhadaPage() {
  const {
    todayLog,
    monthLogs,
    recentLogs,
    monthStats,
    saveLog,
    isLoading,
    isSaving,
  } = useWalking();

  const monthName = new Date().toLocaleString("pt-BR", { month: "long" });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-4">
          <div className="skeleton h-36 w-full" />
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-56 w-full" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Caminhada</h1>
          <p className="text-(--text-secondary) text-sm mt-1 capitalize">
            {monthName} {new Date().getFullYear()}
          </p>
        </div>

        {/* Resumo do Mês */}
        <Card hover={false} className="p-5">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { icon: Route, value: `${monthStats.totalKm}`, unit: "km/mês" },
              {
                icon: Clock,
                value: formatMinToHours(monthStats.totalMin),
                unit: "total",
              },
              {
                icon: Gauge,
                value: `${monthStats.avgSpeed}`,
                unit: "km/h avg",
              },
            ].map(({ icon: Icon, value, unit }) => (
              <div
                key={unit}
                className="flex flex-col items-center gap-1 text-center"
              >
                <Icon size={16} className="text-indigo-400" />
                <span className="text-lg font-bold">{value}</span>
                <span className="text-[10px] text-(--text-muted)">{unit}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-(--text-muted) whitespace-nowrap">
              Meta 2h/dia
            </span>
            <ProgressBar
              value={Math.min(monthStats.goalProgress, 100)}
              max={100}
              color={monthStats.goalProgress >= 80 ? "green" : "indigo"}
              className="flex-1"
            />
            <span className="text-xs text-(--text-muted) whitespace-nowrap">
              {monthStats.goalProgress}%
            </span>
          </div>
        </Card>

        {/* Formulário */}
        <WalkingForm todayLog={todayLog} onSave={saveLog} isSaving={isSaving} />

        {/* Gráfico */}
        {recentLogs.length > 0 && <WalkingChart logs={recentLogs} />}

        {/* Lista de logs recentes */}
        {monthLogs.length > 0 && (
          <Card hover={false} className="overflow-hidden">
            <div className="p-4 pb-2">
              <h2 className="text-sm font-semibold text-(--text-secondary)">
                Logs do mês
              </h2>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-(--border)/30 text-(--text-muted)">
                    <th className="text-left px-4 py-2 font-medium">Data</th>
                    <th className="text-right px-4 py-2 font-medium">Dist.</th>
                    <th className="text-right px-4 py-2 font-medium">Dur.</th>
                    <th className="text-right px-4 py-2 font-medium">Vel.</th>
                  </tr>
                </thead>
                <tbody>
                  {monthLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-(--border)/10 hover:bg-(--bg-tertiary)/30 transition-colors"
                    >
                      <td className="px-4 py-2 text-(--text-secondary)">
                        {new Date(log.date + "T12:00:00").toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "short",
                          },
                        )}
                      </td>
                      <td className="text-right px-4 py-2 font-mono text-(--text-primary)">
                        {log.distanceKm} km
                      </td>
                      <td className="text-right px-4 py-2 font-mono text-(--text-primary)">
                        {log.durationMin} min
                      </td>
                      <td className="text-right px-4 py-2 font-mono text-indigo-400">
                        {log.avgSpeedKmh ?? "–"}
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
