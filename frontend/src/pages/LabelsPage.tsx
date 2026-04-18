import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Award,
  Search,
  ShieldCheck,
  ChevronRight,
  Globe,
  LayoutGrid,
  List,
  ArrowUpDown,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { useLabels } from "@/hooks/useLabels";
import { Reveal } from "@/components/Reveal";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const IMAGE_FALLBACK = "https://placehold.co/400x400/064e3b/ffd700?text=Logo";
const PAGE_SIZE = 6;

type SortKey =
  | "newest"
  | "oldest"
  | "alpha-asc"
  | "alpha-desc"
  | "popular";

function LabelsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: labels, isLoading } = useLabels();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSector, setActiveSector] = useState("Tous");
  const [activeSubSector, setActiveSubSector] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    // Scroll to top of list when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const sectors = [
    { value: "Tous", label: t("labels.filters.all_sectors", "Secteurs") },
    { value: "finance", label: t("sectors.finance") || "Finance" },
    { value: "tech", label: t("sectors.tech") || "Technologie" },
    { value: "energy", label: t("sectors.energy") || "Énergie" },
    { value: "governance", label: t("sectors.governance") || "Gouvernance" },
    { value: "leadership", label: t("sectors.leadership") || "Leadership" },
  ];

  const subSectors: Record<string, { value: string; label: string }[]> = {
    Tous: [{ value: "all", label: t("labels.filters.category_placeholder", "Catégories") }],
    finance: [
      { value: "all", label: t("labels.filters.category_placeholder", "Catégories") },
      { value: "banking", label: "Banque" },
      { value: "insurance", label: "Assurance" },
      { value: "microfinance", label: "Microfinance" },
    ],
    tech: [
      { value: "all", label: t("labels.filters.category_placeholder", "Catégories") },
      { value: "software", label: "Logiciel" },
      { value: "infra", label: "Infrastructure" },
      { value: "ai", label: "IA & Data" },
    ],
    energy: [
      { value: "all", label: t("labels.filters.category_placeholder", "Catégories") },
      { value: "solar", label: "Solaire" },
      { value: "hydro", label: "Hydro" },
      { value: "wind", label: "Éolien" },
    ],
    governance: [
      { value: "all", label: t("labels.filters.category_placeholder", "Catégories") },
      { value: "public", label: "Public" },
      { value: "ngo", label: "ONG" },
    ],
    leadership: [
      { value: "all", label: t("labels.filters.category_placeholder", "Catégories") },
      { value: "executive", label: "Dirigeants" },
      { value: "youth", label: "Jeunesse" },
    ],
  };

  const filteredLabels = useMemo(() => {
    const list = (labels ?? []).filter((label: any) => {
      const name = getLocalized(label?.name, lang).toLowerCase();
      const desc = getLocalized(label?.description, lang).toLowerCase();
      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        desc.includes(searchTerm.toLowerCase());
      const matchesSector = activeSector === "Tous" || label.sector === activeSector;
      return matchesSearch && matchesSector;
    });

    const sorted = [...list];
    switch (sortKey) {
      case "alpha-asc":
        sorted.sort((a, b) =>
          getLocalized(a.name, lang).localeCompare(getLocalized(b.name, lang)),
        );
        break;
      case "alpha-desc":
        sorted.sort((a, b) =>
          getLocalized(b.name, lang).localeCompare(getLocalized(a.name, lang)),
        );
        break;
      case "oldest":
        sorted.reverse();
        break;
      case "popular":
        // Mock popularity by id length / numeric id
        sorted.sort((a, b) => (b._id || "").localeCompare(a._id || ""));
        break;
      case "newest":
      default:
        // Keep API order (assumed newest-first)
        break;
    }
    return sorted;
  }, [labels, lang, searchTerm, activeSector, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredLabels.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredLabels.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden labels-page-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-gold)/0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--brand-emerald)/0.18),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-brand-gold" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Portails de Certification
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Labels & Certifications
            </h1>
            <p className="text-lg text-brand-gold/90 max-w-xl">
              Découvrez les standards d'excellence qui structurent l'économie africaine certifiée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Animated emerald/gold content area (filters + results) */}
      <div className="labels-content-bg pb-12">
      {/* Filters bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-20">
        <Reveal variant="down" className="bg-white border border-brand-gold/30 rounded-2xl p-4 md:p-5 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            {/* Search with golden glow */}
            <div className="relative flex-1 search-gold-glow rounded-xl bg-white">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold-dark" />
              <input
                type="text"
                placeholder={t("labels.filters.search_placeholder", "Rechercher...")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-background border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-brand-gold-dark shrink-0" />
              <Select
                value={sortKey}
                onValueChange={(v) => {
                  setSortKey(v as SortKey);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[170px] border-brand-gold/40 focus:ring-brand-gold/60 bg-white rounded-xl">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="oldest">Plus anciens</SelectItem>
                  <SelectItem value="alpha-asc">A → Z</SelectItem>
                  <SelectItem value="alpha-desc">Z → A</SelectItem>
                  <SelectItem value="popular">Plus populaires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-gold-dark shrink-0" />
              <Select
                value={activeSector}
                onValueChange={(v) => {
                  setActiveSector(v);
                  setActiveSubSector("all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px] border-brand-gold/40 focus:ring-brand-gold/60 bg-white rounded-xl">
                  <SelectValue placeholder={t("labels.filters.sector_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={activeSubSector}
                onValueChange={setActiveSubSector}
              >
                <SelectTrigger className="w-[160px] border-brand-gold/40 focus:ring-brand-gold/60 bg-white rounded-xl">
                  <SelectValue placeholder={t("labels.filters.category_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {(subSectors[activeSector] ?? subSectors.Tous).map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View toggle */}
            <div
              className="inline-flex rounded-xl p-1 border border-brand-gold/40 bg-white"
              role="tablist"
              aria-label="Mode d'affichage"
            >
              <button
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-foreground",
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-gold-foreground shadow-[0_0_14px_hsl(var(--brand-gold)/0.5)]"
                    : "text-muted-foreground hover:text-brand-gold",
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Cartes
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-foreground",
                  viewMode === "list"
                    ? "bg-gradient-to-r from-brand-emerald to-brand-gold text-white shadow-[0_0_14px_hsl(var(--brand-emerald)/0.5)]"
                    : "text-muted-foreground hover:text-brand-emerald",
                )}
              >
                <List className="w-3.5 h-3.5" /> Liste
              </button>
            </div>

            {/* Reset filters */}
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveSector("Tous");
                setActiveSubSector("all");
                setSortKey("newest");
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-brand-gold/40 text-brand-gold-dark bg-white hover:bg-brand-gold/10 hover:border-brand-gold transition-all shadow-[0_0_10px_hsl(var(--brand-gold)/0.15)]"
              aria-label="Réinitialiser les filtres"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          </div>
        </Reveal>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-3",
            )}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "bg-white/5 animate-pulse rounded-xl",
                  viewMode === "grid" ? "h-72" : "h-24",
                )}
              />
            ))}
          </div>
        ) : paginated.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((label: any, idx: number) => (
                <Reveal
                  key={label._id}
                  variant={idx % 3 === 0 ? "up" : idx % 3 === 1 ? "scale" : "tilt"}
                  delay={idx * 80}
                >
                  <Link
                    to={`/labels/${label._id}`}
                    className="label-card-elevated group block p-6 h-full flex flex-col relative"
                  >
                    {/* Gold corners */}
                    <span className="corner top-2 left-2 border-t-2 border-l-2" />
                    <span className="corner top-2 right-2 border-t-2 border-r-2" />
                    <span className="corner bottom-2 left-2 border-b-2 border-l-2" />
                    <span className="corner bottom-2 right-2 border-b-2 border-r-2" />

                    <div className="relative z-10 flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-secondary border border-brand-gold/40 flex items-center justify-center overflow-hidden p-2 group-hover:border-brand-gold transition-colors">
                        {label.logoUrl ? (
                          <img
                            src={resolveImageUrl(getLocalized(label.logoUrl, lang))}
                            alt={getLocalized(label.name, lang)}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                            }}
                          />
                        ) : (
                          <Award className="w-6 h-6 text-brand-gold/60" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-brand-gold-dark transition-colors">
                          {getLocalized(label.name, lang)}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                          <span className="text-xs font-medium text-brand-emerald">
                            {t("home.labels.verified") || "Vérifié"}
                          </span>
                          {label.sector && (
                            <span className="text-xs text-muted-foreground ml-1">
                              · {label.sector}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="relative z-10 text-sm text-foreground/75 leading-relaxed line-clamp-3 flex-1 mb-4">
                      {getLocalized(label.description, lang) ||
                        "Protocole de conformité certifié pour l'excellence institutionnelle."}
                    </p>

                    <span className="relative z-10 inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-brand-gold-dark group-hover:gap-2 transition-all mt-auto">
                      {t("home.labels.explore") || "Explorer le label"}{" "}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginated.map((labelBy: any, idx: number) => (
                <Reveal
                  key={labelBy._id}
                  variant={idx % 2 === 0 ? "left" : "right"}
                  delay={idx * 60}
                >
                  <Link
                    to={`/labels/${labelBy._id}`}
                    className="list-row-glow group flex items-center gap-4 p-4 rounded-xl"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-lg bg-secondary border border-brand-gold/35 flex items-center justify-center overflow-hidden p-1.5">
                      {labelBy.logoUrl ? (
                        <img
                          src={resolveImageUrl(getLocalized(labelBy.logoUrl, lang))}
                          alt={getLocalized(labelBy.name, lang)}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                          }}
                        />
                      ) : (
                        <Award className="w-5 h-5 text-brand-gold/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-foreground leading-snug truncate group-hover:text-brand-gold-dark transition-colors">
                        {getLocalized(labelBy.name, lang)}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {getLocalized(labelBy.description, lang)}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-emerald">
                          Vérifié
                        </span>
                        {labelBy.sector && (
                          <span className="text-[10px] text-brand-gold-dark/80">
                            · {labelBy.sector}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand-gold shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Reveal>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <Globe className="w-12 h-12 text-brand-gold/30 mx-auto mb-4" />
            <p className="text-white/70">{t("common.no_results") || "Aucun résultat"}</p>
          </div>
        )}

        {/* Golden pagination */}
        {!isLoading && filteredLabels.length > PAGE_SIZE && (
          <Reveal variant="up" className="mt-10">
            <Pagination className="pagination-gold">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setPage((p) => p - 1);
                    }}
                    className={cn(
                      "rounded-full transition-all",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  if (
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - currentPage) <= 1
                  ) {
                    return (
                      <PaginationItem key={n}>
                        <PaginationLink
                          href="#"
                          isActive={n === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(n);
                          }}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (n === currentPage - 2 || n === currentPage + 2) {
                    return (
                      <PaginationItem key={`e-${n}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setPage((p) => p + 1);
                    }}
                    className={cn(
                      "rounded-full transition-all",
                      currentPage === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Reveal>
        )}
      </div>
      </div>
    </div>
  );
}

export default LabelsPage;
