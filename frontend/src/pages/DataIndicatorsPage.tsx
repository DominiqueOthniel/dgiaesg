import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Minus,
  Leaf,
  Users,
  ShieldCheck,
  Globe,
  Zap,
  Droplets,
  Recycle,
  Building2,
  GraduationCap,
  HeartHandshake,
  Scale,
  Eye,
  Landmark,
} from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────── */

type Trend = "up" | "down" | "flat";

interface Indicator {
  id: string;
  label: string;
  value: string;
  unit: string;
  change: string;
  trend: Trend;
  scope: string;
  icon: React.ElementType;
  sparkline: number[]; // 0-100 relative values
  color: "emerald" | "sky" | "violet";
  category: "E" | "S" | "G";
  description: string;
}

const INDICATORS: Indicator[] = [
  /* ── Environnement ── */
  {
    id: "renew-energy",
    label: "Énergie renouvelable",
    value: "38",
    unit: "%",
    change: "+4.2 pp",
    trend: "up",
    scope: "Afrique de l'Ouest",
    icon: Zap,
    sparkline: [22, 25, 27, 29, 31, 33, 36, 38],
    color: "emerald",
    category: "E",
    description: "Part des EnR dans le mix électrique des 16 pays CEDEAO",
  },
  {
    id: "water",
    label: "Accès eau potable",
    value: "71",
    unit: "%",
    change: "+1.8 pp",
    trend: "up",
    scope: "Afrique de l'Est",
    icon: Droplets,
    sparkline: [60, 62, 64, 66, 67, 68, 70, 71],
    color: "sky",
    category: "E",
    description: "Population disposant d'un accès à l'eau salubre gérée",
  },
  {
    id: "recycling",
    label: "Taux de recyclage urbain",
    value: "29",
    unit: "%",
    change: "-0.3 pp",
    trend: "down",
    scope: "Pan-africain",
    icon: Recycle,
    sparkline: [25, 27, 28, 30, 31, 30, 29, 29],
    color: "emerald",
    category: "E",
    description: "Part des déchets solides urbains effectivement recyclés",
  },
  {
    id: "green-bonds",
    label: "Obligations vertes / PIB",
    value: "2.4",
    unit: "%",
    change: "+0.6 pp",
    trend: "up",
    scope: "Afrique du Nord",
    icon: Leaf,
    sparkline: [0.8, 1.0, 1.2, 1.5, 1.7, 1.9, 2.1, 2.4],
    color: "emerald",
    category: "E",
    description: "Encours obligataire durable rapporté au PIB national",
  },
  /* ── Social ── */
  {
    id: "esg-coverage",
    label: "Couverture reporting ESG",
    value: "54",
    unit: "%",
    change: "+7.1 pp",
    trend: "up",
    scope: "Afrique australe",
    icon: Globe,
    sparkline: [35, 38, 41, 44, 47, 50, 52, 54],
    color: "sky",
    category: "S",
    description: "Entreprises cotées publiant un rapport de durabilité",
  },
  {
    id: "education",
    label: "Taux alphabétisation adultes",
    value: "67",
    unit: "%",
    change: "+2.0 pp",
    trend: "up",
    scope: "Afrique subsaharienne",
    icon: GraduationCap,
    sparkline: [55, 57, 59, 61, 63, 64, 66, 67],
    color: "sky",
    category: "S",
    description: "Part de la population adulte sachant lire et écrire",
  },
  {
    id: "gender-pay",
    label: "Écart salarial H/F",
    value: "28",
    unit: "%",
    change: "-3.2 pp",
    trend: "up",
    scope: "Grandes entreprises africaines",
    icon: HeartHandshake,
    sparkline: [40, 38, 36, 34, 33, 31, 29, 28],
    color: "sky",
    category: "S",
    description: "Écart médian de rémunération entre femmes et hommes",
  },
  {
    id: "health",
    label: "Dépenses santé / PIB",
    value: "5.1",
    unit: "%",
    change: "+0.4 pp",
    trend: "up",
    scope: "UA (55 États)",
    icon: Users,
    sparkline: [4.0, 4.2, 4.4, 4.5, 4.7, 4.8, 4.9, 5.1],
    color: "sky",
    category: "S",
    description: "Dépenses publiques et privées de santé en % du PIB",
  },
  /* ── Gouvernance ── */
  {
    id: "transparency",
    label: "Indice de transparence",
    value: "41",
    unit: "/100",
    change: "+2.5 pts",
    trend: "up",
    scope: "Afrique centrale",
    icon: Eye,
    sparkline: [32, 34, 35, 36, 37, 39, 40, 41],
    color: "violet",
    category: "G",
    description: "Score moyen Transparency International (Afrique centrale)",
  },
  {
    id: "board-diversity",
    label: "Diversité CA (% femmes)",
    value: "22",
    unit: "%",
    change: "+3.8 pp",
    trend: "up",
    scope: "CAC Africa 40",
    icon: Building2,
    sparkline: [12, 14, 15, 16, 18, 19, 21, 22],
    color: "violet",
    category: "G",
    description: "Proportion d'administratrices dans les grandes entreprises",
  },
  {
    id: "rule-of-law",
    label: "État de droit",
    value: "38",
    unit: "/100",
    change: "=",
    trend: "flat",
    scope: "Pan-africain",
    icon: Scale,
    sparkline: [36, 37, 37, 38, 38, 38, 38, 38],
    color: "violet",
    category: "G",
    description: "Score WJP Rule of Law Index (moyenne continentale)",
  },
  {
    id: "esg-regulation",
    label: "Réglementation ESG",
    value: "19",
    unit: "pays",
    change: "+3",
    trend: "up",
    scope: "Afrique",
    icon: Landmark,
    sparkline: [8, 10, 12, 13, 14, 16, 17, 19],
    color: "violet",
    category: "G",
    description: "Pays ayant adopté une réglementation ESG contraignante",
  },
];

