import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Award,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Play,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Headphones,
  Building2,
  Search,
  Factory,
  Zap,
  Truck,
  Landmark,
  Leaf,
  Share2,
  Bookmark
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLabels } from "../hooks/useLabels";
import { useNews } from "../hooks/useNews";
import { useMagazines } from "../hooks/useMagazines";
import { useEvents } from "../hooks/useEvents";
import { useCompanies } from "../hooks/useCompanies";
import { cn, getLocalized, handleImageError } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../services/api";
import AdBanner from "../components/AdBanner";
import { Button as CoopButton } from "../components/ui/Button";

const heroImages = ["/img/hero_image.jpg", "/img/hero_image2.jpg"];

/* ─── Animated word-by-word text component ─── */
function AnimatedMissionText({ text, isVisible }: { text: string; isVisible: boolean }) {
  const words = text.split(" ");

  return (
    <span className="flex flex-wrap gap-x-[0.3em] gap-y-1">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for premium feel
              delay: i * 0.03,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Home() {
  const { t, i18n } = useTranslation();
  const [activeSector, setActiveSector] = useState("Tous");
  const { data: labels, isLoading: labelsLoading } = useLabels();
  const { data: newsData } = useNews({ page: 1, limit: 12 });
  const { data: magazines, isLoading: magazinesLoading } = useMagazines();
  const { data: events, isLoading: eventsLoading } = useEvents({ limit: 6, featured: true });
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ limit: 4, status: 'certified' });
  
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
  const videoItems = multimedia.filter((m: any) => m.type === 'video');
  const podcastItems = multimedia.filter((m: any) => m.type === 'audio');

  const videoReelRef = useRef<HTMLDivElement>(null);

  const scrollReel = (direction: 'left' | 'right') => {
    if (videoReelRef.current) {
        const scrollAmount = 300;
        videoReelRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };


  const sectors = [
    { id: 'env', name: t('sectors.environment'), count: 124, color: "bg-emerald-500" },
    { id: 'social', name: t('sectors.social'), count: 98, color: "bg-amber-500" },
    { id: 'governance', name: t('sectors.governance'), count: 86, color: "bg-brand-primary" },
    { id: 'tech', name: t('sectors.tech'), count: 54, color: "bg-emerald-600" },
    { id: 'energy', name: t('sectors.energy'), count: 42, color: "bg-amber-600" },
    { id: 'leadership', name: t('sectors.leadership'), count: 31, color: "bg-purple-600" }
  ];

  /* ─── Hero slideshow state ─── */
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* ─── Mission section intersection observer ─── */
  const missionRef = useRef<HTMLDivElement>(null);
  const [missionVisible, setMissionVisible] = useState(false);
  useEffect(() => {
    const el = missionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMissionVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col bg-white">
      {/* ═══ 0. HERO SECTION (VIEWPORT FIT & FULL WIDTH) ═══ */}
      <section className="relative w-full h-[calc(100vh-112px)] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeSlide === i ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <img
                src={img}
                alt="Excellence Africaine"
                className="w-full h-full object-cover scale-105"
                style={{ mixBlendMode: 'multiply' }}
                onError={handleImageError}
              />
            </motion.div>
          ))}
          {/* Deep High-Prestige Overlay System */}
          <div className="absolute inset-0 bg-[#0D4D33]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-[#0D4D33]/20" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto">
          {/* Standard d'Excellence Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 mb-10"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse shadow-[0_0_10px_rgba(255,191,0,0.8)]" />
            <span className="text-sm font-black uppercase tracking-[0.3em] text-white">
                Standard d'Excellence Africain
            </span>
          </motion.div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-sans font-black text-white tracking-tighter leading-[1.0] max-w-7xl mb-10 drop-shadow-2xl"
          >
            L'Excellence Africaine,<br />
            <span className="text-brand-accent italic">Certifiée.</span>
          </h1>

          <p
            className="font-sans text-lg md:text-xl text-white/90 max-w-3xl mb-12 font-medium leading-relaxed tracking-wide drop-shadow-lg"
          >
            Propulsez votre impact ESG vers de nouveaux sommets grâce à notre plateforme de certification panafricaine de classe mondiale.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/labels" className="bg-[#10B981] text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white hover:text-brand-primary transition-all shadow-xl active:scale-95 group min-w-[200px] justify-center">
              Découvrir nos Portails <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            
            <Link to="/directory" className="border-2 border-white text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-brand-primary transition-all backdrop-blur-md active:scale-95 min-w-[200px] justify-center">
              Consulter le Registre
            </Link>
          </div>
        </div>

        {/* Navigation Pagers - Modern Bar Style */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-20">
          <div className="flex gap-4">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={cn(
                  "h-1.5 transition-all duration-700 rounded-full",
                  activeSlide === i 
                    ? "w-24 bg-brand-accent shadow-[0_0_15px_rgba(255,191,0,0.6)]" 
                    : "w-8 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Show slide ${i + 1}`}
              />
            ))}
          </div>
          
          {/* Scroll Down Indicator */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => document.querySelector('.viewport-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs font-black uppercase tracking-[0.5em] text-white">Explorer</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-brand-accent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ═══ REAL-TIME EXCELLENCE TICKER (HIGH DENSITY) ═══ */}
      <div className="bg-brand-secondary border-b border-white/5 py-2.5 overflow-hidden relative z-30">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12">
              {news.slice(0, 5).map((item: any) => (
                <div key={item._id} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  <span className="text-sm font-black text-white/40 uppercase tracking-widest">{item.sector}</span>
                  <span className="text-sm font-bold text-white uppercase tracking-tight hover:text-brand-accent transition-colors cursor-pointer">{getLocalized(item.title, i18n.language)}</span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                <span className="text-sm font-black text-brand-accent uppercase tracking-[0.2em]">DIRECTIVE ESG 2024 ACTIVÉE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. VISION & CERTIFICATION SECTION (VIEWPORT LOCKED) */}
      {/* 1. VISION & CERTIFICATION SECTION (VIEWPORT LOCKED) */}
      <section className="bg-white border-b border-slate-100 viewport-section flex items-center min-h-[calc(100vh-112px)] py-6 overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
            {/* Mission Hook */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <section
                ref={missionRef}
                className="py-12 px-10 md:py-16 md:px-14 bg-white border border-slate-200 rounded-[2rem] relative overflow-hidden group h-full flex flex-col justify-center shadow-md hover:shadow-2xl transition-all duration-700"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] group-hover:bg-brand-primary/10 transition-colors duration-1000" />
                <div className="relative z-10 text-left">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={missionVisible ? { width: 40 } : { width: 0 }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-[1px] bg-brand-primary"
                    />
                    <span
                      className="font-display text-sm md:text-base font-black uppercase tracking-[0.4em] text-brand-primary"
                    >
                      {t('home.about_title')}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-sans font-black text-brand-secondary tracking-tighter leading-[1.0] mb-8 max-w-4xl uppercase italic underline decoration-brand-accent/30 underline-offset-4">
                    Le Portail Panafricain de l'Excellence <span className="text-brand-primary">Certifiée.</span>
                  </h2>
                  
                  <div className="space-y-6 mb-10">
                    <p className="font-sans text-base md:text-xl text-slate-700 max-w-2xl font-normal leading-relaxed">
                        DGIA ESG connecte les organisations d'excellence avec les investisseurs mondiaux grâce à des protocoles d'audit rigoureux et des normes de gouvernance de haut niveau.
                        <Link to="/about" className="inline-flex items-center gap-1.5 ml-2 text-brand-primary font-black uppercase text-sm tracking-widest hover:underline">En savoir plus <ArrowRight className="w-3 h-3" /></Link>
                    </p>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { t: "Certification ESG de classe mondiale", i: ShieldCheck },
                            { t: "Transparence économique & ISO", i: Building2 },
                            { t: "Accès aux capitaux globaux", i: Globe }
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="p-1 bg-emerald-50 rounded-full border border-emerald-100">
                                    <item.i className="w-3.5 h-3.5 text-[#10B981]" />
                                </div>
                                <span className="text-base font-bold text-slate-600 uppercase tracking-tight">{item.t}</span>
                            </li>
                        ))}
                    </ul>
                  </div>

                  <div
                    className="flex flex-wrap gap-4 transition-all duration-1000 items-center"
                    style={{
                      opacity: missionVisible ? 1 : 0,
                      transform: missionVisible ? "translateY(0)" : "translateY(30px)",
                      transitionDelay: "1000ms",
                    }}
                  >
                    <Link to="/labels" className="bg-[#10B981] text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-brand-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-center min-w-[160px] justify-center">
                      Nos Portails <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link to="/directory" className="bg-slate-100 text-brand-secondary px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-secondary hover:text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-center min-w-[160px] justify-center border border-slate-200">
                      Consulter le Registre
                    </Link>
                    
                    {/* Duplicated Yellow CTA for distribution */}
                    <Link to="/directory" className="bg-brand-accent text-brand-secondary px-5 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white border-2 border-brand-accent hidden xl:flex items-center gap-2 transition-all animate-soft-pulse active:scale-95">
                      Explorer l'Annuaire <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Top Entities Card */}
            <div className="lg:col-span-4">
               <div className="bg-gradient-to-br from-[#0B422F] to-[#041A13] rounded-[2rem] p-7 border border-white/5 flex flex-col h-full shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-accent/10 transition-colors" />
                
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-2.5 bg-brand-primary/20 rounded-xl shadow-lg border border-white/5">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display text-base font-black uppercase tracking-[0.5em] text-white">
                    {t('home.certified_enterprises')}
                  </h3>
                </div>
                
                <div className="space-y-4 relative z-10 flex-1 overflow-hidden">
                  {companiesLoading ? (
                      [1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />)
                  ) : companies.length > 0 ? (
                      companies.slice(0, 3).map((company) => {
                        const SectorIcon = company.sector?.toLowerCase().includes('tech') ? Globe : 
                                         company.sector?.toLowerCase().includes('gov') ? ShieldCheck :
                                         company.sector?.toLowerCase().includes('env') ? Globe :
                                         Building2;
                        return (
                          <Link key={company._id} to={`/directory/${company._id}`} className="block group/item scale-105">
                              <motion.div 
                                  whileHover={{ x: 6 }}
                                  className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-brand-accent/20 transition-all cursor-pointer relative"
                              >
                                  <div className="w-14 h-14 rounded-[1.2rem] bg-white flex items-center justify-center p-3 shadow-2xl group-hover/item:bg-brand-accent transition-all duration-500">
                                      {company.logoUrl ? (
                                          <img src={resolveImageUrl(getLocalized(company.logoUrl, i18n.language))} onError={handleImageError} className="w-full h-full object-contain" alt={getLocalized(company.name, i18n.language)} />
                                      ) : (
                                          <SectorIcon className="w-7 h-7 text-brand-primary" />
                                      )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-sans text-sm font-black text-[#E9F6F0] tracking-wide group-hover/item:text-brand-accent transition-colors truncate uppercase">
                                          {getLocalized(company.name, i18n.language)}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-2">
                                          <span className="font-display text-xs font-black text-brand-accent uppercase tracking-[0.2em] bg-brand-accent/10 px-3 py-1 rounded border border-brand-accent/20">
                                              {getLocalized(company.sector, i18n.language) || "SECTEUR"}
                                          </span>
                                          <span className="text-xs font-black text-[#E9F6F0]/40 uppercase tracking-widest group-hover/item:text-white transition-colors">• VOIR PROFIL</span>
                                      </div>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-white/10 group-hover/item:text-brand-accent group-hover/item:translate-x-1.5 transition-all" />
                              </motion.div>
                          </Link>
                        );
                      })
                  ) : (
                      <p className="font-display text-sm text-white/30 italic tracking-widest uppercase text-center py-8">Aucune entreprise certifiée pour le moment.</p>
                  )}
                </div>

                <div className="mt-8 relative z-10">
                  <Link to="/directory" className="font-sans flex items-center justify-between p-5 bg-brand-accent text-[#0D4D33] rounded-[1.5rem] hover:bg-white transition-all shadow-xl hover:shadow-brand-accent/20 hover:-translate-y-1 group/btn overflow-hidden relative animate-soft-pulse">
                    <div className="flex flex-col ml-3">
                        <span className="text-base font-black uppercase tracking-[0.2em]">Listing Complet</span>
                        <span className="text-xs font-bold uppercase tracking-[0.1em] opacity-60">Explorer l'Annuaire National</span>
                    </div>
                    <div className="mr-3 p-2.5 bg-[#0D4D33]/10 rounded-xl group-hover/btn:bg-brand-accent transition-colors">
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. INTELLIGENCE ÉDITORIALE SECTION (VIEWPORT LOCKED) ═══ */}
      <section className="bg-slate-50 border-b border-slate-200 viewport-section min-h-[calc(100vh-112px)] py-6 overflow-hidden flex items-center justify-center">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">
          {/* Sticky-Style Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-brand-primary/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-base font-black uppercase tracking-[0.4em] text-brand-secondary">Intelligence Éditoriale</h3>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5 italic">Analyses & Rapports Stratégiques</span>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                 <div className="relative group/search hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="RECHERCHER UN RAPPORT..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-black tracking-widest focus:border-brand-primary outline-none transition-all w-64" />
                 </div>
                 <Link to="/index-editorial" className="bg-brand-accent text-brand-secondary px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    Explorer l'Index <Search className="w-3 h-3" />
                 </Link>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* News Stream (Left 3/4) */}
            <div className="lg:col-span-9 flex flex-col h-full overflow-hidden">
               <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                  {/* Featured Item (Magazine or First News) */}
                  {magazines && magazines.length > 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative cursor-pointer overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 flex-shrink-0">
                      <a href={magazines[0].pdfUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-[21/6.5]">
                        <img src={resolveImageUrl(magazines[0].coverImageUrl) || "/img/hero_image.jpg"} alt={getLocalized(magazines[0].title, i18n.language)} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75 group-hover:brightness-100" />
                        
                        {/* Shrunken Watermark */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-15 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <h4 className="text-[120px] font-black text-white/50 tracking-tighter uppercase select-none leading-none">LOGO</h4>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                            <div className="flex items-center justify-between mb-4">
                              <span className="px-4 py-1 bg-brand-primary text-white text-sm font-black uppercase tracking-[0.3em] rounded-full shadow-lg">À LA UNE</span>
                              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                                <span className="text-white text-sm font-black uppercase tracking-widest">
                                    {new Date(magazines[0].publishDate).toLocaleDateString(i18n.language, { month: 'short', year: 'numeric' }).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                <div className="max-w-3xl">
                                    <h2 className="text-[28px] font-sans font-black text-white leading-[1.1] tracking-tighter mb-4 group-hover:text-brand-accent transition-colors drop-shadow-2xl uppercase italic">
                                        "{getLocalized(magazines[0].title, i18n.language)}"
                                    </h2>
                                    <p className="text-base md:text-sm font-medium text-white/80 max-w-xl italic border-l-2 border-brand-accent pl-4">
                                        Décryptage stratégique de l'excellence économique africaine et analyses sectorielles approfondies.
                                    </p>
                                </div>
                                <div className="bg-brand-accent text-brand-secondary px-8 py-3 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-white transition-all flex items-center gap-2.5 active:scale-95 group/hero shadow-brand-accent/10">
                                    CONSULTER LE RAPPORT <ArrowRight className="w-4 h-4 group-hover/hero:translate-x-1.5 transition-transform" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-8 pb-1 border-t border-white/10 pt-4">
                                <div className="flex items-center gap-2 text-white/60 text-sm font-black uppercase tracking-[0.3em]">
                                    <MapPin className="w-3 h-3 text-brand-accent" /> Panafricain
                                </div>
                                <span className="w-1 h-1 bg-brand-accent rounded-full" />
                                <div className="text-white/60 text-sm font-black uppercase tracking-[0.3em]">
                                    Vol. {magazines[0].volume || "01"}
                                </div>
                                <span className="w-1 h-1 bg-brand-accent rounded-full" />
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/5"><ShieldCheck className="w-3 h-3 text-brand-accent" /></div>
                                    <span className="text-xs font-black text-brand-accent uppercase tracking-widest">Partenaire de Confiance</span>
                                </div>
                            </div>
                        </div>
                      </a>
                    </motion.div>
                  ) : null}

                  {/* Secondary News Stream (ENLARGED GRID) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {news.slice(1, 5).map((item) => (
                        <Link key={item._id} to={`/news/${item.slug}`} className="group flex gap-5 p-4 bg-white border border-slate-100 rounded-3xl hover:border-brand-primary/40 hover:shadow-2xl transition-all duration-300">
                            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-brand-primary/20 shadow-sm">
                                <img src={resolveImageUrl(item.imageUrl)} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-[#0B6B4F] uppercase tracking-widest px-2.5 py-1 bg-[#0B6B4F]/5 rounded-md border border-[#0B6B4F]/10">{item.sector}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(item.publishedAt || Date.now()).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' }).toUpperCase()}</span>
                                </div>
                                <h4 className="text-sm font-sans font-black text-[#222222] leading-tight group-hover:text-brand-primary transition-colors line-clamp-2 uppercase italic tracking-tight mb-3">
                                    {getLocalized(item.title, i18n.language)}
                                </h4>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] group-hover:underline">Lire le rapport</span>
                                    <div className="p-1 px-2.5 bg-slate-50 rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                      ))}
                  </div>
               </div>
            </div>

            {/* Slimmer Ecosystem & Partner Sidebar (Right 1/4) */}
            <div className="lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
                {/* Digital Ecosystem App Card (Unified Brand Yellow) */}
                <div className="bg-brand-primary rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group flex-shrink-0 flex flex-col justify-center shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 text-center">
                    <div className="flex flex-col items-center mb-8">
                      <div className="p-4 bg-brand-accent/20 rounded-2xl ring-1 ring-brand-accent shadow-2xl mb-4 group-hover:scale-110 transition-transform">
                          <Globe className="w-8 h-8 text-brand-accent" />
                      </div>
                      <span className="text-base font-black uppercase tracking-[0.5em] text-brand-accent">Digital Ecosystem</span>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Plateforme Stratégique</span>
                    </div>
                    
                    <h4 className="text-xl font-sans font-black text-white leading-none mb-6 tracking-tighter uppercase italic">
                      Connectez votre impact <br/> <span className="text-brand-accent underline decoration-white/10 underline-offset-8">au réseau.</span>
                    </h4>
                    
                    <div className="space-y-6">
                        <CoopButton className="w-full bg-brand-accent text-brand-primary hover:bg-white transition-all duration-300 rounded-full py-2.5 shadow-xl animate-soft-pulse glow-yellow text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 group/cta">
                           EXPLORER L'INDEX <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1.5 transition-transform" />
                        </CoopButton>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2 opacity-30">
                                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Données Certifiées</span>
                            </div>
                            <div className="mt-4 flex flex-col items-center opacity-30 group-hover:opacity-100 transition-opacity">
                                <div className="text-xs font-black text-white uppercase tracking-[0.3em] mb-2">Partenaire Stratégique</div>
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center grayscale scale-75">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Strategic Partner Banner */}
                <div className="flex-1 flex flex-col group/banner relative overflow-hidden rounded-[2rem] border border-slate-200">
                    <AdBanner position="sidebar" className="flex-1 transition-transform duration-700 group-hover/banner:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
            </div>
          </div>
        </div>
      </section>


      {/* 5. KIOSQUE & MAGAZINES (ENHANCED HIERARCHY & CONVERSION) */}
      <section className="py-12 lg:py-16 border-y border-slate-100 viewport-section flex items-center bg-[#F9F8F6]">
        <div className="editorial-container w-full relative">
            {/* Header: Optimized Contrast & CTA Positioning */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b-2 border-brand-primary/10 pb-8">
                <div>
                     <span className="text-sm font-black text-brand-primary uppercase tracking-[0.4em] mb-2 block">Kiosque Institutionnel</span>
                     <h2 className="text-[28px] font-serif font-black text-brand-secondary tracking-tighter leading-none uppercase italic">Dernières <span className="text-brand-primary">Éditions</span></h2>
                </div>
                <div className="flex items-center gap-6">
                    <Link 
                        to="/kiosk" 
                        className="text-sm font-black uppercase tracking-widest text-[#0B3B2B] hover:text-brand-primary transition-all flex items-center gap-2 group pb-1 border-b-2 border-transparent hover:border-brand-primary"
                    >
                        EXPLORE KIOSK <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-end">
                {magazinesLoading ? [1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4.2] bg-white animate-pulse rounded-2xl shadow-sm" />) :
                 magazines?.slice(0, 5).map((mag, idx) => (
                    <motion.div 
                      key={mag._id} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        "group relative flex flex-col",
                        idx === 0 ? "lg:scale-110 z-10 origin-bottom" : "scale-100"
                      )}
                    >
                        <motion.a 
                          href={mag.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block cursor-pointer perspective-2000"
                          whileHover={{ y: -10 }}
                        >
                            <div className={cn(
                                "aspect-[3/4.2] bg-white relative overflow-hidden rounded-2xl transition-all duration-700",
                                idx === 0 ? "shadow-featured ring-2 ring-brand-primary/20" : "shadow-xl ring-1 ring-black/5"
                            )}>
                                 {/* Thumbnail with Dark Overlay for Text Clarity */}
                                 <img src={resolveImageUrl(mag.coverImageUrl)} onError={handleImageError} className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" alt={getLocalized(mag.title, i18n.language)} />
                                 <div className="absolute inset-0 bg-brand-secondary/40 mix-blend-multiply opacity-100 group-hover:opacity-20 transition-opacity duration-500" />
                                 
                                 {/* Featured/Nouveau Badge */}
                                 {idx === 0 && (
                                     <div className="absolute top-4 left-4 z-20">
                                         <span className="px-4 py-1.5 bg-brand-accent text-brand-secondary text-sm font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse" />
                                             Nouveau
                                         </span>
                                     </div>
                                 )}

                                 {/* Volume/Edition Badge */}
                                 <div className="absolute top-4 right-4 z-20">
                                     <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm font-black text-white uppercase tracking-widest">
                                         VOL. {idx + 1}
                                     </div>
                                 </div>

                                 {/* Hover Intelligence: Excerpt & Read Button */}
                                 <div className="absolute inset-0 bg-brand-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                                      <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileHover={{ scale: 1.1 }}
                                        animate={idx === 0 ? { scale: 1, opacity: 1 } : {}}
                                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6"
                                      >
                                          <BookOpen className="w-8 h-8 text-brand-primary" />
                                      </motion.div>
                                      
                                      <p className="text-base text-white font-medium leading-relaxed italic mb-8 line-clamp-3">
                                          {getLocalized(mag.summary || "Consultez l'intelligence stratégique de cette édition certifiée DGIA.", i18n.language)}
                                      </p>
                                      
                                      <span className="px-6 py-2.5 bg-brand-accent text-brand-secondary text-[11px] font-black uppercase tracking-widest rounded-xl shadow-xl hover:bg-white transition-all transform hover:scale-105">
                                          TÉLÉCHARGER PDF
                                      </span>
                                 </div>
                            </div>

                            <div className="mt-6 flex flex-col">
                                <h4 className="text-base font-sans font-black text-slate-900 group-hover:text-brand-primary transition-colors leading-tight uppercase tracking-tight line-clamp-2 min-h-[40px]">
                                    {getLocalized(mag.title, i18n.language)}
                                </h4>
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                                    <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                        {new Date(mag.publishDate).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' }).toUpperCase()}
                                    </p>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span className="text-sm font-black text-brand-primary uppercase tracking-widest">Digital</span>
                                </div>
                            </div>
                        </motion.a>
                    </motion.div>
                 ))
                }
            </div>

            {/* Main High-Conversion CTA: Explorer l'Index */}
            <div className="mt-16 flex justify-center">
                <Link 
                    to="/kiosk" 
                    className="group/cta relative flex items-center justify-center gap-3 mr-4 h-[38px] px-6 bg-[#0B3B2B] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl hover:bg-brand-primary hover:shadow-brand-primary/20 transition-all active:scale-95 ring-2 ring-white/10"
                    aria-label="Explorer l'index — Voir toutes les éditions"
                >
                    <span className="relative z-10">Explorer l'index</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 rounded-full border border-white/20 group-hover/cta:bg-white group-hover/cta:text-brand-secondary transition-colors">
                        <span className="text-[9px] font-black uppercase tracking-widest">24 ÉDITIONS</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1.5 transition-transform" />
                </Link>
            </div>

            {/* Mobile Persistent Floating CTA */}
            <div className="fixed bottom-6 right-6 z-[110] md:hidden">
                <Link 
                    to="/kiosk" 
                    className="flex w-14 h-14 bg-brand-primary text-white rounded-full items-center justify-center shadow-2xl ring-4 ring-white active:scale-90 transition-transform"
                    aria-label="Voir le kiosque"
                >
                    <BookOpen className="w-6 h-6" />
                </Link>
            </div>
        </div>
      </section>

      {/* ═══ 6 & 7. LABELS & REGISTRY (RESTORED UNIFIED LAYOUT) ═══ */}
      <section className="py-12 bg-white viewport-section flex items-center border-b border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left Sidebar: Data Par Secteur (Sticky) */}
                <div className="lg:col-span-3 lg:sticky lg:top-28 flex flex-col pt-4">
                    {/* ACCÈS DATA CENTRAL Gateway (MOVED UP & ENHANCED) */}
                    <div className="mb-10 p-6 border border-[#E6ECE8] rounded-2xl bg-slate-50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-brand-primary/10 rounded-xl shadow-inner">
                                <BookOpen className="w-5 h-5 text-[#0B5A3D]" />
                            </div>
                            <h4 className="text-base font-black text-brand-secondary uppercase tracking-[0.2em] leading-none">Accès Data Central</h4>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 italic">
                            Consultez l'index exhaustif de l'économie africaine certifiée.
                        </p>
                        <Link 
                            to="/directory" 
                            className="flex items-center justify-center w-full h-[40px] bg-[#0B5A3D] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:bg-brand-primary shadow-lg active:scale-95 group/reg"
                        >
                            <BookOpen className="w-4 h-4 mr-3 group-hover/reg:scale-110 transition-transform" />
                            OUVRIR LE RÉGISTRE
                        </Link>
                        <p className="text-sm text-[#0B5A3D] mt-3 text-center italic font-black uppercase tracking-widest opacity-60">Accès gratuit • Consultations</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-base font-black text-[#0F3B2F] uppercase tracking-[0.3em] mb-1">Data Par Secteur</h3>
                        <div className="w-10 h-1 bg-brand-primary rounded-full" />
                    </div>

                    <div className="space-y-1">
                        {[
                            { name: "ESG & FINANCE", count: 124, icon: TrendingUp },
                            { name: "CSR & GOVERNANCE", count: 86, icon: ShieldCheck },
                            { name: "TECH & SUSTAINABLE", count: 54, icon: Globe },
                            { name: "ENERGY & BIO", count: 42, icon: Zap },
                            { name: "LEADERSHIP & IMPACT", count: 31, icon: Award }
                        ].map((s) => (
                            <button 
                                key={s.name}
                                onClick={() => setActiveSector(s.name.split(' ')[0])}
                                className={cn(
                                    "w-full flex items-center justify-between p-3.5 rounded-xl transition-all group",
                                    activeSector === s.name.split(' ')[0] 
                                        ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-[1.02]" 
                                        : "hover:bg-slate-50 text-slate-500"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <s.icon className={cn("w-4 h-4 transition-colors", activeSector === s.name.split(' ')[0] ? "text-white" : "text-[#0F3B2F]")} />
                                    <span className="text-sm font-black uppercase tracking-widest leading-none">{s.name}</span>
                                </div>
                                <span className={cn("text-base font-semibold leading-none", activeSector === s.name.split(' ')[0] ? "text-white font-black" : "text-[#0F3B2F]")}>{s.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Main: Labels & Certifications */}
                <div className="lg:col-span-9">
                    {/* Simplified Header with VOIR TOUT Placement */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-slate-100 gap-6">
                        <div className="flex items-center gap-5">
                            <h2 className="text-[18px] md:text-[22px] font-serif font-black text-brand-secondary uppercase tracking-[0.4em] italic">Labels & <span className="text-brand-primary">Certifications</span></h2>
                            <Link to="/labels" className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                                VOIR TOUT
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                             <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
                             <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Digital Registry Active</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {labelsLoading ? [1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-slate-50 animate-pulse rounded-2xl" />) :
                         labels?.slice(0, 6).map((label: any) => (
                            <Link key={label._id} to={`/labels/${label._id}`} className="group relative">
                                <div className="h-full bg-white border border-[#E6ECE8] rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-[320px]">
                                    {/* Award Ribbon (More subtle) */}
                                    <div className="absolute top-0 right-4 w-9 h-10 bg-brand-primary/5 rounded-b-lg flex items-center justify-center border-x border-b border-brand-primary/10 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                        <Award className="w-4 h-4" />
                                    </div>

                                    <div className="flex items-start gap-4 mb-6">
                                        {/* Left-Aligned Logo with increase diameter 30% */}
                                        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl bg-white border border-[#E6ECE8] flex items-center justify-center shadow-inner group-hover:border-brand-primary/30 transition-all overflow-hidden p-3">
                                            {label.logoUrl ? (
                                                <img src={resolveImageUrl(getLocalized(label.logoUrl, i18n.language))} className="w-full h-full object-contain" alt="Label" />
                                            ) : (
                                                <div className="p-4 opacity-10 bg-slate-100 rounded-lg w-full h-full flex items-center justify-center"><Award className="w-full h-full" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1 pr-6">
                                            <h3 className="text-sm md:text-base font-sans font-black text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors leading-tight uppercase tracking-tight line-clamp-2">
                                                {getLocalized(label.name, i18n.language)}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100/50 rounded-full shadow-sm">
                                                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                                                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest whitespace-nowrap">Verified</span>
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest line-clamp-1">{label.sector || "SECTEUR"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-base text-slate-500 font-medium leading-relaxed line-clamp-2 mb-8 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                        {getLocalized(label.description, i18n.language) || "Protocole de conformité certifié DGIA pour l'excellence institutionnelle."}
                                    </p>

                                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-sm font-black text-[#114033] uppercase tracking-[0.3em] font-semibold">
                                            {label.sector || "ENERGY"}
                                        </span>
                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0B5A3D] text-white text-sm font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                            <span>Voir Détails</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                         ))
                        }
                    </div>
                </div>
            </div>
        </div>
      </section>
      {/* 8. MULTIMEDIA & EXCELLENCE SECTION (HIGH DENSITY) */}
      <section className="py-8 bg-brand-secondary text-white relative overflow-hidden viewport-section flex items-center min-h-[calc(100vh-112px)]">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-brand-primary/5 -skew-y-3 pointer-events-none" />
        <div className="editorial-container relative w-full">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div>
                     <h3 className="text-sm font-black uppercase tracking-[0.4em] text-brand-primary mb-2">DGIA TV & EXCELLENCE</h3>
                     <h2 className="text-[28px] font-serif font-black italic tracking-tighter uppercase leading-none text-white">{t('home.media_hub')}</h2>
                </div>
                <Link 
                    to="/multimedia" 
                    className="flex items-center justify-center min-w-[120px] h-[44px] px-6 bg-brand-primary text-white text-sm font-black uppercase tracking-widest rounded shadow-xl hover:bg-white hover:text-brand-secondary transition-all"
                >
                    {t('home.media_cta')}
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Video Hub */}
                <div className="lg:col-span-8 flex flex-col">
                    <div className="mb-4 h-[38vh] min-h-[250px]">
                        {videoItems[0] ? (
                            <div className="h-full relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/5">
                                <img src={resolveImageUrl(videoItems[0].coverImageUrl)} onError={handleImageError} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
                                {/* Green Overlay */}
                                <div className="absolute inset-0 bg-brand-primary/60 group-hover:bg-brand-primary/40 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center -translate-x-8">
                                    <a href={videoItems[0].embedUrl} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-brand-primary flex items-center justify-center rounded-full shadow-3xl hover:scale-110 transition-all duration-500 backdrop-blur-sm ring-4 ring-white/10">
                                        <Play className="w-4 h-4 text-white ml-1 fill-white" />
                                    </a>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className="flex items-start gap-4 mb-2">
                                        <div className="w-1 h-12 bg-brand-primary rounded-full mt-1" />
                                        <div>
                                            <h4 className="text-[22px] font-serif font-black text-white hover:text-brand-primary transition-colors mb-2 uppercase tracking-tight italic leading-tight">
                                                "{getLocalized(videoItems[0].title, i18n.language)}"
                                            </h4>
                                            <p className="text-base text-white/80 line-clamp-2 italic font-medium max-w-xl leading-relaxed">
                                                {getLocalized(videoItems[0].description, i18n.language)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    
                    <div className="relative group/reel">
                        {/* Scroll Navigation System */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 opacity-0 group-hover/reel:opacity-100 transition-opacity">
                            <button 
                                onClick={() => scrollReel('left')}
                                className="w-10 h-10 bg-brand-secondary/80 backdrop-blur-md text-brand-accent rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-primary transition-all -ml-5 border border-brand-accent/20"
                                aria-label="Défiler à gauche"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 opacity-0 group-hover/reel:opacity-100 transition-opacity">
                            <button 
                                onClick={() => scrollReel('right')}
                                className="w-10 h-10 bg-brand-secondary/80 backdrop-blur-md text-brand-accent rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-primary transition-all -mr-5 border border-brand-accent/20"
                                aria-label="Défiler à droite"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div 
                            ref={videoReelRef}
                            className="flex gap-4 mt-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
                        >
                            {videoItems.slice(1, 10).map((item: any) => (
                                <motion.a 
                                    key={item._id} 
                                    href={item.embedUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-xl p-1 w-[280px] md:w-[calc(30%-1rem)] min-w-[200px] flex-shrink-0 snap-start" 
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="aspect-video relative overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 mb-3 shadow-lg">
                                        <img src={resolveImageUrl(item.coverImageUrl)} onError={handleImageError} className="w-full h-full object-cover transition-all grayscale group-hover:grayscale-0" />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-brand-primary/90 flex items-center justify-center rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                                <Play className="w-2.5 h-2.5 text-white fill-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="text-sm font-black leading-tight text-white group-hover:text-brand-primary transition-colors line-clamp-1 uppercase tracking-tight mb-1">{getLocalized(item.title, i18n.language)}</h5>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest line-clamp-1">{getLocalized(item.description, i18n.language) || "Analysis Insight"}</p>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Podcast Sidebar */}
                <div className="lg:col-span-4">
                    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 h-full flex flex-col shadow-2xl backdrop-blur-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Headphones className="w-4 h-4 text-[#1DB954]" />
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/70">Podcasts Audio</h3>
                            </div>
                        </div>

                        {/* PRIMARY CTA (MOVED TO TOP) */}
                        <Link 
                            to="/multimedia?type=audio" 
                            className="mb-6 flex items-center justify-center gap-2 w-full h-[40px] bg-[#1DB954] text-white text-sm font-black uppercase tracking-widest rounded-full shadow-md hover:bg-white hover:text-brand-secondary transition-all group/aud"
                        >
                            <span>VOIR TOUT LES AUDIOS</span>
                            <span className="px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-bold">(24)</span>
                        </Link>
                        
                        <div className="space-y-5 flex-1 overflow-hidden">
                            {podcastItems.slice(0, 5).map((item: any, idx: number) => (
                                <Link 
                                    key={item._id} 
                                    to={`/multimedia/audio/${item._id}`} 
                                    className={cn(
                                        "group flex gap-4 items-center p-2.5 rounded-xl transition-all border border-transparent",
                                        idx === 0 ? "bg-white/5 border-white/10 shadow-lg" : "hover:bg-white/5"
                                    )}
                                >
                                    <div className="w-9 h-9 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden relative shadow-md">
                                        <img src={resolveImageUrl(item.coverImageUrl)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                                            <Play className="w-2.5 h-2.5 text-white fill-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-[#1DB954] uppercase tracking-widest">{item.sector || "ESG"}</span>
                                            {idx === 0 && <span className="text-[6px] px-1.5 py-0.5 bg-[#1DB954]/20 text-[#1DB954] rounded font-black uppercase tracking-tighter">Newest</span>}
                                        </div>
                                        <h5 className="text-base font-black leading-tight text-white group-hover:text-[#1DB954] transition-colors line-clamp-1 uppercase italic tracking-tight">"{getLocalized(item.title, i18n.language)}"</h5>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 9. FINAL CTA (HIGH DENSITY) */}
      <section className="bg-slate-50 py-16 relative overflow-hidden flex items-center min-h-[50vh]">
          <div className="absolute inset-0 bg-brand-primary/5 -skew-x-12 translate-x-1/2" />
          <div className="editorial-container relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
               <div>
                   <span className="text-sm font-black text-brand-primary uppercase tracking-[0.4em] mb-4 block">Développement Stratégique</span>
                   <div className="relative">
                       <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-secondary tracking-[0.04em] italic mb-6 leading-[1.1] uppercase max-w-lg">
                           Transformez votre vision en certification.
                       </h2>
                       {/* Directional Cue (Subtle Diagonal Rule) */}
                       <div className="hidden lg:block absolute -right-12 top-1/2 w-24 h-[1px] bg-brand-primary/20 -rotate-45" />
                   </div>

                   {/* Benefit Bullets (Replaced Paragraph) */}
                   <ul className="space-y-4 mb-10">
                       {[
                           { t: "Expertise Panafricaine", d: "Réseau d'influence certifié.", i: Globe },
                           { t: "Protocoles Rigoureux", d: "Certification étape par étape.", i: ShieldCheck },
                           { t: "Visibilité Accrue", i: Zap, d: "Indexation prioritaire." }
                       ].map((item, idx) => (
                           <motion.li 
                             key={idx}
                             initial={{ opacity: 0, x: -10 }}
                             whileInView={{ opacity: 1, x: 0 }}
                             transition={{ delay: idx * 0.1 }}
                             className="flex items-start gap-3"
                           >
                               <div className="mt-1 w-5 h-5 flex items-center justify-center rounded-full bg-brand-primary/10">
                                   <item.i className="w-2.5 h-2.5 text-brand-primary" />
                               </div>
                               <div>
                                   <p className="text-base font-black text-[#174033] uppercase tracking-wider">{item.t}</p>
                                   <p className="text-base text-slate-500 font-medium italic">{item.d}</p>
                               </div>
                           </motion.li>
                       ))}
                   </ul>

                   <div className="flex flex-col sm:flex-row items-center gap-6">
                       {/* Primary CTA (Pulse + Shadow) */}
                       <motion.div
                         initial={{ scale: 1 }}
                         animate={{ scale: [1, 1.02, 1] }}
                         transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                       >
                               <Link 
                                 to="/directory" 
                                 id="cta_start_certification"
                                 role="button"
                                 aria-label="Démarrer ma certification"
                                 className="flex flex-col items-center justify-center min-w-[220px] h-[54px] px-8 bg-brand-secondary text-white rounded-full shadow-xl hover:bg-brand-primary transition-all active:scale-95 focus:ring-3 focus:ring-brand-primary focus:ring-offset-2"
                               >
                                   <span className="text-xs font-black uppercase tracking-[0.2em] leading-none mb-1">Démarrer ma certification</span>
                                   <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Protocoles Officiels</span>
                               </Link>
                           </motion.div>
    
                           {/* Secondary CTA (Filled + Sublabel) */}
                           <Link 
                             to="/labels" 
                             id="cta_view_portals_new"
                             role="button"
                             aria-label="Découvrir les portails — options de certification"
                             className="flex flex-col items-center justify-center min-w-[180px] h-[54px] px-6 bg-brand-primary text-white rounded-full shadow-md hover:bg-brand-secondary transition-all active:scale-95 focus:ring-3 focus:ring-brand-secondary focus:ring-offset-2"
                           >
                               <span className="text-xs font-black uppercase tracking-[0.2em] leading-none mb-1">Découvrir les portails</span>
                               <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Options de certification</span>
                           </Link>
                   </div>
               </div>
              <div className="grid grid-cols-2 gap-4">
                  {[
                      { l: "ENTITÉS", v: 2400, suffix: "+", i: TrendingUp },
                      { l: "PAYS", v: 24, i: Globe },
                      { l: "AUDITS", v: 850, i: ShieldCheck },
                      { l: "IMPACT", v: 100, isImpact: true, i: Award }
                  ].map((s, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 bg-brand-primary/[0.02] rounded-2xl flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300"
                      >
                          <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                             <s.i className="w-5 h-5 text-brand-primary" />
                          </div>
                          
                          <div className="flex flex-col items-center">
                              <div className="text-3xl font-serif font-black text-brand-secondary leading-none mb-2">
                                  {s.isImpact ? (
                                      "A+"
                                  ) : (
                                      <motion.span
                                          initial={{ opacity: 0 }}
                                          whileInView={{ opacity: 1 }}
                                          viewport={{ once: true }}
                                      >
                                          {s.v}
                                      </motion.span>
                                  )}
                                  {!s.isImpact && s.suffix}
                              </div>
                              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{s.l}</p>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. ENGAGEMENT & AGENDA SECTION (VIEWPORT LOCKED) */}
      <section className="bg-white border-b border-slate-200 viewport-section min-h-[calc(100vh-112px)] py-8 flex items-center justify-center overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">
          {/* Section Orientation Header - Optimized for Discoverability */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-brand-secondary rounded-xl shadow-lg ring-1 ring-white/10">
                  <Mail className="w-5 h-5 text-brand-accent animate-pulse" />
              </div>
              <div className="flex flex-col">
                  <h3 className="text-base font-black uppercase tracking-[0.4em] text-brand-secondary leading-none mb-1">Synergies & Évènements</h3>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest italic text-left">Connecter l'économie réelle à l'intelligence</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative group/search flex-1 md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-brand-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="RECHERCHER UN ÉVÈNEMENT OU RAPPORT..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black tracking-widest focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all placeholder:text-slate-400" 
                  />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Newsletter Column (Enhanced Conversion) */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 bg-brand-secondary text-white relative overflow-hidden group flex flex-col rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:shadow-brand-secondary/30 ring-1 ring-white/5"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                
                {latestNewsletter ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col relative z-10 h-full">
                        {/* Hero Section CTA Integration */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-accent drop-shadow-sm">Latest Newsletter</span>
                                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
                                    <span className="text-sm font-black text-white/60 uppercase tracking-widest">
                                        {new Date(latestNewsletter.publishedAt || latestNewsletter.createdAt).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' }).toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-serif font-black leading-[1.1] uppercase tracking-tighter italic group-hover:text-brand-accent transition-colors">
                                    "{getLocalized(latestNewsletter.title, i18n.language)}"
                                </h3>
                                <p className="text-base text-white font-medium leading-relaxed italic border-l-4 border-brand-accent/60 pl-6 max-w-lg">
                                    {getLocalized(latestNewsletter.summary, i18n.language)}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 flex-shrink-0">
                                <Link 
                                  to="/kiosk" 
                                  className="px-8 py-4 bg-white text-brand-secondary text-sm font-black uppercase tracking-widest rounded-full shadow-premium hover:bg-brand-accent hover:shadow-brand-accent/30 transition-all flex items-center justify-center gap-3 active:scale-95 group/btn"
                                  aria-label="Voir l'édition complète — newsletter"
                                >
                                    VOIR L'ÉDITION <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                                </Link>
                                <Link to="/newsletters" className="text-sm font-black text-white/50 hover:text-brand-accent text-center uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                     Consulter les Archives <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                        
                        {/* Featured Image with Dark Overlay */}
                        <div className="relative flex-grow min-h-[220px] overflow-hidden rounded-[2rem] ring-1 ring-white/10 group-hover:ring-brand-accent/40 transition-all mb-4 mt-auto">
                            <img src={resolveImageUrl(latestNewsletter.imageUrl)} onError={handleImageError} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt="Newsletter Thumbnail" />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/40 to-transparent mix-blend-multiply" />
                            <div className="absolute inset-x-0 bottom-0 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <div className="w-2 h-2 bg-brand-accent rounded-full" />
                                    <span className="text-sm font-black uppercase tracking-widest text-white">Certifié DGIA</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white/10 hover:bg-brand-accent hover:text-brand-secondary transition-all rounded-lg"><Share2 className="w-3.5 h-3.5" /></button>
                                    <button className="p-2 bg-white/10 hover:bg-brand-accent hover:text-brand-secondary transition-all rounded-lg"><Bookmark className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center py-10">
                        <Mail className="w-16 h-16 text-brand-primary/30 mb-6" />
                        <h3 className="text-2xl font-serif font-black mb-4 italic uppercase">{t('home.newsletter_title')}</h3>
                        <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-xs">{t('home.newsletter_desc')}</p>
                        <form className="w-full max-w-sm flex flex-col gap-3">
                            <input type="email" placeholder="VOTRE ADRESSE EMAIL PROFESSIONNELLE" className="w-full px-6 py-4 bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest focus:border-brand-accent outline-none transition-all placeholder:text-white/20 rounded-2xl focus:bg-white/10" />
                            <button className="w-full py-4 bg-brand-accent text-brand-secondary text-sm font-black uppercase tracking-widest shadow-2xl hover:bg-white transition-all rounded-2xl">S'ABONNER À L'INTELLIGENCE</button>
                        </form>
                    </div>
                )}
            </motion.div>

            {/* Events Column (Optimized Access) */}
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] flex flex-col shadow-xl group/agenda min-h-[550px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/10" />
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-primary shadow-lg rounded-xl"><Calendar className="w-4 h-4 text-white" /></div>
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 leading-none">Agenda Institutionnel</h3>
                        </div>
                        <h4 className="text-2xl font-serif font-black text-brand-secondary tracking-tighter uppercase italic">Évènements Stratégiques</h4>
                    </div>
                    {/* Exposed Filters */}
                    <div className="flex gap-2">
                        {['Tous', 'Conférences', 'Audits'].map(f => (
                            <button key={f} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm">{f}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 flex-1 overflow-hidden relative">
                    {/* Shadow Scroll Mask */}
                    <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />
                    
                    {eventsLoading ? (
                        [1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-white animate-pulse rounded-2xl mb-3 shadow-sm" />)
                    ) : (
                        events?.slice(0, 4).map((event) => (
                            <Link 
                                key={event._id} 
                                to={`/events/${event._id}`} 
                                className="group/item block bg-white p-5 rounded-2xl border border-slate-100 hover:border-brand-primary/30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex gap-6 items-center">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 group-hover/item:bg-brand-primary group-hover/item:text-white group-hover/item:scale-105 transition-all shadow-inner border border-slate-100">
                                        <span className="text-xl font-black leading-none">{new Date(event.startDate).getDate()}</span>
                                        <span className="text-xs font-black uppercase tracking-tighter mt-1">{new Date(event.startDate).toLocaleString(i18n.language, { month: 'short' }).toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 text-brand-primary font-black"><MapPin className="w-3 h-3" /> {getLocalized(event.location, i18n.language)}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span className="text-slate-400">{event.type}</span>
                                        </div>
                                        <h4 className="text-[15px] font-sans font-black text-slate-900 group-hover/item:text-brand-primary transition-colors leading-tight line-clamp-1 uppercase tracking-tight">{getLocalized(event.title, i18n.language)}</h4>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/item:bg-brand-primary/10 group-hover/item:translate-x-1 transition-all">
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-brand-primary" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <Link 
                      to="/events" 
                      className="flex items-center justify-center gap-3 w-full h-[56px] bg-[#0D4D33] text-[#FFD24A] text-base md:text-base font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-[#0D4D33]/20 transition-all active:scale-95 group/main-cta relative overflow-hidden"
                      aria-label="Voir l'agenda complet, ouvre l'agenda"
                    >
                        <span className="relative z-10 transition-transform group-hover/main-cta:scale-105">Voir l'agenda complet et s'inscrire</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover/main-cta:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING CTA - ATTENTION CAPTURE (OPTIMIZED & DESKTOP ONLY) */}
      <div className="fixed bottom-10 right-10 z-[110] hidden md:flex">
          <motion.div 
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{ scale: 1.06 }}
            className="flex items-center"
          >
              <Link 
                to="/directory" 
                className="group/float flex items-center justify-center gap-3 h-[42px] px-6 bg-[#053a1f] text-brand-accent text-base font-black uppercase tracking-[0.1em] rounded-full shadow-[0_0_15px_rgba(255,191,0,0.4)] hover:shadow-[0_0_25px_rgba(255,191,0,0.6)] transition-all duration-300 active:scale-95 border border-brand-accent/30 hover:border-brand-accent"
                aria-label="Explorer l’index"
              >
                  <span className="leading-none pt-0.5">Explorer l'index</span>
                  <Search className="w-3.5 h-3.5 text-brand-accent group-hover/float:scale-110 transition-transform" />
              </Link>
          </motion.div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Screens < 768px ONLY) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] p-4 bg-white/80 backdrop-blur-lg border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <Link 
            to="/register" 
            className="flex items-center justify-center w-full h-[56px] bg-[#053a1f] text-white text-base font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95"
            aria-label="Explorer l’index"
          >
              <Search className="w-5 h-5 mr-3" />
              Explorer l'index
          </Link>
      </div>
    </div>
  );
}

export default Home;
