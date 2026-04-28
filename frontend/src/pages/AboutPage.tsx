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

const SECTIONS = [
  { id: "mission", icon: Target, titleKey: "pages.about.mission_title", idx: "01" },
  { id: "editorial", icon: PenLine, titleKey: "pages.about.editorial_title", idx: "02" },
  { id: "history", icon: Landmark, titleKey: "pages.about.history_title", idx: "03" },
] as const;

const KEY_STATS = [
  { value: "55", unit: "pays", label: "couverts par nos donnees", icon: Globe, color: "emerald" },
  { value: "1 200+", unit: "entreprises", label: "referencees dans l'annuaire", icon: Building2, color: "sky" },
  { value: "340+", unit: "rapports", label: "publies et archives", icon: FileText, color: "violet" },
  { value: "48 000+", unit: "lecteurs", label: "mensuels actifs", icon: Users, color: "gold" },
] as const;

const MISSION_VALUES = [
  { icon: ShieldCheck, label: "Rigueur", desc: "Certification et audit selon des standards alignes sur les meilleures pratiques internationales." },
  { icon: Eye, label: "Transparence", desc: "Methodes, sources et limites explicites sur chaque indicateur publie." },
  { icon: Leaf, label: "Pertinence africaine", desc: "Standards adaptes aux realites economiques et institutionnelles du continent." },
  { icon: Scale, label: "Independance", desc: "Ligne editoriale libre de toute influence commerciale ou politique." },
  { icon: TrendingUp, label: "Impact mesurable", desc: "Chaque certification produit un score composite tracable dans le temps." },
  { icon: Zap, label: "Accessibilite", desc: "Contenu multilingue, ouvert au grand public comme aux experts." },
] as const;

const EDITORIAL_PRINCIPLES = [
  { num: "01", title: "Clarte des faits", desc: "Les donnees primaires sont distinguees des analyses editoriales et des contenus partenaires." },
  { num: "02", title: "Sources verifiees", desc: "Chaque chiffre cite renvoie a une source institutionnelle ou un rapport auditable." },
  { num: "03", title: "Regard africain", desc: "Nos grilles d'analyse contextualisent les normes mondiales aux realites locales." },
  { num: "04", title: "Mise a jour continue", desc: "Les indicateurs et classements sont actualises trimestriellement au minimum." },
] as const;

const TIMELINE = [
  { year: "2019", title: "Fondation", desc: "Creation d'un registre de transparence ESG pour les entreprises du Maghreb et d'Afrique subsaharienne." },
  { year: "2021", title: "Expansion data", desc: "Lancement du module Donnees : indicateurs pays, classements sectoriels et acces API pour les chercheurs." },
  { year: "2022", title: "Plateforme integree", desc: "Fusion du portail actualites, de l'annuaire d'entreprises et du module pays en une plateforme unifiee." },
  { year: "2024", title: "Certification ESG Africa", desc: "Deploiement du label de certification en partenariat avec 4 bourses africaines et 12 institutions academiques." },
  { year: "2026", title: "Hub continental", desc: "Couverture de 55 pays, lancement du Comparateur et de la Revue ESG Africa trimestrielle." },
] as const;

const CONTENT_TYPES = [
  { icon: Newspaper, label: "Actualites", count: "1 800+ articles" },
  { icon: BarChart3, label: "Donnees ESG", count: "12 indicateurs" },
  { icon: FileText, label: "Rapports", count: "340+ publications" },
  { icon: BookOpen, label: "Revue trimestrielle", count: "Depuis 2024" },
] as const;

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

function StatCard({ stat, idx }: { stat: (typeof KEY_STATS)[number]; idx: number }) {
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
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-[0_16px_40px_-20px_rgba(13,77,51,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.06),transparent_55%)]" />
      <div className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1", colorMap[stat.color])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-black tabular-nums text-foreground">
        {stat.value} <span className="text-sm font-bold text-foreground/70">{stat.unit}</span>
      </p>
      <p className="mt-1 text-xs font-medium text-foreground/75">{stat.label}</p>
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
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-base font-extrabold text-foreground">{v.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/80">{v.desc}</p>
      </div>
    </motion.div>
  );
}

