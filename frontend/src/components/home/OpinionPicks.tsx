import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { getLocalized } from "./_shared";

/**
 * Bande sombre « Opinions & Analyses » : tribune éditoriale + 3 cartes auteur.
 */
export function OpinionPicks({ news, lang }: { news: any[]; lang: string }) {
  const { t } = useTranslation();
  const picks = news.slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <section className="relative py-14 md:py-20 bg-brand-dark text-primary-foreground overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-brand-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-brand-emerald/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8 md:mb-10 pb-4 border-b border-white/15">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-gold block mb-2">
              {t("home.news_front.opinion_kicker")}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
              {t("home.news_front.opinion_title")}{" "}
              <span className="italic text-white/65">
                {t("home.news_front.opinion_em")}
              </span>
            </h2>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-brand-gold hover:text-white transition-colors"
          >
            {t("home.news_front.opinion_view_all")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {picks.map((article: any, idx: number) => (
            <motion.article
              key={article._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-7 hover:border-brand-gold/40 hover:bg-white/[0.06] transition-all"
            >
              <Quote className="absolute top-5 right-5 w-7 h-7 text-brand-gold/35" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
                {article.sector || t("home.news_front.opinion_default_tag")}
              </span>
              <Link
                to={`/news/${article.slug || article._id}`}
                className="block mt-3"
              >
                <h3 className="font-serif text-xl md:text-2xl font-semibold leading-snug text-white tracking-tight group-hover:text-brand-gold transition-colors">
                  {getLocalized(article.title, lang)}
                </h3>
                {article.excerpt && (
                  <p className="mt-3 text-sm text-white/70 line-clamp-3 leading-relaxed">
                    {getLocalized(article.excerpt, lang)}
                  </p>
                )}
              </Link>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {article.author || t("home.news_front.opinion_default_author")}
                </span>
                <Link
                  to={`/news/${article.slug || article._id}`}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold hover:gap-2 transition-all"
                >
                  {t("home.news_front.read_full")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
