import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import {
  getLocalized,
  handleImageError,
  Skeleton,
  ViewportSection,
  SCALE_IN,
} from "./_shared";

/**
 * 3. PUBLICATIONS & REVUES
 * Full viewport-fit redesign with 16:9 hero and 2x2 secondary grid.
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
      variants={SCALE_IN}
      className="py-5 sm:py-7 md:py-8 border-y border-border bg-[linear-gradient(135deg,_#f7efdc_0%,_#fbf6e7_45%,_#f3e6c4_100%)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in oklch, var(--brand-gold) 60%, transparent) 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, color-mix(in oklch, var(--brand-gold-dark) 50%, transparent) 0 1px, transparent 1px 22px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in oklch, var(--brand-gold) 18%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, color-mix(in oklch, var(--brand-deep) 12%, transparent) 0%, transparent 55%)",
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
            <h2 className="font-serif text-base leading-[1.15] sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground tracking-tight text-balance">
              {t("home.kiosk.headline_main")}{" "}
              <span className="italic text-primary">
                {t("home.kiosk.headline_accent")}
              </span>
            </h2>
            <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed max-w-xl">
              {t("home.kiosk.subtitle")}
            </p>
          </div>
          <Link
            to="/revue"
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary hover:text-primary/80 transition-colors self-start md:self-end whitespace-nowrap"
          >
            {t("home.kiosk.view_all")}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {magazinesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <Skeleton className="lg:col-span-6 aspect-[4/3] rounded-2xl" />
            <div className="lg:col-span-6 grid grid-cols-2 gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
              ))}
            </div>
          </div>
        ) : magazines && magazines.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <Link
              to="/revue"
              className="lg:col-span-6 group relative bg-card rounded-2xl overflow-hidden ring-1 ring-border/60 shadow-[0_22px_50px_-18px_rgba(13,77,51,0.35),0_8px_20px_-10px_rgba(0,0,0,0.18)] hover:shadow-[0_30px_70px_-20px_rgba(13,77,51,0.5),0_12px_28px_-10px_rgba(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="aspect-[16/9] lg:aspect-[16/10] bg-muted overflow-hidden relative">
                {magazines[0].coverImageUrl ? (
                  <img
                    src={resolveImageUrl(magazines[0].coverImageUrl)}
                    alt={getLocalized(magazines[0].title, lang)}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary via-brand-deep to-brand-forest flex items-center justify-center p-8">
                    <BookOpen className="w-14 h-14 text-brand-gold/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5">
                <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-brand-gold mb-0.5 italic">
                  {magazines[0].issue || "MAGAZINE"} ·{" "}
                  {magazines[0].date || new Date().getFullYear()}
                </p>
                <h3 className="font-serif text-xs sm:text-sm md:text-base font-semibold text-white leading-[1.15] tracking-tight mb-0.5 text-balance line-clamp-2">
                  {getLocalized(magazines[0].title, lang)}
                </h3>
                <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.18em] text-white group-hover:text-brand-gold transition-colors">
                  {t("home.kiosk.read_edition")}
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            <div className="lg:col-span-6 grid grid-cols-2 gap-2 sm:gap-2.5">
              {magazines.slice(1, 5).map((mag: any, idx: number) => (
                <Link
                  key={mag._id}
                  to="/revue"
                  className="group relative bg-card rounded-lg overflow-hidden ring-1 ring-border/50 shadow-[0_14px_30px_-14px_rgba(13,77,51,0.30),0_6px_14px_-8px_rgba(0,0,0,0.15)] hover:shadow-[0_22px_45px_-15px_rgba(13,77,51,0.45),0_10px_20px_-8px_rgba(0,0,0,0.22)] hover:-translate-y-1 hover:ring-primary/30 transition-all"
                >
                  <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                    {mag.coverImageUrl ? (
                      <img
                        src={resolveImageUrl(mag.coverImageUrl)}
                        alt={getLocalized(mag.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                        onError={handleImageError}
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          idx % 2 === 0
                            ? "bg-gradient-to-br from-brand-gold/30 to-brand-gold-dark/20"
                            : "bg-gradient-to-br from-primary/20 to-brand-emerald/10"
                        }`}
                      >
                        <BookOpen className="w-5 h-5 text-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-1 sm:p-1.5">
                    <h4 className="font-serif text-[9px] sm:text-[10px] font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
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
              {t("home.kiosk.no_publications") || "Aucune publication disponible."}
            </p>
          </div>
        )}
      </div>
    </ViewportSection>
  );
}

