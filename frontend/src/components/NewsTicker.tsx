import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import api from "../services/api";

interface BreakingNews {
    _id: string;
    title: string;
    link?: string;
}

const ensureExternalLink = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
};

const isExternalLink = (url?: string) => {
    if (!url) return false;
    return url.startsWith("http://") || url.startsWith("https://");
};

const NewsTicker = () => {
    const [items, setItems] = useState<BreakingNews[]>([]);

    useEffect(() => {
        const fetchBreaking = async () => {
            try {
                const { data } = await api.get("/breaking-news");
                if (data.success) {
                    setItems(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch breaking news", error);
            }
        };
        fetchBreaking();
    }, []);

    const streamItems = useMemo(() => {
        if (items.length === 0) return [];
        return [...items, ...items];
    }, [items]);

    if (items.length === 0) return null;

    return (
        <div className="fixed top-0 inset-x-0 z-[80] bg-brand-secondary text-white border-b border-white/5 h-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-primary/10 pointer-events-none" />
            <div className="h-full flex items-center gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/20 rounded-full border border-brand-accent/30 shrink-0">
                    <Zap className="w-3 h-3 text-brand-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Flash Info</span>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-8 min-w-max animate-flash-ticker hover:[animation-play-state:paused]">
                        {streamItems.map((item, idx) => {
                            const isExternal = isExternalLink(item.link);
                            const href = item.link ? ensureExternalLink(item.link) : "";
                            const content = (
                                <span className="text-[11px] font-bold text-slate-200 whitespace-nowrap hover:text-white transition-colors">
                                    {item.title}
                                </span>
                            );
                            return (
                                <span key={`${item._id}-${idx}`} className="flex items-center gap-4">
                                    {item.link ? (
                                        isExternal ? (
                                            <a href={href} target="_blank" rel="noopener noreferrer">
                                                {content}
                                            </a>
                                        ) : (
                                            <Link to={item.link}>
                                                {content}
                                            </Link>
                                        )
                                    ) : (
                                        content
                                    )}
                                    <span className="w-1 h-1 rounded-full bg-white/40" />
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
