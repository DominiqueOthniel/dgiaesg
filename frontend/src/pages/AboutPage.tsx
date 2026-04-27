import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
} from "framer-motion";
import {
  Target,
  PenLine,
  Landmark,
  Sparkles,
  Globe,
  Building2,
  Users,
  FileText,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Leaf,
  ShieldCheck,
  BarChart3,
  BookOpen,
  ArrowRight,
  Star,
  Zap,
  Scale,
  Eye,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Data ──────────────────────────────────────────────────── */

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

const KEY_STATS = [
  { value: "55", unit: "pays", label: "couverts par nos données", icon: Globe, color: "emerald" },
  { value: "1 200+", unit: "entreprises", label: "référencées dans l'annuaire", icon: Building2, color: "sky" },
  { value: "340+", unit: "rapports", label: "publiés et archivés", icon: FileText, color: "violet" },
  { value: "48 000+", unit: "lecteurs", label: "mensuels actifs", icon: Users, color: "gold" },
] as const;

const MISSION_VALUES = [
  { icon: ShieldCheck, label: "Rigueur", desc: "Certification et audit selon des standards alignés sur les meilleures pratiques internationales." },
  { icon: Eye, label: "Transparence", desc: "Méthodes, sources et limites explicites sur chaque indicateur publié." },
  { icon: Leaf, label: "Pertinence africaine", desc: "Standards adaptés aux réalités économiques et institutionnelles du continent." },
  { icon: Scale, label: "Indépendance", desc: "Ligne éditoriale libre de toute influence commerciale ou politique." },
  { icon: TrendingUp, label: "Impact mesurable", desc: "Chaque certification produit un score composite traçable dans le temps." },
  { icon: Zap, label: "Accessibilité", desc: "Contenu multilingue, ouvert au grand public comme aux experts." },
] as const;

const EDITORIAL_PRINCIPLES = [
  { num: "01", title: "Clarté des faits", desc: "Les données primaires sont distinguées des analyses éditoriales et des contenus partenaires." },
  { num: "02", title: "Sources vérifiées", desc: "Chaque chiffre cité renvoie à une source institutionnelle ou un rapport auditable." },
  { num: "03", title: "Regard africain", desc: "Nos grilles d'analyse contextualisent les normes mondiales aux réalités locales." },
  { num: "04", title: "Mise à jour continue", desc: "Les indicateurs et classements sont actualisés trimestriellement au minimum." },
] as const;

const TIMELINE = [
  { year: "2019", title: "Fondation", desc: "Création d'un registre de transparence ESG pour les entreprises du Maghreb et d'Afrique subsaharienne." },
  { year: "2021", title: "Expansion data", desc: "Lancement du module Données : indicateurs pays, classements sectoriels et accès API pour les chercheurs." },
  { year: "2022", title: "Plateforme intégrée", desc: "Fusion du portail actualités, de l'annuaire d'entreprises et du module pays en une plateforme unifiée." },
  { year: "2024", title: "Certification ESG Africa", desc: "Déploiement du label de certification en partenariat avec 4 bourses africaines et 12 institutions académiques." },
  { year: "2026", title: "Hub continental", desc: "Couverture de 55 pays, lancement du Comparateur et de la Revue ESG Africa trimestrielle." },
] as const;

const CONTENT_TYPES = [
  { icon: Newspaper, label: "Actualités", count: "1 800+ articles" },
  { icon: BarChart3, label: "Données ESG", count: "12 indicateurs" },
  { icon: FileText, label: "Rapports", count: "340+ publications" },
  { icon: BookOpen, label: "Revue trimestrielle", count: "Depuis 2024" },
] as const;

/* ─── Components ─────────────────────────────────────────────── */

function ChapterPip({ href, label, index }: { href: string; label: string; index: number }) {
  return (
    <a href={href} className="group flex items-center gap-3 py-1.5 text-right" title={label}>
      <span className="max-w-[120px] truncate text-[9px] font-bold uppercase tracking-widest text-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
      <span
        className="flex h-2.5 w-2.5 rounded-full border-2 border-primary/40 transition-all group-hover:scale-125 group-hover:border-brand-gold/80"
        style={{ transitionDelay: `${index * 40}ms` }}
      />
    </a>
  );
}

function StatCard({
  stat,
  idx,
}: {
  stat: (typeof KEY_STATS)[number];
  idx: number;
}) {
  const Icon = stat.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
    sky: "text-sky-600 dark:text-sky-400 bg-sky-500/10 ring-sky-500/20",
    violet: "text-violet-600 dark:text-violet-400 bg-violet-500/10 ring-violet-500/20",
    gold: "text-brand-gold-dark bg-brand-gold/10 ring-brand-gold/20",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-[0_16px_40px_-20px_rgba(13,77,51,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.06),transparent_55%)]" />
      <div className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1", colorMap[stat.color])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-black tabular-nums text-foreground">
        {stat.value} <span className="text-sm font-bold text-muted-foreground">{stat.unit}</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}

