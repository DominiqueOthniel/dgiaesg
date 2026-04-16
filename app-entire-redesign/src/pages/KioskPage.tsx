import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Search, Download, ExternalLink } from "lucide-react";
import { useMagazines } from "@/hooks/useMagazines";
import { getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/300x400/e2e8f0/94a3b8?text=Magazine";

function KioskPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [searchQuery, setSearchQuery] = useState("");

  const { data: reviews = [], isLoading } = useMagazines();

  const filtered = reviews.filter((r: any) =>
    getLocalized(r.title, lang).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Publications</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Kiosque & Revues
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              Consultez nos publications mensuelles et revues de l'excellence africaine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une publication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {filtered.map((mag: any, idx: number) => (
              <motion.div key={mag._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <div className="group hover-lift">
                  <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-lg transition-shadow relative">
                    {mag.coverImageUrl ? (
                      <img
                        src={resolveImageUrl(mag.coverImageUrl)}
                        alt={getLocalized(mag.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      {mag.pdfUrl ? (
                        <a
                          href={resolveImageUrl(mag.pdfUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-3.5 h-3.5" /> Télécharger
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-primary-foreground">Consulter →</span>
                      )}
                    </div>
                    {mag.featured && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold uppercase rounded">
                        À la une
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mt-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {getLocalized(mag.title, lang)}
                  </h4>
                  {mag.publishDate && (
                    <span className="text-[11px] text-muted-foreground">{new Date(mag.publishDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune publication trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default KioskPage;
