"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WorkoutHistoryCard } from "@/components/history/WorkoutHistoryCard";
import { useHistory } from "@/hooks/useHistory";
import { Dumbbell, Calendar, TrendingUp, Flame } from "lucide-react";

const FILTER_OPTIONS = [
  { value: null, label: "Todos" },
  { value: "A" as const, label: "Push" },
  { value: "B" as const, label: "Pull" },
  { value: "C" as const, label: "Legs" },
];

export default function HistoricoPage() {
  const { logs, hasMore, filter, setFilter, stats, isLoading, loadMore } =
    useHistory();

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Histórico</h1>
          <p className="text-(--text-secondary) text-sm mt-1">
            Suas sessões de treino passadas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Dumbbell, value: stats.monthCount, label: "treinos mês" },
            { icon: Calendar, value: stats.totalCount, label: "total" },
            { icon: TrendingUp, value: stats.avgPerWeek, label: "/semana" },
            { icon: Flame, value: stats.streak, label: "streak" },
          ].map(({ icon: Icon, value, label }) => (
            <Card
              key={label}
              hover={false}
              className="p-3 flex flex-col items-center gap-1 text-center"
            >
              <Icon size={16} className="text-indigo-400" />
              <span className="text-xl font-bold">{value}</span>
              <span className="text-[10px] text-(--text-muted)">{label}</span>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setFilter(opt.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filter === opt.value
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-(--bg-tertiary) text-(--text-muted) border border-transparent hover:text-(--text-secondary)"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-32 w-full" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && logs.length === 0 && (
          <Card className="p-6 flex flex-col items-center gap-3 text-center">
            <Calendar size={32} className="text-(--text-muted)" />
            <p className="text-sm text-(--text-secondary)">
              {filter
                ? "Nenhum treino desse tipo encontrado"
                : "Nenhum treino registrado ainda"}
            </p>
          </Card>
        )}

        {/* Workout Cards */}
        {!isLoading &&
          logs.map((log, index) => {
            // Encontrar log anterior do mesmo tipo para comparação
            const previousLog = logs
              .slice(index + 1)
              .find((l) => l.workoutType === log.workoutType);

            return (
              <WorkoutHistoryCard
                key={log.id}
                log={log}
                previousLog={previousLog}
              />
            );
          })}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={loadMore}>
              Carregar mais
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
