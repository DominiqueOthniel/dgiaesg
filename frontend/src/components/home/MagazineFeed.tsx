import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  SearchX,
  Star,
} from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { getLocalized, handleImageError, Skeleton } from "./_shared";

/** Largeurs fixes pour un slider lisible (~2 cartes sur petit écran, plus sur grand). */
const CARD_BOX =
  "w-[min(46vw,168px)] min-w-[min(46vw,168px)] shrink-0 sm:w-[156px] sm:min-w-[156px] md:w-[172px] md:min-w-[172px] lg:w-[188px] lg:min-w-[188px]";

/**
 * Liste filtrable des magazines / numéros — présentée en slider horizontal.
 */
export function MagazineFeed({
  magazines,
  loading,
  lang,
  totalCount,
  onResetFilters,
}: {
  magazines: any[];
  loading: boolean;
  lang: string;
  totalCount: number;
  onResetFilters?: () => void;
}) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const locale = lang === "en" ? "en-GB" : "fr-FR";
  const formatMonth = (iso: string | undefined) => {
    if (!iso) return "";
    try {
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        year: "numeric",
      }).format(new Date(iso));
    } catch {
      return "";
    }
  };

  const scrollMag = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(el.offsetWidth * 0.55, 180);
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-12 md:py-16 w-full max-w-[100vw] min-w-0 overflow-x-hidden bg-[linear-gradient(135deg,_#0d3322_0%,_#0a2a1a_55%,_#061a10_100%)] text-primary-foreground">
      <div className="pointer-events-none absolute -top-32 -left-24 w-[440px] h-[440px] rounded-full bg-brand-gold/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 w-[440px] h-[440px] rounded-full bg-brand-emerald/15 blur-[140px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,.4) 0 1px, transparent 1px 18px), repeating-linear-gradient(-45deg, rgba(255,255,255,.3) 0 1px, transparent 1px 26px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-3 pb-4 mb-8 border-b border-white/15">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold block mb-2">
              {t("home.news_front.revue_kicker", "La Revue")}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
              {t("home.news_front.magazine_title", "Le magazine")}{" "}
              <span className="italic text-white/65">
                {t("home.news_front.magazine_em", "et ses numéros.")}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
              {magazines.length}/{totalCount}
            </span>
            <Link
              to="/revue/numeros"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.18em] hover:brightness-110 transition-all shadow-lg shadow-brand-gold/20"
            >
              {t("home.news_front.revue_view_all", "Voir tous les numéros")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-hidden pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className={cn(
                  "aspect-[3/4] flex-shrink-0 rounded-lg bg-white/5",
                  CARD_BOX,
                )}
              />
            ))}
          </div>
        ) : magazines.length === 0 ? (
          <div className="text-center py-16">
            <SearchX className="w-10 h-10 text-white/30 mx-auto mb-4" />
            <p className="text-base font-semibold text-white mb-1">
              {t(
                "home.news_front.no_revue_results",
                "Aucun numéro ne correspond.",
              )}
            </p>
            <p className="text-sm text-white/55">
              {t(
                "home.news_front.no_results_hint",
                "Essayez d'autres filtres ou réinitialisez la recherche.",
              )}
            </p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold text-brand-dark text-[11px] font-black uppercase tracking-[0.18em] hover:brightness-110 transition-all shadow-md"
              >
                {t("common.reset", "Réinitialiser")}
              </button>
            )}
          </div>
        ) : (
          <div className="relative group/mag-scroll">
            <button
              type="button"
              aria-label={t("common.previous", "Précédent")}
              onClick={() => scrollMag("left")}
              className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gold text-brand-dark shadow-lg ring-2 ring-black/10 transition-all hover:scale-110 hover:brightness-110 sm:h-10 sm:w-10 md:-ml-2 lg:-ml-3 opacity-95 md:opacity-0 md:group-hover/mag-scroll:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={t("common.next", "Suivant")}
              onClick={() => scrollMag("right")}
              className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gold text-brand-dark shadow-lg ring-2 ring-black/10 transition-all hover:scale-110 hover:brightness-110 sm:h-10 sm:w-10 md:-mr-2 lg:-mr-3 opacity-95 md:opacity-0 md:group-hover/mag-scroll:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={scrollRef}
              className="scrollbar-hide flex gap-3 overflow-x-auto overscroll-x-contain pb-3 pt-1 snap-x snap-mandatory touch-pan-x px-1 -mx-1"
            >
              {magazines.map((mag: any, idx: number) => {
                const cover = mag.coverImageUrl
                  ? resolveImageUrl(mag.coverImageUrl)
                  : null;
                const monthLabel = formatMonth(mag.publishDate);
                const issueNum =
                  typeof mag.issue !== "undefined" && mag.issue !== ""
                    ? mag.issue
                    : idx + 1;
                return (
                  <motion.div
                    key={mag._id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      delay: Math.min(idx * 0.03, 0.2),
                      duration: 0.4,
                    }}
                    className={cn("snap-start", CARD_BOX)}
                  >
                    <Link
                      to="/revue/numeros"
                      className="group block h-full relative"
                    >
                      <div className="aspect-[3/4] h-full rounded-lg overflow-hidden bg-white/5 ring-1 ring-brand-gold/30 shadow-2xl transition-all duration-500 hover:ring-brand-gold hover:-translate-y-1 relative">
                        {cover ? (
                          <img
                            src={cover}
                            alt={getLocalized(mag.title, lang)}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-deep via-brand-emerald/30 to-brand-gold/15">
                            <BookOpen className="w-10 h-10 text-brand-gold/55" />
                          </div>
                        )}
                        <span className="absolute bottom-14 left-2 font-heading text-lg font-black text-white/90 drop-shadow-md tabular-nums">
                          {issueNum}
                        </span>
                        {mag.featured && (
                          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-brand-gold text-brand-dark px-2 py-1 rounded text-[8px] font-black uppercase tracking-[0.18em] shadow-md">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {t("home.news_front.featured", "À la une")}
                          </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                          {monthLabel && (
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-1 inline-flex items-center gap-1.5 capitalize">
                              <Calendar className="w-2.5 h-2.5 shrink-0" />
                              {monthLabel}
                            </p>
                          )}
                          <p className="font-serif text-xs font-semibold text-white leading-snug line-clamp-2">
                            {getLocalized(mag.title, lang)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
