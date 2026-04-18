import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Calendar, ExternalLink, Loader2, Newspaper } from 'lucide-react';
import { Button } from './ui/Button';
import api from '../services/api';
import { resolveImageUrl } from '../lib/image';

interface MonthlyReview {
    _id: string;
    title: string;
    coverImageUrl: string;
    pdfUrl: string;
    publishDate: string;
    featured: boolean;
}

export const ReviewKiosk = () => {
    const [review, setReview] = useState<MonthlyReview | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatestReview = async () => {
            try {
                const response = await api.get('/reviews/latest');
                if (response.data.success && response.data.data) {
                    setReview(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch latest review:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatestReview();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-slate-50 rounded-[2rem] p-8 animate-pulse flex flex-col items-center">
                <div className="w-full aspect-[3/4] bg-white rounded-2xl mb-6 shadow-sm flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
                </div>
                <div className="h-4 w-3/4 bg-slate-200 rounded-full mb-3" />
                <div className="h-4 w-1/2 bg-slate-200 rounded-full" />
            </div>
        );
    }

    if (!review) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="group"
        >
            <div className="bg-brand-secondary rounded-[2.5rem] p-8 overflow-hidden relative border border-white/5 shadow-2xl shadow-slate-200/50">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-brand-primary/20 transition-colors" />

                <div className="relative">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] italic">La Revue</span>
                            <span className="block text-xs font-bold text-white uppercase tracking-widest">En Kiosque</span>
                        </div>
                    </div>

                    <div className="relative mb-10 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500 relative bg-white border-2 border-white/10">
                            {review.coverImageUrl ? (
                                <img
                                    src={resolveImageUrl(review.coverImageUrl)}
                                    alt={review.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                    <Newspaper className="w-16 h-16" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    <h4 className="text-xl font-black text-white mb-3 italic tracking-tight leading-tight">
                        {review.title}
                    </h4>

                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 italic">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                            {new Date(review.publishDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-brand-primary" />
                        <span className="text-white">Édition Spéciale</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <a
                            href={review.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <Button
                                className="w-full rounded-2xl h-14 bg-brand-primary hover:bg-white hover:text-brand-secondary transition-all font-bold text-xs uppercase tracking-widest gap-3 shadow-xl shadow-brand-primary/20"
                            >
                                <Download className="w-4 h-4" /> Télécharger (PDF)
                            </Button>
                        </a>
                        <Button
                            variant="ghost"
                            className="w-full text-slate-400 hover:text-white font-bold text-[10px] uppercase tracking-widest gap-2 italic"
                        >
                            Lire en ligne <ExternalLink className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
