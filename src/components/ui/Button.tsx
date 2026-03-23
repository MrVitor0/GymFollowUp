"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "icon" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-indigo-500 hover:bg-indigo-400 text-white font-medium
    rounded-xl px-5 py-2.5
    shadow-[0_0_20px_rgba(99,102,241,0.3)]
    hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
  `,
  secondary: `
    bg-transparent border border-[var(--border)]
    text-[var(--text-secondary)] hover:text-[var(--text-primary)]
    hover:border-[var(--border-hover)]
    rounded-xl px-5 py-2.5
  `,
  icon: `
    bg-[var(--bg-tertiary)] hover:bg-[var(--border)]
    text-[var(--text-secondary)] hover:text-[var(--text-primary)]
    rounded-xl p-2.5
  `,
  danger: `
    bg-red-500/10 hover:bg-red-500/20
    text-red-400 hover:text-red-300
    rounded-xl px-5 py-2.5
  `,
};

export function Button({
  variant = "primary",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 cursor-pointer
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantStyles[variant]}
        ${className ?? ""}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
