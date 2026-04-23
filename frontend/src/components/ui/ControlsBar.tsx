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
            "radial-gradient(ellipse at top left, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(ellipse at center, hsl(var(--brand-gold) / 0.22), transparent 55%), radial-gradient(ellipse at bottom right, hsl(var(--brand-gold-dark) / 0.18), transparent 60%)",
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

      <div className="relative p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        {children}
      </div>

      {footer && (
        <div className="relative px-4 sm:px-5 py-3 border-t border-border/40 bg-gradient-to-r from-transparent via-muted/30 to-transparent flex flex-wrap items-center justify-between gap-2">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

export default ControlsBar;
