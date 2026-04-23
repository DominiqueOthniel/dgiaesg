import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import {
  getLocalized,
  handleImageError,
  ViewportSection,
  SLIDE_LEFT,
} from "./_shared";

/**
 * 2. INTELLIGENCE ÉDITORIALE
 * Redesigned with compacted carousel and slide-left animations.
 */
export function EditorialSection({ news }: { news: any[] }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [featuredIdx, setFeaturedIdx] = useState(0);
  useEffect(() => {
    if (!news || news.length < 2) return;
    const t = setInterval(
      () => setFeaturedIdx((i) => (i + 1) % Math.min(news.length, 5)),
      5000,
    );
    return () => clearInterval(t);
  }, [news?.length]);

  return (
    <ViewportSection
      id="editorial"
      variants={SLIDE_LEFT}
      className="py-5 sm:py-7 md:py-9 bg-gradient-to-b from-[#0a2a1a] via-[#0d3322] to-[#0a2a1a]"
    >
      <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-brand-emerald/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-5 mb-4 sm:mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3 h-3 text-brand-gold shrink-0" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                {t("home.editorial.subtitle") || "Intelligence Éditoriale"}
              </span>
            </div>
            <h2 className="font-serif text-base leading-[1.15] sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white tracking-tight text-balance">
              {t("home.editorial.headline_lead")}{" "}
              <span className="italic text-white/70">
                {t("home.editorial.headline_em")}
              </span>
            </h2>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] hover:brightness-110 transition-all shadow-lg shadow-brand-gold/20 shrink-0 self-start md:self-end"
          >
            {t("home.editorial.view_all") || "Tous les articles"} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {news.length === 0 ? (
          <p className="text-center text-white/50 py-12">
            {t("home.editorial.empty")}
          </p>
        ) : (
          <>
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/60 mb-3 sm:mb-4 h-[170px] sm:h-[230px] md:h-[280px] lg:h-[320px]">
              <AnimatePresence mode="wait">
                {news.slice(0, 5).map((article: any, idx: number) =>
                  idx === featuredIdx ? (
                    <motion.div
                      key={article._id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0"
                    >
                      <Link
                        to={`/news/${article.slug || article._id}`}
                        className="relative block w-full h-full group"
                      >
                        <div className="absolute inset-0 z-0">
                          {article.imageUrl ? (
                            <img
                              src={resolveImageUrl(article.imageUrl)}
                              alt={getLocalized(article.title, lang)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-brand-dark via-primary/40 to-brand-emerald/30" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 z-10">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            {article.sector && (
                              <span className="inline-flex items-center bg-brand-gold text-brand-dark px-2.5 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em]">
                                {article.sector}
                              </span>
                            )}
                            {article.publishedAt && (
                              <span className="text-[9px] sm:text-[10px] font-semibold text-white/80 uppercase tracking-[0.18em]">
                                {new Date(article.publishedAt).toLocaleDateString(
                                  lang || "fr",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-sm sm:text-lg md:text-2xl lg:text-3xl font-semibold text-white leading-[1.15] tracking-tight mb-1.5 max-w-3xl text-balance group-hover:text-brand-gold transition-colors line-clamp-2">
                            {getLocalized(article.title, lang)}
                          </h3>

                          <p className="hidden md:block text-[11px] md:text-xs text-white/75 line-clamp-2 max-w-2xl leading-relaxed">
                            {getLocalized(article.excerpt, lang)}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ) : null,
                )}
              </AnimatePresence>

              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex gap-1.5 z-20">
                {news.slice(0, 5).map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setFeaturedIdx(i)}
                    aria-label={`Article ${i + 1}`}
                    className={cn(
                      "h-1 sm:h-1.5 rounded-full transition-all duration-500",
                      i === featuredIdx
                        ? "w-6 sm:w-8 bg-brand-gold"
                        : "w-3 sm:w-4 bg-white/25 hover:bg-white/45",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth -mx-4 px-4 scrollbar-hide">
              {news.slice(1).map((article: any) => (
                <Link
                  key={article._id}
                  to={`/news/${article.slug || article._id}`}
                  className="snap-start shrink-0 w-[130px] sm:w-[160px] md:w-[180px] group/card bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/25 ring-1 ring-brand-gold/10 rounded-lg overflow-hidden shadow-xl shadow-black/30 hover:-translate-y-1.5 hover:ring-brand-gold/60 hover:shadow-2xl hover:shadow-brand-gold/25 hover:border-brand-gold transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-white/5 overflow-hidden">
                    {article.imageUrl ? (
                      <img
                        src={resolveImageUrl(article.imageUrl)}
                        alt={getLocalized(article.title, lang)}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-brand-emerald/10">
                        <BookOpen className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-2.5">
                    {article.sector && (
                      <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-gold block mb-0.5">
                        {article.sector}
                      </span>
                    )}
                    <h4 className="font-serif text-[11px] sm:text-[12px] font-medium text-white leading-snug line-clamp-2 group-hover/card:text-brand-gold transition-colors">
                      {getLocalized(article.title, lang)}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </ViewportSection>
  );
}