function RichBody({ text, tone = "default" }: { text: string; tone?: "default" | "emerald" | "gold" }) {
  const blocks = text
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);

  const toneClass =
    tone === "emerald"
      ? "border-emerald-500/20 bg-emerald-500/[0.04]"
      : tone === "gold"
      ? "border-brand-gold/25 bg-brand-gold/[0.05]"
      : "border-primary/20 bg-primary/[0.04]";

  const bulletDotClass =
    tone === "emerald"
      ? "bg-emerald-600"
      : tone === "gold"
      ? "bg-brand-gold-dark"
      : "bg-primary";

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        const bulletLines = lines.filter((l) => l.startsWith("- "));
        const textLines = lines.filter((l) => !l.startsWith("- "));
        const isPureList = bulletLines.length > 0 && bulletLines.length === lines.length;
        const hasLeadAndList = bulletLines.length > 0 && textLines.length > 0;

        if (isPureList) {
          return (
            <div key={`list-${i}`} className={cn("rounded-2xl border p-4 md:p-5", toneClass)}>
              <ul className="space-y-3">
                {bulletLines.map((line, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90 md:text-[15px]">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", bulletDotClass)} />
                    <span>{line.replace(/^-\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (hasLeadAndList) {
          return (
            <div key={`mix-${i}`} className="space-y-3">
              <p className="text-lg font-semibold leading-relaxed text-foreground md:text-xl">{textLines.join(" ")}</p>
              <div className={cn("rounded-2xl border p-4 md:p-5", toneClass)}>
                <ul className="space-y-3">
                  {bulletLines.map((line, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90 md:text-[15px]">
                      <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", bulletDotClass)} />
                      <span>{line.replace(/^-\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }

        if (lines.length === 1 && lines[0].endsWith(":")) {
          return (
            <div key={`heading-${i}`} className="flex items-center gap-3 pt-2">
              <p className="text-sm font-black uppercase tracking-wider text-foreground/80 md:text-base">{lines[0]}</p>
              <div className="h-px flex-1 bg-border/60" />
            </div>
          );
        }

        return (
          <p
            key={`p-${i}`}
            className={cn(
              "text-base leading-relaxed text-foreground/92 md:text-lg md:leading-relaxed",
              i === 0 && "text-[17px] font-medium md:text-[21px]"
            )}
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}
function TimelineItem({ item, idx, isLast }: { item: (typeof TIMELINE)[number]; idx: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const isCurrent = item.year === "2026";

  return (
    <div ref={ref} className="relative flex gap-5">
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
        {!isLast && <div className="mt-1 h-full w-px bg-gradient-to-b from-primary/30 to-transparent" />}
      </div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: idx * 0.1 + 0.1, duration: 0.45 }}
        className="pb-8"
      >
        <p className="mb-1 text-xs font-black uppercase tracking-widest text-foreground/70">{item.year}</p>
        <h4 className={cn("text-lg font-extrabold tracking-tight", isCurrent ? "text-brand-gold-dark" : "text-foreground")}>
          {item.title}
        </h4>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{item.desc}</p>
      </motion.div>
    </div>
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
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <header ref={heroRef} className="relative flex min-h-[min(84vh,860px)] flex-col justify-end border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-primary to-primary" />
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% -12%, hsl(var(--brand-emerald) / 0.26), transparent 65%), radial-gradient(ellipse 50% 35% at 100% 0%, hsl(var(--brand-gold) / 0.14), transparent 62%)",
          }}
        />
        <motion.div style={{ y: orb1Y }} className="pointer-events-none absolute -right-10 top-28 h-60 w-60 rounded-full bg-brand-gold/16 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 bottom-24 h-72 w-72 rounded-full bg-brand-emerald/20 blur-[110px]" />
        <div className="pointer-events-none absolute left-1/2 top-8 h-36 w-64 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />

        <motion.div style={{ opacity: heroFade, y: springY, scale: springScale }} className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pb-24 lg:px-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 shadow-2xl shadow-black/20 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-foreground/90">{t("pages.about.hero_kicker")}</span>
          </motion.div>

          <div className="max-w-5xl rounded-3xl border border-white/15 bg-black/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-md md:p-8">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 text-sm font-bold uppercase tracking-[0.5em] text-primary-foreground/60 md:text-base"
            >
              {t("pages.about.hero_chapters")}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-black leading-[0.95] tracking-[-0.04em] text-primary-foreground sm:text-5xl md:text-7xl lg:text-8xl"
            >
              <span className="block text-primary-foreground/95">{t("pages.about.hero_title_lead")}</span>
              <span
                className="mt-1 block animate-gradient-pan bg-clip-text text-transparent [background-size:200%_auto] md:mt-2"
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
              className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-primary-foreground/88 md:text-2xl"
            >
              {t("pages.about.hero_subtitle")}
            </motion.p>
          </div>

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
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground/95 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand-gold/60 hover:bg-white/15 hover:shadow-lg hover:shadow-brand-gold/10"
              >
                <span className="text-[10px] text-brand-gold/90">{s.idx}</span>
                {t(s.titleKey)}
              </a>
            ))}
            <Link
              to="/equipe"
              className="group inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground/95 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand-gold/60 hover:bg-white/15 hover:shadow-lg hover:shadow-brand-gold/10"
            >
              <span className="text-[10px] text-brand-gold/90">04</span>
              {t("pages.team.hero_nav_chip")}
            </Link>
          </motion.nav>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {KEY_STATS.map((s) => (
              <div key={s.label} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-sm">
                <span className="text-lg font-black tabular-nums text-brand-gold">{s.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/75">{s.unit}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </header>

      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
        <div className="rounded-2xl border border-border/60 bg-card/80 px-2 py-4 shadow-2xl backdrop-blur-xl">
          {SECTIONS.map((s, i) => (
            <ChapterPip key={s.id} href={`#${s.id}`} label={t(s.titleKey)} index={i} />
          ))}
          <Link to="/equipe" className="group flex items-center gap-3 py-1.5 text-right" title={t("pages.team.hero_nav_chip")}>
            <span className="max-w-[120px] truncate text-[9px] font-bold uppercase tracking-widest text-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
              {t("pages.team.hero_nav_chip")}
            </span>
            <span className="flex h-2.5 w-2.5 rounded-full border-2 border-primary/40 transition-all group-hover:scale-125 group-hover:border-brand-gold/80" style={{ transitionDelay: `${SECTIONS.length * 40}ms` }} />
          </Link>
        </div>
      </div>

      <div className="relative bg-[linear-gradient(180deg,hsl(var(--surface-warm)),hsl(var(--background)))]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_18%_-10%,hsl(var(--brand-gold)/0.08),transparent_55%),radial-gradient(900px_420px_at_85%_-12%,hsl(var(--brand-emerald)/0.08),transparent_55%)]" />

        <section className="relative z-10 mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Chiffres cles</p>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {KEY_STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} idx={i} />
            ))}
          </div>
        </section>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <ul className="space-y-12 md:space-y-16">
            <li className="list-none">
              <motion.article
                id="mission"
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(13,77,51,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_34px_76px_-32px_rgba(13,77,51,0.4)] sm:p-10 md:p-12"
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pointer-events-none absolute -right-12 -top-14 h-56 w-56 rounded-full bg-primary/[0.06] blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:bg-primary/[0.12]" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25 shadow-sm">
                    <Target className="h-8 w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                        Chapitre 01
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                        {t("pages.about.hero_kicker")}
                      </span>
                    </div>
                    <h2 className="mb-5 text-3xl font-black tracking-tight text-foreground md:text-4xl">{t("pages.about.mission_title")}</h2>
                    <div className="mb-8"><RichBody text={t("pages.about.mission_body")} tone="default" /></div>
                    <div className="grid grid-cols-1 gap-5 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
                      {MISSION_VALUES.map((v, i) => (
                        <ValueCard key={v.label} v={v} idx={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            </li>

            <li className="list-none">
              <motion.article
                id="editorial"
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(13,77,51,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_34px_76px_-32px_rgba(13,77,51,0.4)] sm:p-10 md:p-12"
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pointer-events-none absolute -left-12 -bottom-14 h-56 w-56 rounded-full bg-brand-emerald/[0.06] blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:bg-brand-emerald/[0.12]" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-emerald/12 text-emerald-700 dark:text-emerald-400 ring-1 ring-brand-emerald/25 shadow-sm">
                    <PenLine className="h-8 w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                        Chapitre 02
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                        Ligne éditoriale
                      </span>
                    </div>
                    <h2 className="mb-5 text-3xl font-black tracking-tight text-foreground md:text-4xl">{t("pages.about.editorial_title")}</h2>
                    <div className="mb-8"><RichBody text={t("pages.about.editorial_body")} tone="emerald" /></div>

                    <div className="grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-2">
                      {EDITORIAL_PRINCIPLES.map((p, i) => (
                        <motion.div
                          key={p.num}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.4 }}
                          className="group relative overflow-hidden rounded-xl border border-border/80 bg-background/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-[0_16px_34px_-20px_rgba(16,185,129,0.45)]"
                        >
                          <span className="shrink-0 text-xs font-black text-emerald-700 dark:text-emerald-400">{p.num}</span>
                          <div>
                            <p className="text-sm font-extrabold text-foreground">{p.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-foreground/75">{p.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
                      {CONTENT_TYPES.map(({ icon: Icon, label, count }) => (
                        <div key={label} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                          <Icon className="h-3.5 w-3.5 text-foreground/70" />
                          <span className="text-xs font-bold text-foreground">{label}</span>
                          <span className="text-[11px] text-foreground/65">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            </li>

            <li className="list-none">
              <motion.article
                id="history"
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(13,77,51,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_34px_76px_-32px_rgba(13,77,51,0.4)] sm:p-10 md:p-12"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pointer-events-none absolute -right-12 -top-14 h-56 w-56 rounded-full bg-brand-gold/[0.06] blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:bg-brand-gold/[0.12]" />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                <div className="relative">
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gold/12 text-brand-gold-dark ring-1 ring-brand-gold/25 shadow-sm">
                      <Landmark className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">
                        Chapitre 03
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                        Histoire
                      </span>
                    </div>
                      <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">{t("pages.about.history_title")}</h2>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-foreground/70">{t("pages.about.history_badge")}</p>
                    </div>
                  </div>
                  <div className="mb-8"><RichBody text={t("pages.about.history_body")} tone="gold" /></div>

                  <div className="rounded-2xl border border-border bg-background/60 p-5 md:p-6">
                    {TIMELINE.map((item, idx) => (
                      <TimelineItem key={item.year} item={item} idx={idx} isLast={idx === TIMELINE.length - 1} />
                    ))}
                  </div>
                </div>
              </motion.article>
            </li>
          </ul>
        </div>

        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <Link
              to="/equipe"
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.45)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_40px_80px_-28px_rgba(13,77,51,0.6)] md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-gold)/0.1),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">Notre equipe</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">Decouvrez les journalistes, analystes et experts qui font vivre DGIAESG au quotidien.</p>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
                  Rencontrer l'equipe <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link
              to="/contribuer"
              className="group relative overflow-hidden rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/8 via-brand-gold/5 to-transparent p-6 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-gold/35 hover:shadow-[0_40px_80px_-28px_rgba(13,77,51,0.5)] md:p-8"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--brand-gold)/0.08),transparent_60%)]" />
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/10 text-brand-gold-dark">
                  <PenLine className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">Appel a contributions</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">Experts et praticiens, partagez vos analyses ESG, etudes de cas et retours terrain avec notre communaute.</p>
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






