import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface ControlsBarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Reusable "glass + gold accent" controls card used across public pages
 * (search bar, filters, sort, view toggles...). Provides:
 *   - frosted card with soft shadow
 *   - green/gold radial gradient background
 *   - thin golden hairline on top
 *   - optional footer row (counter + reset)
 */
export function ControlsBar({
  children,
  footer,
  className,
  ...rest
}: ControlsBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative rounded-3xl bg-card/80 backdrop-blur-xl border border-white/40 dark:border-white/10",
        "shadow-[0_20px_60px_-20px_rgba(13,77,51,0.35),0_8px_24px_-12px_rgba(0,0,0,0.15)] overflow-hidden",
        className
      )}
      {...(rest as Record<string, unknown>)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-gradient-pan"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 10% 0%, hsl(var(--primary) / 0.12), transparent 50%), radial-gradient(ellipse 80% 60% at 90% 100%, hsl(var(--brand-emerald) / 0.06), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px animate-hairline"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(var(--brand-gold) / 0.15) 25%, hsl(var(--brand-gold) / 0.8) 50%, hsl(var(--brand-gold) / 0.15) 75%, transparent 100%)",
        }}
      />

      <div className="relative flex flex-col gap-3 p-3 sm:gap-3.5 sm:p-4 lg:flex-row lg:items-center lg:gap-3">
        {children}
      </div>

      {footer && (
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border/50 bg-muted/20 px-4 py-2.5 sm:px-5 sm:py-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

export default ControlsBar;
