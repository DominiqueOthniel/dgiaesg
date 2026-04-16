import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Search, Download, ExternalLink, Calendar } from "lucide-react";
import { useMagazines } from "@/hooks/useMagazines";
import { getLocalized, cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/300x400/2a3347/94a3b8?text=Magazine";

function KioskPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [searchQuery, setSearchQuery] = useState("");

  const { data: reviews = [], isLoading } = useMagazines();

  const filtered = reviews.filter((r: any) =>
    getLocalized(r.title, lang).toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
          <div className="relative max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={t("magazines.search_placeholder") || "Rechercher une publication..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {filtered.map((mag: any, idx: number) => (
              <motion.div key={mag._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <div className="group flex flex-col h-full translate-y-0 hover:-translate-y-2 transition-transform duration-300">
                  <div className="aspect-[3/4] bg-muted rounded-2xl overflow-hidden border border-border shadow-md group-hover:shadow-2xl transition-all relative">
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
                      <button className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                        Consulter Aperçu
                      </button>
                    </div>

                    {mag.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                        Premium Focus
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-5 space-y-1.5 flex-1">
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
          <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border">
            <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-muted-foreground">Aucune revue disponible</h2>
            <p className="text-sm text-muted-foreground/60 mt-2">Notre kiosque sera bientôt mis à jour avec de nouvelles éditions.</p>
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
