import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Headphones, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import {
  getLocalized,
  handleImageError,
  ViewportSection,
  extractYoutubeId,
  SCALE_IN,
} from "./_shared";

/**
 * 5. MULTIMEDIA HUB (videos + podcasts)
 * Redesigned with 21:9 hero, gold halos, and inline playback.
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
  const [playingHero, setPlayingHero] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const heroVideo = videoItems[0];
  const heroYtId = extractYoutubeId(heroVideo?.embedUrl);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <ViewportSection
      id="multimedia"
      variants={SCALE_IN}
      className="py-6 sm:py-8 md:py-10 bg-gradient-to-b from-brand-dark via-[#061a10] to-brand-dark text-primary-foreground"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.04),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-5 pb-3 border-b border-brand-gold/20">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.28em] text-brand-gold mb-1 block">
              DGIA TV & EXCELLENCE
            </span>
            <h2 className="font-heading text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              {t("home.multimedia.title")} Hub
            </h2>
          </div>
          <Link
            to="/multimedia"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 active:scale-95 self-start sm:self-auto"
          >
            {t("home.multimedia.view_all") || "Tout le multimédia"} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-3 sm:gap-4">
          <div className="lg:col-span-9 space-y-3 sm:space-y-4">
            {videoItems.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  className="group relative rounded-xl overflow-hidden aspect-[21/9] bg-black cursor-pointer ring-1 ring-brand-gold/40 max-h-[320px] shadow-[0_18px_45px_-15px_rgba(0,0,0,0.7),0_0_30px_-10px_color-mix(in_oklch,var(--brand-gold)_55%,transparent)] hover:shadow-[0_22px_55px_-15px_rgba(0,0,0,0.8),0_0_45px_-5px_color-mix(in_oklch,var(--brand-gold)_75%,transparent)] hover:-translate-y-1 transition-all duration-500"
                  onClick={() => heroYtId && setPlayingHero(true)}
                >
                  {playingHero && heroYtId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${heroYtId}?autoplay=1&rel=0`}
                      title={getLocalized(heroVideo.title, lang)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <div className="block w-full h-full">
                      {heroVideo.coverImageUrl ? (
                        <img
                          src={resolveImageUrl(heroVideo.coverImageUrl)}
                          alt={getLocalized(heroVideo.title, lang)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                          onError={handleImageError}
                        />
                      ) : heroYtId ? (
                        <img
                          src={`https://img.youtube.com/vi/${heroYtId}/maxresdefault.jpg`}
                          alt={getLocalized(heroVideo.title, lang)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-deep via-primary to-brand-emerald/40 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-gold rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ring-4 ring-white/20">
                          <Play className="w-5 h-5 md:w-6 md:h-6 text-brand-dark ml-1 fill-brand-dark" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 p-3 sm:p-4 md:p-5">
                        <h3 className="font-heading text-sm sm:text-lg md:text-xl font-black text-white mb-1 group-hover:text-brand-gold transition-colors uppercase tracking-tight italic line-clamp-1">
                          "{getLocalized(heroVideo.title, lang)}"
                        </h3>
                        <p className="text-[11px] sm:text-xs text-white italic font-medium max-w-2xl line-clamp-1">
                          {getLocalized(heroVideo.description, lang)}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Horizontally scrollable video thumbnails */}
                <div className="relative group/scroll">
                  <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-brand-gold/90 rounded-full flex items-center justify-center text-brand-dark shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:scale-110 -ml-3">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-brand-gold/90 rounded-full flex items-center justify-center text-brand-dark shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:scale-110 -mr-3">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                    {videoItems.slice(1).map((v: any, i: number) => {
                      const ytId = extractYoutubeId(v.embedUrl);
                      return (
                        <motion.div
                          key={v._id || i}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false }}
                          transition={{ delay: i * 0.06 }}
                          className="min-w-[200px] sm:min-w-[220px] max-w-[260px] flex-shrink-0 snap-start"
                        >
                          <Link to="/multimedia" className="group block">
                            <div className="aspect-video rounded-lg overflow-hidden bg-white/5 border border-brand-gold/30 hover:border-brand-gold relative mb-1.5 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.6)] hover:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.7)] transition-all duration-300 group-hover:-translate-y-1">
                              {v.coverImageUrl ? (
                                <img src={resolveImageUrl(v.coverImageUrl)} alt={getLocalized(v.title, lang)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImageError} />
                              ) : ytId ? (
                                <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt={getLocalized(v.title, lang)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImageError} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-brand-emerald/10"><Play className="w-5 h-5 text-white/30" /></div>
                              )}
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ring-2 ring-white/20">
                                  <Play className="w-3 h-3 text-brand-dark fill-brand-dark ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <h4 className="text-[10px] sm:text-[11px] font-black text-white group-hover:text-brand-gold transition-colors line-clamp-2 uppercase tracking-tight italic">
                              {getLocalized(v.title, lang)}
                            </h4>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-sm text-white italic">
                  {t("home.multimedia.no_videos") || "Aucune capsule vidéo indexée."}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 h-full">
            <div className="bg-white/[0.07] border border-brand-gold/30 rounded-2xl p-3 sm:p-4 h-full flex flex-col backdrop-blur-md shadow-[0_18px_45px_-15px_rgba(0,0,0,0.6),0_0_22px_-10px_color-mix(in_oklch,var(--brand-gold)_45%,transparent)] relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-[80px]" />

              <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className="p-1.5 bg-brand-gold/20 rounded-md border border-brand-gold/40">
                  <Headphones className="w-3.5 h-3.5 text-brand-gold" />
                </div>
                <h3 className="text-[9px] font-black uppercase tracking-[0.28em] text-white">
                  {t("home.multimedia.podcasts") || "Podcasts & Audios"}
                </h3>
              </div>

              <Link
                to="/multimedia"
                className="mb-3 flex items-center justify-center gap-2 w-full py-2 bg-brand-gold text-brand-dark rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-brand-gold/30 relative z-10 active:scale-[0.98]"
              >
                {t("home.multimedia.all_audios")}
              </Link>

              <div className="space-y-2 flex-1 relative z-10 overflow-y-auto">
                {podcastItems.length > 0 ? (
                  podcastItems.slice(0, 4).map((p: any, i: number) => (
                    <motion.div
                      key={p._id || i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to="/multimedia"
                        className={cn(
                          "group flex items-center gap-2.5 p-2 rounded-xl transition-all border hover:-translate-y-0.5",
                          i === 0
                            ? "bg-white/15 border-brand-gold/50 shadow-[0_10px_22px_-10px_rgba(0,0,0,0.5),0_0_16px_-8px_color-mix(in_oklch,var(--brand-gold)_60%,transparent)]"
                            : "bg-white/5 border-brand-gold/20 hover:bg-white/10 hover:border-brand-gold/40 shadow-[0_8px_18px_-10px_rgba(0,0,0,0.45),0_0_10px_-8px_color-mix(in_oklch,var(--brand-gold)_40%,transparent)] hover:shadow-[0_10px_22px_-10px_rgba(0,0,0,0.55),0_0_16px_-6px_color-mix(in_oklch,var(--brand-gold)_55%,transparent)]",
                        )}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ring-1",
                            i === 0
                              ? "bg-brand-gold shadow-md ring-brand-gold/40"
                              : "bg-white/10 group-hover:bg-brand-gold/30 ring-brand-gold/20",
                          )}
                        >
                          <Volume2
                            className={cn(
                              "w-3 h-3",
                              i === 0 ? "text-brand-dark" : "text-white",
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-black text-white truncate group-hover:text-brand-gold transition-colors uppercase tracking-tight italic">
                            {getLocalized(p.title, lang)}
                          </p>
                          <p className="text-[8px] font-semibold uppercase tracking-widest text-white/80 mt-0.5">
                            {32 + i * 4} min · Audio
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-white italic text-center py-8">
                    {t("home.multimedia.no_podcasts")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}
