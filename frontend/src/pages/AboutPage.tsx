import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Target, PenLine, Landmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "mission",
    icon: Target,
    titleKey: "pages.about.mission_title",
    bodyKey: "pages.about.mission_body",
    idx: "01",
    variant: "flagship" as const,
  },
  {
    id: "editorial",
    icon: PenLine,
    titleKey: "pages.about.editorial_title",
    bodyKey: "pages.about.editorial_body",
    idx: "02",
    variant: "offset" as const,
  },
  {
    id: "history",
    icon: Landmark,
    titleKey: "pages.about.history_title",
    bodyKey: "pages.about.history_body",
    idx: "03",
    variant: "heritage" as const,
  },
] as const;

function ChapterPip({ href, label, index }: { href: string; label: string; index: number }) {
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

export default function AboutPage() {
  const { t } = useTranslation();
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
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* ═══ HERO — Cinematic ═══ */}
      <header
        ref={heroRef}
        className="relative min-h-[min(88vh,900px)] flex flex-col justify-end border-b border-white/5"
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

        {/* Giant orbit + inner ring */}
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

        {/* Floating orbs */}
        <motion.div
          style={{ y: orb1Y }}
          className="pointer-events-none absolute -right-4 top-32 h-64 w-64 rounded-full bg-brand-gold/20 blur-[100px] animate-float-soft"
        />
        <div className="pointer-events-none absolute -left-20 bottom-32 h-72 w-72 rounded-full bg-brand-emerald/25 blur-[110px] animate-float-soft [animation-delay:-2s]" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-primary-foreground/5 blur-3xl" />

        <motion.div
          style={{ opacity: heroFade, y: springY, scale: springScale }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 pt-28"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md mb-8 shadow-2xl shadow-black/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-foreground/90">
              {t("pages.about.hero_kicker")}
            </span>
          </motion.div>

          <div className="max-w-5xl">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-base font-bold uppercase tracking-[0.5em] text-primary-foreground/50 mb-3"
            >
              {t("pages.about.hero_chapters")}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.95] text-primary-foreground"
            >
              <span className="block text-primary-foreground/90">
                {t("pages.about.hero_title_lead")}
              </span>
              <span
                className="block mt-1 md:mt-2 bg-clip-text text-transparent [background-size:200%_auto] animate-gradient-pan"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, hsl(var(--brand-gold)), hsl(45 100% 85%), hsl(var(--brand-emerald)), hsl(var(--brand-gold)))",
                }}
              >
                {t("pages.about.hero_title_brand")}
              </span>
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.55 }}
              className="mt-8 text-lg md:text-2xl font-medium leading-relaxed text-primary-foreground/70 max-w-2xl"
            >
              {t("pages.about.hero_subtitle")}
            </motion.p>
          </div>

          {/* Quick chapter chips */}
          <motion.nav
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 flex flex-wrap gap-2 md:gap-3"
            aria-label={t("pages.about.hero_chapters")}
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground/85 backdrop-blur-sm transition-all hover:border-brand-gold/50 hover:bg-white/10 hover:shadow-lg hover:shadow-brand-gold/10"
              >
                <span className="text-[10px] text-brand-gold/90">{s.idx}</span>
                {t(s.titleKey)}
              </a>
            ))}
            <Link
              to="/equipe"
              className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground/85 backdrop-blur-sm transition-all hover:border-brand-gold/50 hover:bg-white/10 hover:shadow-lg hover:shadow-brand-gold/10"
            >
              <span className="text-[10px] text-brand-gold/90">04</span>
              {t("pages.team.hero_nav_chip")}
            </Link>
          </motion.nav>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex justify-center md:justify-start"
            aria-hidden
          >
            <div className="flex flex-col items-center gap-1 text-primary-foreground/30">
              <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Scroll</span>
              <div className="h-8 w-px bg-gradient-to-b from-primary-foreground/40 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Sticky side chapter index — desktop */}
      <div className="hidden xl:block fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl px-2 py-4 shadow-2xl">
          {SECTIONS.map((s, i) => (
            <ChapterPip
              key={s.id}
              href={`#${s.id}`}
              label={t(s.titleKey)}
              index={i}
            />
          ))}
          <Link
            to="/equipe"
            className="group flex items-center gap-3 py-1.5 text-right"
            title={t("pages.team.hero_nav_chip")}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity max-w-[120px] truncate">
              {t("pages.team.hero_nav_chip")}
            </span>
            <span
              className="flex h-2.5 w-2.5 rounded-full border-2 border-primary/40 transition-all group-hover:scale-125 group-hover:border-brand-gold/80"
              style={{ transitionDelay: `${SECTIONS.length * 40}ms` }}
            />
          </Link>
        </div>
      </div>

      {/* ═══ Content chapters ═══ */}
      <div className="relative gradient-flow-bg">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-primary to-transparent opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          {/* Timeline rail */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-[18px] md:left-8 lg:left-12 w-px hidden sm:block"
            style={{
              background:
                "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.4) 8%, hsl(var(--primary) / 0.25) 50%, transparent)",
            }}
            aria-hidden
          />

          <ul className="relative space-y-20 md:space-y-28 sm:pl-8 md:pl-14">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isFlagship = section.variant === "flagship";
              const isOffset = section.variant === "offset";
              const isHeritage = section.variant === "heritage";

              return (
                <li key={section.id} className="relative list-none">
                  <motion.div
                    className="absolute -left-0 sm:left-0 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/40 bg-card shadow-lg sm:relative sm:float-left sm:mr-6 sm:top-0 sm:mb-4"
                    style={{ boxShadow: "0 0 20px hsl(var(--brand-gold) / 0.15)" }}
                    initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  >
                    <span className="text-[10px] font-black text-primary">{section.idx}</span>
                  </motion.div>

                  <div
                    className={cn(
                      "sm:ml-0",
                      isOffset && "md:ml-auto md:max-w-2xl md:pl-0",
                    )}
                  >
                    {isFlagship && (
                      <div className="p-[1px] rounded-[2rem] border-flow-gold-emerald shadow-2xl shadow-black/10">
                        <motion.article
                          id={section.id}
                          className="golden-glow relative overflow-hidden rounded-[1.95rem] bg-card/95 p-6 sm:p-10 md:p-12 backdrop-blur-sm"
                          initial={reduce ? false : { opacity: 0, y: 32 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="absolute -right-4 -top-4 text-[10rem] font-black leading-none text-foreground/[0.04] select-none pointer-events-none">
                            {section.idx}
                          </div>
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_0%,hsl(var(--brand-gold)/0.12),transparent)]" />
                          <div className="relative flex flex-col md:flex-row md:items-start gap-6">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-2 ring-primary/20 shadow-inner">
                              <Icon className="h-8 w-8" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-2">
                                {section.idx} — {t("pages.about.hero_kicker")}
                              </p>
                              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-5">
                                {t(section.titleKey)}
                              </h2>
                              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                {t(section.bodyKey)}
                              </p>
                            </div>
                          </div>
                        </motion.article>
                      </div>
                    )}

                    {isOffset && (
                      <motion.article
                        id={section.id}
                        className="emerald-glow group relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-card via-card to-emerald-950/5 p-6 sm:p-9 md:-rotate-1 md:hover:rotate-0 transition-transform duration-500"
                        initial={reduce ? false : { opacity: 0, x: 32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute -left-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
                        <div className="absolute right-0 top-0 p-4 opacity-20 text-7xl font-black text-emerald-600/30">
                          {section.idx}
                        </div>
                        <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                            <Icon className="h-7 w-7" />
                          </div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">
                              {t(section.titleKey)}
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                              {t(section.bodyKey)}
                            </p>
                          </div>
                        </div>
                      </motion.article>
                    )}

                    {isHeritage && (
                      <motion.article
                        id={section.id}
                        className="relative overflow-hidden rounded-[2rem] border border-dashed border-primary/30 bg-card/60 p-6 sm:p-10 backdrop-blur-md"
                        initial={reduce ? false : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute inset-0 opacity-[0.35] [background:repeating-linear-gradient(-45deg,hsl(var(--border)/0.4)_0_1px,transparent_1px_10px)]" />
                        <div className="relative flex flex-col lg:flex-row gap-8">
                          <div className="lg:w-1/3">
                            <div className="inline-flex rounded-xl border border-foreground/10 bg-muted/40 p-3">
                              <Icon className="h-10 w-10 text-foreground" />
                            </div>
                            <h2 className="mt-6 text-3xl font-black text-foreground">
                              {t(section.titleKey)}
                            </h2>
                            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                              {t("pages.about.history_badge")}
                            </p>
                          </div>
                          <p className="lg:flex-1 text-base md:text-lg text-muted-foreground leading-relaxed border-l-0 lg:border-l border-border/60 lg:pl-10">
                            {t(section.bodyKey)}
                          </p>
                        </div>
                        <div
                          className="pointer-events-none absolute bottom-0 right-0 text-[5rem] font-black leading-none text-foreground/[0.06]"
                          aria-hidden
                        >
                          {section.idx}
                        </div>
                      </motion.article>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
