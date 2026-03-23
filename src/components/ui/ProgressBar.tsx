"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: "indigo" | "green" | "orange" | "blue" | "purple";
}

const colorStyles: Record<string, string> = {
  indigo: "from-indigo-500 to-indigo-400",
  green: "from-emerald-500 to-emerald-400",
  orange: "from-orange-500 to-orange-400",
  blue: "from-blue-500 to-blue-400",
  purple: "from-purple-500 to-purple-400",
};

export function ProgressBar({
  value,
  max,
  className,
  color = "indigo",
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div
      className={`w-full h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden ${className ?? ""}`}
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colorStyles[color]} transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
