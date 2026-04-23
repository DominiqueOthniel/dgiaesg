import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLocalized as getLocalizedFromUtils } from "@/lib/utils";
import type { LocalizedString } from "@/types";

/**
 * Shared helpers / atoms for Home page section components.
 * Merged with premium animation and styling tokens from the redesign.
 */

// Animation variants for section entries
export const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

export const SCALE_IN: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
};

export const SLIDE_LEFT: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

export const SLIDE_RIGHT: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

export const STAGGER_CONTAINER = (stagger = 0.08, delay = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const CHILD_ITEM: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

// Premium styling constants
export const CARD_STYLE = "bg-card border border-border rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-brand-gold/20 transition-all duration-500 overflow-hidden";
export const GLOW_CARD = "relative group after:absolute after:inset-0 after:rounded-[2.5rem] after:shadow-[0_0_30px_rgba(255,191,0,0.15)] after:opacity-0 hover:after:opacity-100 after:transition-opacity";

export const IMAGE_FALLBACK =
  "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

export function getLocalized(
  val: LocalizedString | undefined | null,
  lang: string,
): string {
  return getLocalizedFromUtils(val, lang);
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.target as HTMLImageElement;
  if (target.src !== IMAGE_FALLBACK) target.src = IMAGE_FALLBACK;
}

export function extractYoutubeId(url: string | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-muted", className)} />
);

export const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  actionHref,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border">
    <div className="flex items-start gap-3">
      <div className="p-2.5 bg-primary/10 rounded-xl mt-0.5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
    {action && actionHref && (
      <Link
        to={actionHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0"
      >
        {action}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    )}
  </div>
);

/**
 * Enhanced ViewportSection with entry animations and viewport fitting.
 */
export const ViewportSection = ({
  id,
  className,
  children,
  variants = FADE_UP,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  variants?: Variants;
}) => (
  <motion.section
    id={id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.15 }}
    variants={variants}
    className={cn(
      "relative w-full md:min-h-screen flex flex-col justify-center overflow-hidden",
      className,
    )}
  >
    {children}
  </motion.section>
);