const FEATURED: Indicator = {
  id: "climate-invest",
  label: "Investissement climatique / PIB",
  value: "2.1",
  unit: "%",
  change: "+0.5 pp vs 2024",
  trend: "up",
  scope: "Afrique continentale",
  icon: Leaf,
  sparkline: [0.9, 1.1, 1.2, 1.4, 1.5, 1.7, 1.9, 2.1],
  color: "emerald",
  category: "E",
  description:
    "Agrégation des flux publics et privés d'investissement climatique rapportés au PIB continental — source UNECA/CPI 2026.",
};

const CATEGORIES = [
  { key: "all", label: "Tous", icon: Globe },
  { key: "E", label: "Environnement", icon: Leaf },
  { key: "S", label: "Social", icon: Users },
  { key: "G", label: "Gouvernance", icon: ShieldCheck },
] as const;

/* ─── Components ───────────────────────────────────────────── */

function Sparkline({ points, color }: { points: number[]; color: Indicator["color"] }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const step = w / (points.length - 1);

  const coords = points.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const fill = color === "emerald" ? "#10b981" : color === "sky" ? "#0ea5e9" : "#8b5cf6";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle
        cx={coords[coords.length - 1].split(",")[0]}
        cy={coords[coords.length - 1].split(",")[1]}
        r="3"
        fill={fill}
      />
    </svg>
  );
}

function TrendBadge({ trend, change }: { trend: Trend; change: string }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="h-3 w-3" /> {change}
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-black text-red-500">
        <TrendingDown className="h-3 w-3" /> {change}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-black text-muted-foreground">
      <Minus className="h-3 w-3" /> Stable
    </span>
  );
}

function colorRing(color: Indicator["color"]) {
  return color === "emerald"
    ? "ring-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : color === "sky"
    ? "ring-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
    : "ring-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400";
}

function FeaturedCard({ item }: { item: Indicator }) {
  const Icon = item.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="golden-glow relative mb-10 overflow-hidden rounded-3xl border-border/90 bg-card shadow-[0_40px_90px_-30px_rgba(13,77,51,0.6)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--brand-emerald)/0.12),transparent_55%)]" />

      <div className="relative grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8 lg:p-10">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">
            <Icon className="h-3.5 w-3.5" />
            Indicateur phare 2026
          </span>
          <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
            {item.label}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <TrendBadge trend={item.trend} change={item.change} />
            <span className="text-xs font-bold text-muted-foreground">{item.scope}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="text-6xl font-black tabular-nums leading-none text-primary md:text-7xl">
              {item.value}
              <span className="text-3xl text-primary/60">{item.unit}</span>
            </p>
          </div>
          <Sparkline points={item.sparkline} color={item.color} />
        </div>
      </div>
    </motion.div>
  );
}

