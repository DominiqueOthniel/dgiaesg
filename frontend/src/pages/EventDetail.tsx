import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, MapPin, Loader2, ShieldCheck, ArrowLeft, ExternalLink } from "lucide-react";
import api from "../services/api";
import { getLocalized } from "../lib/utils";
import type { IEvent } from "../types";

const EventDetail = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();

    const { data: event, isLoading, error } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const response = await api.get(`/events/${id}`);
            return response.data.data as IEvent;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen pt-40 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen pt-40 text-center">
                <h2 className="text-2xl font-black mb-4">Événement introuvable</h2>
                <Link to="/events" className="text-brand-primary font-bold uppercase tracking-widest text-[10px] hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Retour à l'agenda
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 bg-white">
            {/* Split Header */}
            <div className="flex flex-col lg:flex-row h-auto lg:h-[65vh] border-b border-slate-100">
                <div className="flex-1 bg-brand-secondary p-12 lg:p-20 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -mr-32 -mt-32" />
                    
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10"
                    >
                        <Link to="/events" className="inline-flex items-center gap-2 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-12 hover:translate-x-[-4px] transition-transform">
                            <ArrowLeft className="w-4 h-4" /> {t('events.back_to_list')}
                        </Link>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <span className="px-3 py-1 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest">
                                {event.type}
                            </span>
                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest border-l border-white/20 pl-4">
                                Réf: {event._id.slice(-8).toUpperCase()}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-sans font-black text-white leading-[1.05] tracking-tight italic mb-10">
                            {getLocalized(event.title, i18n.language)}
                        </h1>

                        <div className="flex flex-wrap gap-8 text-white/60">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-brand-primary" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Date</span>
                                    <span className="text-sm font-bold text-white">
                                        {new Date(event.startDate).toLocaleDateString(i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-brand-primary" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Lieu</span>
                                    <span className="text-sm font-bold text-white">{getLocalized(event.location, i18n.language)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="flex-1 relative order-first lg:order-none">
                    <img 
                        src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"} 
                        alt={getLocalized(event.title, i18n.language)}
                        className="w-full h-full object-cover"
                    />
                    {event.featured && (
                        <div className="absolute top-0 right-0 bg-brand-accent text-brand-secondary py-3 px-8 font-black uppercase tracking-[0.4em] text-[9px] shadow-tactile z-30">
                            À L'AFFICHE
                        </div>
                    )}
                </div>
            </div>

            <div className="editorial-container mt-12 lg:-mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Description & Agenda */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 lg:p-16 border border-surface-muted shadow-2xl">
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-[10px] font-black mb-8 uppercase tracking-[0.4em] text-brand-primary border-b border-slate-100 pb-4 inline-block">{t('common.details')}</h3>
                                <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium mb-12">
                                    {getLocalized(event.description, i18n.language)}
                                </p>

                                {/* Agenda Section */}
                                {event.agenda && event.agenda.length > 0 && (
                                    <div className="mt-16">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="h-0.5 flex-1 bg-surface-muted" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary whitespace-nowrap">
                                                {t('events.agenda_title')}
                                            </h4>
                                            <div className="h-0.5 flex-1 bg-surface-muted" />
                                        </div>

                                        <div className="space-y-0">
                                            {event.agenda.map((item, idx) => (
                                                <div key={idx} className="flex group">
                                                    <div className="w-32 flex-shrink-0 py-8 border-r border-surface-muted relative">
                                                        <span className="text-sm font-black text-brand-secondary tabular-nums">{item.time}</span>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-brand-primary border-4 border-white rounded-full translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="flex-1 py-8 pl-12 group-hover:bg-surface-base transition-colors border-b border-surface-muted last:border-0">
                                                        <h5 className="text-[11px] font-black uppercase tracking-widest text-brand-primary mb-2">
                                                            {getLocalized(item.label, i18n.language)}
                                                        </h5>
                                                        {item.description && (
                                                            <p className="text-sm text-slate-500">{getLocalized(item.description, i18n.language)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Registration & Organizer */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            {/* Registration Card */}
                            <div className="bg-brand-secondary text-white p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                                <h3 className="text-xl font-black mb-8 leading-tight">
                                    Prêt à rejoindre l'événement ?
                                </h3>
                                <a 
                                    href={event.registrationUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-brand-primary text-white text-center py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-brand-secondary transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 group/reg"
                                >
                                    {t('events.register')} <ExternalLink className="w-4 h-4 group-hover/reg:translate-x-1 group-hover/reg:-translate-y-1 transition-transform" />
                                </a>
                                <p className="mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                    * L'inscription est obligatoire pour accéder aux sessions en direct et recevoir les supports.
                                </p>
                            </div>

                            {/* Organizer Card */}
                            <div className="bg-white border border-surface-muted p-10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-6">
                                    {t('events.organizer')}
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-surface-base rounded-sm flex items-center justify-center border border-surface-muted">
                                        <ShieldCheck className="w-6 h-6 text-brand-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-brand-secondary">
                                            {getLocalized(event.organizer, i18n.language)}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            Partenaire Certifié
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
