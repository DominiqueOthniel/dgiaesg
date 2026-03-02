import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Edit2,
    Zap,
    Save,
    X,
    Clock,
    ExternalLink,
} from "lucide-react";
import api from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { toast, Toaster } from "react-hot-toast";
import { cn } from "../../lib/utils";

interface BreakingNews {
    _id: string;
    title: string;
    link?: string;
    active: boolean;
    priority: number;
    expiresAt?: string;
}

const BreakingNewsAdmin = () => {
    const [items, setItems] = useState<BreakingNews[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<BreakingNews>>({
        title: "",
        link: "",
        priority: 0,
        active: true,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const { data } = await api.get("/breaking-news/all");
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            toast.error("Échec de la récupération des flash infos");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item: BreakingNews) => {
        setIsEditing(item._id);
        setFormData(item);
    };

    const handleCreate = () => {
        setIsEditing("new");
        setFormData({ title: "", link: "", priority: 1, active: true });
    };

    const handleSave = async () => {
        if (!formData.title) return toast.error("Le titre est requis");
        try {
            if (isEditing === "new") {
                await api.post("/breaking-news", formData);
                toast.success("Flash info créé");
            } else {
                await api.put(`/breaking-news/${isEditing}`, formData);
                toast.success("Flash info mis à jour");
            }
            setIsEditing(null);
            fetchItems();
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Supprimer ce flash info ?")) return;
        try {
            await api.delete(`/breaking-news/${id}`);
            toast.success("Flash info supprimé");
            fetchItems();
        } catch (error) {
            toast.error("Échec de la suppression");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <Toaster position="top-right" />

            {/* Hero Control */}
            <div className="bg-brand-primary rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                            <Zap className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
                                Live Broadcast Control
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Flash Info Ticker</h1>
                        <p className="text-white/60 text-sm font-medium">Gestion du bandeau d'actualités critiques en temps réel.</p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="h-14 px-8 rounded-xl bg-brand-accent hover:bg-white hover:text-brand-primary text-brand-primary font-black uppercase text-[11px] tracking-widest border-none transition-all shadow-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Diffuser un Flash
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Panel */}
                <div className="lg:col-span-1">
                    {isEditing ? (
                        <Card className="rounded-[2rem] border-2 border-brand-primary/10 shadow-xl sticky top-24">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-brand-primary uppercase tracking-tighter">
                                        {isEditing === "new" ? "Nouveau Message" : "Édition Message"}
                                    </h3>
                                    <button onClick={() => setIsEditing(null)} className="text-slate-400 hover:text-rose-500">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contenu du Flash</label>
                                        <textarea
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 min-h-[100px]"
                                            placeholder="Ex: Alerte : Nouveau rapport sur la durabilité en Afrique Centrale..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lien de redirection (Optionnel)</label>
                                        <div className="relative">
                                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                value={formData.link}
                                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                                className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 h-12 text-sm font-medium focus:ring-2 focus:ring-brand-primary/10"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priorité (0-99)</label>
                                            <input
                                                type="number"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                                className="w-full bg-slate-50 border-none rounded-xl px-4 h-12 text-sm font-bold focus:ring-2 focus:ring-brand-primary/10"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                            <button
                                                onClick={() => setFormData({ ...formData, active: !formData.active })}
                                                className={cn(
                                                    "w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                    formData.active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                                )}
                                            >
                                                {formData.active ? "Actif" : "Désactivé"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleSave} className="w-full h-14 rounded-xl bg-brand-primary text-white font-black uppercase text-[11px] tracking-widest shadow-lg shadow-brand-primary/20">
                                    <Save className="w-4 h-4 mr-2" /> Publier sur le Ticker
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
                            <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-20" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                Sélectionnez un flash info pour le modifier ou créez-en un nouveau.
                            </p>
                        </div>
                    )}
                </div>

                {/* List Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-4 mb-2">
                        <h2 className="text-xs font-black text-brand-primary uppercase tracking-widest">
                            Messages Récents ({items.length})
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
                            ))
                        ) : items.length === 0 ? (
                            <div className="py-20 text-center opacity-30">
                                <p className="text-sm font-bold">Aucun flash info en attente.</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item._id}
                                    className={cn(
                                        "bg-white p-6 rounded-2xl border transition-all hover:shadow-lg flex items-center justify-between gap-6",
                                        !item.active ? "opacity-60 grayscale border-slate-100" : "border-slate-200/60 shadow-sm"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="w-6 h-6 rounded bg-brand-primary/5 flex items-center justify-center text-[10px] font-black text-brand-primary">
                                                {item.priority}
                                            </span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                                item.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {item.active ? "En Ligne" : "Désactivé"}
                                            </span>
                                        </div>
                                        <p className="font-bold text-brand-secondary line-clamp-1">{item.title}</p>
                                        <div className="flex items-center gap-4 mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.expiresAt || '').toLocaleDateString() === 'Invalid Date' ? 'Permanent' : `Expire le ${new Date(item.expiresAt!).toLocaleDateString()}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleEdit(item)}
                                            className="w-10 h-10 p-0 rounded-xl hover:bg-brand-primary hover:text-white transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreakingNewsAdmin;
