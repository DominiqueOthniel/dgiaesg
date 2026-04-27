import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  Leaf,
  Users,
  ShieldCheck,
  Globe,
  Clock,
  Calendar,
  Star,
  ChevronRight,
  Building,
} from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────── */

type ReportCategory = "all" | "E" | "S" | "G" | "multi";

interface Report {
  id: string;
  title: string;
  excerpt: string;
  category: ReportCategory;
  tags: string[];
  type: "PDF" | "Interactive" | "Synthèse";
  year: string;
  month: string;
  pages: number;
  readTime: string;
  institution: string;
  institutionLogo?: string;
  featured?: boolean;
  locked?: boolean;
}

const REPORTS: Report[] = [
  {
    id: "transition-energie",
    title: "Rapport Transition Énergétique Afrique 2026",
    excerpt:
      "Analyse complète des trajectoires de décarbonation dans 34 pays africains. Ce rapport examine l'accélération des EnR, les barrières à l'investissement climatique et les politiques nationales comparées.",
    category: "E",
    tags: ["Énergie", "Climat", "Politique publique"],
    type: "PDF",
    year: "2026",
    month: "Mars",
    pages: 148,
    readTime: "45 min",
    institution: "UNECA",
    featured: true,
  },
  {
    id: "benchmark-gouv",
    title: "Benchmark Gouvernance ESG — Institutions Financières",
    excerpt:
      "Évaluation comparative de 120 banques et compagnies d'assurance africaines selon 38 critères de gouvernance durable. Incluant analyse des politiques de rémunération et diversité des conseils.",
    category: "G",
    tags: ["Banques", "Gouvernance", "Diversité"],
    type: "PDF",
    year: "2026",
    month: "Janvier",
    pages: 92,
    readTime: "30 min",
    institution: "ESG Africa",
    featured: true,
  },
  {
    id: "biodiversite",
    title: "Biodiversité & Agro-industrie : état des lieux continental",
    excerpt:
      "Premier inventaire consolidé de l'impact biodiversité du secteur agro-industriel africain. Couvre 18 filières et 28 pays, avec recommandations TNFD adaptées au contexte continental.",
    category: "E",
    tags: ["Biodiversité", "Agriculture", "TNFD"],
    type: "PDF",
    year: "2025",
    month: "Novembre",
    pages: 114,
    readTime: "38 min",
    institution: "IUCN Africa",
  },
  {
    id: "rse-telecom",
    title: "Cadre RSE des grandes télécoms africaines",
    excerpt:
      "Cartographie des engagements RSE de 24 opérateurs télécoms africains majeurs. Focus sur l'inclusion numérique, la gestion des DEEE et les reportings de scope 2 et 3.",
    category: "S",
    tags: ["Télécoms", "RSE", "Inclusion numérique"],
    type: "Synthèse",
    year: "2025",
    month: "Octobre",
    pages: 56,
    readTime: "18 min",
    institution: "GSMA Africa",
  },
  {
    id: "obligations-vertes",
    title: "Marché des obligations vertes africaines 2025",
    excerpt:
      "Panorama complet du marché obligataire durable africain : encours, émetteurs, structures, certification et performance comparée aux marchés émergents.",
    category: "multi",
    tags: ["Finance durable", "Obligations", "Marchés"],
    type: "Interactive",
    year: "2025",
    month: "Septembre",
    pages: 78,
    readTime: "25 min",
    institution: "Climate Bonds Initiative",
    locked: true,
  },
  {
    id: "reporting-social",
    title: "Reporting social des entreprises africaines cotées",
    excerpt:
      "Analyse longitudinale 2020-2025 des pratiques de reporting social dans 6 bourses africaines. Mesure de la convergence vers les standards GRI et SASB.",
    category: "S",
    tags: ["Reporting", "GRI", "SASB"],
    type: "PDF",
    year: "2025",
    month: "Juillet",
    pages: 88,
    readTime: "28 min",
    institution: "African Securities Exchanges Association",
    locked: true,
  },
];

const CATEGORIES = [
  { key: "all", label: "Tous", icon: Globe },
  { key: "E", label: "Environnement", icon: Leaf },
  { key: "S", label: "Social", icon: Users },
  { key: "G", label: "Gouvernance", icon: ShieldCheck },
  { key: "multi", label: "Transversal", icon: BookOpen },
] as const;

const CATEGORY_META: Record<
  ReportCategory,
  { color: string; bg: string; border: string }
> = {
  all: { color: "text-foreground", bg: "bg-muted", border: "border-border" },
  E: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  S: { color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/25" },
  G: { color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/25" },
  multi: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25" },
};

/* ─── Components ───────────────────────────────────────────── */

function CategoryChip({ category }: { category: ReportCategory }) {
  if (category === "all") return null;
  const m = CATEGORY_META[category];
  const labels: Record<ReportCategory, string> = {
    all: "",
    E: "Environnement",
    S: "Social",
    G: "Gouvernance",
    multi: "Transversal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest",
        m.color,
        m.bg,
        m.border
      )}
    >
      {labels[category]}
    </span>
  );
}

