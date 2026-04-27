import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal, Lock, ArrowRight } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

export default function DataComparatorPage() {
  const { t } = useTranslation();

  return (
    <HubSubpageShell
      badgeIcon={SlidersHorizontal}
      badgeLabel={t("pages.data.blocks.comparator_title")}
      titleLead={t("pages.data.comparator.hero_title_lead")}
      titleBrand={t("pages.data.comparator.hero_title_brand")}
      subtitle={t("pages.data.comparator.subtitle")}
      contentMaxWidthClass="max-w-4xl"
    >
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
    </HubSubpageShell>
  );
}
