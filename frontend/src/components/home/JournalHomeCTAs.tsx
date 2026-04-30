import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, BookMarked, CreditCard, PenLine } from "lucide-react";
import { ViewportSection, FADE_UP } from "./_shared";

/**
 * Appels à l'action sous la une éditoriale (revue, abonnement, contributions).
 */
export function JournalHomeCTAs() {
  const { t } = useTranslation();

  const cards = [
    {
      to: "/revue/numeros",
      icon: BookMarked,
      title: t("home.journal.cta_revue_title"),
      desc: t("home.journal.cta_revue_desc"),
      btn: t("home.journal.cta_revue_btn"),
      accent: "from-brand-gold/25 via-brand-gold/10 to-transparent",
      ring: "ring-brand-gold/35",
    },
    {
      to: "/abonnement",
      icon: CreditCard,
      title: t("home.journal.cta_sub_title"),
      desc: t("home.journal.cta_sub_desc"),
      btn: t("home.journal.cta_sub_btn"),
      accent: "from-primary/20 via-primary/8 to-transparent",
      ring: "ring-primary/30",
    },
    {
      to: "/contribuer",
      icon: PenLine,
      title: t("home.journal.cta_contrib_title"),
      desc: t("home.journal.cta_contrib_desc"),
      btn: t("home.journal.cta_contrib_btn"),
      accent: "from-brand-emerald/25 via-brand-emerald/10 to-transparent",
      ring: "ring-brand-emerald/35",
    },
  ];

  return (
    <ViewportSection
      id="journal-cta"
      variants={FADE_UP}
      className="py-10 md:py-14 bg-gradient-to-b from-muted/40 via-background to-muted/25 border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            {t("home.journal.cta_band_kicker")}
          </span>
          <h2 className="font-serif text-xl md:text-3xl font-semibold text-foreground mt-2 tracking-tight">
            {t("home.journal.cta_band_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <Link
                to={card.to}
                className={`group flex flex-col h-full rounded-2xl border border-border bg-card p-6 md:p-7 shadow-lg shadow-black/[0.04] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-1 ${card.ring} bg-gradient-to-br ${card.accent}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-background/90 ring-1 ring-border shadow-sm">
                    <card.icon className="w-5 h-5 text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-lg font-bold text-foreground uppercase italic tracking-tight leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary group-hover:gap-3 transition-all">
                  {card.btn}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </ViewportSection>
  );
}
