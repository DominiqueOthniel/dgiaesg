import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal, ArrowRight, Tag, Calendar } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { ControlsBar } from "@/components/ui/ControlsBar";
import { cn, getLocalized } from "@/lib/utils";
import { useNews } from "@/hooks/useNews";
import type { INews } from "@/types";

type SortKey = "recent" | "readingTime";

function uniq<T>(xs: T[]) {
  return Array.from(new Set(xs));
}

function sectorOf(n: INews): string {
  return n.sector || "—";
}

function readingMinutes(n: INews): number {
  const m = parseInt(String(n.readingTime || "5").replace(/\D/g, ""), 10);
  return Number.isFinite(m) ? m : 5;
}

function ContributionCard({ item, idx, lang }: { item: INews; idx: number; lang: string }) {
  const published = item.publishedAt || item.createdAt;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: idx * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/contributions/${item.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-brand-gold/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {item.premium ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">
              <Tag className="h-3 w-3" /> À la une
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-foreground/80">
            Article
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[10px] font-bold tracking-wider text-foreground/70">
            <Calendar className="h-3 w-3" />
            {published
              ? new Date(published).toLocaleDateString(lang, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>

        <h3 className="text-base font-extrabold leading-snug tracking-tight text-foreground group-hover:text-primary line-clamp-2">
          {getLocalized(item.title, lang)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/75 line-clamp-3">
          {getLocalized(item.excerpt, lang)}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{item.author}</p>
            <p className="text-xs text-foreground/70 truncate">{sectorOf(item)}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-foreground/70">
            {readingMinutes(item)} min{" "}
            <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ContributionsPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const { data: newsPage, isLoading } = useNews({ limit: 80, published: true });
  const articles = newsPage?.data ?? [];

  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recent");

  const sectors = useMemo(
    () => ["all" as const, ...uniq(articles.map((a) => sectorOf(a)).filter((s) => s !== "—"))],
    [articles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = articles.filter((c) => {
      const matchesQ =
        !q ||
        getLocalized(c.title, lang).toLowerCase().includes(q) ||
        getLocalized(c.excerpt, lang).toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q);

      const matchesSector = sector === "all" || sectorOf(c) === sector;
      const matchesFeatured = !featuredOnly || Boolean(c.premium);

      return matchesQ && matchesSector && matchesFeatured;
    });

    const sorted = [...base].sort((a, b) => {
      if (sort === "readingTime") return readingMinutes(a) - readingMinutes(b);
      const da = new Date(a.publishedAt || a.createdAt).getTime();
      const db = new Date(b.publishedAt || b.createdAt).getTime();
      return db - da;
    });

    return sorted.sort((a, b) => Number(Boolean(b.premium)) - Number(Boolean(a.premium)));
  }, [articles, featuredOnly, lang, query, sector, sort]);

  const clear = () => {
    setQuery("");
    setSector("all");
    setFeaturedOnly(false);
    setSort("recent");
  };

  const hasActiveFilters = Boolean(query) || sector !== "all" || featuredOnly || sort !== "recent";

  const sectorCount = uniq(articles.map((a) => sectorOf(a)).filter((s) => s !== "—")).length;

  return (
    <HubSubpageShell
      badgeIcon={SlidersHorizontal}
      badgeLabel={t("pages.contributions.badge")}
      sectionsKicker={t("pages.contributions.sections_kicker")}
      titleLead={t("pages.contributions.hero_title_lead")}
      titleBrand={t("pages.contributions.hero_title_brand")}
      subtitle={t("pages.contributions.hero_subtitle")}
      heroFooter={
        <div className="flex flex-wrap gap-2">
          {[
            { value: String(articles.length), label: t("pages.contributions.stats_total") },
            {
              value: String(Math.max(sectorCount, 1)),
              label: t("pages.contributions.stats_categories"),
            },
            { value: "—", label: t("pages.contributions.stats_review") },
          ].map((c) => (
            <div
              key={c.label}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm"
            >
              <span className="text-base font-black text-brand-gold tabular-nums">{c.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      }
      contentMaxWidthClass="max-w-7xl"
    >
      <div className="mx-auto max-w-6xl">
        <ControlsBar
          hideHairline
          className="!border-border/60"
          footer={
            <>
              <div className="flex min-w-0 items-center gap-2.5 text-xs">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-2 text-xs font-black tabular-nums text-primary">
                  {isLoading ? "…" : filtered.length}
                </span>
                <span className="font-semibold text-foreground/75">{t("pages.contributions.results")}</span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary hover:underline"
                >
                  <X className="h-3 w-3" /> {t("common.reset_filters")}
                </button>
              )}
            </>
          }
        >
          <div className="group relative flex-1">
            <div className="relative flex h-12 items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm transition-all focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/10">
              <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder={t("pages.contributions.search_placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as typeof sector)}
              className="h-12 rounded-2xl border border-border bg-card px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10"
              aria-label={t("pages.contributions.filter_category")}
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? t("common.all") : s}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setFeaturedOnly((v) => !v)}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-all",
                featuredOnly
                  ? "border border-brand-gold/35 bg-brand-gold/15 text-brand-gold-dark shadow-sm"
                  : "border border-border bg-card text-foreground shadow-sm hover:border-brand-gold/30",
              )}
              aria-pressed={featuredOnly}
            >
              <Tag className="h-4 w-4" />
              {t("pages.contributions.filter_featured")}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSort("recent")}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-all",
                sort === "recent"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border bg-card text-foreground shadow-sm hover:border-primary/40 hover:text-primary",
              )}
            >
              {t("pages.contributions.sort_recent")}
            </button>
            <button
              type="button"
              onClick={() => setSort("readingTime")}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-all",
                sort === "readingTime"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-border bg-card text-foreground shadow-sm hover:border-primary/40 hover:text-primary",
              )}
            >
              {t("pages.contributions.sort_reading")}
            </button>
          </div>
        </ControlsBar>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">…</div>
          ) : filtered.length > 0 ? (
            filtered.map((c, idx) => <ContributionCard key={c._id} item={c} idx={idx} lang={lang} />)
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 py-24 text-center"
            >
              <p className="text-xl font-black text-foreground">{t("common.no_results")}</p>
              <p className="mt-2 text-base text-foreground/75">{t("pages.contributions.no_results_hint")}</p>
              <button
                type="button"
                onClick={clear}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-xs font-black uppercase tracking-wider text-foreground transition-all hover:border-primary/40"
              >
                <X className="h-3.5 w-3.5" /> {t("common.reset_filters")}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </HubSubpageShell>
  );
}
