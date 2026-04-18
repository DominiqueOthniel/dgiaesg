import { useMemo, useState, useEffect } from "react";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Search,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import api from "@/services/api";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

const IMAGE_FALLBACK =
  "https://placehold.co/800x400/e2e8f0/94a3b8?text=Article";

const PAGE_SIZE = 6;

function NewsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sector, setSector] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Scroll to top of list when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);


  // Define categories and sectors with translations
  const CATEGORIES = [
    { value: "all", label: t("news.filters.all_categories", "Catégories") },
    { value: "analyse", label: t("news.categories.analyse", "Analyse") },
    { value: "rapport", label: t("news.categories.rapport", "Rapport") },
    { value: "actualite", label: t("news.categories.actualite", "Actualité") },
  ];

  const SECTORS = [
    { value: "all", label: t("news.filters.all_sectors", "Secteurs") },
    { value: "finance", label: t("sectors.finance", "Finance") },
    { value: "tech", label: t("sectors.tech", "Technologie") },
    { value: "governance", label: t("sectors.governance", "Gouvernance") },
    { value: "energy", label: t("sectors.energy", "Énergie") },
  ];

  const SORT_OPTIONS = [
    { value: "newest", label: t("news.sort.newest", "Plus récents") },
    { value: "popular", label: t("news.sort.popular", "Plus populaires") },
    { value: "title", label: t("news.sort.title", "Titre") },
  ];

  // Fetch data - fetching 24 to have enough for client-side pagination/filtering
  const { data: newsData, isLoading } = useNews({ page: 1, limit: 24 });
  const news = newsData?.data || [];

  const filtered = useMemo(() => {
    let list = [...news];
    if (sector !== "all") list = list.filter((n: any) => n.sector === sector);
    if (category !== "all")
      list = list.filter(
        (n: any) => (n.category || "actualite") === category
      );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n: any) =>
        getLocalized(n.title, lang).toLowerCase().includes(q) ||
        getLocalized(n.excerpt, lang).toLowerCase().includes(q)
      );
    }
    if (dateFrom)
      list = list.filter(
        (n: any) =>
          new Date(n.publishedAt || n.createdAt) >= new Date(dateFrom)
      );
    if (dateTo)
      list = list.filter(
        (n: any) =>
          new Date(n.publishedAt || n.createdAt) <= new Date(dateTo)
      );

    list.sort((a: any, b: any) => {
      let cmp = 0;
      if (sortBy === "newest") {
        cmp =
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime();
      } else if (sortBy === "popular") {
        cmp = (a.views || 0) - (b.views || 0);
      } else if (sortBy === "title") {
        cmp = getLocalized(a.title, lang).localeCompare(
          getLocalized(b.title, lang)
        );
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [news, sector, category, search, dateFrom, dateTo, sortBy, sortDir, lang]);

  // Featured articles: top 5 by views then date
  const featured = useMemo(() => {
    return [...filtered]
      .sort((a: any, b: any) => {
        const viewDiff = (b.views || 0) - (a.views || 0);
        if (viewDiff !== 0) return viewDiff;
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      })
      .slice(0, 5);
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSector("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("newest");
    setSortDir("desc");
    setPage(1);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      toast.success(t("home.newsletter.success", "Merci ! Vous êtes inscrit à la newsletter."));
      setEmail("");
    } catch {
      toast.error(t("home.newsletter.error", "Impossible d'inscrire cet email."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen news-bg text-foreground">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Intelligence Éditoriale
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              {t("home.news.title", "Actualités & Analyses")}
            </h1>
            <p className="text-lg text-accent font-semibold max-w-xl">
              {t("home.news.subtitle", "Analyses stratégiques, rapports sectoriels et actualités de l'économie certifiée.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-accent/40 rounded-2xl p-4 md:p-5 shadow-[0_20px_60px_-20px_hsl(var(--brand-gold)/0.35)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher un article…"
                className="pl-9 h-11 bg-white border-border rounded-xl focus-visible:ring-accent"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <Select
                value={category}
                onValueChange={(v: string) => {
                  setCategory(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 bg-background">
                  <SelectValue placeholder={t("news.filter.category", "Catégorie")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sector */}
            <div className="md:col-span-2">
              <Select
                value={sector}
                onValueChange={(v: string) => {
                  setSector(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 bg-background">
                  <SelectValue placeholder={t("news.filter.sector", "Secteur")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {SECTORS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date range popover */}
            <div className="md:col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full h-11 px-3 rounded-xl border border-input bg-white text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate text-left flex-1">
                      {dateFrom || dateTo
                        ? `${dateFrom || "…"} → ${dateTo || "…"}`
                        : t("news.filter.period", "Période")}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 bg-popover z-50" align="start">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("common.from", "Du")}
                      </label>
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                          setDateFrom(e.target.value);
                          setPage(1);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("common.to", "Au")}
                      </label>
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                          setDateTo(e.target.value);
                          setPage(1);
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort */}
            <div className="md:col-span-2 flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 bg-background flex-1">
                  <SelectValue placeholder={t("news.filter.sort", "Trier")} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() =>
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                }
                aria-label="Changer l'ordre"
                className="h-11 w-11 shrink-0 rounded-xl border border-input bg-white hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
              >
                {sortDir === "asc" ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips + reset */}
          {(search ||
            category !== "all" ||
            sector !== "all" ||
            dateFrom ||
            dateTo) && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {filtered.length} {t("common.results", "résultat")}{filtered.length > 1 ? "s" : ""}
              </span>
              <button
                onClick={resetFilters}
                className="ml-auto text-xs font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> {t("common.reset", "Réinitialiser")}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Featured Carousel */}
      {!isLoading && featured.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <FeaturedCarousel articles={featured} lang={lang} autoPlayMs={6000} />
        </div>
      )}

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-muted animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((article: any, idx: number) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: idx * 0.06,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    to={`/news/${article.slug}`}
                    className="group card-gold block bg-card rounded-2xl overflow-hidden h-full flex flex-col"
                  >
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={
                          resolveImageUrl(article.imageUrl) || IMAGE_FALLBACK
                        }
                        alt={getLocalized(article.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                        }}
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      {article.sector && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary group-hover:text-accent transition-colors mb-2 block">
                          {article.sector}
                        </span>
                      )}
                      <h3 className="text-lg font-extrabold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-3 leading-snug">
                        {getLocalized(article.title, lang)}
                      </h3>
                      <p className="text-sm text-foreground/70 line-clamp-2 mb-6 leading-relaxed flex-1">
                        {getLocalized(article.excerpt, lang)}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-black">
                        <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                          <Calendar className="w-3 h-3" />
                          {new Date(
                            article.publishedAt || article.createdAt,
                          ).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary group-hover:text-[hsl(var(--brand-emerald))] group-hover:translate-x-1.5 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-10 px-4 rounded-md border-2 border-accent/40 bg-card text-sm font-semibold flex items-center gap-1 hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> {t("common.previous", "Précédent")}
                    </button>
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const active = p === currentPage;
                    return (
                      <PaginationItem key={p}>
                        <button
                          onClick={() => setPage(p)}
                          className={cn(
                            "h-10 w-10 rounded-md text-sm font-bold transition-all border-2",
                            active
                              ? "bg-accent text-accent-foreground border-accent shadow-lg"
                              : "bg-card border-border hover:border-accent",
                          )}
                        >
                          {p}
                        </button>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="h-10 px-4 rounded-md border-2 border-accent/40 bg-card text-sm font-semibold flex items-center gap-1 hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      {t("common.next", "Suivant")} <ChevronRight className="w-4 h-4" />
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("common.no_results", "Aucun résultat")}</p>
          </div>
        )}

        {/* Compact Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 relative overflow-hidden rounded-2xl border-2 border-accent/40 shadow-xl"
          style={{
            background:
              "linear-gradient(115deg, hsl(var(--brand-dark)) 0%, hsl(220 40% 12%) 55%, hsl(260 35% 18%) 100%)",
          }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/30 rounded-full blur-[80px]" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-[hsl(var(--brand-emerald))]/30 rounded-full blur-[80px]" />
          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                  Newsletter
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white mb-1">
                {t("home.newsletter.title", "Restez informé")}
              </h3>
              <p className="text-sm text-white/60">
                {t("home.newsletter.subtitle", "Une sélection éditoriale livrée chaque semaine.")}
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:min-w-[420px]"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("home.newsletter.placeholder", "votre@email.com")}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-accent text-accent-foreground font-black uppercase tracking-widest text-xs rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-lg shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? "..." : t("home.newsletter.subscribe", "S'inscrire")}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NewsPage;
