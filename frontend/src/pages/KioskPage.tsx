import { motion } from "framer-motion";
import { BookOpen, Download, Calendar, ArrowUpRight, Search, Newspaper } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";
import { resolveImageUrl } from "../lib/image";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

interface MonthlyReview {
    _id: string;
    title: string;
    coverImageUrl: string;
    pdfUrl: string;
    publishDate: string;
    featured: boolean;
}

function KioskPage() {
    const [reviews, setReviews] = useState<MonthlyReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/reviews');
                if (response.data.success) {
                    setReviews(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const filteredReviews = reviews.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(r.publishDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            .toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Section */}
            <section className="bg-brand-secondary pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                Archives Éphemeres & Digitales
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight uppercase italic">
                                Le <span className="text-brand-primary">Kiosque</span> Digital
                            </h1>
                            <p className="text-lg text-slate-400 font-medium">
                                Retrouvez toutes les éditions mensuelles de notre revue d'excellence. Analyses prospectives, rapports d'impact et actualités du réseau.
                            </p>
                        </div>

                        {/* Search in Hero */}
                        <div className="w-full md:max-w-sm">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une édition..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:bg-white/10 focus:border-brand-primary transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-white rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Newspaper className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-slate-400">Aucune revue trouvée</h3>
                            <button onClick={() => setSearchQuery("")} className="text-brand-primary font-bold text-sm mt-4 hover:underline">Réinitialiser les filtres</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {filteredReviews.map((review, idx) => (
                                <motion.article
                                    key={review._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 overflow-hidden bg-white group-hover:-translate-y-2">
                                        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                                            {review.coverImageUrl ? (
                                                <img
                                                    src={resolveImageUrl(review.coverImageUrl)}
                                                    alt={review.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <BookOpen className="w-12 h-12" />
                                                </div>
                                            )}
                                            {review.featured && (
                                                <div className="absolute top-6 left-6">
                                                    <div className="px-3 py-1 rounded-full bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest shadow-lg italic">
                                                        Édition Spéciale
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                                                <a
                                                    href={review.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full"
                                                >
                                                    <Button className="w-full rounded-2xl bg-white text-slate-900 hover:bg-brand-accent hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest h-12">
                                                        Consulter le PDF
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                        <CardContent className="p-8">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">
                                                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                                {new Date(review.publishDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()}
                                            </div>
                                            <h3 className="text-xl font-black text-brand-secondary leading-tight group-hover:text-brand-primary transition-colors line-clamp-2 italic uppercase">
                                                {review.title}
                                            </h3>
                                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                                                    Détails <ArrowUpRight className="w-3 h-3" />
                                                </span>
                                                <Download className="w-4 h-4 text-slate-300" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default KioskPage;
