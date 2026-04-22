import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import {
    Plus,
    Trash2,
    Calendar,
    XCircle,
    Loader2,
    Search,
    ExternalLink
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { toast } from "react-hot-toast";
import { resolveImageUrl } from "../../lib/image";
import { cn } from "../../lib/utils";
import { FileUpload } from "../../components/ui/FileUpload";

interface MonthlyReview {
    _id: string;
    title: string;
    coverImageUrl: string;
    pdfUrl: string;
    publishDate: string;
    featured: boolean;
    published: boolean;
}

const ReviewAdmin = () => {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterFeatured, setFilterFeatured] = useState<string>("all");
    const [formData, setFormData] = useState({
        title: "",
        coverImageUrl: "",
        pdfUrl: "",
        publishDate: new Date().toISOString().split('T')[0],
        featured: false,
        published: true
    });

    const { data: reviews, isLoading } = useQuery({
        queryKey: ["adminReviews"],
        queryFn: async () => {
            const response = await api.get("/reviews");
            return response.data.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: (newReview: any) => api.post("/reviews", newReview),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
            toast.success("Revue publiée avec succès");
            setIsFormOpen(false);
            setFormData({
                title: "",
                coverImageUrl: "",
                pdfUrl: "",
                publishDate: new Date().toISOString().split('T')[0],
                featured: false,
                published: true
            });
        },
        onError: () => toast.error("Erreur lors de la publication")
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/reviews/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
            toast.success("Revue supprimée");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-brand-secondary uppercase italic tracking-tight">
                        Kiosque <span className="text-brand-primary">Digital</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-[0.2em] italic">
                        Gestion des publications mensuelles PDF
                    </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold h-12 px-8 flex items-center gap-3 shadow-lg shadow-brand-primary/20 transition-all"
                >
                    {isFormOpen ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isFormOpen ? "Annuler" : "Nouvelle Édition"}
                </Button>
            </header>

            {isFormOpen && (
                <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Titre de l'édition</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="ex: Revue Mensuelle - Mars 2026"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FileUpload
                                        label="Image de la Couverture (JPG/PNG)"
                                        defaultValue={formData.coverImageUrl}
                                        onUploadSuccess={(url) => setFormData({ ...formData, coverImageUrl: url })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <FileUpload
                                        label="Document de la Revue (PDF)"
                                        defaultValue={formData.pdfUrl}
                                        onUploadSuccess={(url) => setFormData({ ...formData, pdfUrl: url })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Date de sortie</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                                            value={formData.publishDate}
                                            onChange={e => setFormData({ ...formData, publishDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-end pb-4 pl-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-md border-slate-200 text-brand-primary focus:ring-brand-primary transition-all"
                                                checked={formData.featured}
                                                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                            />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-brand-primary">Édition Premium</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 pt-6 border-t border-slate-50">
                                <Button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="w-full md:w-auto rounded-xl bg-brand-secondary text-white font-black italic uppercase tracking-widest h-14 px-12 hover:bg-brand-primary transition-all shadow-xl shadow-brand-secondary/10"
                                >
                                    {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Plus className="w-5 h-5 mr-3" />}
                                    Publier l'édition dans le kiosque
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une édition..."
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={filterFeatured}
                        onChange={e => setFilterFeatured(e.target.value)}
                        className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
                    >
                        <option value="all">Toutes éditions</option>
                        <option value="featured">Premium uniquement</option>
                        <option value="standard">Standard uniquement</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="rounded-[2.5rem] bg-slate-50 border-none h-64 animate-pulse" />
                    ))
                ) : reviews.filter((r: MonthlyReview) => {
                    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesFeatured = filterFeatured === "all" || (filterFeatured === "featured" ? r.featured : !r.featured);
                    return matchesSearch && matchesFeatured;
                }).length === 0 ? (
                    <div className="col-span-full py-40 text-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                        <XCircle className="w-16 h-16 text-slate-200 mb-6" />
                        <h3 className="text-xl font-bold text-slate-400">Aucun résultat</h3>
                        <p className="text-sm text-slate-400 mt-2">Essayez d'autres critères de recherche.</p>
                    </div>
                ) : (
                    reviews.filter((r: MonthlyReview) => {
                        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesFeatured = filterFeatured === "all" || (filterFeatured === "featured" ? r.featured : !r.featured);
                        return matchesSearch && matchesFeatured;
                    }).map((review: MonthlyReview) => (
                        <Card key={review._id} className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white border border-slate-50 hover:-translate-y-2">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img src={resolveImageUrl(review.coverImageUrl)} alt={review.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-6 left-6 flex gap-2">
                                    {review.featured && (
                                        <Badge className="bg-brand-accent text-white border-none font-bold uppercase tracking-widest text-[8px] italic shadow-lg">PREMIUM</Badge>
                                    )}
                                    <Badge className={cn("font-bold uppercase tracking-widest text-[8px] italic shadow-lg", review.published ? "bg-success text-white" : "bg-slate-500 text-white")}>
                                        {review.published ? "EN LIGNE" : "BROUILLON"}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 text-[10px] font-black text-brand-primary uppercase tracking-widest mb-4 italic">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(review.publishDate).toLocaleDateString("fr-FR", { month: 'long', year: 'numeric' }).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-black text-brand-secondary mb-6 group-hover:text-brand-primary transition-colors uppercase italic tracking-tighter">
                                    {review.title}
                                </h3>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <a href={review.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-all italic">
                                        <ExternalLink className="w-3.5 h-3.5" /> Aperçu PDF
                                    </a>
                                    <button
                                        onClick={() => { if (window.confirm('Supprimer cette publication ?')) deleteMutation.mutate(review._id); }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-[10px] font-bold uppercase tracking-wider"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Supprimer
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewAdmin;
