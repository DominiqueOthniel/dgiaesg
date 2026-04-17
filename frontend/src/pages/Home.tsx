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

      {/* ═══════════ 2. INTELLIGENCE ÉDITORIALE (NEWS) — REDESIGNED ═══════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-[#0a2a1a]">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-brand-emerald/10 blur-[120px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Custom Header matching Image 1 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                  Intelligence Éditoriale
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                L'actualité décryptée <br />
                <span className="opacity-90">des leaders africains</span>
              </h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-3 bg-brand-gold text-brand-dark px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-brand-gold/20 shrink-0 self-start md:self-end"
            >
              Tous les articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {news.length === 0 ? (
            <p className="text-center text-white/50 py-12">Aucun article pour le moment.</p>
          ) : (
            <>
              {/* ── Featured carousel (auto-rotating) ───────────────────── */}
              <div className="relative rounded-[2rem] overflow-hidden border border-white/5 shadow-3xl shadow-black/60 group/feat transition-all duration-700 mb-12 min-h-[400px] md:h-[520px]">
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
                          {/* Background Image */}
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
                            {/* Gradient Overlay matching Image 1 depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                          </div>

                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-10">
                            <div className="flex items-center gap-5 mb-6">
                              {article.sector && (
                                <span className="px-5 py-2 bg-brand-gold text-brand-dark text-[11px] font-black uppercase tracking-widest rounded-lg">
                                  {article.sector}
                                </span>
                              )}
                              {article.publishedAt && (
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                                  {new Date(article.publishedAt).toLocaleDateString(lang || "fr", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              )}
                            </div>

                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-6 max-w-5xl">
                              {getLocalized(article.title, lang)}
                            </h3>

                            <p className="text-sm md:text-lg text-white/80 line-clamp-2 max-w-3xl font-medium leading-relaxed">
                              {getLocalized(article.excerpt, lang)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ) : null
                  )}
                </AnimatePresence>

                {/* Pagination bars (Top Right) matching Image 1 */}
                <div className="absolute top-10 right-10 flex gap-2 z-20">
                  {news.slice(0, 5).map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setFeaturedIdx(i)}
                      aria-label={`Article ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        i === featuredIdx ? "w-10 bg-brand-gold" : "w-6 bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* ── Secondary articles: horizontal scroll row ────────────── */}
              {news.length > 1 && (
                <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4 [scrollbar-width:thin]">
                  {news.slice(1).map((article: any) => (
                    <Link
                      key={article._id}
                      to={`/news/${article.slug || article._id}`}
                      className="snap-start shrink-0 w-[260px] sm:w-[300px] group/card bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/30 ring-1 ring-brand-gold/10 rounded-xl overflow-hidden shadow-xl shadow-black/30 hover:-translate-y-2 hover:scale-[1.02] hover:ring-brand-gold/60 hover:shadow-2xl hover:shadow-brand-gold/30 hover:border-brand-gold transition-all duration-300"
                    >
                      <div className="aspect-[16/10] bg-white/5 overflow-hidden">
                        {article.imageUrl ? (
                          <img
                            src={resolveImageUrl(article.imageUrl)}
                            alt={getLocalized(article.title, lang)}
                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        {article.sector && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold block mb-2">
                            {article.sector}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-2 group-hover/card:text-brand-gold transition-colors">
                          {getLocalized(article.title, lang)}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ═══════════ 3. KIOSQUE & MAGAZINES ═══════════ */}
      <section className="py-16 md:py-20 bg-surface-warm border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={BookOpen}
            title={t("home.kiosk.title")}
            subtitle={t("home.kiosk.subtitle")}
            action={t("home.kiosk.view_all")}
            actionHref="/kiosk"
          />

          {magazinesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : magazines && magazines.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {magazines.slice(0, 5).map((mag: any) => (
                <Link key={mag._id} to="/kiosk" className="group hover-lift">
                  <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-shadow relative">
                    {mag.coverImageUrl ? (
                      <img
                        src={resolveImageUrl(mag.coverImageUrl)}
                        alt={getLocalized(mag.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[10px] font-black text-primary-foreground uppercase tracking-widest">
                        {t("home.news.read_more")} →
                      </span>
                    </div>
                  </div>
                  <h4 className="text-[11px] font-black text-foreground mt-3 line-clamp-2 group-hover:text-primary transition-colors uppercase tracking-tight italic italic">
                    {getLocalized(mag.title, lang)}
                  </h4>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucune publication pour le moment.</p>
          )}
        </div>
      </section>

      {/* ═══════════ 4. CERTIFIED ENTERPRISES GRID ═══════════ */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sector Sidebar */}
            <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-8">
              {/* Data Central Gateway */}
              <div className="p-6 border border-border rounded-2xl bg-muted/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Accès DATA Direct</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-bold">
                  Accédez à l'index exhaustif de l'économie africaine certifiée.
                </p>
                <Link
                  to="/directory"
                  className="flex items-center justify-center w-full py-3 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/10"
                >
                  Ouvrir le Registre
                </Link>
              </div>

              {/* Sectors */}
              <div>
                <h3 className="text-[10px] font-black text-foreground mb-4 uppercase tracking-[0.3em]">Data Par Secteur</h3>
                <div className="space-y-1">
                  {[
                    { name: "ESG & FINANCE", count: 124, icon: TrendingUp },
                    { name: "CSR & GOVERNANCE", count: 86, icon: ShieldCheck },
                    { name: "TECH & SUSTAINABLE", count: 54, icon: Globe },
                    { name: "ENERGY & BIO", count: 42, icon: Zap },
                    { name: "LEADERSHIP & IMPACT", count: 31, icon: Award },
                  ].map((s) => {
                    const sectorKey = s.name.split(" ")[0];
                    return (
                      <button
                        key={s.name}
                        onClick={() => setActiveSector(sectorKey)}
                        className={cn(
                          "w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left group",
                          activeSector === sectorKey
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <s.icon className={cn("w-4 h-4", activeSector === sectorKey ? "text-brand-gold" : "opacity-30")} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                        </div>
                        <span className="text-[10px] font-black opacity-40">{s.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Labels Grid */}
            <div className="lg:col-span-9">
              <SectionHeader
                icon={Award}
                title="Certified Enterprises"
                action="Voir l'Annuaire"
                actionHref="/directory"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {companiesLoading
                  ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
                  : companies?.slice(0, 6).map((company: any) => (
                      <Link
                        key={company._id}
                        to={`/directory/${company._id}`}
                        className="group bg-card border border-border rounded-2xl p-7 flex flex-col relative hover:border-brand-gold/40 hover:shadow-2xl hover:shadow-brand-gold/10 hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="absolute top-0 right-6 w-9 h-10 bg-primary/5 rounded-b-xl flex items-center justify-center border-x border-b border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <Building2 className="w-4 h-4" />
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 shrink-0 rounded-2xl bg-white border border-border flex items-center justify-center overflow-hidden p-2 group-hover:border-primary/30 transition-colors shadow-sm">
                            {company.logoUrl ? (
                              <img
                                src={resolveImageUrl(getLocalized(company.logoUrl, lang))}
                                alt={getLocalized(company.name, lang)}
                                className="w-full h-full object-contain"
                                onError={handleImageError}
                              />
                            ) : (
                              <Building2 className="w-6 h-6 text-muted-foreground/30" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 pt-1">
                            <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tight italic line-clamp-2">
                              {getLocalized(company.name, lang)}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-6">
                          {getLocalized(company.description, lang) ||
                            "Entreprise certifiée pour son excellence institutionnelle et sa gouvernance d'impact."}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                              Fiche Profil <ChevronRight className="w-3.5 h-3.5" />
                           </span>
                           <div className="flex items-center gap-1.5 opacity-40">
                              <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">Indexé</span>
                           </div>
                        </div>
                      </Link>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. MULTIMEDIA (VIDEOS + PODCASTS) ═══════════ */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-primary-foreground/10">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-primary-foreground/10 rounded-xl">
                <Play className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-foreground tracking-tight">
                  {t("home.multimedia.title")}
                </h2>
              </div>
            </div>
            <Link
              to="/multimedia"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group"
            >
              {t("home.multimedia.view_all")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Videos */}
            <div className="lg:col-span-8">
              <h3 className="text-[10px] font-black text-primary-foreground/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Play className="w-4 h-4" />
                {t("home.multimedia.videos")}
              </h3>
              {videoItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {videoItems.slice(0, 4).map((item: any) => (
                    <Link
                      key={item._id}
                      to="/multimedia"
                      className="group rounded-xl overflow-hidden hover-lift"
                    >
                      <div className="aspect-video bg-primary-foreground/5 relative overflow-hidden rounded-xl">
                        {item.coverImageUrl ? (
                          <img
                            src={resolveImageUrl(item.coverImageUrl)}
                            alt={getLocalized(item.title, lang)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-primary-foreground/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/30">
                          <div className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary fill-primary" />
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-primary-foreground mt-3 line-clamp-2 group-hover:text-accent transition-colors uppercase tracking-tight italic italic">
                        {getLocalized(item.title, lang)}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary-foreground/40 italic py-8">
                  Aucune vidéo pour le moment.
                </p>
              )}
            </div>

            {/* Podcasts */}
            <div className="lg:col-span-4">
              <h3 className="text-[10px] font-black text-primary-foreground/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                {t("home.multimedia.podcasts")}
              </h3>
              {podcastItems.length > 0 ? (
                <div className="space-y-3">
                  {podcastItems.slice(0, 4).map((item: any) => (
                    <Link
                      key={item._id}
                      to="/multimedia"
                      className="group flex items-start gap-3 p-4 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl hover:bg-primary-foreground/10 transition-all"
                    >
                      <div className="w-10 h-10 shrink-0 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-black text-primary-foreground line-clamp-2 group-hover:text-accent transition-colors uppercase tracking-tight">
                          {getLocalized(item.title, lang)}
                        </h4>
                        <p className="text-[10px] text-primary-foreground/50 mt-1 line-clamp-1 font-bold">
                          {getLocalized(item.description, lang)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary-foreground/40 italic py-8">
                  Aucun podcast pour le moment.
                </p>
              )}

              {/* Multimedia CTA */}
              <Link
                to="/multimedia"
                className="mt-6 flex items-center justify-center w-full py-4 bg-accent text-accent-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-accent/20"
              >
                Explorer tout le multimédia
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 6. FINAL CTA (STATS + BENEFITS) ═══════════ */}
      <section className="py-16 md:py-20 bg-muted/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Benefits */}
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">
                CONFORMITÉ STRATÉGIQUE
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter mb-6 leading-tight uppercase italic italic">
                Transformez votre vision en certification.
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  { title: "Expertise Panafricaine", desc: "Réseau d'influence institutionnel.", icon: Globe },
                  { title: "Protocoles Rigoureux", desc: "Audit étape par étape.", icon: ShieldCheck },
                  { title: "Visibilité Accrue", desc: "Indexation au Registre prioritaires.", icon: Zap },
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{item.title}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
                >
                  Démarrer mon Audit
                </Link>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "ENTITÉS", value: "2400+", icon: TrendingUp },
                { label: "PAYS", value: "24", icon: Globe },
                { label: "AUDITS", value: "850", icon: ShieldCheck },
                { label: "IMPACT", value: "A+", icon: Award },
              ].map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-card rounded-2xl flex flex-col items-center text-center group hover:shadow-lg transition-all border border-border overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[40px] -mr-4 -mt-4" />
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-foreground leading-none mb-1 relative z-10 italic italic">
                    {s.value}
                  </div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] relative z-10">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. ENGAGEMENT: NEWSLETTER + EVENTS ═══════════ */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={Mail}
            title="Synergies & Événements"
            subtitle="Connecter l'économie réelle à l'intelligence stratégique"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Newsletter */}
            <div className="bg-brand-dark rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                  <Mail className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-xl font-black mb-2 uppercase tracking-tight italic italic">{t("home.newsletter.title")}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-8 font-medium">
                  {t("home.newsletter.subtitle")}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) {
                      api.post("/newsletter/subscribe", { email }).catch(() => {});
                      setEmail("");
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("home.newsletter.placeholder")}
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-bold"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-brand-gold text-brand-gold-foreground font-black text-[10px] uppercase tracking-widest rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-brand-gold/20 shrink-0"
                  >
                    {t("home.newsletter.subscribe")}
                  </button>
                </form>
              </div>
            </div>

            {/* Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-foreground flex items-center gap-2 uppercase tracking-[0.3em]">
                  <Calendar className="w-4 h-4 text-primary" />
                  {t("home.events.title")}
                </h3>
                <Link
                  to="/events"
                  className="text-[10px] font-black text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 uppercase tracking-widest"
                >
                  {t("home.events.view_all")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {eventsLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
              ) : events && events.length > 0 ? (
                events.slice(0, 3).map((event: any) => {
                  const startDate = new Date(event.startDate);
                  return (
                    <Link
                      key={event._id}
                      to={`/events/${event._id}`}
                      className="group flex gap-5 bg-card border border-border rounded-2xl p-4 hover-lift"
                    >
                      <div className="shrink-0 w-16 h-16 bg-primary/5 rounded-2xl flex flex-col items-center justify-center border border-primary/10">
                        <span className="text-xl font-black text-primary leading-none italic italic">
                          {startDate.getDate()}
                        </span>
                        <span className="text-[9px] font-black uppercase text-primary/40 mt-1 tracking-widest">
                          {startDate.toLocaleString("fr", { month: "short" })}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center gap-2 mb-1.5">
                           <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                             {event.type}
                           </span>
                        </div>
                        <h4 className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight italic italic">
                          {getLocalized(event.title, lang)}
                        </h4>
                        {getLocalized(event.location, lang) && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            <MapPin className="w-3 h-3" />
                            <span>{getLocalized(event.location, lang)}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground italic py-8 text-center bg-muted/20 rounded-2xl">Aucun événement institutionnel programmé.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
