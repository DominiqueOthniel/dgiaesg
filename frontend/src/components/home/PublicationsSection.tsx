import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import {
  getLocalized,
  handleImageError,
  Skeleton,
  ViewportSection,
} from "./_shared";

/**
 * 3. PUBLICATIONS & REVUES
 * Featured magazine + 2x2 grid. Vertical padding tightened so the whole layout fits md+ viewports.
 */
export function PublicationsSection({
  magazines,
  magazinesLoading,
}: {
  magazines: any[] | undefined;
  magazinesLoading: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <ViewportSection
      id="publications"
      className="py-8 sm:py-10 md:py-14 bg-gradient-to-b from-surface-warm via-background to-surface-warm border-y border-border"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, hsl(var(--primary)) 0, transparent 40%), radial-gradient(circle at 90% 90%, hsl(var(--brand-gold)) 0, transparent 40%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-5 mb-5 sm:mb-7">
          <div className="max-w-2xl min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-primary/40" />
              <BookOpen className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-primary">
                {t("home.kiosk.title")}
              </span>
            </div>
            <h2 className="font-serif text-[1.15rem] leading-[1.15] sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight text-balance">
              Publications & Revues{" "}
              <span className="italic text-primary">Mensuelles</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              {t("home.kiosk.subtitle")}
            </p>
          </div>
          <Link
            to="/kiosk"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary hover:text-primary/80 transition-colors self-start md:self-end whitespace-nowrap"
          >
            {t("home.kiosk.view_all")}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {magazinesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Skeleton className="lg:col-span-5 aspect-[16/10] lg:h-[400px] rounded-2xl" />
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
              ))}
            </div>
          </div>
        ) : magazines && magazines.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <Link
              to="/kiosk"
              className="lg:col-span-5 group relative bg-card rounded-2xl overflow-hidden ring-1 ring-border/60 shadow-[0_20px_50px_-20px_rgba(13,77,51,0.25)] hover:shadow-[0_30px_70px_-25px_rgba(13,77,51,0.40)] hover:-translate-y-1.5 transition-all duration-500 lg:max-h-[460px]"
            >
              <div className="aspect-[16/9] sm:aspect-[16/10] lg:aspect-auto lg:h-full bg-muted overflow-hidden">
                {magazines[0].coverImageUrl ? (
                  <img
                    src={resolveImageUrl(magazines[0].coverImageUrl)}
                    alt={getLocalized(magazines[0].title, lang)}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center p-8">
                    <BookOpen className="w-16 h-16 text-primary/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold mb-1.5 italic">
                  {magazines[0].issue || "MAGAZINE"} ·{" "}
                  {magazines[0].date || new Date().getFullYear()}
                </p>
                <h3 className="font-serif text-lg sm:text-2xl md:text-3xl font-semibold text-white leading-[1.15] tracking-tight mb-2 text-balance">
                  {getLocalized(magazines[0].title, lang)}
                </h3>
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-white group-hover:text-brand-gold transition-colors">
                  Lire l'édition
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-5">
              {magazines.slice(1, 5).map((mag: any) => (
                <Link
                  key={mag._id}
                  to="/kiosk"
                  className="group relative bg-card rounded-xl overflow-hidden ring-1 ring-border/50 shadow-[0_12px_30px_-15px_rgba(13,77,51,0.20)] hover:shadow-[0_20px_45px_-15px_rgba(13,77,51,0.35)] hover:-translate-y-1 hover:ring-primary/20 transition-all"
                >
                  <div className="aspect-[4/5] sm:aspect-video lg:aspect-[4/5] bg-muted overflow-hidden relative">
                    {mag.coverImageUrl ? (
                      <img
                        src={resolveImageUrl(mag.coverImageUrl)}
                        alt={getLocalized(mag.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <BookOpen className="w-6 h-6 text-primary/10" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h4 className="font-serif text-sm sm:text-base font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {getLocalized(mag.title, lang)}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl">
            <p className="text-sm font-medium text-muted-foreground">
              Aucune publication disponible.
            </p>
          </div>
        )}
      </div>
    </ViewportSection>
  );
}
