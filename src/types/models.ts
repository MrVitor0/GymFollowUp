export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  workoutType: "A" | "B" | "C";
  sets: number;
  repsRange: string;
  order: number;
  videoUrl: string;
  tip: string;
}

export interface SetLog {
  setNumber: number;
  reps: number;
  weight?: number;
  duration?: number;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  completed: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  workoutType: "A" | "B" | "C";
  exercises: ExerciseLog[];
  completedAt?: string;
  notes?: string;
}

export interface WalkingLog {
  id: string;
  date: string;
  distanceKm: number;
  durationMin: number;
  avgSpeedKmh?: number;
  notes?: string;
}

export interface BodyLog {
  id: string;
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
  water: number;
  protein: number;
  bmi: number;
  // Campos extras do RelaxFit
  leanBodyMass?: number;
  subcutaneousFat?: number;
  visceralFat?: number;
  skeletalMuscle?: number;
  muscleMass?: number;
  boneMass?: number;
  bmr?: number;
  bodyAge?: number;
  fatMass?: number;
  waterMass?: number;
  proteinMass?: number;
  idealWeight?: number;
  obesityLevel?: string;
  bodyType?: string;
  measuredAt?: string;
  rawJson?: Record<string, unknown>;
}
