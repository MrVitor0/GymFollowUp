"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full bg-[var(--bg-tertiary)] border border-[var(--border)]
          rounded-xl px-4 py-2.5
          text-[var(--text-primary)] placeholder-[var(--text-muted)]
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
          transition-all duration-200
          ${className ?? ""}
        `}
        {...props}
      />
    </div>
  );
}
