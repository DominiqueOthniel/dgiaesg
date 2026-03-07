import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";
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

const NewsTicker = () => {
    const [items, setItems] = useState<BreakingNews[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    useEffect(() => {
        if (items.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % items.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [items]);

    if (items.length === 0) return null;

    return (
        <div className="bg-brand-secondary text-white py-2 border-b border-white/5 relative z-[60] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 relative">
                {/* Label */}
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/20 rounded-full border border-brand-accent/30 shrink-0 shadow-[0_0_15px_rgba(var(--brand-accent-rgb),0.2)]">
                    <Zap className="w-3 h-3 text-brand-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
                        Flash Info
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 relative h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center"
                        >
                            <p className="text-xs font-bold text-slate-200 truncate pr-4">
                                {items[currentIndex].title}
                            </p>
                            {items[currentIndex].link && (
                                <a
                                    href={ensureExternalLink(items[currentIndex].link)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-black text-brand-accent hover:text-white transition-all uppercase tracking-widest border-l border-white/10 pl-4 h-4"
                                >
                                    Poursuivre <ChevronRight className="w-3 h-3" />
                                </a>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls / Stats */}
                <div className="hidden sm:flex items-center gap-2">
                    <div className="flex gap-1">
                        {items.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-brand-accent w-3' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
