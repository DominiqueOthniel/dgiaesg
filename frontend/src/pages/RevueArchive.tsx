import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Calendar,
  Sparkles,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  StretchHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { ISSUES } from "@/lib/revue-mock-data";
import { IssueCover } from "@/components/revue/IssueCover";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

export default function RevueArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "az">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = ISSUES.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(query) ||
        issue.monthLabel.toLowerCase().includes(query);
      const matchesFeatured = featuredOnly ? issue.featured : true;
      return matchesSearch && matchesFeatured;
    }).sort((a, b) => {
      if (sortBy === "az") return a.title.localeCompare(b.title);
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });
    
    return result;
  }, [searchQuery, featuredOnly, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--brand-gold))]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground/70">
                Archive des Publications
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-primary-foreground tracking-tight mb-6">
              L'excellence se{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] bg-clip-text text-transparent italic">
                documente.
              </span>
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Explorez nos dossiers stratégiques et retrouvez les analyses
              qui ont façonné la durabilité africaine mois après mois.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters — Rectangular with Golden Border */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl border-2 border-[hsl(var(--brand-gold))] shadow-[0_25px_60px_-15px_rgba(255,215,0,0.3)] rounded-3xl p-3 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 group w-full">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un numéro, un dossier, un mois..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-14 pl-14 pr-6 bg-slate-50/80 border-none rounded-2xl text-sm font-medium placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-[hsl(var(--brand-gold)/0.3)] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {/* Premium Filter Button - Golden Bordered */}
              <button
                onClick={() => {
                  setFeaturedOnly(!featuredOnly);
                  setCurrentPage(1);
                }}
                className={cn(
                  "h-14 px-6 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border-2",
                  featuredOnly
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "bg-slate-50 border-[hsl(var(--brand-gold)/0.3)] text-foreground hover:bg-slate-100"
                )}
              >
                <Sparkles className={cn("w-3.5 h-3.5", featuredOnly && "fill-current animate-pulse text-[hsl(var(--brand-gold))]")} />
                À LA UNE
              </button>

              {/* Sort Dropdown - Golden Bordered */}
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                 </div>
                 <select
                   value={sortBy}
                   onChange={(e) => {
                     setSortBy(e.target.value as any);
                     setCurrentPage(1);
                   }}
                   className="h-14 pl-12 pr-10 bg-slate-50 border-2 border-[hsl(var(--brand-gold)/0.3)] rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-2 focus:ring-[hsl(var(--brand-gold)/0.3)] hover:bg-slate-100 transition-all"
                 >
                   <option value="latest">PLUS RÉCENTS</option>
                   <option value="oldest">ANCIENS</option>
                   <option value="az">A-Z</option>
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-[8px] flex flex-col gap-0.5">
                    <ChevronLeft className="w-2.5 h-2.5 rotate-90" />
                    <ChevronLeft className="w-2.5 h-2.5 -rotate-90" />
                 </div>
              </div>

              <div className="h-10 w-px bg-border mx-1 hidden lg:block" />

              {/* View Mode Switchers */}
              <div className="flex bg-slate-100/50 p-1 rounded-2xl border-2 border-[hsl(var(--brand-gold)/0.2)]">
                 <button
                   onClick={() => setViewMode("grid")}
                   className={cn(
                     "flex items-center gap-2 px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     viewMode === "grid" ? "bg-[hsl(var(--brand-deep))] text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">GRILLE</span>
                 </button>
                 <button
                   onClick={() => setViewMode("compact")}
                   className={cn(
                     "flex items-center gap-2 px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     viewMode === "compact" ? "bg-[hsl(var(--brand-deep))] text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                    <StretchHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">COMPACT</span>
                 </button>
                 <button
                   onClick={() => setViewMode("list")}
                   className={cn(
                     "flex items-center gap-2 px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     viewMode === "list" ? "bg-[hsl(var(--brand-deep))] text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">LISTE</span>
                 </button>
              </div>
            </div>
          </div>
          
          <div className="px-5 pb-1 flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-primary">
                {filtered.length}
             </div>
             <span className="text-[10px] font-bold text-muted-foreground">numéros trouvés</span>
          </div>
        </div>
      </div>

      {/* Grid Content — Scroll Reveal + Layout Modes */}
      <section className="py-24 aurora-bg aurora-bg-soft min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {currentItems.length > 0 ? (
              <motion.div
                key={`${searchQuery}-${currentPage}-${featuredOnly}-${sortBy}-${viewMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className={cn(
                  "grid gap-x-8 gap-y-12",
                  viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : 
                  viewMode === "compact" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}>
                  {currentItems.map((issue, idx) => (
                    <motion.div
                      key={issue.slug}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-20px" }}
                      transition={{ 
                        delay: (idx % 4) * 0.08, 
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                      className="group"
                    >
                      <Link 
                        to={`/revue/numeros/${issue.slug}`} 
                        className={cn(
                          "bg-white rounded-3xl overflow-hidden transition-all duration-500",
                          viewMode === "grid" ? "flex flex-col h-full bg-transparent shadow-none" : 
                          "flex flex-row items-center gap-6 p-5 border-2 border-[hsl(var(--brand-gold)/0.4)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_60px_-15px_rgba(255,215,0,0.3)] hover:-translate-y-2",
                          viewMode === "list" && "md:gap-10 border-[hsl(var(--brand-gold))] p-8"
                        )}
                      >
                        <div className={cn(
                          "relative transform transition-transform duration-500 shrink-0",
                          viewMode === "grid" ? "w-full group-hover:-translate-y-3" : 
                          "w-28 sm:w-36 md:w-44 lg:w-48 group-hover:scale-105"
                        )}>
                          <IssueCover issue={issue} size={viewMode === "grid" ? "md" : "sm"} />
                        </div>

                        <div className={cn(
                          "flex-1 space-y-3",
                          viewMode === "grid" ? "mt-6" : ""
                        )}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand-gold))]" />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[hsl(var(--brand-gold-dark))]">
                                 {issue.monthLabel}
                               </span>
                            </div>
                            {issue.featured && viewMode !== "grid" && (
                               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[hsl(var(--brand-gold)/0.15)] text-[hsl(var(--brand-gold-dark))] text-[8px] font-black uppercase tracking-widest border border-[hsl(var(--brand-gold)/0.3)]">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  À LA UNE
                               </div>
                            )}
                          </div>
                          
                          <h3 className={cn(
                            "font-black text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2",
                            viewMode === "grid" ? "text-sm md:text-base" : "text-lg md:text-2xl"
                          )}>
                            {issue.title}
                          </h3>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                            {issue.tagline}
                          </p>

                          <div className="pt-2 flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                             <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(issue.publishDate).getFullYear()}
                             </div>
                             <div className="w-1 h-1 rounded-full bg-border" />
                             <div>{issue.pageCount} P.</div>
                          </div>

                          {(viewMode === "compact" || viewMode === "list") && (
                            <div className="pt-4">
                               <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:gap-3 transition-all">
                                  LIRE LE NUMÉRO
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                               </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-24 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10 px-4 rounded-md border-2 border-accent/40 bg-card text-sm font-semibold flex items-center gap-2 hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                    
                    <div className="flex items-center gap-2">
                       {Array.from({ length: totalPages }).map((_, i) => {
                         const pageNum = i + 1;
                         const active = currentPage === pageNum;
                         return (
                           <button
                             key={pageNum}
                             onClick={() => handlePageChange(pageNum)}
                             className={cn(
                               "h-10 w-10 rounded-md text-sm font-bold transition-all border-2",
                               active 
                                 ? "bg-accent text-accent-foreground border-accent shadow-lg scale-105" 
                                 : "bg-card border-border hover:border-accent text-muted-foreground"
                             )}
                           >
                             {pageNum}
                           </button>
                         );
                       })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-10 px-4 rounded-md border-2 border-accent/40 bg-card text-sm font-semibold flex items-center gap-2 hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
                  <Search className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Aucun numéro trouvé</h3>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">Nous n'avons trouvé aucune publication correspondant à vos critères actuels.</p>
                <button
                  onClick={() => { setSearchQuery(""); setFeaturedOnly(false); setCurrentPage(1); }}
                  className="mt-8 px-8 py-3 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-28 relative overflow-hidden bg-primary text-white">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]" />
         <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                Accédez à l'intégralité de <br />
                notre{" "}
                <span className="bg-gradient-to-r from-[hsl(var(--brand-gold))] to-[hsl(var(--brand-gold-dark))] bg-clip-text text-transparent italic">
                  intelligence éditoriale.
                </span>
              </h2>
              <p className="text-white/70 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
                L'abonnement annuel vous offre un accès illimité aux archives, 
                aux dossiers PDF et à nos outils de veille stratégique.
              </p>
              <Link to="/abonnement">
                <button className="px-12 h-16 rounded-2xl bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold-foreground))] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.05] active:scale-[0.98] transition-all">
                  S'abonner maintenant
                </button>
              </Link>
            </motion.div>
         </div>
      </section>
    </div>
  );
}
