import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK =
  "https://placehold.co/1600x800/e2e8f0/94a3b8?text=Featured";

interface FeaturedCarouselProps {
  articles: any[];
  lang?: string;
  autoPlayMs?: number;
}

export function FeaturedCarousel({
  articles,
  lang = "fr",
  autoPlayMs = 6000,
}: FeaturedCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = articles.length;

  const next = useCallback(
    () => setIndex((i) => (i + 1) % Math.max(1, count)),
    [count],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % Math.max(1, count)),
    [count],
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
  }, [paused, count, autoPlayMs, next]);

  useEffect(() => {
    if (index >= count && count > 0) {
      setIndex(0);
    }
  }, [count, index]);

  if (!count) return null;
  const article = articles[index];
  if (!article) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border-2 border-accent/40 shadow-[0_30px_80px_-30px_hsl(var(--brand-gold)/0.45)] group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative aspect-[21/9] md:aspect-[21/8] bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={article._id || index}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={resolveImageUrl(article.imageUrl) || IMAGE_FALLBACK}
              alt={getLocalized(article.title, lang)}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="p-6 md:p-12 max-w-3xl">
            <motion.div
              key={`content-${article._id || index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-accent/95 text-accent-foreground">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  À la une
                </span>
              </div>
              {article.sector && (
                <span className="block text-[10px] font-black uppercase tracking-widest text-accent mb-3">
                  {article.sector}
                </span>
              )}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 line-clamp-3">
                {getLocalized(article.title, lang)}
              </h2>
              <p className="hidden md:block text-base text-foreground/75 line-clamp-2 mb-6 leading-relaxed">
                {getLocalized(article.excerpt, lang)}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  to={`/news/${article.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-accent hover:text-accent-foreground transition-all active:scale-95 shadow-lg"
                >
                  Lire l'article <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(
                    article.publishedAt || article.createdAt,
                  ).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Précédent"
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Suivant"
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-4 right-6 flex items-center gap-2 z-10">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Aller à la diapositive ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-accent"
                    : "w-1.5 bg-foreground/30 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {count > 1 && !paused && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
            <motion.div
              key={`progress-${index}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: autoPlayMs / 1000, ease: "linear" }}
              className="h-full bg-accent"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FeaturedCarousel;
