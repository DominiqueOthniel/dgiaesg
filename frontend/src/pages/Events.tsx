import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, MapPin, Loader2, ChevronRight, Filter, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { IEvent } from "../types";
import { cn, getLocalized } from "../lib/utils";

const Events = () => {
    const { t, i18n } = useTranslation();
    const [filter, setFilter] = useState<string>("all");

    const { data: eventsData, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await api.get('/events');
            return response.data.data as IEvent[];
        }
    });

    const filteredEvents = eventsData?.filter(event => {
        if (filter === "all") return true;
        return event.type === filter;
    });

    const categories = [
        { id: "all", label: t('common.all') },
        { id: "workshop", label: "Workshop" },
        { id: "conference", label: "Conference" },
        { id: "training", label: "Training" },
        { id: "certification", label: "Certification" }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen pt-40 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-20 bg-surface-base">
            {/* Hero Section */}
            <div className="bg-brand-secondary text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-10" />
                <div className="editorial-container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block px-4 py-1.5 bg-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                            Agenda Institutionnel
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter italic">
                            {t('events.title')}
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            {t('events.subtitle')}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="editorial-container -mt-12 relative z-20">
                {/* Filter Bar */}
                <div className="bg-white border border-surface-muted p-4 shadow-xl flex flex-wrap items-center gap-4 mb-12">
                    <div className="flex items-center gap-3 pr-6 border-r border-surface-muted mr-2">
                        <Filter className="w-4 h-4 text-brand-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Filtrer par type</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={cn(
                                    "px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-all border",
                                    filter === cat.id 
                                        ? "bg-brand-primary border-brand-primary text-white shadow-lg" 
                                        : "bg-surface-base border-surface-muted text-slate-500 hover:border-brand-primary/30"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                {filteredEvents && filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white border border-surface-muted shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden"
                            >
                                {/* Image Wrapper */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img 
                                        src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
                                        alt={getLocalized(event.title, i18n.language)} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-lg flex flex-col items-center min-w-[50px]">
                                        <span className="text-brand-primary text-lg font-black leading-none">
                                            {new Date(event.startDate).getDate()}
                                        </span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-secondary">
                                            {new Date(event.startDate).toLocaleDateString(i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US', { month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <span className="px-3 py-1 bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest">
                                            {event.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                            {new Date(event.startDate).getFullYear()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-brand-primary" />
                                            {new Date(event.startDate).toLocaleTimeString(i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                                        {getLocalized(event.title, i18n.language)}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-3 leading-relaxed">
                                        {getLocalized(event.description, i18n.language)}
                                    </p>
                                    
                                    <div className="mt-auto pt-8 border-t border-surface-muted flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-brand-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest truncate max-w-[120px]">
                                                {getLocalized(event.location, i18n.language)}
                                            </span>
                                        </div>
                                        <Link 
                                            to={`/events/${event._id}`}
                                            className="w-10 h-10 bg-brand-secondary text-white flex items-center justify-center hover:bg-brand-primary transition-all shadow-lg shadow-brand-secondary/20"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-surface-muted py-32 text-center shadow-xl">
                        <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-brand-secondary mb-2">{t('events.no_events')}</h2>
                        <button 
                            onClick={() => setFilter("all")}
                            className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline"
                        >
                            Voir tous les événements
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
