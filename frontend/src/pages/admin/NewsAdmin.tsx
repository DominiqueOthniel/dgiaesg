import { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Newspaper,
    User,
    Search,
    RefreshCcw,
    Filter,
    Clock
} from 'lucide-react';
import { useNews } from '../../hooks/useNews';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/Modal';
import { NewsForm } from '../../components/NewsForm';
import api from '../../services/api';
import { cn } from '../../lib/utils';
import { resolveImageUrl } from '../../lib/image';
import { useQueryClient } from '@tanstack/react-query';

const NewsAdmin = () => {
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const queryClient = useQueryClient();

    const { data: newsData, isLoading } = useNews({
        page,
        limit: 10,
        search: searchTerm,
        includeDeleted: showDeleted,
        published: undefined // Admin sees all
    });
    const news = newsData?.data || [];
    const pagination = newsData?.pagination;

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.scrollTop = 0;
    }, [page]);

    const handleCreateNews = () => {
        setEditingArticle(null);
        setIsModalOpen(true);
    };

    const handleEditNews = (article: any) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingArticle) {
                await api.put(`/news/${editingArticle._id}`, data);
                toast.success('Communiqué mis à jour avec succès');
            } else {
                await api.post('/news', data);
                toast.success('Signal publié sur le réseau');
            }
            setIsModalOpen(false);
            await queryClient.invalidateQueries({ queryKey: ['news'] });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la diffusion');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteNews = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir archiver ce communiqué ?')) return;
        try {
            await api.delete(`/news/${id}`);
            toast.success('Communiqué archivé');
            await queryClient.invalidateQueries({ queryKey: ['news'] });
        } catch (error) {
            toast.error('Échec de l\'archivage');
        }
    };

    const handleRestoreNews = async (id: string) => {
        try {
            await api.put(`/news/${id}/restore`);
            toast.success('Signal restauré');
            await queryClient.invalidateQueries({ queryKey: ['news'] });
        } catch (error) {
            toast.error('Échec de la restauration');
        }
    };

    return (
        <div className="space-y-10 pb-20">

            {/* Editorial Command Header */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            <Newspaper className="w-3.5 h-3.5" /> Centre de Rédaction Institutionnel
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary leading-none">
                            Gestion Éditoriale
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Pilotage des flux d'informations et diffusion des communiqués officiels du réseau.
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateNews}
                        className="rounded-2xl h-16 px-10 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all font-bold uppercase tracking-widest text-[11px]"
                    >
                        <Plus className="w-5 h-5 mr-3" /> Nouveau Communiqué
                    </Button>
                </div>
            </div>

            {/* Matrix & Filter Matrix */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher dans les archives éditoriales..."
                        className="w-full pl-16 pr-8 h-16 bg-white border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm font-medium transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => setShowDeleted(!showDeleted)}
                        className={cn(
                            "h-16 px-8 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                            showDeleted ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" : "bg-white text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        {showDeleted ? "Masquer les archives" : "Voir les archives"}
                    </Button>
                    <Button
                        variant="outline"
                        className="h-16 w-16 p-0 rounded-2xl border-slate-200 bg-white text-slate-500 hover:bg-slate-50 shadow-sm"
                    >
                        <Filter className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Editorial Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="h-[400px] animate-pulse bg-slate-50 border-none rounded-[2.5rem]" />
                    ))
                ) : news.length === 0 ? (
                    <div className="col-span-full py-40 text-center opacity-20">
                        <Newspaper className="w-20 h-20 mx-auto mb-8" />
                        <p className="text-sm font-bold uppercase tracking-widest">Aucun signal détecté sur le réseau</p>
                    </div>
                ) : (
                    news.map((item) => (
                        <Card key={item._id} className="group overflow-hidden rounded-[2.5rem] border-slate-200/60 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col h-full bg-white">
                            <div className="aspect-[16/10] relative overflow-hidden shrink-0">
                                {item.imageUrl ? (
                                    <img src={resolveImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                        <Newspaper className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <Badge className={cn(
                                        "rounded-full px-4 py-1.5 font-bold text-[9px] uppercase tracking-widest border-none shadow-lg",
                                        item.published ? "bg-brand-primary text-white" : "bg-white text-slate-500"
                                    )}>
                                        {item.published ? 'Diffusé' : 'Brouillon'}
                                    </Badge>
                                    {item.deletedAt && (
                                        <Badge className="rounded-full px-4 py-1.5 bg-rose-600 text-white font-bold text-[9px] uppercase tracking-widest border-none shadow-lg">
                                            Archivé
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <CardContent className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-brand-primary" />
                                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                    <span className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-brand-primary" />
                                        {item.author}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-brand-secondary group-hover:text-brand-primary transition-colors leading-snug line-clamp-2 mb-4">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-slate-400 font-medium line-clamp-2 mb-8 flex-1">
                                    {item.excerpt || item.content.substring(0, 100) + '...'}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                                    <div className="flex gap-2">
                                        {item.deletedAt ? (
                                            <button
                                                onClick={() => handleRestoreNews(item._id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-[10px] font-bold uppercase tracking-wider"
                                            >
                                                <RefreshCcw className="w-3.5 h-3.5" /> Restaurer
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditNews(item)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all text-[10px] font-bold uppercase tracking-wider"
                                                    title="Modifier"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" /> Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNews(item._id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-[10px] font-bold uppercase tracking-wider"
                                                    title="Archiver"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Archiver
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination Matrix */}
            {pagination && pagination.pages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Sequence <span className="text-brand-secondary">{page} sur {pagination.pages}</span> du flux éditorial
                    </p>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="h-12 px-10 rounded-xl border-slate-200 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                        >
                            Périmètre Précédent
                        </Button>
                        <Button
                            variant="outline"
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="h-12 px-10 rounded-xl border-slate-200 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                        >
                            Suivant
                        </Button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingArticle ? 'Édition du Communiqué' : 'Initialisation de Signal'}
                width="2xl"
            >
                <div className="p-10">
                    <NewsForm
                        initialData={editingArticle}
                        onSubmit={handleFormSubmit}
                        isLoading={isSubmitting}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default NewsAdmin;
