import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Loader2, ChevronRight, Filter, Clock, Search, ArrowRight, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { IEvent } from "../types";
import { cn, getLocalized } from "../lib/utils";

const Events = () => {
    const { t, i18n } = useTranslation();
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: eventsData, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await api.get('/events');
            return response.data.data as IEvent[];
        }
    });

    const filteredEvents = eventsData?.filter(event => {
        const matchesFilter = filter === "all" || event.type === filter;
        const matchesSearch = getLocalized(event.title, i18n.language).toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const categories = [
        { id: "all", label: "Tous" },
        { id: "workshop", label: "Workshops" },
        { id: "conference", label: "Conférences" },
        { id: "training", label: "Formations" },
        { id: "certification", label: "Certification" }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen pt-40 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Chargement de l'agenda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-32">
            {/* Editorial Hero Section */}
            <div className="bg-brand-secondary pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-brand-primary/5 -skew-x-12 translate-x-1/4" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="h-[1px] w-12 bg-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">DGIA ESG Agenda</span>
                        </div>
                        <h1 className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-sans font-black text-white leading-[0.95] tracking-tight italic mb-10">
                            Connecter <br/> <span className="text-brand-accent">L'Impact.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl border-l-2 border-brand-accent pl-8">
                            Participez aux moments clés de la transformation économique africaine. Workshops exclusifs, sommets stratégiques et sessions de certification.
                        </p>
                    </motion.div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 right-10 flex items-center gap-4 opacity-20">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white rotate-90 origin-right">Scroll</span>
                    <div className="h-12 w-[1px] bg-white mt-12" />
                </div>
            </div>

            {/* Strategy Filter Bar */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
                <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-4 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={cn(
                                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === cat.id 
                                        ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20" 
                                        : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="w-full lg:w-auto flex items-center gap-4 pl-0 lg:pl-10 border-l-0 lg:border-l border-slate-100">
                        <div className="relative flex-1 lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Rechercher un événement..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-12 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Asymmetrical Agenda Grid */}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                {filteredEvents && filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {filteredEvents.map((event, index) => {
                            const isFeatured = index % 5 === 0;
                            return (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (index % 3) * 0.1 }}
                                    className={cn(
                                        "group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-2",
                                        isFeatured ? "md:col-span-8 md:aspect-[21/10]" : "md:col-span-4"
                                    )}
                                >
                                    <div className="flex flex-col h-full">
                                        {/* Dynamic Header: Image & Badge */}
                                        <div className={cn("relative overflow-hidden", isFeatured ? "md:h-full md:w-1/2" : "aspect-[16/10]")}>
                                            <img 
                                                src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"} 
                                                alt={getLocalized(event.title, i18n.language)} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-brand-secondary/20 group-hover:bg-brand-secondary/0 transition-colors duration-700" />
                                            
                                            {/* Premium Date Badge */}
                                            <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl flex flex-col items-center min-w-[65px] border border-white/20">
                                                <span className="text-2xl font-black text-brand-secondary tabular-nums leading-none">
                                                    {new Date(event.startDate).getDate()}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mt-1">
                                                    {new Date(event.startDate).toLocaleDateString(i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US', { month: 'short' }).toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Type Badge */}
                                            <div className="absolute bottom-8 right-8">
                                                <span className="px-4 py-1.5 bg-brand-accent text-brand-secondary text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                                                    {event.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Editorial Content */}
                                        <div className={cn("p-10 flex flex-col", isFeatured ? "md:w-1/2 justify-center" : "flex-1")}>
                                            <div className="flex items-center gap-6 mb-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                                                    {new Date(event.startDate).toLocaleTimeString(i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                                                    {getLocalized(event.location, i18n.language)}
                                                </div>
                                            </div>

                                            <h3 className={cn("font-sans font-black text-brand-secondary leading-tight group-hover:text-brand-primary transition-colors mb-6", isFeatured ? "text-3xl lg:text-4xl" : "text-xl")}>
                                                {getLocalized(event.title, i18n.language)}
                                            </h3>

                                            <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-3 mb-10">
                                                {getLocalized(event.description, i18n.language)}
                                            </p>

                                            <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                                                <Link 
                                                    to={`/events/${event._id}`}
                                                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary group/nav"
                                                >
                                                    Réserver ma place <ArrowRight className="w-4 h-4 group-hover/nav:translate-x-2 transition-transform" />
                                                </Link>
                                                <button className="p-3 rounded-full hover:bg-slate-50 text-slate-300 hover:text-brand-primary transition-all">
                                                    <Bookmark className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Responsive Flex Adjustment for Featured */}
                                    {isFeatured && (
                                        <style dangerouslySetInnerHTML={{ __html: `
                                            @media (min-width: 768px) {
                                                .md\\:col-span-8 > div { flex-direction: row; }
                                            }
                                        `}} />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-100 rounded-[3rem] py-40 text-center shadow-xl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <Calendar className="w-20 h-20 text-slate-100 mx-auto mb-8" />
                            <h2 className="text-3xl font-black text-brand-secondary mb-4 italic uppercase tracking-tighter">Aucun Événement Trouvé</h2>
                            <p className="text-slate-400 font-medium mb-10">Essayez de modifier vos filtres ou revenez plus tard.</p>
                            <button 
                                onClick={() => { setFilter("all"); setSearchQuery(""); }}
                                className="px-8 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl hover:bg-brand-secondary transition-all"
                            >
                                Réinitialiser les filtres
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>
            
            {/* Newsletter Integration */}
            <div className="max-w-7xl mx-auto px-6 mt-32">
                <div className="bg-brand-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/10 transition-colors duration-1000" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl text-center lg:text-left">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-accent mb-6 block">Ne manquez rien</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight italic tracking-tighter mb-8">
                                L'Excellence <br className="hidden md:block"/> dans votre boîte mail.
                            </h2>
                            <p className="text-lg text-white/70 font-medium leading-relaxed">
                                Recevez les invitations prioritaires pour nos sommets et les rapports d'impact mensuels.
                            </p>
                        </div>
                        <div className="w-full lg:w-[450px]">
                            <form className="relative">
                                <input 
                                    type="email" 
                                    placeholder="VOTRE ADRESSE EMAIL..." 
                                    className="w-full bg-white/10 border border-white/20 rounded-full py-5 px-10 text-white placeholder:text-white/30 text-xs font-black tracking-widest outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
                                />
                                <button className="absolute right-2 top-2 bottom-2 bg-brand-accent text-brand-secondary px-8 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                                    S'abonner
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;
