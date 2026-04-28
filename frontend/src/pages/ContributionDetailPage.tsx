import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { cn, getLocalized } from "@/lib/utils";
import { CONTRIBUTIONS } from "@/lib/contributions-mock-data";

export default function ContributionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const item = CONTRIBUTIONS.find((c) => c.slug === slug);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-foreground mb-2">{t("pages.contributions.not_found_title")}</h2>
        <p className="text-sm text-foreground/70 mb-6">{t("pages.contributions.not_found_body")}</p>
        <Link to="/contributions" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
          ← {t("pages.contributions.back_to_list")}
        </Link>
      </div>
    );
  }

  const published = new Date(item.publishedAt);

  return (
    <HubSubpageShell
      badgeIcon={Tag}
      badgeLabel={t("pages.contributions.detail_badge")}
      sectionsKicker={t("pages.contributions.sections_kicker")}
      titleLead={getLocalized(item.title, lang)}
      titleBrand={t("pages.contributions.detail_brand")}
      subtitle={`${item.category} · ${item.format}`}
      beforeBadge={
        <Link
          to="/contributions"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm transition-colors hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {t("pages.contributions.back_to_list")}
        </Link>
      }
      heroFooter={
        <div className="flex flex-wrap items-center gap-3">
          {item.featured ? (
            <span className="inline-flex items-center gap-2 rounded-xl border border-brand-gold/40 bg-brand-gold/20 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-brand-gold backdrop-blur-sm">
              <Tag className="h-4 w-4" /> À la une
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-brand-gold" />
            {published.toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80 backdrop-blur-sm">
            <Clock className="h-4 w-4 text-brand-gold" />
            {item.readingMinutes} min
          </span>
        </div>
      }
      contentMaxWidthClass="max-w-6xl"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-primary/20 md:p-10"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl opacity-60" />
            <div className="pointer-events-none absolute -left-14 -bottom-14 h-56 w-56 rounded-full bg-brand-gold/10 blur-3xl opacity-50" />
            <p className="text-sm leading-relaxed text-foreground/75 whitespace-pre-line">
              {getLocalized(item.content, lang)}
            </p>
          </motion.article>
        </div>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:border-primary/20">
            <div className="border-b border-border/60 px-6 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
                {t("pages.contributions.about_author")}
              </p>
            </div>
            <div className="px-6 py-5 space-y-2">
              <p className="text-base font-extrabold text-foreground">{item.authorName}</p>
              {item.authorRole ? (
                <p className="text-sm text-foreground/70">{item.authorRole}</p>
              ) : null}
              {item.authorOrg ? (
                <p className="text-sm font-bold text-foreground/75">{item.authorOrg}</p>
              ) : null}
              {(item.city || item.country) ? (
                <p className="text-xs text-foreground/65">
                  {[item.city, item.country].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:border-primary/20">
            <div className="border-b border-border/60 px-6 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
                {t("pages.contributions.metadata")}
              </p>
            </div>
            <div className="px-6 py-5 space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground/70">{t("pages.contributions.category")}</span>
                <span className="font-bold text-foreground">{item.category}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground/70">{t("pages.contributions.format")}</span>
                <span className="font-bold text-foreground">{item.format}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tg) => (
                  <span
                    key={tg}
                    className={cn(
                      "rounded-xl border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-bold text-foreground/70"
                    )}
                  >
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </HubSubpageShell>
  );
}

