"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { WorkoutHeader } from "@/components/workout/WorkoutHeader";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { useWorkout } from "@/hooks/useWorkout";
import { Footprints, PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  const { workoutType, exercises, log, progress, logSet, isLoading, isRest } =
    useWorkout();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-4">
          <div className="skeleton h-28 w-full" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      </PageContainer>
    );
  }

  // Dia de descanso
  if (isRest) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center gap-6 pt-12 text-center animate-fade-slide-up">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
            <Footprints size={36} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dia de Descanso Ativo 🧘</h1>
            <p className="text-sm text-(--text-secondary) mt-2 max-w-xs mx-auto">
              Foco nas 2h de caminhada na Kingsmith. Deixe os músculos
              recuperarem!
            </p>
          </div>
          <Link href="/caminhada">
            <Button>
              Logar Caminhada
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const allDone = progress.completed === progress.total && progress.total > 0;

  // Primeiro exercício não concluído é o "ativo"
  const activeIndex = log ? log.exercises.findIndex((e) => !e.completed) : 0;

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        {/* Celebração */}
        {allDone && (
          <Card className="p-5 flex items-center gap-4 border-emerald-500/30 animate-fade-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <PartyPopper size={24} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-emerald-400">
                Treino concluído! 🎉
              </p>
              <p className="text-xs text-(--text-secondary) mt-0.5">
                {progress.total} exercícios · Todas as séries completadas
              </p>
            </div>
            <Link href="/historico">
              <Button variant="secondary" className="text-xs">
                Histórico
              </Button>
            </Link>
          </Card>
        )}

        {/* Header */}
        <WorkoutHeader
          workoutType={workoutType as "A" | "B" | "C"}
          progress={progress}
        />

        {/* Exercise Cards */}
        {log &&
          exercises.map((exercise, index) => {
            const exerciseLog = log.exercises[index];
            if (!exerciseLog) return null;

            return (
              <ExerciseCard
                key={exerciseLog.exerciseId}
                exercise={exercise}
                log={exerciseLog}
                onLogSet={(setNumber, data) =>
                  logSet(exerciseLog.exerciseId, setNumber, data)
                }
                isActive={index === activeIndex}
              />
            );
          })}
      </div>
    </PageContainer>
  );
}