function FeaturedReport({ report, idx }: { report: Report; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const m = CATEGORY_META[report.category];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="golden-glow group relative overflow-hidden rounded-3xl border-border/90 bg-card shadow-[0_36px_80px_-28px_rgba(13,77,51,0.55)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--brand-gold)/0.12),transparent_55%)]" />

      <div className="relative grid grid-cols-1 gap-0 md:grid-cols-[auto_1fr]">
        {/* Color sidebar */}
        <div
          className={cn(
            "hidden w-2 rounded-l-3xl md:block",
            report.category === "E"
              ? "bg-gradient-to-b from-emerald-500 to-emerald-700"
              : report.category === "G"
              ? "bg-gradient-to-b from-violet-500 to-violet-700"
              : "bg-gradient-to-b from-sky-500 to-sky-700"
          )}
        />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">
                <Star className="h-3 w-3" /> Rapport vedette
              </span>
              <CategoryChip category={report.category} />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {report.month} {report.year}
            </div>
          </div>

          <h2 className="mb-3 text-xl font-black tracking-tight text-foreground md:text-2xl">
            {report.title}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{report.excerpt}</p>

          {/* Tags */}
          <div className="mb-5 flex flex-wrap gap-2">
            {report.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-border/70 bg-muted/50 px-2.5 py-1 text-[11px] font-bold text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta + CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" />
                {report.institution}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                {report.pages} pages
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {report.readTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {report.locked ? (
                <span className="inline-flex items-center gap-2 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-brand-gold-dark">
                  Premium
                </span>
              ) : (
                <>
                  <button className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-primary transition-all hover:bg-primary/15">
                    <Download className="h-4 w-4" /> Télécharger
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
                    <ExternalLink className="h-4 w-4" /> Lire
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ReportCard({ report, idx }: { report: Report; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_16px_48px_-20px_rgba(13,77,51,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_28px_64px_-20px_rgba(13,77,51,0.5)]"
    >
      {/* Top accent */}
      <div
        className={cn(
          "h-1 w-full",
          report.category === "E"
            ? "bg-gradient-to-r from-emerald-500/60 via-emerald-400 to-emerald-500/60"
            : report.category === "S"
            ? "bg-gradient-to-r from-sky-500/60 via-sky-400 to-sky-500/60"
            : report.category === "G"
            ? "bg-gradient-to-r from-violet-500/60 via-violet-400 to-violet-500/60"
            : "bg-gradient-to-r from-amber-500/60 via-amber-400 to-amber-500/60"
        )}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Meta header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryChip category={report.category} />
            {report.locked && (
              <span className="rounded-full bg-brand-gold/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand-gold-dark">
                Premium
              </span>
            )}
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {report.month} {report.year}
          </span>
        </div>

        <h3 className="mb-2 text-sm font-extrabold leading-snug tracking-tight text-foreground">
          {report.title}
        </h3>
        <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
          {report.excerpt}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {report.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-bold text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>{report.institution}</span>
            <span>{report.pages}p</span>
            <span>{report.readTime}</span>
          </div>
          {report.locked ? (
            <ChevronRight className="h-4 w-4 text-brand-gold-dark opacity-60" />
          ) : (
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-primary transition-all hover:bg-primary/15">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function DataReportsPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ReportCategory>("all");

  const filtered =
    activeCategory === "all"
      ? REPORTS
      : REPORTS.filter((r) => r.category === activeCategory);

  const featured = filtered.filter((r) => r.featured);
  const rest = filtered.filter((r) => !r.featured);

  return (
    <HubSubpageShell
      badgeIcon={FileText}
      badgeLabel={t("pages.data.blocks.reports_title")}
      titleLead={t("pages.data.reports.hero_title_lead")}
      titleBrand={t("pages.data.reports.hero_title_brand")}
      subtitle={t("pages.data.reports.subtitle")}
      heroFooter={
        <div className="flex flex-wrap gap-2">
          {[
            { value: "6", label: "rapports disponibles" },
            { value: "2025-2026", label: "millésimes" },
            { value: "PDF / Interactif", label: "formats" },
          ].map((c) => (
            <div
              key={c.label}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm"
            >
              <span className="text-base font-black text-brand-gold">{c.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      }
    >
      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as ReportCategory)}
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

      {/* Featured reports */}
      {featured.length > 0 && (
        <div className="mb-8 space-y-5">
          {featured.map((report, i) => (
            <FeaturedReport key={report.id} report={report} idx={i} />
          ))}
        </div>
      )}

      {/* Grid of remaining reports */}
      {rest.length > 0 && (
        <>
          {featured.length > 0 && (
            <div className="mb-5 flex items-center gap-3">
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                Autres publications
              </p>
              <div className="h-px flex-1 bg-border/50" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((report, i) => (
              <ReportCard key={report.id} report={report} idx={i} />
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border/60 text-muted-foreground">
          <p className="text-sm font-bold">Aucun rapport dans cette catégorie</p>
        </div>
      )}

      <p className="mt-10 text-center text-[11px] text-muted-foreground/60">
        Tous les rapports sont produits par des institutions indépendantes partenaires d'ESG Africa — 2025-2026
      </p>
    </HubSubpageShell>
  );
}
