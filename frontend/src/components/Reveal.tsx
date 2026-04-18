import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  variant?: "up" | "down" | "left" | "right" | "scale" | "tilt" | "fade";
  delay?: number;
  className?: string;
  repeat?: boolean;
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  repeat = true,
}: RevealProps) {
  const { elementRef, isVisible, direction } = useScrollReveal();
  const [hasRevealed, setHasRevealed] = React.useState(false);

  React.useEffect(() => {
    if (isVisible && !hasRevealed) {
      setHasRevealed(true);
    }
  }, [isVisible, hasRevealed]);

  // For direction-aware: if we want it to react to scroll up/down
  // we use isVisible. If we want one-time reveal, we use hasRevealed.
  const active = repeat ? isVisible : hasRevealed;

  return (
    <div
      ref={elementRef as any}
      className={cn(
        "reveal-base",
        `reveal-${variant}`,
        active && "is-visible",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
