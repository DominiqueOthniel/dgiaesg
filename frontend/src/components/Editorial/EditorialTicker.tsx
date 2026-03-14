import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import api from "../../services/api";

interface BreakingNews {
    _id: string;
    title: string;
    link?: string;
}

const EditorialTicker = () => {
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

    if (items.length === 0) return null;

    // Duplicate items to ensure smooth infinite scroll
    const displayItems = [...items, ...items, ...items];

    return (
        <div className="fixed top-0 left-0 w-full bg-brand-secondary text-brand-accent h-10 flex items-center overflow-hidden border-b border-white/10 z-[110]">
            <div className="flex items-center bg-brand-primary h-full px-6 gap-3 shrink-0 relative z-10 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                <Zap className="w-3 h-3 fill-current animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Flash Info</span>
            </div>
            
            <div className="flex-1 flex items-center overflow-hidden relative">
                <div 
                    className="flex whitespace-nowrap animate-ticker hover:[animation-play-state:paused] cursor-pointer"
                    style={{ animationDuration: `${items.length * 10}s` }}
                >
                    {displayItems.map((item, idx) => (
                        <div key={`${item._id}-${idx}`} className="flex items-center px-8 border-r border-brand-accent/10 group">
                            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-brand-primary transition-colors">
                                {item.title}
                            </span>
                            <div className="w-1.5 h-1.5 bg-brand-primary rotate-45 ml-8 opacity-40" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditorialTicker;
