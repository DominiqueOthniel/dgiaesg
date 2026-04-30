import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Flame, Newspaper, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import { getLocalized, handleImageError, Skeleton } from "./_shared";

const IMAGE_FALLBACK =
  "https://placehold.co/1200x675/0d3322/f5e6a8?text=DGIAESG+Review";

function formatArticleDate(iso: string | undefined, locale: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/**
 * Une de site média : article principal large + 2 secondaires côte à côte
 * + colonne « Le plus lu » numérotée. Inspiré des grilles éditoriales modernes.
 */
export function NewsHomeFront({
  news,
  lang,
  isLoading,
  onResetFilters,
}: {
  news: any[];
  lang: string;
  isLoading: boolean;
  onResetFilters?: () => void;
}) {
  const { t } = useTranslation();

  const featured = news[0];
  const secondaries = news.slice(1, 3);
  const tertiaries = news.slice(3, 6);
  const mostRead = news.slice(0, 5);

  return (
    <section className="news-bg text-foreground w-full max-w-[100vw] min-w-0 overflow-x-hidden">
      <div className="max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 pb-10 md:pb-14">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-primary/20">
          <Newspaper className="w-4 h-4 text-primary" />
          <h2 className="font-heading text-sm font-black uppercase tracking-[0.28em] text-primary">
            {t("home.news_front.section_journal", "Le Journal")}
          </h2>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.18em] ml-auto">
            {news.length} {t("home.news_front.articles", "articles")}
          </span>
        </div>

        {isLoading ? (
          <HeroSkeleton />
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <SearchX className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-base font-semibold text-foreground mb-1">
              {t("home.news_front.no_results", "Aucun article ne correspond.")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                "home.news_front.no_results_hint",
                "Essayez d'autres filtres ou réinitialisez la recherche.",
              )}
            </p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-[0.18em] hover:brightness-110 transition-all shadow-md"
              >
                {t("common.reset", "Réinitialiser")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 md:gap-8 min-w-0">
            {/* Article principal */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-12 lg:col-span-8 min-w-0"
            >
              <Link
                to={`/news/${featured.slug || featured._id}`}
                className="group block"
              >
                <div className="relative aspect-[16/9] bg-muted overflow-hidden rounded-xl ring-1 ring-border shadow-xl">
                  <img
                    src={
                      featured.imageUrl
                        ? resolveImageUrl(featured.imageUrl)
                        : IMAGE_FALLBACK
                    }
                    alt={getLocalized(featured.title, lang)}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-[0.18em] shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                      {t("home.news_front.headline_label")}
                    </span>
                    {featured.sector && (
                      <span className="inline-block bg-brand-gold text-brand-dark px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-[0.15em] shadow-md">
                        {featured.sector}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 min-w-0">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.06] tracking-tight group-hover:text-primary transition-colors break-words hyphens-auto">
                    {getLocalized(featured.title, lang)}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed line-clamp-3 max-w-3xl">
                      {getLocalized(featured.excerpt, lang)}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {featured.author && <span>{featured.author}</span>}
                    {featured.publishedAt && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatArticleDate(featured.publishedAt, lang)}
                      </span>
                    )}
                    {featured.readingTime && (
                      <span>
                        {featured.readingTime} {t("home.news_front.read_min")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>

            {/* Colonne droite : Plus lus */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="bg-card border border-border rounded-xl shadow-md overflow-hidden h-full flex flex-col">
                <div className="px-5 py-4 bg-primary text-primary-foreground flex items-center gap-2">
                  <Flame className="w-4 h-4 text-brand-gold" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.22em]">
                    {t("home.news_front.most_read")}
                  </h3>
                </div>
                <ol className="divide-y divide-border flex-1">
                  {mostRead.map((article: any, idx: number) => (
                    <li key={article._id}>
                      <Link
                        to={`/news/${article.slug || article._id}`}
                        className="flex gap-4 p-4 hover:bg-muted/50 transition-colors group"
                      >
                        <span className="font-heading text-3xl font-black text-primary/30 group-hover:text-primary transition-colors leading-none w-8 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          {article.sector && (
                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary block mb-1">
                              {article.sector}
                            </span>
                          )}
                          <p className="font-serif text-[15px] font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                            {getLocalized(article.title, lang)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
                <Link
                  to="/news"
                  className="block px-5 py-3 text-center bg-muted/40 border-t border-border text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {t("home.news_front.view_all")}
                </Link>
              </div>
            </aside>

            {/* Secondaires */}
            {secondaries.length > 0 && (
              <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-2 border-t border-primary/15">
                {secondaries.map((article: any, idx: number) => (
                  <motion.article
                    key={article._id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.45 }}
                  >
                    <Link
                      to={`/news/${article.slug || article._id}`}
                      className="group block"
                    >
                      <div className="aspect-[16/10] bg-muted overflow-hidden rounded-lg shadow-md mb-4">
                        <img
                          src={
                            article.imageUrl
                              ? resolveImageUrl(article.imageUrl)
                              : IMAGE_FALLBACK
                          }
                          alt={getLocalized(article.title, lang)}
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                        {article.sector && <span>{article.sector}</span>}
                        {article.publishedAt && (
                          <>
                            <span aria-hidden className="opacity-30">·</span>
                            <span className="text-muted-foreground">
                              {formatArticleDate(article.publishedAt, lang)}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                        {getLocalized(article.title, lang)}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {getLocalized(article.excerpt, lang)}
                        </p>
                      )}
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Liste minimale sous most-read */}
            {tertiaries.length > 0 && (
              <aside className="col-span-12 lg:col-span-4 pt-2 lg:pt-0">
                <div className="bg-muted/30 border border-border rounded-xl p-5">
                  <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-foreground mb-4 pb-3 border-b border-border">
                    <Newspaper className="w-3.5 h-3.5 text-primary" />
                    {t("home.news_front.brief_heading")}
                  </h3>
                  <ul className="space-y-3.5">
                    {tertiaries.map((article: any) => (
                      <li key={article._id}>
                        <Link
                          to={`/news/${article.slug || article._id}`}
                          className="group block"
                        >
                          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary block mb-1">
                            {article.sector || t("home.news_front.opinion_default_tag")}
                          </span>
                          <p className="font-serif text-sm font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                            {getLocalized(article.title, lang)}
                          </p>
                          {article.publishedAt && (
                            <span className="text-[10px] text-muted-foreground mt-1 block">
                              {formatArticleDate(article.publishedAt, lang)}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        )}

        {/* Grille « Les autres titres » */}
        {!isLoading && news.length > 6 && (
          <div className="mt-12 md:mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-7 pb-3 border-b border-primary/30">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground tracking-tight">
                {t("home.news_front.section_more")}
              </h3>
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-primary hover:text-brand-gold-dark transition-colors"
              >
                {t("home.news_front.view_all")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {news.slice(6, 14).map((article: any, idx: number) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: Math.min(idx * 0.04, 0.32),
                    duration: 0.45,
                  }}
                >
                  <Link
                    to={`/news/${article.slug || article._id}`}
                    className={cn(
                      "group flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border",
                      "shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300",
                    )}
                  >
                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      <img
                        src={
                          article.imageUrl
                            ? resolveImageUrl(article.imageUrl)
                            : IMAGE_FALLBACK
                        }
                        alt={getLocalized(article.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary mb-1.5">
                        {article.sector || t("home.news_front.opinion_default_tag")}
                      </span>
                      <h4 className="font-serif text-base font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors flex-1">
                        {getLocalized(article.title, lang)}
                      </h4>
                      {article.publishedAt && (
                        <span className="text-[10px] text-muted-foreground mt-2">
                          {formatArticleDate(article.publishedAt, lang)}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 md:gap-8">
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <Skeleton className="aspect-[16/9] rounded-xl w-full" />
        <Skeleton className="h-10 w-4/5 rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
