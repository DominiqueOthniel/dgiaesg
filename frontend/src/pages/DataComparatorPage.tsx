import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, Lock, ArrowRight } from "lucide-react";

export default function DataComparatorPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.065] [background:radial-gradient(circle_at_15%_14%,hsl(var(--brand-emerald))_0%,transparent_35%),radial-gradient(circle_at_86%_72%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5">
            <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("pages.data.blocks.comparator_title")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-[1.05]">
            {t("pages.data.comparator.title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.data.comparator.subtitle")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 z-10">
          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 md:p-8 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-75 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
            <h2 className="text-lg font-extrabold tracking-tight text-foreground mb-6">
              {t("pages.data.comparator.preview_title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-4 shadow-[0_16px_35px_-28px_rgba(0,0,0,0.8)]">
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">{t("pages.data.comparator.country")}</p>
                <p className="text-sm text-muted-foreground">Maroc vs Kenya</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-4 shadow-[0_16px_35px_-28px_rgba(0,0,0,0.8)]">
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">{t("pages.data.comparator.dimension")}</p>
                <p className="text-sm text-muted-foreground">Climat, Gouvernance, Inclusion</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-5">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-brand-gold-dark mt-0.5" />
                <div>
                  <h3 className="text-base font-extrabold tracking-tight text-foreground">
                    {t("pages.data.comparator.premium_title")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("pages.data.comparator.premium_desc")}</p>
                  <Link
                    to="/pricing"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    {t("pages.data.comparator.premium_cta")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
