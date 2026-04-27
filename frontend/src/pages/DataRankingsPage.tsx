import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  MapPin,
  Factory,
  Medal,
  Star,
} from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────── */

interface RankEntry {
  rank: number;
  name: string;
  score: number;
  maxScore: number;
  change: number; // positions gained/lost
  region: string;
  badge?: string;
}

const COMPANIES: RankEntry[] = [
  { rank: 1, name: "OCP Group", score: 84, maxScore: 100, change: 0, region: "Maroc", badge: "Leader Environnement" },
  { rank: 2, name: "Safaricom", score: 81, maxScore: 100, change: 1, region: "Kenya", badge: "Leader Social" },
  { rank: 3, name: "Attijariwafa Bank", score: 78, maxScore: 100, change: -1, region: "Maroc" },
  { rank: 4, name: "Nedbank", score: 75, maxScore: 100, change: 2, region: "Afrique du Sud" },
  { rank: 5, name: "Sonatel", score: 72, maxScore: 100, change: 0, region: "Sénégal" },
  { rank: 6, name: "ECOBANK", score: 70, maxScore: 100, change: 3, region: "Togo" },
  { rank: 7, name: "Dangote Group", score: 68, maxScore: 100, change: -2, region: "Nigeria" },
  { rank: 8, name: "Equity Bank", score: 65, maxScore: 100, change: 1, region: "Kenya" },
];

const COUNTRIES: RankEntry[] = [
  { rank: 1, name: "Maroc", score: 72, maxScore: 100, change: 0, region: "Afrique du Nord", badge: "Meilleure progression" },
  { rank: 2, name: "Rwanda", score: 70, maxScore: 100, change: 2, region: "Afrique de l'Est" },
  { rank: 3, name: "Kenya", score: 67, maxScore: 100, change: 0, region: "Afrique de l'Est" },
  { rank: 4, name: "Ghana", score: 64, maxScore: 100, change: 1, region: "Afrique de l'Ouest" },
  { rank: 5, name: "Afrique du Sud", score: 62, maxScore: 100, change: -2, region: "Afrique australe" },
  { rank: 6, name: "Sénégal", score: 60, maxScore: 100, change: 3, region: "Afrique de l'Ouest" },
  { rank: 7, name: "Côte d'Ivoire", score: 57, maxScore: 100, change: 0, region: "Afrique de l'Ouest" },
  { rank: 8, name: "Éthiopie", score: 54, maxScore: 100, change: 4, region: "Afrique de l'Est" },
];

const SECTORS: RankEntry[] = [
  { rank: 1, name: "Banques & Finance", score: 76, maxScore: 100, change: 0, region: "Notation moyenne", badge: "Meilleure gouvernance" },
  { rank: 2, name: "Télécommunications", score: 73, maxScore: 100, change: 1, region: "Notation moyenne" },
  { rank: 3, name: "Agro-industrie", score: 69, maxScore: 100, change: 2, region: "Notation moyenne" },
  { rank: 4, name: "Énergie renouvelable", score: 66, maxScore: 100, change: -1, region: "Notation moyenne" },
  { rank: 5, name: "Mines & Ressources", score: 61, maxScore: 100, change: -1, region: "Notation moyenne" },
  { rank: 6, name: "Commerce de détail", score: 58, maxScore: 100, change: 0, region: "Notation moyenne" },
];

/* ─── Components ───────────────────────────────────────────── */

const MEDAL_STYLES: Record<number, { bg: string; text: string; border: string; shadow: string }> = {
  1: {
    bg: "bg-gradient-to-br from-brand-gold/20 via-amber-400/10 to-transparent",
    text: "text-brand-gold-dark",
    border: "border-brand-gold/40",
    shadow: "shadow-[0_0_32px_-8px_rgba(234,179,8,0.4)]",
  },
  2: {
    bg: "bg-gradient-to-br from-slate-400/15 via-slate-300/10 to-transparent",
    text: "text-slate-500 dark:text-slate-300",
    border: "border-slate-400/30",
    shadow: "shadow-[0_0_20px_-8px_rgba(148,163,184,0.3)]",
  },
  3: {
    bg: "bg-gradient-to-br from-amber-700/15 via-amber-600/10 to-transparent",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-700/30",
    shadow: "shadow-[0_0_20px_-8px_rgba(180,83,9,0.3)]",
  },
};

