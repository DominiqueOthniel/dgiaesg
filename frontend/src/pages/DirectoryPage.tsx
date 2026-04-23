import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Search, Building2, MapPin, ChevronRight, ChevronLeft,
  LayoutGrid, List, Award, ArrowUpDown, Filter, RotateCcw,
} from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";
const PAGE_SIZE = 6;
type SortKey = "newest" | "oldest" | "az" | "za";

function useScrollDirection() {
  const [dir, setDir] = useState<"down" | "up">("down");
  useEffect(() => {
    let last = window.scrollY;
    const fn = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 5) { setDir(y > last ? "down" : "up"); last = y; }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return dir;
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const rY = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const rX = (0.5 - (e.clientY - r.top) / r.height) * 12;
    el.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px) scale(1.02)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)"; };
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={cn("tilt-card", className)}>{children}</div>;
}

function DirectoryPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const scrollDir = useScrollDirection();
  const enterY = scrollDir === "down" ? 40 : -40;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const { data: companiesData, isLoading } = useCompanies({});
  const companies = companiesData?.data || [];

  const categories = useMemo(() => {
    const s = new Set<string>();
    companies.forEach((c) => { const v = getLocalized(c.sector, lang); if (v) s.add(v); });
    return Array.from(s).sort();
  }, [companies, lang]);

  const filtered = useMemo(() => {
    let list = companies.filter((c) =>
      getLocalized(c.name, lang).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (category !== "all") list = list.filter((c) => getLocalized(c.sector, lang) === category);
    const byName = (a: any, b: any) => getLocalized(a.name, lang).localeCompare(getLocalized(b.name, lang));
    switch (sort) {
      case "az": list = [...list].sort(byName); break;
      case "za": list = [...list].sort((a, b) => -byName(a, b)); break;
      case "oldest": list = [...list].sort((a, b) => (a._id).localeCompare(b._id)); break;
      default: list = [...list].sort((a, b) => (b._id).localeCompare(a._id)); break;
    }
    return list;
  }, [companies, searchTerm, category, sort, lang]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasActiveFilters = searchTerm.trim() || category !== "all" || sort !== "newest";

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-brand-gold" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">{t("nav.directory")}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              {t("registry.title") || "Registre Central des Sociétés"}
            </h1>
            <p className="text-lg max-w-xl text-brand-gold font-medium">
              {t("registry.subtitle") || "Explorez l'annuaire complet des entreprises certifiées à travers l'Afrique."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="relative rounded-3xl bg-card/85 backdrop-blur-xl p-4 md:p-6 shadow-[0_20px_60px_-20px_rgba(13,77,51,0.35),0_8px_24px_-12px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-gradient-pan"
            style={{
              background:
                "radial-gradient(ellipse at top left, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(ellipse at center, hsl(var(--brand-gold) / 0.22), transparent 55%), radial-gradient(ellipse at bottom right, hsl(var(--brand-gold-dark) / 0.18), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px animate-hairline"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsl(var(--brand-gold) / 0.15) 25%, hsl(var(--brand-gold) / 0.8) 50%, hsl(var(--brand-gold) / 0.15) 75%, transparent 100%)",
            }}
          />
          <div className="relative flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            <div className="relative flex-1">
              <div className="golden-ring rounded-xl bg-white flex items-center">
                <Search className="ml-3 w-4 h-4 text-brand-gold-dark" />
                <input type="text" placeholder={t("registry.search_placeholder", "Rechercher une entité certifiée...")}
                  value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
              </div>
            </div>
            <div className="golden-ring rounded-xl bg-white flex items-center px-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-brand-gold-dark mr-2 shrink-0" />
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="bg-transparent py-2.5 text-sm text-foreground focus:outline-none pr-2 w-full sm:w-auto">
                <option value="all">{t("labels.filters.all_categories", "Catégories")}</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="golden-ring rounded-xl bg-white flex items-center px-3 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-brand-gold-dark mr-2 shrink-0" />
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent py-2.5 text-sm text-foreground focus:outline-none pr-2 w-full sm:w-auto">
                <option value="newest">{t("registry.sort.newest", "Plus récent")}</option>
                <option value="oldest">{t("registry.sort.oldest", "Plus ancien")}</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
            </div>
            <div className="golden-ring rounded-xl bg-white flex items-center justify-center gap-1 p-1 shrink-0 w-full sm:w-auto">
              <button onClick={() => setView("grid")} aria-label="Grid"
                className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-brand-gold text-white shadow-lg" : "text-muted-foreground hover:bg-brand-gold/10")}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} aria-label="List"
                className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-brand-emerald text-white shadow-lg" : "text-muted-foreground hover:bg-brand-emerald/10")}>
                <List className="w-4 h-4" />
              </button>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-brand-gold/40 text-brand-gold-dark bg-white hover:bg-brand-gold/10 transition-all w-full sm:w-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            )}
          </div>

          <div className="relative mt-3 pt-3 border-t border-border/40 flex items-center justify-between gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-2 rounded-full bg-primary/10 text-primary text-[11px] font-black">
                {filtered.length}
              </span>
              <span className="font-semibold text-muted-foreground">
                entité{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground w-full sm:w-auto">
              affichage : {view === "grid" ? "grille" : "liste"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="gradient-flow-bg mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/10 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <>
              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginated.map((company, idx) => (
                    <motion.div key={company._id} initial={{ opacity: 0, y: enterY }}
                      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}>
                      <TiltCard>
                        <Link to={`/directory/${company._id}`}
                          className="group golden-glow bg-white rounded-2xl p-6 h-full flex flex-col">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-50 border border-brand-gold/20 flex items-center justify-center overflow-hidden p-2">
                              {company.logoUrl ? (
                                <img src={resolveImageUrl(company.logoUrl)} alt={getLocalized(company.name, lang)} className="w-full h-full object-contain"
                                  onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
                              ) : <Building2 className="w-6 h-6 text-brand-gold-dark/40" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-foreground group-hover:text-brand-emerald transition-colors line-clamp-2">
                                {getLocalized(company.name, lang)}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{getLocalized(company.region, lang) || "Afrique"}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{getLocalized(company.description, lang)}</p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-gold/20">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-emerald">
                              <Award className="w-3 h-3" /> {getLocalized(company.sector, lang) || "Certifié"}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-gold transition-colors" />
                          </div>
                        </Link>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginated.map((company, idx) => (
                    <motion.div key={company._id} initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: idx * 0.04 }}>
                      <Link to={`/directory/${company._id}`}
                        className="group emerald-glow flex items-center gap-4 bg-white rounded-xl p-4">
                        <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-50 border border-brand-emerald/20 flex items-center justify-center overflow-hidden p-1.5">
                          {company.logoUrl ? (
                            <img src={resolveImageUrl(company.logoUrl)} alt={getLocalized(company.name, lang)} className="w-full h-full object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
                          ) : <Building2 className="w-5 h-5 text-brand-emerald/40" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-brand-emerald transition-colors">
                            {getLocalized(company.name, lang)}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {getLocalized(company.sector, lang)} · {getLocalized(company.region, lang)}
                          </span>
                          <p className="text-[11px] text-muted-foreground/85 mt-1 line-clamp-1">
                            {getLocalized(company.description, lang)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-brand-emerald group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="golden-ring inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white text-sm font-semibold disabled:opacity-40">
                    <ChevronLeft className="w-4 h-4" /> {t("common.prev", "Précédent")}
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <button key={n} onClick={() => setPage(n)}
                        className={cn("w-10 h-10 rounded-full text-sm font-bold transition-all",
                          n === currentPage
                            ? "bg-brand-gold text-white shadow-[0_0_20px_hsl(var(--brand-gold)/0.6)]"
                            : "golden-ring bg-white text-foreground hover:bg-brand-gold/10"
                        )}>{n}</button>
                    );
                  })}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="golden-ring inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white text-sm font-semibold disabled:opacity-40">
                    {t("common.next", "Suivant")} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
              <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/70">{t("common.no_results", "Aucun résultat")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DirectoryPage;
