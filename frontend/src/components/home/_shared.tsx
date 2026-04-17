import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocalizedString } from "@/types";

/**
 * Shared helpers / atoms for Home page section components.
 * Extracted from the original frontend/src/pages/Home.tsx so each section
 * file stays focused and small.
 */

export const IMAGE_FALLBACK =
  "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

export function getLocalized(
  val: LocalizedString | undefined | null,
  lang: string,
): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val["fr"] || val["en"] || "";
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.target as HTMLImageElement;
  if (target.src !== IMAGE_FALLBACK) target.src = IMAGE_FALLBACK;
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
 * Wrapper that makes any page section fit the viewport on desktop while
 * staying naturally scrollable / responsive on small screens.
 */
export const ViewportSection = ({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className={cn(
      "relative w-full md:min-h-screen flex flex-col justify-center overflow-hidden",
      className,
    )}
  >
    {children}
  </section>
);

export const slides = [
  {
    badge: "Standard d'Excellence Africain",
    title: "L'Excellence Africaine,",
    highlight: "Certifiée.",
    subtitle:
      "Propulsez votre impact ESG grâce à notre plateforme de certification panafricaine de classe mondiale.",
    image: "/img/hero_image.jpg",
  },
  {
    badge: "Gouvernance & Transparence",
    title: "Bâtir la confiance,",
    highlight: "Ensemble.",
    subtitle:
      "Des protocoles d'audit rigoureux et des normes ISO pour connecter les organisations d'excellence aux investisseurs mondiaux.",
    image: "/img/hero_image2.jpg",
  },
];