function ScoreBar({ score, maxScore, rank, inView }: { score: number; maxScore: number; rank: number; inView: boolean }) {
  const pct = (score / maxScore) * 100;
  const barColor =
    rank === 1
      ? "from-brand-gold to-amber-400"
      : rank === 2
      ? "from-slate-400 to-slate-300"
      : rank === 3
      ? "from-amber-700 to-amber-500"
      : "from-primary to-emerald-400";

  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border/50">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.8, delay: 0.1 + rank * 0.06, ease: [0.22, 1, 0.36, 1] }}
        className={cn("absolute left-0 top-0 h-full rounded-full bg-gradient-to-r", barColor)}
      />
    </div>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-500">
        <TrendingUp className="h-3 w-3" />+{change}
      </span>
    );
  if (change < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-red-500">
        <TrendingDown className="h-3 w-3" />{change}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-muted-foreground">
      <Minus className="h-3 w-3" />
    </span>
  );
}

function PodiumCard({ entry }: { entry: RankEntry }) {
  const m = MEDAL_STYLES[entry.rank];
  const height = entry.rank === 1 ? "h-24" : entry.rank === 2 ? "h-16" : "h-10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (3 - entry.rank) * 0.1 + 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center",
        m.bg,
        m.border,
        m.shadow
      )}
    >
      <div className={cn("w-2 rounded-full bg-current opacity-40", height, m.text)} />
      <Medal className={cn("h-6 w-6", m.text)} />
      <p className="text-xs font-black text-foreground">{entry.name}</p>
      <p className="text-[10px] text-muted-foreground">{entry.region}</p>
      <p className={cn("text-xl font-black tabular-nums", m.text)}>{entry.score}</p>
    </motion.div>
  );
}

function RankingTable({ entries }: { entries: RankEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_28px_66px_-28px_rgba(13,77,51,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.07),transparent_55%)]" />

      {/* Podium top 3 */}
      <div className="relative border-b border-border/60 p-5">
        <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Podium</p>
        <div className="grid grid-cols-3 gap-3">
          {entries.slice(0, 3).map((e) => (
            <PodiumCard key={e.rank} entry={e} />
          ))}
        </div>
      </div>

      {/* Rows 4+ */}
      <div className="divide-y divide-border/50">
        {entries.slice(3).map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
            className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/30"
          >
            <span className="w-6 shrink-0 text-right text-sm font-black tabular-nums text-muted-foreground">
              {entry.rank}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold text-foreground">{entry.name}</p>
                {entry.badge && (
                  <span className="rounded-full bg-brand-gold/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand-gold-dark">
                    {entry.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">{entry.region}</p>
              <ScoreBar score={entry.score} maxScore={entry.maxScore} rank={entry.rank} inView={inView} />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-base font-black tabular-nums text-foreground">{entry.score}</span>
              <ChangeIndicator change={entry.change} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

const TABS = [
  { key: "companies", label: "Entreprises", icon: Building2, data: COMPANIES },
  { key: "countries", label: "Pays", icon: MapPin, data: COUNTRIES },
  { key: "sectors", label: "Secteurs", icon: Factory, data: SECTORS },
] as const;

export default function DataRankingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"companies" | "countries" | "sectors">("companies");

  const current = TABS.find((tab) => tab.key === activeTab)!;

  return (
    <HubSubpageShell
      badgeIcon={Trophy}
      badgeLabel={t("pages.data.blocks.rankings_title")}
      titleLead={t("pages.data.rankings.hero_title_lead")}
      titleBrand={t("pages.data.rankings.hero_title_brand")}
      subtitle={t("pages.data.rankings.subtitle")}
      heroFooter={
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <Star className="h-4 w-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              Score ESG Africa / 100
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="text-base font-black text-brand-gold">T1 2026</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">Mise à jour</span>
          </div>
        </div>
      }
    >
      {/* Tabs */}
      <div className="mb-7 flex gap-2 flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200",
              activeTab === key
                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Ranking table */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <RankingTable entries={current.data} />
      </motion.div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground">
          {[
            { color: "bg-brand-gold", label: "1er rang" },
            { color: "bg-slate-400", label: "2e rang" },
            { color: "bg-amber-700", label: "3e rang" },
            { color: "bg-primary", label: "Autres" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", color)} />
              {label}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground/60">
          Score composite E/S/G — Méthodologie ESG Africa 2026
        </p>
      </div>
    </HubSubpageShell>
  );
}