function ValueCard({ v, idx }: { v: (typeof MISSION_VALUES)[number]; idx: number }) {
  const Icon = v.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: idx * 0.07, duration: 0.45 }}
      className="flex gap-3"
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-extrabold text-foreground">{v.label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
      </div>
    </motion.div>
  );
}

function TimelineItem({
  item,
  idx,
  isLast,
}: {
  item: (typeof TIMELINE)[number];
  idx: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const isCurrent = item.year === "2026";

  return (
    <div ref={ref} className="relative flex gap-5">
      {/* Rail dot + line */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: idx * 0.1, duration: 0.4, type: "spring", stiffness: 250 }}
          className={cn(
            "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-black text-xs shadow-lg",
            isCurrent
              ? "border-brand-gold bg-brand-gold/20 text-brand-gold-dark shadow-[0_0_20px_hsl(var(--brand-gold)/0.3)]"
              : "border-primary/40 bg-card text-primary"
          )}
        >
          {isCurrent ? <Star className="h-4 w-4" /> : item.year.slice(2)}
        </motion.div>
        {!isLast && (
          <div className="mt-1 h-full w-px bg-gradient-to-b from-primary/30 to-transparent" />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: idx * 0.1 + 0.1, duration: 0.45 }}
        className="pb-8"
      >
        <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {item.year}
        </p>
        <h4
          className={cn(
            "text-base font-extrabold tracking-tight",
            isCurrent ? "text-brand-gold-dark" : "text-foreground"
          )}
        >
          {item.title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
      </motion.div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

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
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* ═══ HERO ═══ */}
      <header
        ref={heroRef}
        className="relative flex min-h-[min(88vh,900px)] flex-col justify-end border-b border-white/5"
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
        <div className="absolute inset-0 animate-hairline bg-[length:200%_100%] opacity-[0.12] [background:linear-gradient(120deg,transparent_40%,hsl(var(--primary-foreground))_50%,transparent_60%)]" />

        <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[min(120vw,820px)] w-[min(120vw,820px)] -translate-x-1/2 opacity-[0.14] about-orbit-slow">
          <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.2)", boxShadow: "inset 0 0 60px rgba(255,191,0,0.08)" }} />
        </div>
        <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[min(85vw,560px)] w-[min(85vw,560px)] -translate-x-1/2 rounded-full border border-white/10 opacity-25 about-orbit-slow [animation-direction:reverse] [animation-duration:95s]" />

        <motion.div style={{ y: orb1Y }} className="pointer-events-none absolute -right-4 top-32 h-64 w-64 animate-float-soft rounded-full bg-brand-gold/20 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 bottom-32 h-72 w-72 animate-float-soft rounded-full bg-brand-emerald/25 blur-[110px] [animation-delay:-2s]" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-primary-foreground/5 blur-3xl" />

        <motion.div
          style={{ opacity: heroFade, y: springY, scale: springScale }}
          className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pb-24 lg:px-8"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 shadow-2xl shadow-black/20 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-gold shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-foreground/90">
              {t("pages.about.hero_kicker")}
            </span>
          </motion.div>

          <div className="max-w-5xl">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 text-sm font-bold uppercase tracking-[0.5em] text-primary-foreground/50 md:text-base"
            >
              {t("pages.about.hero_chapters")}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-black leading-[0.95] tracking-[-0.04em] text-primary-foreground sm:text-5xl md:text-7xl lg:text-8xl"
            >
              <span className="block text-primary-foreground/90">{t("pages.about.hero_title_lead")}</span>
              <span
                className="block mt-1 animate-gradient-pan bg-clip-text text-transparent [background-size:200%_auto] md:mt-2"
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
              className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-primary-foreground/70 md:text-2xl"
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

          {/* Hero stats */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {KEY_STATS.map((s) => (
              <div
                key={s.label}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
              >
                <span className="text-lg font-black text-brand-gold tabular-nums">{s.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">
                  {s.unit}
                </span>
              </div>
            ))}
          </motion.div>

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
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <div className="rounded-2xl border border-border/60 bg-card/80 px-2 py-4 shadow-2xl backdrop-blur-xl">
          {SECTIONS.map((s, i) => (
            <ChapterPip key={s.id} href={`#${s.id}`} label={t(s.titleKey)} index={i} />
          ))}
          <Link to="/equipe" className="group flex items-center gap-3 py-1.5 text-right" title={t("pages.team.hero_nav_chip")}>
            <span className="max-w-[120px] truncate text-[9px] font-bold uppercase tracking-widest text-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
              {t("pages.team.hero_nav_chip")}
            </span>
            <span
              className="flex h-2.5 w-2.5 rounded-full border-2 border-primary/40 transition-all group-hover:scale-125 group-hover:border-brand-gold/80"
              style={{ transitionDelay: `${SECTIONS.length * 40}ms` }}
            />
          </Link>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="gradient-flow-bg relative">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-primary to-transparent opacity-30" />

        {/* ── Chiffres clés bento ── */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Chiffres clés
            </p>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {KEY_STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} idx={i} />
            ))}
          </div>
        </section>

        {/* ── Timeline rail ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-[18px] hidden w-px sm:block md:left-8 lg:left-12"
            style={{
              background:
                "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.4) 8%, hsl(var(--primary) / 0.25) 50%, transparent)",
            }}
            aria-hidden
          />

          <ul className="relative space-y-20 sm:pl-8 md:space-y-28 md:pl-14">
            {/* ── 01 Mission ── */}
            <li className="relative list-none">
              <motion.div
                className="absolute -left-0 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/40 bg-card shadow-lg sm:relative sm:float-left sm:mb-4 sm:mr-6 sm:top-0"
                style={{ boxShadow: "0 0 20px hsl(var(--brand-gold) / 0.15)" }}
                initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              >
                <span className="text-[10px] font-black text-primary">01</span>
              </motion.div>

              <div className="p-[1px] rounded-[2rem] border-flow-gold-emerald shadow-2xl shadow-black/10">
                <motion.article
                  id="mission"
                  className="golden-glow relative overflow-hidden rounded-[1.95rem] bg-card/95 p-6 backdrop-blur-sm sm:p-10 md:p-12"
                  initial={reduce ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="pointer-events-none absolute -right-4 -top-4 select-none text-[10rem] font-black leading-none text-foreground/[0.04]">
                    01
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_0%,hsl(var(--brand-gold)/0.12),transparent)]" />
                  <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-2 ring-primary/20 shadow-inner">
                      <Target className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">
                        01 — {t("pages.about.hero_kicker")}
                      </p>
                      <h2 className="mb-5 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                        {t("pages.about.mission_title")}
                      </h2>
                      <p className="mb-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                        {t("pages.about.mission_body")}
                      </p>
                      {/* Values grid */}
                      <div className="grid grid-cols-1 gap-4 border-t border-border/50 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                        {MISSION_VALUES.map((v, i) => (
                          <ValueCard key={v.label} v={v} idx={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </div>
            </li>

            {/* ── 02 Ligne éditoriale ── */}
            <li className="relative list-none">
              <motion.div
                className="absolute -left-0 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/40 bg-card shadow-lg sm:relative sm:float-left sm:mb-4 sm:mr-6 sm:top-0"
                style={{ boxShadow: "0 0 20px hsl(var(--brand-gold) / 0.15)" }}
                initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              >
                <span className="text-[10px] font-black text-primary">02</span>
              </motion.div>

              <motion.article
                id="editorial"
                className="emerald-glow group relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-card via-card to-emerald-950/5 p-6 transition-transform duration-500 sm:p-9 md:-rotate-1 md:hover:rotate-0"
                initial={reduce ? false : { opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pointer-events-none absolute -left-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="pointer-events-none absolute right-0 top-0 p-4 text-7xl font-black text-emerald-600/30 opacity-20">
                  02
                </div>
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <PenLine className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-4 text-2xl font-black text-foreground md:text-3xl">
                      {t("pages.about.editorial_title")}
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {t("pages.about.editorial_body")}
                    </p>
                    {/* Principles */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {EDITORIAL_PRINCIPLES.map((p, i) => (
                        <motion.div
                          key={p.num}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.4 }}
                          className="flex gap-3 rounded-xl border border-border/50 bg-card/50 p-3"
                        >
                          <span className="shrink-0 text-[10px] font-black text-emerald-500">{p.num}</span>
                          <div>
                            <p className="text-xs font-extrabold text-foreground">{p.title}</p>
                            <p className="text-[11px] leading-snug text-muted-foreground">{p.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Content types */}
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-border/40 pt-5">
                      {CONTENT_TYPES.map(({ icon: Icon, label, count }) => (
                        <div
                          key={label}
                          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2"
                        >
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[11px] font-bold text-foreground">{label}</span>
                          <span className="text-[10px] text-muted-foreground">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            </li>

            {/* ── 03 Histoire / Timeline ── */}
            <li className="relative list-none">
              <motion.div
                className="absolute -left-0 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/40 bg-card shadow-lg sm:relative sm:float-left sm:mb-4 sm:mr-6 sm:top-0"
                style={{ boxShadow: "0 0 20px hsl(var(--brand-gold) / 0.15)" }}
                initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              >
                <span className="text-[10px] font-black text-primary">03</span>
              </motion.div>

              <motion.article
                id="history"
                className="relative overflow-hidden rounded-[2rem] border border-dashed border-primary/30 bg-card/60 p-6 backdrop-blur-md sm:p-10"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background:repeating-linear-gradient(-45deg,hsl(var(--border)/0.4)_0_1px,transparent_1px_10px)]" />
                <div className="relative">
                  <div className="mb-6 flex items-start gap-4">
                    <div className="inline-flex rounded-xl border border-foreground/10 bg-muted/40 p-3">
                      <Landmark className="h-8 w-8 text-foreground" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-foreground">
                        {t("pages.about.history_title")}
                      </h2>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {t("pages.about.history_badge")}
                      </p>
                    </div>
                  </div>
                  <p className="mb-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {t("pages.about.history_body")}
                  </p>

                  {/* Timeline */}
                  <div className="rounded-2xl border border-border/50 bg-background/40 p-5 md:p-6">
                    {TIMELINE.map((item, idx) => (
                      <TimelineItem
                        key={item.year}
                        item={item}
                        idx={idx}
                        isLast={idx === TIMELINE.length - 1}
                      />
                    ))}
                  </div>
                </div>
                <div className="pointer-events-none absolute bottom-0 right-0 select-none text-[5rem] font-black leading-none text-foreground/[0.06]" aria-hidden>
                  03
                </div>
              </motion.article>
            </li>
          </ul>
        </div>

        {/* ── CTA bottom — equipe + contribuer ── */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Notre équipe */}
            <Link
              to="/equipe"
              className="golden-glow group relative overflow-hidden rounded-3xl border-border/90 bg-card p-6 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_40px_80px_-28px_rgba(13,77,51,0.6)] md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-gold)/0.1),transparent_55%)]" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">Notre équipe</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Découvrez les journalistes, analystes et experts qui font vivre DGIAESG au quotidien.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
                  Rencontrer l'équipe <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Contribuer */}
            <Link
              to="/contribuer"
              className="group relative overflow-hidden rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/8 via-brand-gold/5 to-transparent p-6 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.35)] transition-all hover:-translate-y-1 hover:border-brand-gold/35 hover:shadow-[0_40px_80px_-28px_rgba(13,77,51,0.5)] md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--brand-gold)/0.08),transparent_60%)]" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/10 text-brand-gold-dark">
                  <PenLine className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">Appel à contributions</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Experts et praticiens, partagez vos analyses ESG, études de cas et retours terrain avec notre communauté.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-gold-dark">
                  Soumettre une contribution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
