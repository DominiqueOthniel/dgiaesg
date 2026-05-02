import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { IssueCover } from "@/components/revue/IssueCover";
import { resolveImageUrl } from "@/lib/image";
import { getLatestIssue } from "@/lib/revue-mock-data";
import type { MonthlyReview } from "@/hooks/useMagazines";
import { cn } from "@/lib/utils";
import { getLocalized, handleImageError, Skeleton } from "./_shared";

function pickLatestMag(mags: MonthlyReview[]) {
  if (!mags.length) return undefined;
  return [...mags].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  )[0];
}

/**
 * Bloc vedette « revue principale » : deux colonnes (texte + stats | couverture 3D).
 */
export function RevuePrincipalHero({
  lang,
  magazines,
  fallbackMagazines,
  loading,
}: {
  lang: string;
  magazines: MonthlyReview[];
  fallbackMagazines: MonthlyReview[];
  loading: boolean;
}) {
  const { t } = useTranslation();
  const latestMock = useMemo(() => getLatestIssue(), []);
  const heroMag = useMemo(() => {
    const primary = pickLatestMag(magazines);
    if (primary) return primary;
    return pickLatestMag(fallbackMagazines);
  }, [magazines, fallbackMagazines]);

  const locale = lang === "en" ? "en-GB" : "fr-FR";
  const formatMonth = (iso: string | undefined) => {
    if (!iso) return "";
    try {
      return new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(new Date(iso));
    } catch {
      return "";
    }
  };

  const coverUrl = heroMag?.coverImageUrl
    ? resolveImageUrl(heroMag.coverImageUrl)
    : null;
  const heroTitle = heroMag ? getLocalized(heroMag.title, lang) : latestMock.title;
  const heroMonth = formatMonth(heroMag?.publishDate ?? latestMock.publishDate);
  const pageCount = latestMock.pageCount;
  const issueNum =
    heroMag && typeof heroMag.issue !== "undefined" && heroMag.issue !== ""
      ? String(heroMag.issue).padStart(2, "0")
      : String(latestMock.number).padStart(2, "0");
  const issueLink = `/revue/numeros/${latestMock.slug}`;

  const stats = [
    {
      num: t("home.revue_hero.stat_pages_num", "50"),
      label: t("home.revue_hero.stat_pages", "pages d'analyses"),
    },
    {
      num: t("home.revue_hero.stat_issues_num", "12"),
      label: t("home.revue_hero.stat_issues", "numéros par an"),
    },
    {
      num: t("home.revue_hero.stat_editorial_num", "100%"),
      label: t(
        "home.revue_hero.stat_editorial",
        "rédaction éditoriale africaine",
      ),
    },
  ];

  return (
    <section
      aria-labelledby="revue-principal-heading"
      className="relative w-full max-w-[100vw] min-w-0 overflow-x-hidden py-12 md:py-20 text-primary-foreground bg-[linear-gradient(135deg,#052a1c_0%,#0a3d2a_42%,#041910_100%)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 78% 38%, hsl(152 45% 22% / 0.55) 0%, transparent 52%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.12)_0%,transparent_35%,transparent_65%,rgba(0,0,0,.2)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-white/85 to-white" />

      <div className="relative max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
          <div className="order-2 lg:order-1 space-y-6 min-w-0">
            <p className="inline-flex rounded-full border border-white/15 bg-black/25 px-3 py-1.5 uppercase text-[10px] font-black tracking-[0.24em] text-[#ffe08a]">
              {t(
                "home.revue_hero.badge",
                "Toute l'actu durabilité",
              )}
            </p>

            <h2
              id="revue-principal-heading"
              className="font-sans text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-[1.08] tracking-tight"
            >
              <span className="text-white">
                {t(
                  "home.revue_hero.title_white",
                  "La Revue Durabilité Afrique —",
                )}
              </span>{" "}
              <span className="text-[#ffe08a]">
                {t(
                  "home.revue_hero.title_gold",
                  "la référence mensuelle.",
                )}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              {t(
                "home.revue_hero.description",
                "Chaque mois, 50 pages d'analyses exclusives, de portraits de leaders, de données et de tendances sur la durabilité en Afrique. Le magazine de référence pour les professionnels engagés.",
              )}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                to="/abonnement"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark shadow-lg shadow-brand-gold/25 hover:brightness-110 transition-all"
              >
                {t("home.revue_hero.subscribe", "S'abonner")}
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/revue/numeros"
                className="inline-flex items-center justify-center rounded-full border border-white/80 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-colors"
              >
                {t("home.revue_hero.all_issues", "Voir tous les numéros")}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-2 border-t border-white/12">
              {stats.map((s) => (
                <p
                  key={s.label}
                  className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 leading-snug min-w-0"
                >
                  <span className="text-[#ffe08a] font-black text-lg sm:text-xl tabular-nums tracking-normal">
                    {s.num}
                  </span>{" "}
                  {s.label}
                </p>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-end justify-center min-w-0">
            {loading ? (
              <Skeleton className="aspect-[3/4] w-[min(100%,280px)] max-w-[320px] rounded-[1.25rem] bg-white/10" />
            ) : coverUrl ? (
              <Link
                to="/revue/numeros"
                className="group block w-full max-w-[300px] md:max-w-[320px] [perspective:1400px]"
              >
                <div
                  className={cn(
                    "[transform:rotateY(-14deg)_rotateX(5deg)] transition-transform duration-500",
                    "group-hover:[transform:rotateY(-10deg)_rotateX(3deg)_translateY(-6px)]",
                  )}
                >
                  <div className="magazine-cover relative aspect-[3/4] overflow-hidden ring-1 ring-brand-gold/35">
                    <img
                      src={coverUrl}
                      alt={heroTitle}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-brand-deep/25" />
                    <div className="relative z-10 flex h-full flex-col p-[7%]">
                      <div className="flex justify-between items-start border-b border-white/20 pb-3 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/90">
                          DGIAESG
                        </span>
                        <span className="text-right text-[11px] font-black uppercase tracking-wider text-white/95">
                          {t("home.revue_hero.issue_label", "Numéro")}{" "}
                          {issueNum}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-black text-white leading-tight text-xl sm:text-2xl [text-shadow:0_4px_18px_rgba(0,0,0,0.45)]">
                          {heroTitle}
                        </p>
                      </div>
                      <div className="mt-auto flex justify-end pt-4">
                        <span className="rounded-lg bg-brand-gold px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark shadow-md">
                          {t("home.revue_hero.discover", "Découvrir")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                to={issueLink}
                className="group block w-full max-w-[300px] md:max-w-[320px] [perspective:1400px]"
              >
                <div
                  className={cn(
                    "[transform:rotateY(-14deg)_rotateX(5deg)] transition-transform duration-500",
                    "group-hover:[transform:rotateY(-10deg)_rotateX(3deg)_translateY(-6px)]",
                  )}
                >
                  <IssueCover
                    issue={latestMock}
                    size="lg"
                    float={false}
                    footerActionLabel={t(
                      "home.revue_hero.discover",
                      "Découvrir",
                    )}
                  />
                </div>
              </Link>
            )}

            <p className="mt-5 text-center lg:text-right text-[11px] font-bold uppercase tracking-[0.2em] text-white/65 w-full max-w-[320px]">
              {heroMonth && (
                <>
                  {heroMonth}
                  {" · "}
                </>
              )}
              {t("home.revue_hero.pages_suffix", { n: pageCount })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
