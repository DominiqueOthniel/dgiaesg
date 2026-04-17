import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Headphones,
  Play,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import {
  getLocalized,
  handleImageError,
  ViewportSection,
} from "./_shared";

/**
 * 5. MULTIMEDIA HUB (videos + podcasts)
 */
export function MultimediaSection({
  videoItems,
  podcastItems,
}: {
  videoItems: any[];
  podcastItems: any[];
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <ViewportSection
      id="multimedia"
      className="py-12 md:py-16 bg-brand-dark text-primary-foreground"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.03),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-6 z-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-primary-foreground/10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2 block">
              DGIA TV & EXCELLENCE
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-primary-foreground tracking-tight uppercase">
              {t("home.multimedia.title")} Hub
            </h2>
          </div>
          <Link
            to="/multimedia"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            Tout le multimédia <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-5">
            {videoItems.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative rounded-2xl overflow-hidden aspect-video bg-foreground/20 cursor-pointer shadow-3xl shadow-black/40 ring-1 ring-white/10 max-h-[360px]"
                >
                  <Link to="/multimedia" className="block w-full h-full">
                    {videoItems[0].coverImageUrl ? (
                      <img
                        src={resolveImageUrl(videoItems[0].coverImageUrl)}
                        alt={getLocalized(videoItems[0].title, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-dark flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ring-4 ring-white/10">
                        <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1.5 fill-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-5 md:p-8">
                      <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-brand-gold transition-colors uppercase tracking-tight italic">
                        "{getLocalized(videoItems[0].title, lang)}"
                      </h3>
                      <p className="text-sm text-white/70 italic font-medium max-w-2xl line-clamp-1">
                        {getLocalized(videoItems[0].description, lang)}
                      </p>
                    </div>
                  </Link>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                  {videoItems.slice(1, 4).map((v: any, i: number) => (
                    <motion.div
                      key={v._id || i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to="/multimedia" className="group block">
                        <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 relative mb-3 shadow-xl">
                          {v.coverImageUrl ? (
                            <img
                              src={resolveImageUrl(v.coverImageUrl)}
                              alt={getLocalized(v.title, lang)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-white/10" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-[12px] font-black text-white group-hover:text-brand-gold transition-colors line-clamp-2 uppercase tracking-tight italic">
                          {getLocalized(v.title, lang)}
                        </h4>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-sm text-white/40 italic">
                  Aucune capsule vidéo indexée.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 h-full">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 lg:p-6 h-full flex flex-col backdrop-blur-md shadow-2xl relative overflow-hidden group/sidebar">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-[80px]" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Headphones className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                  Podcasts & Audios
                </h3>
              </div>

              <Link
                to="/multimedia"
                className="mb-6 flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 relative z-10 active:scale-[0.98]"
              >
                Tous les audios
              </Link>

              <div className="space-y-3 flex-1 relative z-10">
                {podcastItems.length > 0 ? (
                  podcastItems.slice(0, 4).map((p: any, i: number) => (
                    <motion.div
                      key={p._id || i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to="/multimedia"
                        className={cn(
                          "group flex items-center gap-4 p-3 rounded-2xl transition-all border border-transparent shadow-sm",
                          i === 0
                            ? "bg-white/10 border-white/10 shadow-xl"
                            : "hover:bg-white/5 hover:border-white/5",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                            i === 0
                              ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                              : "bg-white/5 group-hover:bg-emerald-500/20",
                          )}
                        >
                          <Play
                            className={cn(
                              "w-4 h-4 fill-current",
                              i === 0 ? "text-white" : "text-emerald-400",
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-black text-white truncate group-hover:text-brand-gold transition-colors uppercase tracking-tight italic">
                            {getLocalized(p.title, lang)}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-white/30 italic py-10 text-center">
                    Aucun podcast archivé.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between opacity-40 group-hover/sidebar:opacity-100 transition-opacity">
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">
                  DGIA HUB
                </span>
                <TrendingUp className="w-4 h-4 text-brand-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}
