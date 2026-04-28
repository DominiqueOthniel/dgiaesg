import { useTranslation } from "react-i18next";
import {
  Database,
  LineChart,
  Trophy,
  FileText,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HubCinematicHero } from "@/components/hub/HubCinematicHero";

const BLOCKS = [
  {
    key: "indicators",
    href: "/donnees/indicateurs",
    icon: LineChart,
    titleKey: "pages.data.blocks.indicators_title",
    descKey: "pages.data.blocks.indicators_desc",
    tagKey: "pages.data.tags.indicators",
    tagFallback: "Tableaux de bord",
  },
  {
    key: "rankings",
    href: "/donnees/classements",
    icon: Trophy,
    titleKey: "pages.data.blocks.rankings_title",
    descKey: "pages.data.blocks.rankings_desc",
    tagKey: "pages.data.tags.rankings",
    tagFallback: "Top performers",
  },
  {
    key: "reports",
    href: "/donnees/rapports",
    icon: FileText,
    titleKey: "pages.data.blocks.reports_title",
    descKey: "pages.data.blocks.reports_desc",
    tagKey: "pages.data.tags.reports",
    tagFallback: "Bibliothèque",
  },
  {
    key: "comparator",
    href: "/donnees/comparateur",
    icon: SlidersHorizontal,
    titleKey: "pages.data.blocks.comparator_title",
    descKey: "pages.data.blocks.comparator_desc",
    tagKey: "pages.data.tags.comparator",
    tagFallback: "Premium",
    premium: true as const,
  },
] as const;

function DataCard({
  block,
  t,
}: {
  block: (typeof BLOCKS)[number];
  t: (k: string, opts?: { defaultValue: string }) => string;
}) {
  const Icon = block.icon;
  const tag = t(block.tagKey, { defaultValue: block.tagFallback });
  const isPremium = "premium" in block && block.premium;

  return (
    <Link
      to={block.href}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:ring-1 hover:ring-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${t(block.titleKey, { defaultValue: "" })} — ${t(block.descKey, { defaultValue: "" })}`}
    >
      {/* Soft halos */}
      <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-primary/[0.08] blur-3xl transition-all duration-700 group-hover:bg-primary/[0.18] group-hover:scale-110" />
      <div className="pointer-events-none absolute -left-14 -bottom-14 h-48 w-48 rounded-full bg-brand-gold/[0.08] blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110" />
      {/* Sweeping shine on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={
            isPremium
              ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold-dark ring-1 ring-brand-gold/30 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:bg-brand-gold/20"
              : "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:bg-primary/15"
          }
        >
          <Icon className="h-6 w-6 transition-transform duration-500 group-hover:-rotate-6" aria-hidden />
        </div>
        <span
          className={
            isPremium
              ? "inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark transition-colors duration-500 group-hover:border-brand-gold/60 group-hover:bg-brand-gold/15"
              : "inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/65 backdrop-blur transition-colors duration-500 group-hover:border-primary/40"
          }
        >
          <span
            className={
              isPremium
                ? "h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse"
                : "h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
            }
            aria-hidden
          />
          {tag}
        </span>
      </div>

      <h2
        className={
          isPremium
            ? "relative mt-6 text-2xl font-extrabold tracking-tight text-foreground transition-colors duration-500 group-hover:text-brand-gold-dark"
            : "relative mt-6 text-2xl font-extrabold tracking-tight text-foreground transition-colors duration-500 group-hover:text-primary"
        }
      >
        {t(block.titleKey, { defaultValue: "" })}
      </h2>
      <p className="relative mt-2 text-sm leading-relaxed text-foreground/75">
        {t(block.descKey, { defaultValue: "" })}
      </p>

      <div className="relative mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <span
            className={
              isPremium
                ? "text-xs font-black uppercase tracking-wider text-brand-gold-dark transition-all duration-500 group-hover:tracking-[0.18em]"
                : "text-xs font-black uppercase tracking-wider text-primary transition-all duration-500 group-hover:tracking-[0.18em]"
            }
          >
            {t("pages.data.explore", { defaultValue: "Explorer" })}
          </span>
          <span
            className={
              isPremium
                ? "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-brand-gold-dark shadow-sm transition-all duration-500 group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-gold/20"
                : "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20"
            }
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function DataPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <HubCinematicHero
        badgeIcon={Database}
        badgeLabel={t("nav.data")}
        sectionsKicker={t("pages.data.hero_sections")}
        titleLead={t("pages.data.hero_title_lead")}
        titleBrand={t("pages.data.hero_title_brand")}
        subtitle={t("pages.data.hero_subtitle")}
        chipsAriaLabel={t("pages.data.hero_sections")}
        chips={BLOCKS.map((b, i) => ({
          id: b.key,
          idx: `0${i + 1}`,
          label: t(b.titleKey),
        }))}
      >
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
          <span className="text-2xl font-black leading-none text-brand-gold tabular-nums">
            {BLOCKS.length}
          </span>
          <span className="max-w-[14rem] text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80">
            {t("pages.data.explore")}
          </span>
        </div>
      </HubCinematicHero>

      <div className="relative bg-[linear-gradient(180deg,hsl(var(--surface-warm)),hsl(var(--background)))]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_18%_-10%,hsl(var(--brand-gold)/0.10),transparent_55%),radial-gradient(900px_420px_at_85%_-12%,hsl(var(--brand-emerald)/0.10),transparent_55%)]" />
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
          <div className="pointer-events-none absolute -top-6 left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {BLOCKS.map((block, idx) => (
              <motion.div
                key={block.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.05, duration: 0.45 }}
                className="h-full"
              >
                <DataCard block={block} t={t as (k: string, opts?: { defaultValue: string }) => string} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
