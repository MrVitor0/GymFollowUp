export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function today(): string {
  return formatDate(new Date());
}

export function calcAvgSpeed(distanceKm: number, durationMin: number): number {
  if (durationMin <= 0) return 0;
  return Math.round((distanceKm / (durationMin / 60)) * 100) / 100;
}

export function getDayOfWeek(date: Date = new Date()): number {
  return date.getDay();
}

const WORKOUT_LABELS: Record<string, string> = {
  A: "Push — Peito, Ombro, Tríceps",
  B: "Pull — Costas, Bíceps",
  C: "Legs & Core — Pernas, Abdómen",
  REST: "Descanso Ativo",
};

export function getWorkoutLabel(type: string): string {
  return WORKOUT_LABELS[type] ?? type;
}

const DAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function getDayName(date: Date = new Date()): string {
  return DAY_NAMES[date.getDay()];
}
