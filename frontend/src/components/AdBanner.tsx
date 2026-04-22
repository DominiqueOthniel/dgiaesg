import { useState, useEffect } from "react";
import api from "../services/api";
import { resolveImageUrl } from "../lib/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { cn, handleImageError } from "../lib/utils";

interface Ad {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    logoUrl?: string;
    targetUrl: string;
    ctaText?: string;
    position: "sidebar" | "top" | "inline";
}

interface AdBannerProps {
    position: "sidebar" | "top" | "inline";
    className?: string;
}

export default function AdBanner({ position, className }: AdBannerProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await api.get(`/ads/random?position=${position}`);
                if (response.data.success) {
                    setAd(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch ad", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [position]);

    const handleAdClick = async () => {
        if (!ad) return;
        try {
            await api.post(`/ads/${ad._id}/click`);
        } catch (error) {
            console.error("Failed to track ad click", error);
        }
    };

    if (loading || !ad) return null;

    // Top Banner Layout (Announcement style)
    if (position === "top") {
        return (
            <div className={cn("w-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm", className)}>
                <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" onClick={handleAdClick} className="flex items-center p-6 md:p-8 group">
                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-2 shrink-0 shadow-sm">
                                <img src={resolveImageUrl(ad.logoUrl || ad.imageUrl)} alt="Sponsor" onError={handleImageError} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-0.5">Sponsorisé</span>
                                <h4 className="text-lg font-black text-brand-secondary group-hover:text-brand-primary transition-colors italic uppercase tracking-tight">{ad.title}</h4>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 md:ml-10 max-w-xl group-hover:text-slate-700 transition-colors">
                            {ad.description || "Découvrez nos solutions exclusives pour l'économie durable."}
                        </p>
                    </div>
                    <div className="hidden md:block ml-auto">
                        <div className="flex items-center gap-3 px-6 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-primary/20 group-hover:bg-brand-secondary transition-all">
                            {ad.ctaText || "En savoir plus"} <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </a>
            </div>
        );
    }

    // Sidebar Layout (Widget style)
    if (position === "sidebar") {
        return (
            <div className={cn("bg-gradient-to-br from-white to-slate-50 border border-brand-primary/10 rounded-[2.5rem] p-8 shadow-modern flex flex-col items-center text-center group relative overflow-hidden", className)}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand-primary rounded-full animate-pulse" />
                    Partenaire Stratégique
                </span>
                
                <div className="w-20 h-20 bg-white rounded-2xl shadow-tactile border border-brand-primary/10 p-4 mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:rotate-3">
                    <img src={resolveImageUrl(ad.logoUrl || ad.imageUrl)} alt="Sponsor" onError={handleImageError} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                </div>
                
                <h4 className="text-xl font-black text-brand-secondary mb-4 uppercase italic tracking-tighter leading-snug group-hover:text-brand-primary transition-colors">
                    {ad.title}
                </h4>
                
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                    {ad.description || "Solutions expertes pour la croissance et la conformité."}
                </p>
                
                <a 
                    href={ad.targetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={handleAdClick}
                    className="w-full py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary hover:shadow-brand-secondary/30 transition-all text-center flex items-center justify-center gap-2 group/btn"
                >
                    {ad.ctaText || "Explorer"} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
            </div>
        );
    }

    // Inline Layout (Card style - matches content)
    return (
        <div className={cn("bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-10 group relative overflow-hidden flex flex-col h-full", className)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] italic">Partenariat</span>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors" />
                </div>
                
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 ring-1 ring-slate-100 group-hover:ring-brand-primary/30 transition-all">
                    <img 
                        src={resolveImageUrl(ad.imageUrl)} 
                        alt={ad.title} 
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    />
                </div>

                <h4 className="text-2xl font-serif font-black text-brand-secondary leading-tight mb-4 group-hover:text-brand-primary transition-colors">
                    {ad.title}
                </h4>
                
                <p className="text-sm font-medium text-slate-500/80 leading-relaxed mb-10 italic">
                    "{ad.description || "L'excellence au service de votre transformation sectorielle."}"
                </p>

                <div className="mt-auto">
                    <a 
                        href={ad.targetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={handleAdClick}
                        className="inline-flex items-center gap-4 text-[10px] font-black text-brand-primary uppercase tracking-widest group/btn"
                    >
                        {ad.ctaText || "DÉCOUVRIR LE PROJET"}
                        <div className="w-8 h-8 rounded-full border border-brand-primary/20 flex items-center justify-center group-hover/btn:bg-brand-primary group-hover/btn:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
