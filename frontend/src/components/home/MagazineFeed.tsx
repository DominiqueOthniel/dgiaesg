import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SearchX,
  Sparkles,
} from "lucide-react";
import type { MagazineIssue } from "@/lib/revue-types";
import { cn } from "@/lib/utils";
import { getLocalized, Skeleton } from "./_shared";

type CoverAccent = MagazineIssue["coverAccent"];

/** Cartes type couverture : lisibilité + proportion magazine-cover (3:4). */
const CARD_BOX =
  "w-[min(82vw,216px)] min-w-[min(82vw,216px)] shrink-0 sm:w-[198px] sm:min-w-[198px] md:w-[218px] md:min-w-[218px] lg:w-[248px] lg:min-w-[248px]";

const SLIDER_FALLBACK: { gradient: string; accent: CoverAccent }[] = [
  {
    gradient:
      "from-[hsl(var(--brand-deep))] via-[hsl(var(--brand-forest))] to-[hsl(var(--brand-emerald)/0.62)]",
    accent: "gold",
  },
  {
    gradient:
      "from-[hsl(200_70%_18%)] via-[hsl(180_55%_22%)] to-[hsl(var(--brand-emerald)/0.52)]",
    accent: "emerald",
  },
  {
    gradient:
      "from-[hsl(35_48%_15%)] via-[hsl(30_58%_26%)] to-[hsl(var(--brand-gold)/0.52)]",
    accent: "gold",
  },
  {
    gradient:
      "from-[hsl(var(--brand-dark))] via-[hsl(145_42%_20%)] to-[hsl(78_38%_38%)]",
    accent: "emerald",
  },
];

const ACCENT: Record<CoverAccent, string> = {
  gold: "hsl(var(--brand-gold))",
  emerald: "hsl(var(--brand-emerald))",
  deep: "hsl(var(--brand-deep))",
};

function isPremium(mag: { featured?: boolean }) {
  return Boolean(mag.featured);
}

function deriveGlyph(title: string, idx: number) {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const a = words[0][0] ?? "";
    const b = words[1][0] ?? "";
    return (a + b).toUpperCase().slice(0, 2);
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return String(idx + 1).padStart(2, "0");
}

function cardVisualsForMagazine(
  mag: { excerpt?: { fr?: string; en?: string } },
  title: string,
  idx: number,
  lang: string,
): {
  gradient: string;
  tagline: string;
  glyph: string;
  pageCount: number;
  accent: CoverAccent;
} {
  const fb = SLIDER_FALLBACK[idx % SLIDER_FALLBACK.length];
  const excerpt = mag.excerpt;
  const tag =
    excerpt && typeof excerpt === "object"
      ? (lang.startsWith("en") ? excerpt.en : excerpt.fr) || ""
      : "";
  return {
    gradient: fb.gradient,
    tagline: tag.slice(0, 120) || "",
    glyph: deriveGlyph(title, idx),
    pageCount: 48,
    accent: fb.accent,
  };
}

function formatCaptionStrip(iso: string | undefined, locale: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    })
      .format(d)
      .toUpperCase();
  } catch {
    return "";
  }
}

/** Ligne mois sous N° : date localisée. */
function headerMonthLine(
  publishDate: string | undefined,
  locale: string,
) {
  return formatCaptionStrip(publishDate, locale);
}

