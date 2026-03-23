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
  salt?: number;
  visceralFat?: number;
  boneMass?: number;
  metabolicAge?: number;
  bmr?: number;
  rawJson?: Record<string, unknown>;
}
