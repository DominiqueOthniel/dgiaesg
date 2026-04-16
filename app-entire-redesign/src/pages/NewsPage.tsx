import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BookOpen, Search, Calendar, ArrowRight } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import api from "@/services/api";

const IMAGE_FALLBACK = "https://placehold.co/800x400/e2e8f0/94a3b8?text=Article";

const sectorFilters = [
  { value: "all", label: "Tous" },
  { value: "finance", label: "Finance" },
  { value: "tech", label: "Technologie" },
  { value: "governance", label: "Gouvernance" },
  { value: "energy", label: "Énergie" },
];

function NewsPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [sectorFilter, setSectorFilter] = useState("all");
  const [email, setEmail] = useState("");

  const { data: newsData, isLoading } = useNews({ page: 1, limit: 12 });
  const news = newsData?.data || [];

  const filtered = sectorFilter === "all" ? news : news.filter((n: any) => n.sector === sectorFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Intelligence Éditoriale</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Journal & Actualités
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              Analyses stratégiques, rapports sectoriels et actualités de l'économie certifiée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg flex flex-wrap gap-2">
          {sectorFilters.map((s) => (
            <button
              key={s.value}
              onClick={() => setSectorFilter(s.value)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all",
                sectorFilter === s.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            {/* Featured */}
            {filtered[0] && (
              <Link to={`/news/${filtered[0].slug}`} className="group block mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card border border-border rounded-2xl overflow-hidden hover-lift">
                  <div className="aspect-[16/10] lg:aspect-auto bg-muted overflow-hidden">
                    <img
                      src={resolveImageUrl(filtered[0].imageUrl) || IMAGE_FALLBACK}
                      alt={getLocalized(filtered[0].title, lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }}
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    {filtered[0].sector && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">{filtered[0].sector}</span>
                    )}
                    <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-3">
                      {getLocalized(filtered[0].title, lang)}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {getLocalized(filtered[0].excerpt, lang)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(filtered[0].publishedAt || filtered[0].createdAt).toLocaleDateString("fr-FR")}</span>
                      {filtered[0].readingTime && <span>· {filtered[0].readingTime}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(1).map((article: any, idx: number) => (
                <motion.div key={article._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                  <Link to={`/news/${article.slug}`} className="group block bg-card border border-border rounded-xl overflow-hidden hover-lift h-full">
                    <div className="aspect-[16/10] bg-muted overflow-hidden">
                      <img
                        src={resolveImageUrl(article.imageUrl) || IMAGE_FALLBACK}
                        alt={getLocalized(article.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }}
                      />
                    </div>
                    <div className="p-5">
                      {article.sector && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2 block">{article.sector}</span>
                      )}
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {getLocalized(article.title, lang)}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {getLocalized(article.excerpt, lang)}
                      </p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun article pour le moment.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-[100px]" />
          <div className="relative z-10 max-w-xl">
            <h3 className="text-xl font-bold mb-2">Restez Informé</h3>
            <p className="text-sm text-primary-foreground/70 mb-6">
              Inscrivez-vous à notre newsletter pour les dernières analyses et certifications.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) { api.post("/newsletter/subscribe", { email }).catch(() => {}); setEmail(""); }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="submit" className="px-6 py-3 bg-accent text-accent-foreground font-semibold text-sm rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-lg shrink-0">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
