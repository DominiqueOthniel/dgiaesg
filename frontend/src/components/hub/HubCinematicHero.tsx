import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Sparkles, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type HubHeroChip = { id: string; label: string; idx: string };

function SectionPip({ href, label, index }: { href: string; label: string; index: number }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 py-1.5 text-right"
      title={label}
    >
      <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity max-w-[120px] truncate">
        {label}
      </span>
      <span
        className="flex h-2.5 w-2.5 rounded-full border-2 border-primary/40 transition-all group-hover:scale-125 group-hover:border-brand-gold/80"
        style={{ transitionDelay: `${index * 40}ms` }}
      />
    </a>
  );
}

export function HubCinematicHero({
  badgeIcon: Icon,
  badgeLabel,
  sectionsKicker,
  titleLead,
  titleBrand,
  subtitle,
  children,
  chips,
  chipsAriaLabel,
  showScrollHint = true,
  useSparklesInBadge = false,
  compact = false,
  beforeBadge,
  singleLineTitle = false,
}: {
  badgeIcon: LucideIcon;
  badgeLabel: string;
  /** Petite ligne uppercase au-dessus du titre (ex. Parcours, Régions). */
  sectionsKicker?: string;
  titleLead: string;
  titleBrand: string;
  subtitle: string;
  children?: ReactNode;
  chips?: HubHeroChip[];
  chipsAriaLabel?: string;
  showScrollHint?: boolean;
  useSparklesInBadge?: boolean;
  /** Héro plus bas pour sous-pages (même style que les hubs, hauteur réduite). */
  compact?: boolean;
  /** Lien retour ou métadonnées au-dessus du badge. */
  beforeBadge?: ReactNode;
  /** Force titleLead + titleBrand on one line (e.g. "Notre équipe"). */
  singleLineTitle?: boolean;
}) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroFade = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, reduce ? 0 : 48]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, reduce ? 1 : 0.97]);
  const orb1Y = useTransform(scrollYProgress, [0, 0.5], [0, reduce ? 0 : 80]);
  const springY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const springScale = useSpring(heroScale, { stiffness: 120, damping: 35 });

  return (
    <>
      <header
        ref={heroRef}
        className={cn(
          "relative flex flex-col justify-end border-b border-white/5",
          compact ? "min-h-[min(52vh,520px)]" : "min-h-[min(78vh,820px)]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-primary to-primary" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--brand-emerald) / 0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, hsl(var(--brand-gold) / 0.15), transparent)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 about-hero-sheen mix-blend-overlay" />
        <div className="absolute inset-0 opacity-[0.12] [background:linear-gradient(120deg,transparent_40%,hsl(var(--primary-foreground))_50%,transparent_60%)] bg-[length:200%_100%] animate-hairline" />

        <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[min(120vw,820px)] w-[min(120vw,820px)] -translate-x-1/2 opacity-[0.14] about-orbit-slow">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "inset 0 0 60px rgba(255,191,0,0.08)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[min(85vw,560px)] w-[min(85vw,560px)] -translate-x-1/2 rounded-full about-orbit-slow opacity-25 [animation-direction:reverse] [animation-duration:95s] border border-white/10" />

        <motion.div
          style={{ y: orb1Y }}
          className="pointer-events-none absolute -right-4 top-32 h-64 w-64 rounded-full bg-brand-gold/20 blur-[100px] animate-float-soft"
        />
        <div className="pointer-events-none absolute -left-20 bottom-32 h-72 w-72 rounded-full bg-brand-emerald/25 blur-[110px] animate-float-soft [animation-delay:-2s]" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-primary-foreground/5 blur-3xl" />

        <motion.div
          style={{ opacity: heroFade, y: springY, scale: springScale }}
          className={cn(
            "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            compact ? "pb-10 md:pb-14 pt-20 md:pt-24" : "pb-14 md:pb-20 pt-24"
          )}
        >
          {beforeBadge ? <div className="mb-5 md:mb-6">{beforeBadge}</div> : null}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-2xl shadow-black/20",
              compact ? "mb-5 md:mb-6" : "mb-8"
            )}
          >
            {useSparklesInBadge ? (
              <Sparkles className="h-3.5 w-3.5 text-brand-gold shrink-0" />
            ) : (
              <Icon className="h-4 w-4 text-brand-gold shrink-0" />
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-foreground/90">
              {badgeLabel}
            </span>
          </motion.div>

          <div className="max-w-5xl">
            {sectionsKicker && (
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm md:text-base font-bold uppercase tracking-[0.45em] text-primary-foreground/50 mb-3"
              >
                {sectionsKicker}
              </motion.p>
            )}
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "font-black tracking-[-0.04em] leading-[1.02] text-primary-foreground",
                singleLineTitle && "whitespace-nowrap",
                compact
                  ? "text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
                  : "text-3xl sm:text-4xl md:text-6xl lg:text-7xl"
              )}
            >
              <span className={cn(singleLineTitle ? "inline text-primary-foreground/90" : "block text-primary-foreground/90")}>
                {titleLead}
                {singleLineTitle ? " " : null}
              </span>
              <span
                className={cn(
                  "bg-clip-text text-transparent [background-size:200%_auto] animate-gradient-pan",
                  singleLineTitle ? "inline" : "block mt-1 md:mt-2"
                )}
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, hsl(var(--brand-gold)), hsl(45 100% 85%), hsl(var(--brand-emerald)), hsl(var(--brand-gold)))",
                }}
              >
                {titleBrand}
              </span>
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.55 }}
              className={cn(
                "font-medium leading-relaxed text-primary-foreground/70 max-w-2xl",
                compact
                  ? "mt-4 md:mt-6 text-sm md:text-lg"
                  : "mt-6 md:mt-8 text-base md:text-xl"
              )}
            >
              {subtitle}
            </motion.p>
          </div>

          {children && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.45 }}
              className={compact ? "mt-6 md:mt-8" : "mt-8 md:mt-10"}
            >
              {children}
            </motion.div>
          )}

          {chips && chips.length > 0 && (
            <motion.nav
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-2 md:gap-3"
              aria-label={chipsAriaLabel}
            >
              {chips.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground/85 backdrop-blur-sm transition-all hover:border-brand-gold/50 hover:bg-white/10 hover:shadow-lg hover:shadow-brand-gold/10"
                >
                  <span className="text-[10px] text-brand-gold/90">{c.idx}</span>
                  {c.label}
                </a>
              ))}
            </motion.nav>
          )}

          {showScrollHint && (
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
              className="mt-12 md:mt-16 flex justify-center md:justify-start"
              aria-hidden
            >
              <div className="flex flex-col items-center gap-1 text-primary-foreground/30">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Scroll</span>
                <div className="h-8 w-px bg-gradient-to-b from-primary-foreground/40 to-transparent" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </header>

      {chips && chips.length > 0 && (
        <div className="hidden xl:block fixed right-6 top-1/2 -translate-y-1/2 z-40">
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl px-2 py-4 shadow-2xl">
            {chips.map((c, i) => (
              <SectionPip key={c.id} href={`#${c.id}`} label={c.label} index={i} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

type HubSubpageShellProps = {
  badgeIcon: LucideIcon;
  badgeLabel: string;
  sectionsKicker?: string;
  titleLead: string;
  titleBrand: string;
  subtitle: string;
  beforeBadge?: ReactNode;
  /** Contenu optionnel sous le sous-titre (pilules, stats). */
  heroFooter?: ReactNode;
  children: ReactNode;
  /** Classes pour le conteneur du corps (ex. max-w-4xl). */
  contentMaxWidthClass?: string;
  /** Force titleLead + titleBrand on one line (e.g. "Notre équipe"). */
  singleLineTitle?: boolean;
};

/** Même coque visuelle que les hubs : héro cinématique compact + bandeau gradient + contenu. */
export function HubSubpageShell({
  badgeIcon,
  badgeLabel,
  sectionsKicker,
  titleLead,
  titleBrand,
  subtitle,
  beforeBadge,
  heroFooter,
  children,
  contentMaxWidthClass = "max-w-7xl",
  singleLineTitle,
}: HubSubpageShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <HubCinematicHero
        compact
        showScrollHint={false}
        badgeIcon={badgeIcon}
        badgeLabel={badgeLabel}
        sectionsKicker={sectionsKicker}
        titleLead={titleLead}
        titleBrand={titleBrand}
        subtitle={subtitle}
        beforeBadge={beforeBadge}
        singleLineTitle={singleLineTitle}
      >
        {heroFooter}
      </HubCinematicHero>
      <div className="gradient-flow-bg relative">
        <div
          className={cn(
            "relative z-10 mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8",
            contentMaxWidthClass
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function hubVariantClass(
  n: number,
  mode: "trio" | "quad" = "trio"
): "flagship" | "offset" | "heritage" {
  if (mode === "quad") {
    const q = n % 4;
    if (q === 0) return "flagship";
    if (q === 1 || q === 2) return "offset";
    return "heritage";
  }
  return n % 3 === 0 ? "flagship" : n % 3 === 1 ? "offset" : "heritage";
}

type HubBentoProps = {
  to: string;
  id?: string;
  variant: "flagship" | "offset" | "heritage";
  className?: string;
  children: ReactNode;
};

export function HubBentoLink({ to, id, variant, className, children }: HubBentoProps) {
  if (variant === "flagship") {
    return (
      <Link
        to={to}
        id={id}
        className={cn(
          "group relative block h-full min-h-full overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <div className="relative text-foreground">{children}</div>
      </Link>
    );
  }
  if (variant === "offset") {
    return (
      <Link
        to={to}
        id={id}
        className={cn(
          "group relative block h-full min-h-full overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <div className="relative text-foreground">{children}</div>
      </Link>
    );
  }
  return (
    <Link
      to={to}
      id={id}
      className={cn(
        "group relative block h-full min-h-full overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="relative z-[1] text-foreground">{children}</div>
    </Link>
  );
}
