import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Play,
  Headphones,
  Calendar,
  Building2,
  Globe,
  ChevronRight,
  TrendingUp,
  Zap,
  ChevronDown,
  Mail,
  MapPin,
  Search
} from "lucide-react";
import { useLabels } from "@/hooks/useLabels";
import { useNews } from "@/hooks/useNews";
import { useCompanies } from "@/hooks/useCompanies";
import { useEvents } from "@/hooks/useEvents";
import { useMagazines } from "@/hooks/useMagazines";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import type { LocalizedString } from "@/types";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

function getLocalized(val: LocalizedString | undefined | null, lang: string): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val["fr"] || val["en"] || "";
}

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.target as HTMLImageElement;
  if (target.src !== IMAGE_FALLBACK) target.src = IMAGE_FALLBACK;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-muted", className)} />
);

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  actionHref,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border">
    <div className="flex items-start gap-3">
      <div className="p-2.5 bg-primary/10 rounded-xl mt-0.5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
    {action && actionHref && (
      <Link
        to={actionHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0"
      >
        {action}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    )}
  </div>
);

const slides = [
  {
    badge: "Standard d'Excellence Africain",
    title: "L'Excellence Africaine,",
    highlight: "Certifiée.",
    subtitle: "Propulsez votre impact ESG grâce à notre plateforme de certification panafricaine de classe mondiale.",
    image: "/img/hero_image.jpg"
  },
  {
    badge: "Gouvernance & Transparence",
    title: "Bâtir la confiance,",
    highlight: "Ensemble.",
    subtitle: "Des protocoles d'audit rigoureux et des normes ISO pour connecter les organisations d'excellence aux investisseurs mondiaux.",
    image: "/img/hero_image2.jpg"
  },
];

