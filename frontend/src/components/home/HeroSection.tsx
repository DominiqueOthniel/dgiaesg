import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleImageError, getLocalized } from "./_shared";

const SLIDE_IMAGES = ["/img/hero_image.jpg", "/img/hero_image2.jpg"];

type SlideContent = {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
};

/**
 * 0. HERO SECTION (Includes News Ticker)
 * This combines the Hero slideshow and the ticker strip to count as one section.
 */
export function HeroSection({ news, lang }: { news: any[]; lang: string }) {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo((): SlideContent[] => {
    const raw = t("home.hero.slides", { returnObjects: true });
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return (raw as Omit<SlideContent, "image">[]).map((s, i) => ({
      ...s,
      image: SLIDE_IMAGES[i] ?? SLIDE_IMAGES[0],
    }));
  }, [t, lang]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(
      () => setActiveSlide((p) => (p + 1) % slides.length),
      6000,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlide] ?? slides[0];
  if (!slide) return null;

  return (
    <>
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${activeSlide}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-primary/40 opacity-90 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.04),transparent)] z-[1]" />

        <div
          className="absolute inset-0 opacity-[0.03] z-[1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${activeSlide}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-primary-foreground/10 backdrop-blur-sm px-5 py-2 rounded-full border border-primary-foreground/15 mb-8 md:mb-10"
            >
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/90 leading-none">
                {slide.badge}
              </span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${activeSlide}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.08] mb-6 tracking-tight">
                {slide.title}
                <br />
                <span className="italic text-brand-gold">{slide.highlight}</span>
              </h1>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${activeSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base sm:text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/labels"
              className="inline-flex items-center gap-2.5 bg-brand-gold text-brand-gold-foreground px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-brand-gold/20 hover:shadow-2xl active:scale-[0.98]"
            >
              {t("home.hero.cta_labels")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/directory"
              className="inline-flex items-center gap-2.5 border border-primary-foreground/25 text-primary-foreground px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-foreground/10 transition-all backdrop-blur-sm shadow-xl"
            >
              <ShieldCheck className="w-4 h-4" />
              {t("home.hero.cta_directory")}
            </Link>
          </div>

          <div className="flex justify-center gap-3 mt-10 md:mt-14">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  activeSlide === i
                    ? "w-10 bg-brand-gold"
                    : "w-4 bg-primary-foreground/20 hover:bg-primary-foreground/40"
                }`}
                aria-label={t("home.hero.slide_indicator", { n: i + 1 })}
              />
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/30 z-[2]"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      <div className="bg-primary py-2.5 overflow-hidden relative z-30">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12">
              {news.slice(0, 5).map((item: any) => (
                <Link
                  key={`${idx}-${item._id}`}
                  to={`/news/${item.slug || item._id}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-black text-primary-foreground/50 uppercase tracking-widest">
                    {item.sector}
                  </span>
                  <span className="text-sm font-bold text-primary-foreground/80 group-hover:text-accent transition-colors">
                    {getLocalized(item.title, lang)}
                  </span>
                </Link>
              ))}
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                  {t("home.hero.ticker_badge")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
