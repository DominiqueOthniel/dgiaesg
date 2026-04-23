import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Search, Download, Calendar, Sparkles, ArrowUpDown, X, Grid3X3, Rows3, List } from "lucide-react";
import { useMagazines, type MonthlyReview } from "@/hooks/useMagazines";
import { getLocalized, cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import { ControlsBar } from "@/components/ui/ControlsBar";

const IMAGE_FALLBACK = "https://placehold.co/300x400/2a3347/94a3b8?text=Magazine";

function KioskPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "az">("latest");
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");
  const searchPlaceholder = t("magazines.search_placeholder", { defaultValue: "Rechercher une publication..." });

  const { data: reviews = [], isLoading } = useMagazines();

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = reviews
      .filter((review: MonthlyReview) => {
        const localizedTitle = getLocalized(review.title, lang).toLowerCase();
        const matchesSearch = localizedTitle.includes(query);
        const matchesFeatured = featuredOnly ? review.featured : true;
        return matchesSearch && matchesFeatured;
      })
      .sort((a: MonthlyReview, b: MonthlyReview) => {
        if (sortBy === "az") {
          return getLocalized(a.title, lang).localeCompare(getLocalized(b.title, lang));
        }

        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return sortBy === "latest" ? dateB - dateA : dateA - dateB;
      });

    return list;
  }, [reviews, searchQuery, featuredOnly, sortBy, lang]);

  const mockCovers = Array.from({ length: 10 });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent fill-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Kiosque Numérique</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Revues & Publications
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              Accédez à nos publications stratégiques et aux archives de l'excellence africaine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <ControlsBar
          footer={
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-2 rounded-full bg-primary/10 text-primary text-[11px] font-black">
                  {filtered.length}
                </span>
                <span className="font-semibold text-muted-foreground">
                  publication{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
                </span>
              </div>
              {(featuredOnly || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedOnly(false);
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 text-[10px] text-primary font-black uppercase tracking-[0.18em] hover:underline"
                >
                  <X className="w-3 h-3" />
                  Réinitialiser
                </button>
              )}
            </>
          }
        >
          <div className="relative flex-1 group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/15 via-transparent to-accent/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity" />
            <div className="relative flex items-center gap-3 px-4 h-12 rounded-2xl bg-background/70 border border-border/60 focus-within:border-primary/50 focus-within:bg-background transition-all">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setFeaturedOnly((prev) => !prev)}
              className={cn(
                "group inline-flex items-center gap-2 h-12 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.16em] transition-all",
                featuredOnly
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-background/70 border border-border/60 text-foreground hover:border-primary/40 hover:text-primary"
              )}
              aria-pressed={featuredOnly}
            >
              <Sparkles className={cn("w-3.5 h-3.5 transition-transform", featuredOnly && "fill-current")} />
              Premium
            </button>

            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "az")}
                className="appearance-none h-12 pl-9 pr-9 rounded-2xl bg-background/70 border border-border/60 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground hover:border-primary/40 focus:outline-none focus:border-primary/50 cursor-pointer transition-colors"
              >
                <option value="latest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="az">A - Z</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">▾</span>
            </div>

            <div className="inline-flex items-center h-12 rounded-2xl bg-background/70 border border-border/60 p-1 w-full sm:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-10 px-3 rounded-xl inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all whitespace-nowrap",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grille</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                className={cn(
                  "h-10 px-3 rounded-xl inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all whitespace-nowrap",
                  viewMode === "compact"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compact</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-10 px-3 rounded-xl inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-all whitespace-nowrap",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Liste</span>
              </button>
            </div>
          </div>
        </ControlsBar>
      </div>

      {/* Magazine Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-2xl shadow-sm" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className={cn(
            "grid gap-8",
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
              : viewMode === "compact"
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
          )}>
            {filtered.map((mag: MonthlyReview, idx: number) => (
              <motion.div key={mag._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <div className={cn(
                  "group h-full translate-y-0 hover:-translate-y-2 transition-transform duration-300",
                  viewMode === "grid"
                    ? "flex flex-col"
                    : "flex gap-4 items-start rounded-2xl border border-border bg-card/60 p-3"
                )}>
                  <div className={cn(
                    "bg-muted rounded-2xl overflow-hidden border border-border shadow-md group-hover:shadow-2xl transition-all relative",
                    viewMode === "grid"
                      ? "aspect-[3/4]"
                      : viewMode === "compact"
                        ? "w-32 sm:w-36 aspect-[3/4] shrink-0"
                        : "w-24 sm:w-28 aspect-[3/4] shrink-0"
                  )}>
                    {mag.coverImageUrl ? (
                      <img
                        src={resolveImageUrl(mag.coverImageUrl)}
                        alt={getLocalized(mag.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/30">
                        <BookOpen className="w-12 h-12 text-muted-foreground/10" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center space-y-4">
                      {mag.pdfUrl ? (
                        <a
                          href={resolveImageUrl(mag.pdfUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-accent text-accent-foreground px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4" /> Télécharger (PDF)
                        </a>
                      ) : (
                        <p className="text-white text-xs font-bold uppercase tracking-widest">Abonnement Requis</p>
                      )}
                      <a
                        href={mag.coverImageUrl ? resolveImageUrl(mag.coverImageUrl) : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                          mag.coverImageUrl
                            ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                            : "bg-white/5 border border-white/10 text-white/60 cursor-not-allowed pointer-events-none"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Consulter couverture
                      </a>
                    </div>

                    {mag.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                        Premium Focus
                      </div>
                    )}
                  </div>
                  
                  <div className={cn("space-y-1.5 flex-1", viewMode === "grid" ? "mt-5" : "pt-1", viewMode === "list" && "flex flex-col justify-center")}>
                    <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                       {getLocalized(mag.title, lang)}
                    </h4>
                    {mag.publishDate && (
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3 text-accent" />
                        {new Date(mag.publishDate).toLocaleDateString(lang, { month: "long", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
              }}
            >
              {mockCovers.map((_, idx) => (
                <motion.div
                  key={`mock-${idx}`}
                  className="group hover-lift-soft"
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-md bg-gradient-to-br from-primary/20 via-primary/10 to-accent/15 relative">
                    <div className="absolute inset-0 opacity-35 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.45)_0_2px,transparent_2px_14px)]" />
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/55 to-transparent">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white/90">Edition {String(idx + 1).padStart(2, "0")}</span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 rounded-full bg-muted" />
                    <div className="h-3 rounded-full bg-muted/70 w-4/5" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Subscription Promo */}
        <div className="mt-20 p-10 md:p-16 rounded-[2.5rem] bg-card border border-border shadow-xl flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shrink-0 shadow-2xl relative z-10">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12" />
           </div>
           <div className="flex-1 text-center md:text-left relative z-10">
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">Accès illimité aux archives</h3>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                Rejoignez le réseau COOP-LABEL et profitez d'un accès exclusif à plus de 50 rapports sectoriels et revues stratégiques.
              </p>
           </div>
           <div className="shrink-0 relative z-10">
              <Link to="/pricing">
                <button className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
                  Voir nos Formules
                </button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

export default KioskPage;
