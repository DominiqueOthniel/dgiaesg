import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import {
  SlidersHorizontal,
  Lock,
  ArrowRight,
  Leaf,
  Users,
  ShieldCheck,
  ChevronDown,
  BarChart3,
  RefreshCw,
  Info,
} from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────── */

interface Entity {
  id: string;
  name: string;
  region: string;
  scores: { E: number; S: number; G: number };
  color: string;
}

const ENTITIES: Entity[] = [
  {
    id: "maroc",
    name: "Maroc",
    region: "Afrique du Nord",
    scores: { E: 68, S: 72, G: 76 },
    color: "#10b981",
  },
  {
    id: "kenya",
    name: "Kenya",
    region: "Afrique de l'Est",
    scores: { E: 71, S: 65, G: 62 },
    color: "#0ea5e9",
  },
  {
    id: "ghana",
    name: "Ghana",
    region: "Afrique de l'Ouest",
    scores: { E: 60, S: 63, G: 64 },
    color: "#8b5cf6",
  },
  {
    id: "senegal",
    name: "Sénégal",
    region: "Afrique de l'Ouest",
    scores: { E: 57, S: 60, G: 58 },
    color: "#f59e0b",
  },
  {
    id: "afrique-du-sud",
    name: "Afrique du Sud",
    region: "Afrique australe",
    scores: { E: 55, S: 67, G: 71 },
    color: "#ef4444",
  },
  {
    id: "ethiopie",
    name: "Éthiopie",
    region: "Afrique de l'Est",
    scores: { E: 52, S: 54, G: 48 },
    color: "#ec4899",
  },
];

const DIMENSIONS = [
  {
    key: "E" as const,
    label: "Environnement",
    icon: Leaf,
    color: "emerald",
    description: "Énergie, eau, biodiversité, obligations vertes",
  },
  {
    key: "S" as const,
    label: "Social",
    icon: Users,
    color: "sky",
    description: "Inclusion, emploi, santé, éducation",
  },
  {
    key: "G" as const,
    label: "Gouvernance",
    icon: ShieldCheck,
    color: "violet",
    description: "Transparence, état de droit, diversité CA",
  },
];

/* ─── Components ───────────────────────────────────────────── */

