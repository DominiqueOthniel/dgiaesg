import {
  ShieldCheck,
  Award,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Play,
  User,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Headphones
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLabels } from "../hooks/useLabels";
import { useNews } from "../hooks/useNews";
import { useMagazines } from "../hooks/useMagazines";
import { useEvents } from "../hooks/useEvents";
import { cn, getLocalized } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../services/api";
import AdBanner from "../components/AdBanner";
import { Button as CoopButton } from "../components/ui/Button";

function Home() {
  const { t, i18n } = useTranslation();
  
  const { data: labels, isLoading: labelsLoading } = useLabels();
  const { data: newsData, isLoading: newsLoading } = useNews({ page: 1, limit: 12 });
  const { data: magazines, isLoading: magazinesLoading } = useMagazines();
  const { data: events, isLoading: eventsLoading } = useEvents({ limit: 3, featured: true });
  
  const news = newsData?.data || [];
  const queryClient = useQueryClient();

  const { data: multimediaData } = useQuery({
    queryKey: ["homepage-multimedia"],
    queryFn: async () => {
      const res = await api.get("/multimedia?limit=5&published=true");
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

  const prefetchArticle = (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: ["news", "slug", slug],
      queryFn: async () => {
        const response = await api.get(`/news/slug/${slug}`);
        return response.data.data;
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  const sectors = [
    { id: 'finance', name: t('sectors.finance'), count: 124, color: "bg-blue-600" },
    { id: 'governance', name: t('sectors.governance'), count: 86, color: "bg-brand-primary" },
    { id: 'tech', name: t('sectors.tech'), count: 54, color: "bg-emerald-600" },
    { id: 'energy', name: t('sectors.energy'), count: 42, color: "bg-amber-600" },
    { id: 'leadership', name: t('sectors.leadership'), count: 31, color: "bg-purple-600" }
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* 1. ASYMMETRIC HERO (A LA UNE) */}
      <section className="bg-white border-b-2 border-brand-secondary/5 pb-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Featured */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-surface-muted">
                <span className="w-8 h-1 bg-brand-primary" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-secondary">{t('home.hero_title')}</h2>
              </div>

              {newsLoading ? (
                <div className="w-full h-[500px] bg-slate-100 animate-pulse" />
              ) : news[0] ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative cursor-pointer" onMouseEnter={() => prefetchArticle(news[0].slug)}>
                  <Link to={`/news/${news[0].slug}`} className="block overflow-hidden relative aspect-video md:aspect-[21/9]">
                    <img src={resolveImageUrl(news[0].imageUrl) || "/img/hero_image.jpg"} alt={getLocalized(news[0].title, i18n.language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
                      <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                           <span className="px-3 py-1 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest">{news[0].sector || "ACTUALITÉ"}</span>
                           {news[0].premium && <span className="px-3 py-1 bg-brand-secondary text-brand-accent text-[9px] font-black uppercase tracking-widest border border-brand-accent/30 tracking-[0.2em]">PREMIUM</span>}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-white leading-[1] mb-6 drop-shadow-2xl group-hover:text-brand-accent transition-colors">
                          "{getLocalized(news[0].title, i18n.language)}"
                        </h1>
                        <div className="flex items-center gap-6 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                          <span className="flex items-center gap-2"><User className="w-3 h-3 text-brand-primary" /> {news[0].author}</span>
                          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                          <span>{new Date(news[0].publishedAt || news[0].createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : null}

              {/* High Density Sub-Grid (1 + 4 layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  {news.slice(1, 9).map((item) => (
                     <Link key={item._id} to={`/news/${item.slug}`} className="group flex gap-6 pb-8 border-b border-surface-muted" onMouseEnter={() => prefetchArticle(item.slug)}>
                        <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-slate-100 ring-1 ring-surface-muted">
                             <img src={resolveImageUrl(item.imageUrl) || "https://images.unsplash.com/photo-1585829365234-78d2b98Ad.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={getLocalized(item.title, i18n.language)} />
                        </div>
                        <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{item.sector}</span>
                                {item.subCategory && (
                                    <>
                                        <span className="w-1 h-1 bg-surface-muted rounded-full" />
                                        <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-1.5 py-0.5 whitespace-nowrap">{getLocalized((item.subCategory as any)?.name, i18n.language)}</span>
                                    </>
                                )}
                             </div>
                             <h4 className="text-lg font-serif font-bold text-brand-secondary leading-tight group-hover:text-brand-primary transition-colors">{getLocalized(item.title, i18n.language)}</h4>
                             <p className="text-[11px] text-text-muted mt-2 line-clamp-2 italic">"{getLocalized(item.excerpt, i18n.language) || getLocalized(item.content, i18n.language).substring(0, 100)}..."</p>
                        </div>
                     </Link>
                  ))}
                  <div className="md:col-span-2 pt-4 flex justify-center">
                    <Link to="/news" className="btn-paper px-10 py-4 text-[10px]">{t('home.more_articles')}</Link>
                  </div>
              </div>

              {/* NEWSLETTER & EVENTS SIDE-BY-SIDE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 mt-12 border-t-2 border-brand-secondary/5">
                  {/* Newsletter Focus */}
                  <div className="p-10 bg-brand-secondary text-white relative overflow-hidden group min-h-[450px] flex flex-col rounded-[2rem] shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                      
                      {latestNewsletter ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col relative z-10"
                          >
                              <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-brand-primary/20 rounded-xl">
                                          <Mail className="w-5 h-5 text-brand-primary" />
                                      </div>
                                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-primary">{t('home.latest_newsletter')}</span>
                                  </div>
                                  <Link to="/newsletters" className="text-[9px] font-black text-white/30 hover:text-brand-primary transition-colors uppercase tracking-widest">Archives</Link>
                              </div>
                              
                              <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl ring-1 ring-white/10 group-hover:ring-brand-primary/40 transition-all shadow-2xl">
                                  <img 
                                    src={resolveImageUrl(latestNewsletter.imageUrl) || "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800"} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                    alt="Newsletter"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-transparent to-transparent" />
                              </div>

                              <h3 className="text-2xl md:text-3xl font-serif font-black mb-6 group-hover:text-brand-primary transition-colors italic leading-[1.1]">
                                  "{getLocalized(latestNewsletter.title, i18n.language)}"
                              </h3>
                              <p className="text-sm text-white/50 mb-10 line-clamp-3 font-medium leading-relaxed italic border-l-2 border-brand-primary pl-6">
                                  {getLocalized(latestNewsletter.summary, i18n.language)}
                              </p>
                              
                              <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                  <Link to={`/newsletter/${latestNewsletter._id}`} className="inline-flex items-center gap-4 py-4 px-8 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-brand-secondary transition-all shadow-xl shadow-brand-primary/20">
                                      {t('home.read_more')} <ArrowRight className="w-4 h-4" />
                                  </Link>
                              </div>
                          </motion.div>
                      ) : (
                          <div className="relative z-10">
                              <Mail className="w-10 h-10 text-brand-primary mb-6 opacity-50" />
                              <h3 className="text-2xl font-serif font-bold mb-6 italic">{t('home.newsletter_title')}</h3>
                              <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-sm">{t('home.newsletter_desc')}</p>
                              <form className="space-y-4 mt-auto max-w-sm">
                                  <input type="email" placeholder="ENTREZ VOTRE EMAIL" className="w-full px-6 py-4 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest focus:border-brand-primary outline-none transition-all placeholder:text-white/20 rounded-xl" />
                                  <button className="w-full py-4 bg-brand-primary text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-brand-secondary transition-all shadow-xl shadow-brand-primary/20">S'ABONNER MAINTENANT</button>
                              </form>
                          </div>
                      )}
                  </div>

                  {/* Enhanced Events Section */}
                  <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col min-h-[450px]">
                      <div className="flex items-center justify-between mb-10">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-brand-primary/10 rounded-xl">
                                  <Calendar className="w-5 h-5 text-brand-primary" />
                              </div>
                              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-secondary">
                                  {t('home.events_title')}
                              </h3>
                          </div>
                          <Link to="/events" className="text-[9px] font-black text-brand-primary hover:text-brand-secondary transition-colors uppercase tracking-widest">
                            Programme Complet
                          </Link>
                      </div>

                      <div className="space-y-6 flex-1">
                          {eventsLoading ? (
                              [1, 2, 3].map((i) => <div key={i} className="h-24 bg-white animate-pulse rounded-2xl border border-slate-100" />)
                          ) : (
                              events?.slice(0, 3).map((event) => (
                                  <Link key={event._id} to={`/events/${event._id}`} className="group block bg-white p-6 rounded-2xl border border-slate-100 hover:border-brand-primary hover:shadow-xl transition-all duration-500">
                                      <div className="flex gap-6">
                                          <div className="w-16 h-16 bg-slate-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                                              <span className="text-xl font-black">{new Date(event.startDate).getDate()}</span>
                                              <span className="text-[8px] font-black uppercase tracking-tighter">{new Date(event.startDate).toLocaleString(i18n.language, { month: 'short' })}</span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-3 mb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                  <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-brand-primary" /> {getLocalized(event.location, i18n.language)}</span>
                                                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                  <span className="text-brand-primary/70">{event.type}</span>
                                              </div>
                                              <h4 className="text-base font-serif font-bold text-brand-secondary group-hover:text-brand-primary transition-colors leading-tight line-clamp-1">
                                                  {getLocalized(event.title, i18n.language)}
                                              </h4>
                                          </div>
                                          <div className="flex items-center">
                                              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                                          </div>
                                      </div>
                                  </Link>
                              ))
                          )}
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-100">
                          <Link to="/events" className="flex items-center justify-center gap-3 w-full py-4 border-2 border-brand-secondary/10 text-brand-secondary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-secondary hover:text-white hover:border-brand-secondary transition-all rounded-xl">
                              EXPLORER L'AGENDA <ArrowRight className="w-4 h-4" />
                          </Link>
                      </div>
                  </div>
              </div>
            </div>

            {/* Sidebar Feed */}
            <div className="lg:col-span-4 space-y-10">
              {/* Trending Topics - NEW */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col min-h-[400px]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-brand-primary/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-secondary">
                    Tendances Impact
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    { tag: "#ESG", label: "Protocoles de transparence 2026", trend: "+24%" },
                    { tag: "#Gouvernance", label: "Index d'intégrité panafricain", trend: "+12%" },
                    { tag: "#Tech", label: "Traçabilité par blockchain verte", trend: "+45%" },
                    { tag: "#Énergie", label: "Transition solaire au Sahel", trend: "+18%" }
                  ].map((topic, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">{topic.tag}</span>
                        <span className="text-[10px] font-bold text-success">{topic.trend}</span>
                      </div>
                      <p className="text-sm font-bold text-brand-secondary group-hover:text-brand-primary transition-colors leading-tight">
                        {topic.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <Link to="/news" className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-primary group transition-all">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-brand-primary transition-colors">Analyses complètes</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Digital Ecosystem - NEW */}
              <div className="bg-brand-secondary rounded-[2rem] p-8 relative overflow-hidden group min-h-[350px] flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Globe className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-primary">
                      Écosystème Digital
                    </h3>
                  </div>
                  <h4 className="text-2xl font-serif font-black text-white italic leading-tight mb-6">
                    Connectez votre organisation au futur.
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed mb-8 italic">
                    Rejoignez le réseau mondial des entreprises certifiées et accédez à des ressources exclusives d'intelligence économique.
                  </p>
                  <CoopButton className="w-full bg-white text-brand-secondary hover:bg-brand-primary hover:text-white text-[10px] font-black uppercase tracking-widest py-4 transition-all">
                    explorer l'index
                  </CoopButton>
                </div>
              </div>

              <div className="w-full">
                 <AdBanner position="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KIOSQUE & MAGAZINES */}
      <section className="py-24 bg-surface-base border-y border-surface-muted">
        <div className="editorial-container">
            <div className="flex items-end justify-between mb-12 border-b-4 border-brand-secondary/10 pb-8">
                <div>
                     <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-2 block">KIOSQUE & MAGASINS</span>
                     <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-secondary tracking-tighter">{t('home.magazines_title')}</h2>
                </div>
                <Link to="/kiosk" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors flex items-center gap-2 group border-b-2 border-brand-primary pb-1">
                    {t('home.explore_kiosk')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {magazinesLoading ? [1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4] bg-white animate-pulse" />) :
                 magazines?.slice(0, 5).map((mag) => (
                    <a key={mag._id} href={mag.pdfUrl} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                        <div className="aspect-[3/4] bg-white shadow-2xl relative overflow-hidden border border-surface-muted group-hover:translate-y-[-12px] transition-all duration-700">                              <img src={resolveImageUrl(mag.coverImageUrl) || "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=600"} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt={getLocalized(mag.title, i18n.language)} />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                                      <BookOpen className="w-6 h-6 text-white" />
                                  </div>
                             </div>
                             <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                 <div className="bg-brand-secondary text-white p-3 text-center text-[8px] font-black uppercase tracking-widest border border-white/10">Lire le Journal</div>
                             </div>
                        </div>
                        <h4 className="text-sm font-serif font-bold mt-6 text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug">{getLocalized(mag.title, i18n.language)}</h4>

                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-2">{new Date(mag.publishDate).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}</p>
                    </a>
                 ))
                }
            </div>
        </div>
      </section>

      {/* 3. AD BANNER */}
      <div className="editorial-container">
          <AdBanner position="top" className="my-16" />
      </div>

      {/* 4. RÉGISTRE & SECTEURS */}
      <section className="py-24 bg-white">
        <div className="editorial-container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                <div className="lg:col-span-1 border-r border-surface-muted pr-8">
                    <div className="sticky top-24">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-6 border-b border-brand-primary/20 pb-2">DATA PAR SECTEUR</h3>
                        <div className="space-y-2">
                            {sectors.map((s) => (
                                <Link key={s.id} to={`/directory?sector=${s.id}`} className={cn("flex items-center justify-between p-4 bg-surface-base hover:bg-brand-primary hover:text-white transition-all group")}>
                                    <div className="flex items-center gap-4">
                                        <TrendingUp className="w-3 h-3 text-brand-primary group-hover:text-white" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.1em]">{s.name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted group-hover:text-white/60">{s.count}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-12 p-6 border-2 border-brand-primary border-dashed bg-surface-base/30">
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-2">Accès Data Central</h5>
                             <p className="text-[9px] text-text-muted mb-4 leading-relaxed italic">Consultez l'index exhaustif de l'économie africaine certifiée.</p>
                             <Link to="/directory" className="btn-paper w-full block text-center py-3 text-[9px] opacity-90 hover:opacity-100">OUVRIR LE RÉGISTRE</Link>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-10 border-b border-surface-muted pb-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-secondary">{t('home.registry_title')}</h3>
                        <Link to="/labels" className="text-[9px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2 group">
                            VOIR TOUT <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {labelsLoading ? [1,2,3,4,5,6].map(i => <div key={i} className="aspect-[4/3] bg-surface-base animate-pulse" />) :
                          labels?.slice(0, 6).map((label) => (
                            <Link key={label._id} to={`/labels/${label._id}`} className="group p-8 border border-surface-muted hover:border-brand-primary hover:shadow-2xl transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-12 h-12 bg-surface-base group-hover:bg-brand-primary transition-colors flex items-center justify-center">
                                     <Award className="w-5 h-5 text-brand-primary group-hover:text-white" />
                                </div>
                                <div className="w-20 h-20 bg-surface-base rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {label.logoUrl ? <img src={resolveImageUrl(label.logoUrl)} className="w-12 h-12 object-contain" /> : <ShieldCheck className="w-10 h-10 text-brand-primary" />}
                                </div>
                                <h4 className="text-lg font-serif font-black text-brand-secondary group-hover:text-brand-primary transition-colors">{getLocalized(label.name, i18n.language)}</h4>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted group-hover:text-brand-primary/60 mt-4 block border-t border-surface-muted pt-4 w-full">{label.sector || "Audit Global"}</span>
                            </Link>
                          ))
                        }
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 5. MULTIMEDIA & ÉVÉNEMENTS */}
      <section className="py-24 bg-brand-secondary text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="editorial-container relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                        <div>
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-2">COOP TV & EXCELLENCE</h3>
                             <h4 className="text-4xl md:text-5xl font-serif font-black italic tracking-tighter">{t('home.media_hub')}</h4>
                        </div>
                        <Link to="/multimedia" className="text-[9px] font-black border-2 border-brand-primary px-6 py-3 hover:bg-brand-primary transition-all tracking-[0.2em]">{t('home.media_cta')}</Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Main Featured Media */}
                        {multimedia[0] ? (
                            <div className="aspect-video relative group overflow-hidden cursor-pointer md:col-span-2">
                                <img src={resolveImageUrl(multimedia[0].coverImageUrl) || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" alt={multimedia[0].title} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <a href={multimedia[0].embedUrl} target="_blank" rel="noopener noreferrer" className="w-24 h-24 bg-brand-primary/90 flex items-center justify-center rounded-full shadow-3xl group-hover:scale-110 transition-all duration-500 backdrop-blur-sm">
                                        <Play className="w-8 h-8 text-white ml-2 fill-white" />
                                    </a>
                                </div>
                                <div className="absolute bottom-0 left-0 p-10 bg-gradient-to-t from-brand-secondary to-transparent w-full">
                                    <div className="flex items-center gap-4 mb-4">
                                         <span className="bg-brand-primary text-white text-[9px] font-black px-3 py-1 flex items-center gap-2 uppercase tracking-widest">
                                             {multimedia[0].type === 'video' ? '▶ Vidéo' : '♪ Podcast'}
                                         </span>
                                         <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{multimedia[0].sector}</span>
                                    </div>
                                    <h4 className="text-3xl md:text-4xl font-serif font-black hover:text-brand-accent transition-colors">{multimedia[0].title}</h4>
                                    <p className="text-sm text-white/60 mt-3 line-clamp-2 max-w-2xl">{multimedia[0].description}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video relative group overflow-hidden cursor-pointer md:col-span-2">
                                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" alt="Main Media" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Link to="/multimedia" className="w-24 h-24 bg-brand-primary/90 flex items-center justify-center rounded-full shadow-3xl group-hover:scale-110 transition-all duration-500 backdrop-blur-sm">
                                        <Play className="w-8 h-8 text-white ml-2 fill-white" />
                                    </Link>
                                </div>
                                <div className="absolute bottom-0 left-0 p-10 bg-gradient-to-t from-brand-secondary to-transparent w-full">
                                    <h4 className="text-3xl md:text-4xl font-serif font-black hover:text-brand-accent transition-colors">Découvrez notre médiathèque</h4>
                                </div>
                            </div>
                        )}

                        {/* Multimedia Grid — Videos & Podcasts */}
                        {multimedia.slice(1, 5).map((item: any) => (
                            <motion.a
                                key={item._id}
                                href={item.embedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex gap-5 items-start cursor-pointer"
                                whileHover={{ x: 8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-28 h-20 flex-shrink-0 relative overflow-hidden bg-white/5 ring-1 ring-white/10">
                                    <img src={resolveImageUrl(item.coverImageUrl) || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400"} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" alt={item.title} />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                                        <div className="w-8 h-8 bg-brand-primary/80 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                                            {item.type === 'video' ? <Play className="w-3.5 h-3.5 text-white ml-0.5 fill-white" /> : <Headphones className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary">{item.type}</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">{item.sector}</span>
                                    </div>
                                    <h5 className="text-sm font-serif font-bold leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">{item.title}</h5>
                                    <p className="text-[10px] text-white/40 mt-1.5 line-clamp-1">{item.description}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Live Events Sidebar */}
                <div className="lg:col-span-4 bg-white/5 p-10 ring-1 ring-white/10 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-10 border-b border-brand-primary pb-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-primary">{t('home.events_title')}</h3>
                        <Link to="/events" className="text-[8px] font-black uppercase text-white/50 hover:text-white transition-colors">VOIR TOUT</Link>
                    </div>
                    <div className="space-y-8">
                        {eventsLoading ? [1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse" />) :
                         events?.slice(0, 3).map((event) => (
                            <Link key={event._id} to={`/events/${event._id}`} className="flex gap-6 group cursor-pointer border-b border-white/5 pb-8 last:border-0 last:pb-0">
                                <div className="w-14 h-14 bg-white/5 border-r border-brand-primary flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-brand-primary transition-all">
                                    <span className="text-lg font-black">{new Date(event.startDate).getDate()}</span>
                                    <span className="text-[8px] font-black uppercase">{new Date(event.startDate).toLocaleString(i18n.language, { month: 'short' })}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-serif font-bold group-hover:text-brand-primary transition-colors leading-tight mb-2 line-clamp-2">{getLocalized(event.title, i18n.language)}</h4>
                                    <div className="flex items-center gap-3 text-white/40 text-[8px] font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {getLocalized(event.location, i18n.language)}</span>
                                        <span className="w-1 h-1 bg-brand-primary rounded-full" />
                                        <span>{event.type}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link to="/events" className="mt-12 btn-paper w-full text-center py-5 block tracking-[0.2em]">{t('home.view_agenda')}</Link>
                </div>
            </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="bg-white py-32 relative overflow-hidden">
          <div className="editorial-container relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                  <span className="metadata mb-6 inline-block">STRATÉGIQUE</span>
                  <h2 className="text-4xl md:text-7xl font-serif font-black text-brand-secondary tracking-tighter italic mb-8 leading-[0.9]">Transformez votre vision en certification.</h2>
                  <p className="max-w-xl text-text-muted text-lg mb-12 font-medium leading-relaxed">COOPLABEL structure l'excellence africaine par des protocoles de certification rigoureux et un réseau d'influence panafricain.</p>
                  <div className="flex flex-col sm:flex-row gap-6">
                      <Link to="/pricing" className="btn-paper px-12 py-6 text-[11px]">DÉMARRER MA CERTIFICATION</Link>
                      <Link to="/labels" className="px-12 py-6 border-2 border-brand-secondary text-brand-secondary text-[11px] font-black uppercase tracking-widest hover:bg-brand-secondary hover:text-white transition-all text-center">VOIR LES PORTAILS</Link>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  {[
                      { l: "ENTITÉS", v: "2,4k+", i: TrendingUp },
                      { l: "PAYS", v: "24", i: Globe },
                      { l: "AUDITS", v: "850", i: ShieldCheck },
                      { l: "IMPACT", v: "A+", i: Award }
                  ].map((s, idx) => (
                      <div key={idx} className="p-10 bg-surface-base border border-surface-muted hover:border-brand-primary transition-colors">
                          <s.i className="w-6 h-6 text-brand-primary mb-4" />
                          <p className="text-4xl font-serif font-black text-brand-secondary">{s.v}</p>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">{s.l}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
}

export default Home;