function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: labels, isLoading: labelsLoading } = useLabels();
  const { data: newsData } = useNews({ page: 1, limit: 12 });
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ limit: 6, status: "certified" });
  const { data: events, isLoading: eventsLoading } = useEvents({ limit: 6, featured: true });
  const { data: magazines, isLoading: magazinesLoading } = useMagazines();

  const news = newsData?.data || [];
  const companies = companiesData?.data || [];

  const { data: multimediaData } = useQuery({
    queryKey: ["homepage-multimedia"],
    queryFn: async () => {
      const res = await api.get("/multimedia?limit=12&published=true");
      return res.data.data || [];
    },
  });

  const { data: latestNewsletter } = useQuery({
    queryKey: ["latest-newsletter"],
    queryFn: async () => {
      const res = await api.get("/newsletter/latest");
      return res.data.data;
    },
  });

  const multimedia = multimediaData || [];
  const videoItems = multimedia.filter((m: any) => m.type === "video");
  const podcastItems = multimedia.filter((m: any) => m.type === "audio");

  const [activeSector, setActiveSector] = useState("ESG");
  const [email, setEmail] = useState("");

  /* Hero slideshow timer callback */
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];

  /* Mission section observer */
  const missionRef = useRef<HTMLDivElement>(null);
  const [missionVisible, setMissionVisible] = useState(false);
  useEffect(() => {
    const el = missionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMissionVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  
  const [featuredIdx, setFeaturedIdx] = useState(0);
  useEffect(() => {
    if (!news || news.length < 2) return;
    const t = setInterval(
      () => setFeaturedIdx((i) => (i + 1) % Math.min(news.length, 5)),
      5000
    );
    return () => clearInterval(t);
  }, [news?.length]);

  return (
    <div className="flex flex-col">
      {/* ═══════════ 0. HERO SECTION (UPGRADED) ═══════════ */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-dark">
        {/* Sliding Background Images */}
        <AnimatePresence mode="wait">
           <motion.div
             key={`bg-${activeSlide}`}
             initial={{ opacity: 0, scale: 1.1 }}
             animate={{ opacity: 0.4, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="absolute inset-0 z-0"
           >
             <img src={slide.image} alt="" className="w-full h-full object-cover" onError={handleImageError} />
           </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-primary/40 opacity-90 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.04),transparent)] z-[1]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] z-[1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${activeSlide}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-primary-foreground/10 backdrop-blur-sm px-5 py-2 rounded-full border border-primary-foreground/15 mb-10"
            >
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/90 leading-none">
                {slide.badge}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Title */}
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

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${activeSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base sm:text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/labels"
              className="inline-flex items-center gap-2.5 bg-brand-gold text-brand-gold-foreground px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-brand-gold/20 hover:shadow-2xl active:scale-[0.98]"
            >
              Découvrir nos Labels
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/directory"
              className="inline-flex items-center gap-2.5 border border-primary-foreground/25 text-primary-foreground px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-foreground/10 transition-all backdrop-blur-sm shadow-xl"
            >
              <ShieldCheck className="w-4 h-4" />
              Consulter le Registre
            </Link>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-3 mt-14">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  activeSlide === i
                    ? "w-10 bg-brand-gold"
                    : "w-4 bg-primary-foreground/20 hover:bg-primary-foreground/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/30 z-[2]"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ═══════════ REAL-TIME NEWS TICKER ═══════════ */}
      <div className="bg-primary py-2.5 overflow-hidden relative z-30">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12">
              {news.slice(0, 5).map((item: any) => (
                <Link key={`${idx}-${item._id}`} to={`/news/${item.slug || item._id}`} className="flex items-center gap-3 group">
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
                  DIRECTIVE ESG 2024 ACTIVÉE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ 1. VISION & MISSION + CERTIFIED COMPANIES ═══════════ */}
      <section className="py-16 md:py-20 relative overflow-hidden border-b border-border bg-gradient-to-br from-surface-warm via-background to-primary/5">
        {/* Decorative blurred blobs (emerald + gold) */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand-emerald/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 w-[480px] h-[480px] rounded-full bg-brand-gold/15 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Mission */}
            <div className="lg:col-span-8">
              <div
                ref={missionRef}
                className="h-full bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/15 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px] group-hover:bg-brand-gold/20 transition-colors duration-1000" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={missionVisible ? { width: 40 } : { width: 0 }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-[2px] bg-gradient-to-r from-primary to-brand-emerald rounded-full"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      {t("home.mission.title")}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter leading-[1.05] mb-6 max-w-2xl uppercase italic">
                    Le Portail Panafricain de l'Excellence{" "}
                    <span className="bg-gradient-to-r from-primary via-brand-emerald to-brand-gold-dark bg-clip-text text-transparent italic">
                      Certifiée.
                    </span>
                  </h2>

                  <p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-8 font-medium">
                    {t("home.mission.text")}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { text: "Certification ESG Global Standard", icon: ShieldCheck, tone: "primary" },
                      { text: "Architecture de Gouvernance ISO", icon: Building2, tone: "emerald" },
                      { text: "Accès au Capital Institutionnel", icon: Globe, tone: "gold" },
                    ].map((item, i) => {
                      const tones: Record<string, string> = {
                        primary: "bg-primary/5 border-primary/20 text-primary",
                        emerald: "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald",
                        gold: "bg-brand-gold/10 border-brand-gold/40 text-brand-gold-dark",
                      };
                      return (
                        <li key={i} className="flex items-center gap-3">
                          <div className={cn("p-1 px-3 rounded-full border", tones[item.tone])}>
                            <span className="text-[10px] font-black uppercase tracking-wider">{item.text}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div
                    className="flex flex-wrap gap-3 transition-all duration-700"
                    style={{
                      opacity: missionVisible ? 1 : 0,
                      transform: missionVisible ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    <Link
                      to="/labels"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-brand-emerald text-primary-foreground px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/25 active:scale-95"
                    >
                      Nos Portails <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Certified Companies Sidebar — white text, gold borders, elevated */}
            <div className="lg:col-span-4">
              <div className="h-full bg-gradient-to-br from-brand-dark via-primary to-brand-forest rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-2xl shadow-black/30 border border-brand-gold/30 ring-1 ring-brand-gold/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-emerald/20 rounded-full blur-[80px]" />

                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-2 bg-brand-gold/20 rounded-xl border border-brand-gold/30">
                    <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {t("home.companies.title")}
                  </h3>
                </div>

                <div className="space-y-3 relative z-10 flex-1 overflow-hidden">
                  {companiesLoading ? (
                    [1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-xl" />)
                  ) : companies.length > 0 ? (
                    companies.slice(0, 3).map((company: any) => (
                      <Link
                        key={company._id}
                        to={`/directory/${company._id}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-brand-gold/40 shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-brand-gold/30 hover:bg-white/10 hover:border-brand-gold hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group/item"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 shrink-0 shadow-lg group-hover/item:rotate-3 transition-transform">
                          {company.logoUrl ? (
                            <img
                              src={resolveImageUrl(getLocalized(company.logoUrl, lang))}
                              onError={handleImageError}
                              className="w-full h-full object-contain"
                              alt={getLocalized(company.name, lang)}
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider truncate group-hover/item:text-brand-gold transition-colors">
                            {getLocalized(company.name, lang)}
                          </h4>
                          <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                            {getLocalized(company.sector, lang) || "Secteur"}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-gold/60 group-hover/item:text-brand-gold group-hover/item:translate-x-1 transition-all" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-white/40 italic text-center py-8">No records indexed.</p>
                  )}
                </div>

                <div className="mt-6 relative z-10">
                  <Link
                    to="/directory"
                    className="flex items-center justify-between w-full p-4 bg-brand-gold text-brand-gold-foreground rounded-xl hover:brightness-110 hover:shadow-2xl hover:shadow-brand-gold/40 transition-all shadow-xl shadow-brand-gold/30 group/btn"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest block leading-none">Registre Global</span>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. INTELLIGENCE ÉDITORIALE (NEWS) — REDESIGNED 2.0 ═══════════ */}
      <section className="relative py-6 sm:py-10 md:py-14 overflow-hidden bg-[#0a2a1a]">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-brand-emerald/10 blur-[120px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Header — compact, refined typography */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-5 mb-4 sm:mb-6 md:mb-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-3 h-3 text-brand-gold shrink-0" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                  Intelligence Éditoriale
                </span>
              </div>
              <h2 className="font-serif text-[1.15rem] leading-[1.15] sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight text-balance">
                L'actualité décryptée{" "}
                <span className="italic text-white/70">
                  des leaders africains
                </span>
              </h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] hover:brightness-110 transition-all shadow-lg shadow-brand-gold/20 shrink-0 self-start md:self-end"
            >
              Tous les articles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {news.length === 0 ? (
            <p className="text-center text-white/50 py-12">Aucun article pour le moment.</p>
          ) : (
            <>
              {/* ── Featured carousel (auto-rotating) ───────────────────── */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/60 mb-4 sm:mb-6 h-[200px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
                <AnimatePresence mode="wait">
                  {news.slice(0, 5).map((article: any, idx: number) =>
                    idx === featuredIdx ? (
                      <motion.div
                        key={article._id || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                      >
                        <Link
                          to={`/news/${article.slug || article._id}`}
                          className="relative block w-full h-full group"
                        >
                          <div className="absolute inset-0 z-0">
                            {article.imageUrl ? (
                              <img
                                src={resolveImageUrl(article.imageUrl)}
                                alt={getLocalized(article.title, lang)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="w-full h-full bg-brand-dark" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 lg:p-12 z-10">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              {article.sector && (
                                <span className="inline-flex items-center bg-brand-gold text-brand-dark px-2.5 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em]">
                                  {article.sector}
                                </span>
                              )}
                              {article.publishedAt && (
                                <span className="text-[9px] sm:text-[10px] font-semibold text-white/80 uppercase tracking-[0.18em]">
                                  {new Date(article.publishedAt).toLocaleDateString(lang || "fr", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-[1.15] tracking-tight mb-2 sm:mb-3 max-w-3xl text-balance group-hover:text-brand-gold transition-colors">
                              {getLocalized(article.title, lang)}
                            </h3>

                            <p className="hidden sm:block text-xs md:text-sm text-white/75 line-clamp-2 max-w-2xl leading-relaxed">
                              {getLocalized(article.excerpt, lang)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ) : null
                  )}
                </AnimatePresence>

                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 md:top-8 md:right-8 flex gap-1.5 z-20">
                  {news.slice(0, 5).map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setFeaturedIdx(i)}
                      aria-label={`Article ${i + 1}`}
                      className={cn(
                        "h-1 sm:h-1.5 rounded-full transition-all duration-500",
                        i === featuredIdx
                          ? "w-6 sm:w-8 bg-brand-gold"
                          : "w-3 sm:w-4 bg-white/25 hover:bg-white/45"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Secondary articles row — compact cards */}
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth -mx-4 px-4 scrollbar-hide">
                {news.slice(1).map((article: any) => (
                  <Link
                    key={article._id}
                    to={`/news/${article.slug || article._id}`}
                    className="snap-start shrink-0 w-[150px] sm:w-[200px] md:w-[240px] group/card bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/25 ring-1 ring-brand-gold/10 rounded-lg overflow-hidden shadow-xl shadow-black/30 hover:-translate-y-1.5 hover:ring-brand-gold/60 hover:shadow-2xl hover:shadow-brand-gold/25 hover:border-brand-gold transition-all duration-300"
                  >
                    <div className="aspect-[16/10] bg-white/5 overflow-hidden">
                      {article.imageUrl ? (
                        <img
                          src={resolveImageUrl(article.imageUrl)}
                          alt={getLocalized(article.title, lang)}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 sm:p-3">
                      {article.sector && (
                        <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-brand-gold block mb-1">
                          {article.sector}
                        </span>
                      )}
                      <h4 className="font-serif text-[12px] sm:text-[13px] font-medium text-white leading-snug line-clamp-2 group-hover/card:text-brand-gold transition-colors">
                        {getLocalized(article.title, lang)}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══════════ 3. PUBLICATIONS & REVUES (REDESIGNED) ═══════════ */}
      <section className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-b from-surface-warm via-background to-surface-warm border-y border-border overflow-hidden">
        {/* Subtle decorative wash */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, hsl(var(--primary)) 0, transparent 40%), radial-gradient(circle at 90% 90%, hsl(var(--brand-gold)) 0, transparent 40%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial header — compact */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-5 mb-5 sm:mb-8 md:mb-10">
            <div className="max-w-2xl min-w-0">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="h-px w-6 bg-primary/40" />
                <BookOpen className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-primary">
                  {t("home.kiosk.title")}
                </span>
              </div>
              <h2 className="font-serif text-[1.15rem] leading-[1.15] sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight text-balance">
                 Publications & Revues <span className="italic text-primary">Mensuelles</span>
              </h2>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
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
               <Skeleton className="lg:col-span-5 aspect-[16/10] lg:h-[450px] rounded-2xl" />
               <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-[4/5] rounded-xl" />)}
               </div>
            </div>
          ) : magazines && magazines.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Featured publication — larger, "floating" card */}
              <Link
                to="/kiosk"
                className="lg:col-span-5 group relative bg-card rounded-2xl overflow-hidden ring-1 ring-border/60 shadow-[0_20px_50px_-20px_rgba(13,77,51,0.25)] hover:shadow-[0_30px_70px_-25px_rgba(13,77,51,0.40)] hover:-translate-y-1.5 transition-all duration-500"
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

                <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold text-brand-gold-foreground text-[9px] font-bold uppercase tracking-[0.18em] shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-foreground/70" />
                    Édition du mois
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm bg-black/30 rounded-full px-2.5 py-1 border border-white/10">
                    {magazines[0].tag || "Nouveauté"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold mb-1.5 sm:mb-2 italic">
                    {magazines[0].issue || "MAGAZINE"} · {magazines[0].date || new Date().getFullYear()}
                  </p>
                  <h3 className="font-serif text-lg sm:text-2xl md:text-3xl font-semibold text-white leading-[1.15] tracking-tight mb-2 sm:mb-3 text-balance">
                    {getLocalized(magazines[0].title, lang)}
                  </h3>
                  <p className="hidden sm:block text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2 mb-3 sm:mb-4 max-w-md">
                    {getLocalized(magazines[0].excerpt, lang)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-white group-hover:text-brand-gold transition-colors">
                    Lire l'édition
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>

              {/* Secondary publications — 2x2 elevated cards */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-5">
                {magazines.slice(1, 5).map((mag: any) => (
                  <Link
                    key={mag._id}
                    to="/kiosk"
                    className="group relative bg-card rounded-xl overflow-hidden ring-1 ring-border/50 shadow-[0_12px_30px_-15px_rgba(13,77,51,0.20)] hover:shadow-[0_20px_45px_-15px_rgba(13,77,51,0.35)] hover:-translate-y-1 hover:ring-primary/20 transition-all duration-400"
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
                      {/* Interactive overlay */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                            <BookOpen className="w-4 h-4" />
                         </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-primary">
                          {mag.tag || "Édition"}
                        </span>
                        <span className="text-[8px] font-medium text-muted-foreground uppercase">
                           {mag.date || "2024"}
                        </span>
                      </div>
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
               <p className="text-sm font-medium text-muted-foreground">Aucune publication disponible.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ 4. CERTIFIED ENTERPRISES (ANNUAIRE REDESIGN) ═══════════ */}
      <section className="py-16 md:py-20 bg-background border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sector Sidebar (Trimmed per guide) */}
            <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
              {/* Data Central Gateway */}
              <div className="p-6 border border-border rounded-2xl bg-muted/30 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Accès DATA Direct</h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-5 font-bold">
                  Accédez à l'index exhaustif de l'économie africaine certifiée.
                </p>
                <Link
                  to="/directory"
                  className="flex items-center justify-center w-full py-3.5 bg-brand-gold text-brand-gold-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-brand-gold/10"
                >
                  Ouvrir le Registre
                </Link>
              </div>

              {/* Sectors */}
              <div className="p-4">
                 <h3 className="text-[10px] font-black text-foreground mb-4 uppercase tracking-[0.3em] opacity-60">Data Par Secteur</h3>
                 <div className="space-y-1">
                    {[
                      { name: "ESG & FINANCE", count: 124, icon: TrendingUp, key: "Finance" },
                      { name: "CSR & GOVERNANCE", count: 86, icon: ShieldCheck, key: "Gouvernance" },
                      { name: "TECH & SUSTAINABLE", count: 54, icon: Globe, key: "Tech" },
                      { name: "ENERGY & BIO", count: 42, icon: Zap, key: "Énergie" },
                      { name: "LEADERSHIP & IMPACT", count: 31, icon: Award, key: "Leadership" },
                    ].map((s) => (
                      <button
                        key={s.name}
                        onClick={() => setActiveSector(s.key)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg transition-all text-left",
                          activeSector === s.key
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted text-muted-foreground/80 hover:text-foreground"
                        )}
                      >
                         <div className="flex items-center gap-2.5">
                            <s.icon className={cn("w-3.5 h-3.5", activeSector === s.key ? "text-brand-gold" : "opacity-40")} />
                            <span className="text-[9px] font-black uppercase tracking-wider">{s.name}</span>
                         </div>
                         <span className="text-[9px] font-black opacity-30">{s.count}</span>
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            {/* Main annuaire listing */}
            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-emerald/10 rounded-lg">
                       <Award className="w-5 h-5 text-brand-emerald" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Certified Enterprises</h2>
                  </div>
                  <Link to="/directory" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">Voir l'Annuaire →</Link>
              </div>

              <div className="flex flex-col gap-4">
                {companiesLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                ) : companies && companies.length > 0 ? (
                  companies.slice(0, 6).map((company: any) => (
                    <Link
                      key={company._id}
                      to={`/directory/${company._id}`}
                      className="group/dir relative block bg-card rounded-xl p-[1.5px] overflow-hidden transition-all duration-300"
                      style={{
                        backgroundImage:
                          "linear-gradient(hsl(var(--card)), hsl(var(--card))), linear-gradient(110deg, hsl(var(--brand-gold) / 0), hsl(var(--brand-gold) / 0) 30%, hsl(var(--brand-gold) / 0) 70%, hsl(var(--brand-gold) / 0))",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        backgroundSize: "100% 100%, 250% 100%",
                        backgroundPosition: "0 0, 0% 0%",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundImage =
                          "linear-gradient(hsl(var(--card)), hsl(var(--card))), linear-gradient(110deg, hsl(var(--brand-gold) / 0.55), hsl(var(--brand-gold) / 0.15) 30%, hsl(var(--brand-gold) / 0.15) 70%, hsl(var(--brand-gold) / 0.55))";
                        (e.currentTarget as HTMLElement).style.backgroundPosition =
                          "0 0, 100% 0%";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundImage =
                          "linear-gradient(hsl(var(--card)), hsl(var(--card))), linear-gradient(110deg, hsl(var(--brand-gold) / 0), hsl(var(--brand-gold) / 0) 30%, hsl(var(--brand-gold) / 0) 70%, hsl(var(--brand-gold) / 0))";
                        (e.currentTarget as HTMLElement).style.backgroundPosition =
                          "0 0, 0% 0%";
                      }}
                    >
                      <div className="flex items-stretch gap-3 sm:gap-5 bg-card rounded-[10px] p-3 sm:p-5 group-hover/dir:bg-card/95 transition-colors">
                        {/* Index badge */}
                        <div className="shrink-0 w-12 sm:w-16 flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-brand-emerald/15 to-brand-emerald/5 border border-brand-emerald/30 shadow-inner">
                          {company.logoUrl ? (
                             <img 
                               src={resolveImageUrl(getLocalized(company.logoUrl, lang))}
                               className="w-8 h-8 object-contain mb-1" 
                               onError={handleImageError} 
                               alt=""
                             />
                          ) : (
                             <Building2 className="w-5 h-5 text-brand-emerald mb-0.5" />
                          )}
                          <span className="text-[8px] font-black uppercase tracking-widest text-brand-emerald/70">Indexé</span>
                        </div>

                        {/* Body */}
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-6">
                           <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                 <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold-dark">
                                    {getLocalized(company.sector, lang) || "EXCELLENCE"}
                                 </span>
                                 <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                                    <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                                    Certifié
                                 </span>
                              </div>
                              <h3 className="font-serif text-base sm:text-xl font-semibold text-foreground leading-tight tracking-tight group-hover/dir:text-brand-gold-dark transition-colors line-clamp-1 italic italic">
                                 {getLocalized(company.name, lang)}
                              </h3>
                              <p className="text-[11px] sm:text-sm text-muted-foreground leading-snug line-clamp-1 mt-1 font-medium">
                                 {getLocalized(company.description, lang)}
                              </p>
                           </div>

                           {/* CTA Pill */}
                           <div className="shrink-0 mt-3 sm:mt-0">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold-dark group-hover/dir:bg-brand-gold group-hover/dir:text-white group-hover/dir:border-brand-gold transition-all duration-300">
                                 Fiche profil
                                 <ChevronRight className="w-3.5 h-3.5 group-hover/dir:translate-x-1 transition-transform" />
                              </div>
                           </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-12 border-2 border-dashed border-border rounded-2xl">Aucun enregistrement indexé dans ce secteur.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. MULTIMEDIA HUB (VIDEOS + PODCASTS) — REDESIGNED ═══════════ */}
      <section className="py-24 lg:py-32 bg-brand-dark text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.03),transparent)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 z-10">
          {/* Hub Header matching redesign */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-primary-foreground/10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2 block">
                DGIA TV & EXCELLENCE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-primary-foreground tracking-tight uppercase">
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

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Video hub (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {videoItems.length > 0 ? (
                <>
                  {/* Featured video */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative rounded-2xl overflow-hidden aspect-video bg-foreground/20 cursor-pointer shadow-3xl shadow-black/40 ring-1 ring-white/10"
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
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ring-4 ring-white/10">
                          <Play className="w-8 h-8 text-white ml-1.5 fill-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 p-8 lg:p-10">
                        <h3 className="font-heading text-xl sm:text-3xl font-black text-white mb-3 group-hover:text-brand-gold transition-colors uppercase tracking-tight italic">
                          "{getLocalized(videoItems[0].title, lang)}"
                        </h3>
                        <p className="text-sm text-white/70 italic font-medium max-w-2xl line-clamp-1">
                          {getLocalized(videoItems[0].description, lang)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Video reel (compact grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {videoItems.slice(1, 4).map((v: any, i: number) => (
                      <motion.div
                        key={v._id || i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link to="/multimedia" className="group block">
                          <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 relative mb-4 shadow-xl">
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
                  <p className="text-sm text-white/40 italic">Aucune capsule vidéo indexée.</p>
                </div>
              )}
            </div>

            {/* Podcast sidebar (4 cols) */}
            <div className="lg:col-span-4 h-full">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 h-full flex flex-col backdrop-blur-md shadow-2xl relative overflow-hidden group/sidebar">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-[80px]" />
                
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Headphones className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                    Podcasts & Audios
                  </h3>
                </div>

                <Link
                  to="/multimedia"
                  className="mb-8 flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 relative z-10 active:scale-[0.98]"
                >
                  Tous les audios
                  <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded ml-1">
                    {podcastItems.length}
                  </span>
                </Link>

                <div className="space-y-4 flex-1 relative z-10">
                  {podcastItems.length > 0 ? (
                    podcastItems.slice(0, 5).map((p: any, i: number) => (
                      <motion.div
                        key={p._id || i}
                        initial={{ opacity: 0, x: 12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link
                          to="/multimedia"
                          className={cn(
                            "group flex items-center gap-4 p-3.5 rounded-2xl transition-all border border-transparent shadow-sm",
                            i === 0
                              ? "bg-white/10 border-white/10 shadow-xl"
                              : "hover:bg-white/5 hover:border-white/5"
                          )}
                        >
                          <div className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                             i === 0 ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-white/5 group-hover:bg-emerald-500/20"
                          )}>
                            <Play className={cn(
                              "w-4 h-4 fill-current",
                              i === 0 ? "text-white" : "text-emerald-400"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-black text-white truncate group-hover:text-brand-gold transition-colors uppercase tracking-tight italic">
                              {getLocalized(p.title, lang)}
                            </p>
                            <p className="text-[10px] text-white/40 font-bold mt-0.5 uppercase tracking-widest">
                               {i === 0 ? "DERNIER ÉPISODE" : `PISTE ${podcastItems.length - i}`} • AUDIO
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-white/30 italic py-10 text-center">Aucun podcast archivé.</p>
                  )}
                </div>

                {/* Decorative element */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover/sidebar:opacity-100 transition-opacity">
                   <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">DGIA HUB</span>
                   <TrendingUp className="w-4 h-4 text-brand-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 6. FINAL CTA (STATS + BENEFITS) — REDESIGNED ═══════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-surface-warm via-background to-secondary/40">
        {/* Animated lighting */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand-gold/25 blur-[110px] animate-aurora" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 w-[460px] h-[460px] rounded-full bg-brand-emerald/25 blur-[120px] animate-aurora-slow" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 w-[280px] h-[280px] -translate-x-1/2 rounded-full bg-primary/10 blur-[90px] animate-aurora" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/40 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                Conformité Stratégique
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter mb-8 leading-[1.1] italic text-balance uppercase">
                Transformez votre vision en{" "}
                <span className="bg-gradient-to-r from-brand-emerald via-primary to-brand-gold-dark bg-clip-text text-transparent">
                  certification
                </span>
                .
              </h2>
              <ul className="space-y-4 mb-10">
                {[
                  { title: "Expertise Panafricaine", desc: "Réseau d'influence institutionnel.", icon: Globe, accent: "from-brand-emerald/15 to-brand-emerald/5", ring: "ring-brand-emerald/30", iconColor: "text-brand-emerald" },
                  { title: "Protocoles Rigoureux", desc: "Audit étape par étape.", icon: ShieldCheck, accent: "from-brand-gold/20 to-brand-gold/5", ring: "ring-brand-gold/40", iconColor: "text-brand-gold-dark" },
                  { title: "Visibilité Accrue", desc: "Indexation au Registre prioritaires.", icon: Zap, accent: "from-primary/15 to-primary/5", ring: "ring-primary/30", iconColor: "text-primary" },
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "group flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-gold/10",
                      item.ring
                    )}
                  >
                    <div className={cn("mt-1 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-inner shrink-0", item.accent)}>
                      <item.icon className={cn("w-6 h-6", item.iconColor)} />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-brand-dark uppercase tracking-tight">{item.title}</p>
                      <p className="text-xs text-brand-dark/70 font-semibold mt-0.5">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 overflow-hidden bg-gradient-to-r from-brand-emerald via-primary to-brand-emerald bg-[length:200%_100%] bg-left text-primary-foreground px-10 py-4.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 hover:bg-right shadow-2xl shadow-primary/30 active:scale-95"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:animate-shine-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <ShieldCheck className="w-4.5 h-4.5 relative z-10" />
                  <span className="relative z-10">Démarrer mon Audit</span>
                  <ArrowRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Stats Grid with dynamic borders */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { label: "ENTITÉS", value: "2400+", icon: TrendingUp, border: "before:from-brand-emerald before:to-brand-gold", iconBg: "bg-brand-emerald/15", iconColor: "text-brand-emerald" },
                { label: "PAYS", value: "24", icon: Globe, border: "before:from-brand-gold before:to-primary", iconBg: "bg-brand-gold/20", iconColor: "text-brand-gold-dark" },
                { label: "AUDITS", value: "850", icon: ShieldCheck, border: "before:from-primary before:to-brand-emerald", iconBg: "bg-primary/10", iconColor: "text-primary" },
                { label: "IMPACT", value: "A+", icon: Award, border: "before:from-brand-gold-dark before:to-brand-gold", iconBg: "bg-brand-gold/20", iconColor: "text-brand-gold-dark" },
              ].map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "relative p-8 rounded-3xl flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 overflow-hidden",
                    "bg-white/80 backdrop-blur-sm shadow-[0_15px_40px_-15px_rgba(13,77,51,0.1)] hover:shadow-2xl hover:shadow-brand-gold/20",
                    "before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:p-[2px] before:bg-gradient-to-br before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude] before:opacity-40 group-hover:before:opacity-100 before:transition-opacity",
                    s.border
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10 transition-transform group-hover:scale-110 shadow-sm", s.iconBg)}>
                    <s.icon className={cn("w-6 h-6", s.iconColor)} />
                  </div>
                  <div className="text-3xl md:text-5xl font-black text-brand-dark leading-none mb-2 relative z-10 italic">
                    {s.value}
                  </div>
                  <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-[0.25em] relative z-10">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. ENGAGEMENT: NEWSLETTER + EVENTS ═══════════ */}
      <section className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={Mail}
            title="Synergies & Événements"
            subtitle="Connecter l'économie réelle à l'intelligence stratégique"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Newsletter — brand green portal */}
            <div className="relative rounded-3xl p-10 overflow-hidden shadow-2xl shadow-primary/20 bg-gradient-to-br from-brand-deep via-primary to-brand-forest text-primary-foreground border border-brand-emerald/30 group/newsletter">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-emerald/30 rounded-full blur-[110px] animate-aurora" />
              <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-brand-gold/20 rounded-full blur-[100px] animate-aurora-slow" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 mb-8 backdrop-blur-md">
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                    RESTONS CONNECTÉS
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter italic text-balance uppercase leading-tight">
                  Newsletter Stratégique
                </h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed mb-10 font-medium max-w-md">
                   Analyses stratégiques, rapports d'audits et tendances panafricaines, livrés exclusivement chaque mois.
                </p>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) {
                      api.post("/newsletter/subscribe", { email }).catch(() => {});
                      setEmail("");
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.organisation@email.id"
                    className="flex-1 px-6 py-4.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-xs outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all font-bold backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    className="group relative overflow-hidden px-10 py-4.5 bg-brand-gold text-brand-gold-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-2xl shadow-brand-gold/40 shrink-0"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:animate-shine-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <span className="relative">S'ABONNER</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Events Redesign */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   <h3 className="text-[11px] font-black text-brand-dark flex items-center gap-2 uppercase tracking-[0.3em]">
                     {t("home.events.title")}
                   </h3>
                </div>
                <Link
                  to="/events"
                  className="text-[11px] font-black text-primary hover:text-brand-gold-dark transition-colors flex items-center gap-1.5 uppercase tracking-widest group"
                >
                  {t("home.events.view_all")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </div>

              {eventsLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-3xl" />)
              ) : events && events.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {events.slice(0, 3).map((event: any, idx: number) => {
                    const startDate = new Date(event.startDate);
                    return (
                      <Link
                        key={event._id}
                        to={`/events/${event._id}`}
                        className="group relative block rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_12px_35px_-15px_rgba(13,77,51,0.2)] hover:shadow-[0_25px_50px_-15px_rgba(188,154,82,0.4)] border-2 border-brand-gold/20 hover:border-brand-gold overflow-hidden"
                      >
                         <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-shine-sweep bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />
                         
                         <div className="relative flex gap-6">
                            <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 shadow-inner group-hover:scale-105 transition-transform duration-500">
                               <span className="text-2xl font-black text-brand-dark leading-none italic">
                                 {startDate.getDate()}
                               </span>
                               <span className="text-[10px] font-black uppercase text-brand-gold-dark/60 mt-1 tracking-widest">
                                 {startDate.toLocaleString("fr", { month: "short" })}
                               </span>
                            </div>
                            
                            <div className="min-w-0 flex-1 pt-0.5">
                               <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold-dark bg-brand-gold/10 px-2.5 py-0.5 rounded-lg border border-brand-gold/20">
                                    {event.type}
                                  </span>
                                  {idx === 0 && (
                                     <span className="text-[9px] font-bold text-primary animate-pulse tracking-widest">● LIVE</span>
                                  )}
                               </div>
                               <h4 className="text-[15px] font-black text-brand-dark group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight italic">
                                 {getLocalized(event.title, lang)}
                               </h4>
                               <div className="flex items-center gap-2 mt-2 text-[10px] text-brand-dark/50 font-black uppercase tracking-[0.15em]">
                                 <MapPin className="w-3.5 h-3.5 text-brand-gold-dark" />
                                 <span>{getLocalized(event.location, lang)}</span>
                               </div>
                            </div>
                         </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic py-12 text-center border-2 border-dashed border-border rounded-3xl">Aucun événement prioritaire à l'agenda.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
