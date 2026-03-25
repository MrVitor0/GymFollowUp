"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { WalkingForm } from "@/components/walking/WalkingForm";
import { useWalking } from "@/hooks/useWalking";
import { calcAvgSpeed } from "@/lib/utils";
import {
  Footprints,
  Route,
  Clock,
  Gauge,
  Pencil,
  Save,
  Check,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { WalkingLog } from "@/types/models";

const WalkingChart = dynamic(
  () =>
    import("@/components/walking/WalkingChart").then((m) => ({
      default: m.WalkingChart,
    })),
  { ssr: false, loading: () => <div className="skeleton h-72 w-full" /> },
);

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
    saveLogForDate,
    isLoading,
    isSaving,
  } = useWalking();

  const [editingLog, setEditingLog] = useState<WalkingLog | null>(null);
  const [editDistance, setEditDistance] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editSaved, setEditSaved] = useState(false);

  function openEdit(log: WalkingLog) {
    setEditingLog(log);
    setEditDistance(String(log.distanceKm));
    setEditDuration(String(log.durationMin));
    setEditNotes(log.notes ?? "");
    setEditSaved(false);
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingLog) return;
    const distNum = parseFloat(editDistance) || 0;
    const durNum = parseInt(editDuration) || 0;
    if (distNum <= 0 || durNum <= 0) return;
    await saveLogForDate(editingLog.date, {
      distanceKm: distNum,
      durationMin: durNum,
      notes: editNotes || undefined,
    });
    setEditSaved(true);
    setTimeout(() => {
      setEditingLog(null);
      setEditSaved(false);
    }, 800);
  }

  const editDistNum = parseFloat(editDistance) || 0;
  const editDurNum = parseInt(editDuration) || 0;
  const editAvgSpeed = calcAvgSpeed(editDistNum, editDurNum);
  const editIsValid = editDistNum > 0 && editDurNum > 0;

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
                    <th className="w-8" />
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
                      <td className="px-2 py-2">
                        <button
                          onClick={() => openEdit(log)}
                          className="p-1.5 rounded-lg text-(--text-muted) hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                        >
                          <Pencil size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

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
              <Input
                label="Distância (km)"
                id="edit-distance"
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="8.5"
                value={editDistance}
                onChange={(e) => setEditDistance(e.target.value)}
              />
              <Input
                label="Duração (min)"
                id="edit-duration"
                type="number"
                inputMode="numeric"
                placeholder="120"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
              />
            </div>

            {editDistNum > 0 && editDurNum > 0 && (
              <p className="text-sm text-(--text-secondary)">
                Vel. média:{" "}
                <span className="text-indigo-400 font-medium">
                  {editAvgSpeed} km/h
                </span>
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit-notes"
                className="text-sm font-medium text-(--text-secondary)"
              >
                Observações (opcional)
              </label>
              <textarea
                id="edit-notes"
                placeholder="Ex: caminhada leve, inclinação 5%..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="w-full bg-(--bg-tertiary) border border-(--border) rounded-xl px-4 py-2.5 text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 resize-none"
              />
            </div>

            <Button type="submit" disabled={!editIsValid || isSaving}>
              {editSaved ? (
                <>
                  <Check size={16} /> Salvo!
                </>
              ) : isSaving ? (
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