function EntitySelect({
  value,
  onChange,
  exclude,
  label,
}: {
  value: string;
  onChange: (id: string) => void;
  exclude: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const current = ENTITIES.find((e) => e.id === value)!;

  return (
    <div className="relative">
      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl border border-border/80 bg-card px-4 py-3 text-sm font-bold text-foreground shadow-sm transition-all hover:border-primary/40"
      >
        <span className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: current.color }}
          />
          <span>
            {current.name}
            <span className="ml-2 text-[10px] font-bold text-muted-foreground">{current.region}</span>
          </span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
          {ENTITIES.filter((e) => e.id !== exclude).map((entity) => (
            <button
              key={entity.id}
              onClick={() => { onChange(entity.id); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold transition-colors hover:bg-muted/50",
                entity.id === value && "bg-primary/5 text-primary"
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entity.color }} />
              <span>
                {entity.name}
                <span className="ml-2 text-[10px] font-normal text-muted-foreground">{entity.region}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CompareBar({
  dimension,
  entityA,
  entityB,
  inView,
}: {
  dimension: { key: "E" | "S" | "G"; label: string; icon: React.ElementType; color: string; description: string };
  entityA: Entity;
  entityB: Entity;
  inView: boolean;
}) {
  const Icon = dimension.icon;
  const scoreA = entityA.scores[dimension.key];
  const scoreB = entityB.scores[dimension.key];
  const maxScore = 100;

  const colorClass =
    dimension.color === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : dimension.color === "sky"
      ? "text-sky-600 dark:text-sky-400"
      : "text-violet-600 dark:text-violet-400";

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Icon className={cn("h-4 w-4", colorClass)} />
        <span className="text-sm font-extrabold text-foreground">{dimension.label}</span>
        <span className="ml-1 text-[11px] text-muted-foreground">{dimension.description}</span>
      </div>

      {/* Entity A bar */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-bold text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entityA.color }} />
            {entityA.name}
          </span>
          <span className="text-sm font-black tabular-nums text-foreground">{scoreA}</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-border/50">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${(scoreA / maxScore) * 100}%` } : { width: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundColor: entityA.color }}
          />
        </div>
      </div>

      {/* Entity B bar */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-bold text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entityB.color }} />
            {entityB.name}
          </span>
          <span className="text-sm font-black tabular-nums text-foreground">{scoreB}</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-border/50">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${(scoreB / maxScore) * 100}%` } : { width: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ backgroundColor: entityB.color }}
          />
        </div>
      </div>

      {/* Delta */}
      <div className="mt-3 flex items-center justify-end gap-1.5">
        <Info className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">
          Écart :{" "}
          <span className={cn("font-black", Math.abs(scoreA - scoreB) > 10 ? "text-amber-500" : "text-foreground")}>
            {scoreA > scoreB ? "+" : ""}{scoreA - scoreB} pts
          </span>
        </span>
      </div>
    </div>
  );
}

function RadarChart({ entityA, entityB }: { entityA: Entity; entityB: Entity }) {
  const cx = 120;
  const cy = 120;
  const r = 90;
  const keys = ["E", "S", "G"] as const;

  function toPoint(score: number, idx: number) {
    const angle = (idx * 2 * Math.PI) / 3 - Math.PI / 2;
    const pct = score / 100;
    return {
      x: cx + r * pct * Math.cos(angle),
      y: cy + r * pct * Math.sin(angle),
    };
  }

  function gridPoints(pct: number) {
    return keys
      .map((_, i) => {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        return `${cx + r * pct * Math.cos(angle)},${cy + r * pct * Math.sin(angle)}`;
      })
      .join(" ");
  }

  const polygonA = keys.map((k, i) => toPoint(entityA.scores[k], i));
  const polygonB = keys.map((k, i) => toPoint(entityB.scores[k], i));

  const labels = [
    { label: "Environnement", ...toPoint(100, 0), offset: { x: 0, y: -12 } },
    { label: "Social", ...toPoint(100, 1), offset: { x: 12, y: 8 } },
    { label: "Gouvernance", ...toPoint(100, 2), offset: { x: -70, y: 8 } },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-[0_24px_58px_-24px_rgba(13,77,51,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.07),transparent_55%)]" />
      <p className="mb-4 text-sm font-extrabold tracking-tight text-foreground">Vue radar E/S/G</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 240 240" className="h-48 w-48">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <polygon
              key={pct}
              points={gridPoints(pct)}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          {/* Axes */}
          {keys.map((_, i) => {
            const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + r * Math.cos(angle)}
                y2={cy + r * Math.sin(angle)}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}

          {/* Entity B polygon */}
          <polygon
            points={polygonB.map((p) => `${p.x},${p.y}`).join(" ")}
            fill={entityB.color}
            fillOpacity="0.15"
            stroke={entityB.color}
            strokeWidth="2"
            strokeOpacity="0.7"
          />
          {/* Entity A polygon */}
          <polygon
            points={polygonA.map((p) => `${p.x},${p.y}`).join(" ")}
            fill={entityA.color}
            fillOpacity="0.2"
            stroke={entityA.color}
            strokeWidth="2"
            strokeOpacity="0.85"
          />

          {/* Labels */}
          {labels.map(({ label, x, y, offset }) => (
            <text
              key={label}
              x={x + offset.x}
              y={y + offset.y}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="hsl(var(--muted-foreground))"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex justify-center gap-5">
        {[entityA, entityB].map((e) => (
          <span key={e.id} className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: e.color }} />
            {e.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScoreSummary({ entityA, entityB }: { entityA: Entity; entityB: Entity }) {
  const avgA = Math.round((entityA.scores.E + entityA.scores.S + entityA.scores.G) / 3);
  const avgB = Math.round((entityB.scores.E + entityB.scores.S + entityB.scores.G) / 3);

  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { entity: entityA, avg: avgA },
        { entity: entityB, avg: avgB },
      ].map(({ entity, avg }) => (
        <div
          key={entity.id}
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-center"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(ellipse at top, ${entity.color}, transparent 70%)`,
            }}
          />
          <span
            className="mb-1 block h-3 w-3 rounded-full mx-auto"
            style={{ backgroundColor: entity.color }}
          />
          <p className="text-xs font-bold text-muted-foreground">{entity.name}</p>
          <p className="text-4xl font-black tabular-nums text-foreground mt-1">{avg}</p>
          <p className="text-[10px] text-muted-foreground">Score ESG global /100</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function DataComparatorPage() {
  const { t } = useTranslation();
  const [entityAId, setEntityAId] = useState("maroc");
  const [entityBId, setEntityBId] = useState("kenya");

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const entityA = ENTITIES.find((e) => e.id === entityAId)!;
  const entityB = ENTITIES.find((e) => e.id === entityBId)!;

  function swap() {
    setEntityAId(entityBId);
    setEntityBId(entityAId);
  }

  return (
    <HubSubpageShell
      badgeIcon={SlidersHorizontal}
      badgeLabel={t("pages.data.blocks.comparator_title")}
      titleLead={t("pages.data.comparator.hero_title_lead")}
      titleBrand={t("pages.data.comparator.hero_title_brand")}
      subtitle={t("pages.data.comparator.subtitle")}
      contentMaxWidthClass="max-w-5xl"
      heroFooter={
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <BarChart3 className="h-4 w-4 text-brand-gold" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
            Aperçu gratuit — données 2026
          </span>
        </div>
      }
    >
      {/* Selectors */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <EntitySelect
          value={entityAId}
          onChange={setEntityAId}
          exclude={entityBId}
          label="Entité A"
        />
        <div className="flex items-end justify-center pb-1">
          <button
            onClick={swap}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary"
            title="Inverser"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <EntitySelect
          value={entityBId}
          onChange={setEntityBId}
          exclude={entityAId}
          label="Entité B"
        />
      </div>

      {/* Main comparison */}
      <div ref={ref} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        {/* Bars */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Scores par dimension /100
          </p>
          {DIMENSIONS.map((dim) => (
            <CompareBar
              key={dim.key}
              dimension={dim}
              entityA={entityA}
              entityB={entityB}
              inView={inView}
            />
          ))}
        </div>

        {/* Radar + summary */}
        <div className="space-y-4">
          <RadarChart entityA={entityA} entityB={entityB} />
          <ScoreSummary entityA={entityA} entityB={entityB} />
        </div>
      </div>

      {/* Premium CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 overflow-hidden rounded-3xl border border-brand-gold/25 bg-gradient-to-br from-brand-gold/8 via-brand-gold/5 to-transparent p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/30 bg-brand-gold/10">
              <Lock className="h-5 w-5 text-brand-gold-dark" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-foreground">
                {t("pages.data.comparator.premium_title")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("pages.data.comparator.premium_desc")}
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {["Tous les pays africains", "Comparaisons sectorielles", "Export CSV & PDF", "Historique 5 ans"].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-brand-gold/60" />
                      {f}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <Link
            to="/abonnement"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            {t("pages.data.comparator.premium_cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </HubSubpageShell>
  );
}
