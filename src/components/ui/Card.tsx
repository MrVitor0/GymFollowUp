"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={`
        bg-[var(--bg-secondary)]/80 backdrop-blur-xl
        border border-[var(--border)]/50
        rounded-2xl
        shadow-[0_4px_24px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.03)]
        ${hover ? "hover:border-[var(--border-hover)]/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5" : ""}
        transition-all duration-300 ease-out
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}
