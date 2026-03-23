"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, BarChart3, Footprints, Scale } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Treino", icon: Dumbbell },
  { href: "/historico", label: "Histórico", icon: BarChart3 },
  { href: "/caminhada", label: "Caminhada", icon: Footprints },
  { href: "/corpo", label: "Corpo", icon: Scale },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: top bar */}
      <nav className="hidden md:flex items-center h-16 px-6 bg-(--bg-primary)/90 backdrop-blur-xl border-b border-(--border)/50 sticky top-0 z-40">
        <Link href="/" className="text-lg font-bold text-(--text-primary) mr-8">
          GymFollowUp
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-(--text-muted) hover:text-(--text-secondary) hover:bg-(--bg-tertiary)"
                  }
                `}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile: bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-(--bg-primary)/90 backdrop-blur-xl border-t border-(--border)/50">
        <div className="flex items-center justify-around h-full">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-15
                  ${
                    isActive
                      ? "text-indigo-400"
                      : "text-(--text-muted) hover:text-(--text-secondary)"
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
