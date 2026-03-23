"use client";

type BadgeVariant =
  | "pending"
  | "in-progress"
  | "completed"
  | "push"
  | "pull"
  | "legs"
  | "rest";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: "bg-zinc-800 text-zinc-400 border-zinc-700",
  "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  push: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  pull: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  legs: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  rest: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1
        text-xs font-medium border
        ${variantStyles[variant]}
        ${className ?? ""}
      `}
    >
      {children}
    </span>
  );
}

export function workoutTypeToBadgeVariant(
  type: "A" | "B" | "C" | "REST",
): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    A: "push",
    B: "pull",
    C: "legs",
    REST: "rest",
  };
  return map[type] ?? "pending";
}