/**
 * Slider « Derniers numéros » : fond clair, cartes dégradé + glyphe (comme IssueCover), animations hover / entrée.
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
  const easeOut = [0.22, 1, 0.36, 1] as const;

  const scrollMag = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(el.offsetWidth * 0.55, 240);
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full max-w-[100vw] min-w-0 overflow-x-hidden border-t border-border/60 bg-background py-14 md:py-20 text-foreground">
      {/* Rayures diagonales légères */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, hsl(var(--muted) / 0.35) 0 1px, transparent 1px 28px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
              {t("home.news_front.latest_issues_kicker", "Derniers numéros")}
            </p>
            <h2 className="font-sans text-2xl font-black tracking-tight text-foreground md:text-3xl lg:text-[2.15rem] lg:leading-[1.15]">
              {t("home.news_front.latest_issues_title", "Quatre numéros,")}{" "}
              <span className="text-[hsl(var(--brand-forest))]">
                {t(
                  "home.news_front.latest_issues_title_em",
                  "quatre angles forts.",
                )}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground md:inline">
              {magazines.length}/{totalCount}
            </span>
            <Link
              to="/revue/numeros"
              className="group/arch inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground transition-colors hover:text-[hsl(var(--brand-forest))]"
            >
              {t(
                "home.news_front.latest_issues_archive",
                "Voir l'archive complète",
              )}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/arch:translate-x-1" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden pb-2 md:gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className={cn(
                  "aspect-[3/4] shrink-0 rounded-2xl bg-muted",
                  CARD_BOX,
                )}
              />
            ))}
          </div>
        ) : magazines.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <SearchX className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="mb-1 text-base font-semibold text-foreground">
              {t(
                "home.news_front.no_revue_results",
                "Aucun numéro ne correspond.",
              )}
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
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-forest))] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-md transition hover:brightness-110"
              >
                {t("common.reset", "Réinitialiser")}
              </button>
            )}
          </div>
        ) : (
          <div className="group/mag-scroll relative">
            <button
              type="button"
              aria-label={t("common.previous", "Précédent")}
              onClick={() => scrollMag("left")}
              className="absolute left-0 top-[38%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background text-foreground shadow-md ring-1 ring-black/5 transition-all hover:scale-105 hover:border-[hsl(var(--brand-gold)/0.45)] hover:text-[hsl(var(--brand-forest))] md:-ml-2 md:opacity-0 md:group-hover/mag-scroll:opacity-100 lg:-ml-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={t("common.next", "Suivant")}
              onClick={() => scrollMag("right")}
              className="absolute right-0 top-[38%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background text-foreground shadow-md ring-1 ring-black/5 transition-all hover:scale-105 hover:border-[hsl(var(--brand-gold)/0.45)] hover:text-[hsl(var(--brand-forest))] md:-mr-2 md:opacity-0 md:group-hover/mag-scroll:opacity-100 lg:-mr-3"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={scrollRef}
              className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-1 pb-3 pt-1 touch-pan-x md:gap-6"
            >
              {magazines.map((mag: any, idx: number) => {
                const title = getLocalized(mag.title, lang);
                const { gradient, tagline, glyph, pageCount, accent } = cardVisualsForMagazine(
                  mag,
                  title,
                  idx,
                  lang,
                );
                const subtitle =
                  tagline ||
                  t(
                    "home.news_front.magazine_slider_tagline",
                    "Analyses, données et décryptages pour décider.",
                  );
                const premium = isPremium(mag);
                const issueNumRaw =
                  typeof mag.issue !== "undefined" && mag.issue !== ""
                    ? mag.issue
                    : idx + 1;
                const issueNumStr = String(issueNumRaw).padStart(2, "0");
                const captionDate = formatCaptionStrip(mag.publishDate, locale);
                const monthHeader = headerMonthLine(mag.publishDate, locale);

                return (
                  <motion.div
                    key={mag._id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-24px" }}
                    transition={{
                      delay: Math.min(idx * 0.09, 0.45),
                      duration: 0.58,
                      ease: easeOut,
                    }}
                    className={cn("flex snap-start flex-col", CARD_BOX)}
                  >
                    <Link
                      to={`/revue/numeros/${mag._id}`}
                      className="group block min-h-0 w-full rounded-[1.25rem] outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="magazine-cover h-full w-full">
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-br",
                            gradient,
                          )}
                        />
                        <div className="magazine-spine" />

                        {premium && (
                          <div className="pointer-events-none absolute right-[7%] top-[7%] z-30">
                            <div className="flex items-center gap-1 rounded-lg border border-white/80 bg-gradient-to-br from-cyan-100 via-sky-50 to-cyan-200 px-2 py-1 shadow-[0_10px_24px_-6px_rgba(8,80,120,0.35)] ring-1 ring-cyan-400/35">
                              <Sparkles className="h-2.5 w-2.5 shrink-0 animate-pulse text-cyan-900" />
                              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-950">
                                {t(
                                  "home.news_front.magazine_slider_premium",
                                  "Premium",
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div
                          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center font-black text-white opacity-[0.08]"
                          style={{
                            fontSize: "clamp(2.5rem, 13vw, 4rem)",
                            fontWeight: 900,
                          }}
                          aria-hidden
                        >
                          {glyph}
                        </div>

                        <div className="relative z-[2] flex h-full select-none flex-col p-[8%]">
                          <div className="mb-3 flex items-start justify-between gap-2 border-b border-white/20 pb-3">
                            <div className="min-w-0 space-y-0.5">
                              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white opacity-90 sm:text-[9px]">
                                {t(
                                  "home.news_front.magazine_slider_brand",
                                  "DGIAESG",
                                )}
                              </p>
                              <p className="text-[7px] font-medium uppercase tracking-[0.15em] text-white/70 sm:text-[8px]">
                                {t(
                                  "home.news_front.magazine_brand_sub",
                                  "Afrique durable",
                                )}
                              </p>
                            </div>
                            {!premium && (
                              <div className="shrink-0 text-right">
                                <p className="text-[11px] font-black tabular-nums text-white/90">
                                  N°{issueNumStr}
                                </p>
                                <p className="text-[7px] font-bold uppercase tracking-wider text-white/55">
                                  {monthHeader ||
                                    captionDate ||
                                    "—"}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center py-2">
                            <motion.h3
                              initial={{ opacity: 0, x: -6 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                delay: 0.05 + Math.min(idx * 0.06, 0.3),
                                duration: 0.45,
                                ease: easeOut,
                              }}
                              className="mb-2 line-clamp-4 text-[11px] font-black leading-[1.12] text-white [text-shadow:0_4px_14px_rgba(0,0,0,0.35)] sm:text-xs"
                            >
                              {title}
                            </motion.h3>
                            <div
                              className="mb-2 h-1 w-10 shrink-0 rounded-full"
                              style={{ backgroundColor: ACCENT[accent] }}
                            />
                            <p className="line-clamp-2 text-[8px] font-medium leading-snug text-white/82 sm:text-[9px]">
                              {subtitle}
                            </p>
                          </div>

                          <div className="relative z-10 mt-auto flex items-end justify-between gap-2 border-t border-white/15 pt-3">
                            <div className="min-w-0 space-y-0.5">
                              <p className="text-[7px] font-black uppercase tracking-[0.25em] text-white sm:text-[8px] uppercase">
                                {t(
                                  "home.news_front.magazine_footer_exclusive",
                                  "Exclusif",
                                )}
                              </p>
                              <p className="text-[6px] font-bold uppercase tracking-widest text-white/60 sm:text-[7px] uppercase">
                                {t(
                                  "home.news_front.magazine_footer_pages",
                                  "{{count}} pages d'analyse",
                                  { count: pageCount },
                                )}
                              </p>
                            </div>
                            <div
                              className="shrink-0 rounded-lg px-3 py-1.5 text-[7px] font-black uppercase tracking-[0.2em] text-black shadow-md transition hover:brightness-110 sm:text-[8px]"
                              style={{
                                backgroundColor: ACCENT[accent],
                              }}
                            >
                              {t(
                                "home.news_front.magazine_relevance",
                                "RELEVANCE",
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-3 space-y-1 px-0.5 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--brand-gold-dark))]">
                        {captionDate}
                      </p>
                      <p className="line-clamp-2 text-[13px] font-bold leading-snug text-foreground">
                        {title}
                      </p>
                    </div>
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