function IndicatorCard({ item, idx }: { item: Indicator; idx: number }) {
  const Icon = item.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_16px_48px_-20px_rgba(13,77,51,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_-20px_rgba(13,77,51,0.55)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.07),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", colorRing(item.color))}>
            <Icon className="h-5 w-5" />
          </div>
          <TrendBadge trend={item.trend} change={item.change} />
        </div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {item.scope}
        </p>
        <h3 className="text-sm font-extrabold leading-snug tracking-tight text-foreground">
          {item.label}
        </h3>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-3xl font-black tabular-nums leading-none text-foreground">
            {item.value}
            <span className="text-lg font-bold text-muted-foreground">{item.unit}</span>
          </p>
          <Sparkline points={item.sparkline} color={item.color} />
        </div>
      </div>
      <div
        className={cn(
          "h-0.5 w-full transition-all duration-300",
          item.color === "emerald"
            ? "bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-0 group-hover:opacity-100"
            : item.color === "sky"
            ? "bg-gradient-to-r from-sky-500/0 via-sky-500/60 to-sky-500/0 opacity-0 group-hover:opacity-100"
            : "bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0 opacity-0 group-hover:opacity-100"
        )}
      />
    </motion.article>
  );
}

function SectionHeader({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  color: "emerald" | "sky" | "violet";
}) {
  const cls =
    color === "emerald"
      ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/8"
      : color === "sky"
      ? "text-sky-600 dark:text-sky-400 border-sky-500/30 bg-sky-500/8"
      : "text-violet-600 dark:text-violet-400 border-violet-500/30 bg-violet-500/8";

  return (
    <div className="mb-5 flex items-center gap-3">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border", cls)}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-base font-black tracking-tight text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{count} indicateurs</p>
      </div>
      <div className="ml-auto h-px flex-1 bg-border/50" />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function DataIndicatorsPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<"all" | "E" | "S" | "G">("all");

  const filtered =
    activeCategory === "all" ? INDICATORS : INDICATORS.filter((i) => i.category === activeCategory);

  const byCategory = {
    E: filtered.filter((i) => i.category === "E"),
    S: filtered.filter((i) => i.category === "S"),
    G: filtered.filter((i) => i.category === "G"),
  };

  return (
    <HubSubpageShell
      badgeIcon={LineChart}
      badgeLabel={t("pages.data.blocks.indicators_title")}
      titleLead={t("pages.data.indicators.hero_title_lead")}
      titleBrand={t("pages.data.indicators.hero_title_brand")}
      subtitle={t("pages.data.indicators.subtitle")}
      heroFooter={
        <div className="flex flex-wrap gap-2">
          {[
            { label: "12 indicateurs", sub: "actifs 2026" },
            { label: "55 pays", sub: "couverts" },
            { label: "Mise à jour", sub: "trimestrielle" },
          ].map((chip) => (
            <div
              key={chip.label}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm"
            >
              <span className="text-base font-black text-brand-gold">{chip.label}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">
                {chip.sub}
              </span>
            </div>
          ))}
        </div>
      }
    >
      {/* Featured indicator */}
      <FeaturedCard item={FEATURED} />

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as typeof activeCategory)}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200",
              activeCategory === key
                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Grouped sections */}
      <div className="space-y-10">
        {(activeCategory === "all" || activeCategory === "E") && byCategory.E.length > 0 && (
          <section>
            <SectionHeader icon={Leaf} label="Environnement" count={byCategory.E.length} color="emerald" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {byCategory.E.map((item, i) => (
                <IndicatorCard key={item.id} item={item} idx={i} />
              ))}
            </div>
          </section>
        )}

        {(activeCategory === "all" || activeCategory === "S") && byCategory.S.length > 0 && (
          <section>
            <SectionHeader icon={Users} label="Social" count={byCategory.S.length} color="sky" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {byCategory.S.map((item, i) => (
                <IndicatorCard key={item.id} item={item} idx={i} />
              ))}
            </div>
          </section>
        )}

        {(activeCategory === "all" || activeCategory === "G") && byCategory.G.length > 0 && (
          <section>
            <SectionHeader icon={ShieldCheck} label="Gouvernance" count={byCategory.G.length} color="violet" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {byCategory.G.map((item, i) => (
                <IndicatorCard key={item.id} item={item} idx={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Source footer */}
      <p className="mt-12 text-center text-[11px] text-muted-foreground/60">
        Sources : UNECA · Banque mondiale · Transparency International · WJP · CPI · Réseau ESG Africa — Données 2025-2026
      </p>
    </HubSubpageShell>
  );
}
