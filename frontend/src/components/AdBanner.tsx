import { useState, useEffect } from "react";
import api from "../services/api";
import { resolveImageUrl } from "../lib/image";
import { ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";

interface Ad {
    _id: string;
    title: string;
    imageUrl: string;
    targetUrl: string;
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

    const isTop = position === "top";

    return (
        <div className={cn(
            "group relative overflow-hidden",
            isTop ? "w-full my-8" : "",
            className
        )}>
            <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAdClick}
                className="block"
            >
                <div className={cn(
                    "relative bg-slate-100 rounded-3xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 border border-slate-100",
                    isTop ? "aspect-[21/9] md:aspect-[32/9]" : "aspect-[4/5]"
                )}>
                    <img
                        src={resolveImageUrl(ad.imageUrl) || ""}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-brand-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6",
                        isTop ? "p-4 md:p-10" : "p-6"
                    )}>
                        <p className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            Sponsorisé <ExternalLink className="w-3 h-3" />
                        </p>
                        <h4 className={cn(
                            "text-white font-bold mt-1",
                            isTop ? "text-lg md:text-2xl" : "text-sm"
                        )}>
                            {ad.title}
                        </h4>
                    </div>

                    {/* Tiny Badge always visible */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-[8px] font-black text-white uppercase tracking-widest">
                        Ad
                    </div>
                </div>
            </a>
        </div>
    );
}
