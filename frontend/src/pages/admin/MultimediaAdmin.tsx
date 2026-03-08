import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Edit2,
    Play,
    Mic,
    Save,
    X,
    Star,
    Search,
    ExternalLink,
} from "lucide-react";
import api from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { toast } from "react-hot-toast";
import { cn } from "../../lib/utils";
import type { IMultimedia } from "../../types";
import { resolveImageUrl } from "../../lib/image";
import { FileUpload } from "../../components/ui/FileUpload";

const MultimediaAdmin = () => {
    const [items, setItems] = useState<IMultimedia[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterSector, setFilterSector] = useState<string>("all");
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<IMultimedia>>({
        title: "",
        description: "",
        type: "video",
        embedUrl: "",
        coverImageUrl: "",
        sector: "finance",
        featured: false,
        published: true,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const { data } = await api.get("/multimedia?published=all");
            if (data.status === "success") {
                setItems(data.data);
            }
        } catch (error) {
            toast.error("Échec de la récupération des médias");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item: IMultimedia) => {
        setIsEditing(item._id);
        setFormData(item);
    };

    const handleCreate = () => {
        setIsEditing("new");
        setFormData({
            title: "",
            description: "",
            type: "video",
            embedUrl: "",
            coverImageUrl: "",
            sector: "finance",
            featured: false,
            published: true,
        });
    };

    const handleSave = async () => {
        if (!formData.title || !formData.embedUrl) {
            return toast.error("Le titre et l'URL sont requis");
        }
        try {
            if (isEditing === "new") {
                await api.post("/multimedia", formData);
                toast.success("Média créé avec succès");
            } else {
                await api.patch(`/multimedia/${isEditing}`, formData);
                toast.success("Média mis à jour");
            }
            setIsEditing(null);
            fetchItems();
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Supprimer ce contenu multimédia ?")) return;
        try {
            await api.delete(`/multimedia/${id}`);
            toast.success("Média supprimé");
            fetchItems();
        } catch (error) {
            toast.error("Échec de la suppression");
        }
    };

    const sectors = ["finance", "governance", "tech", "energy", "leadership"];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || item.type === filterType;
        const matchesSector = filterSector === "all" || item.sector === filterSector;
        return matchesSearch && matchesType && matchesSector;
    });

    return (
        <div className="space-y-8 pb-20">

            {/* Hero Control */}
            <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                            <Play className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
                                Multimedia Hub Control
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">FA TV & Podcasts</h1>
                        <p className="text-white/60 text-sm font-medium">Gestion du contenu vidéo et audio haute performance.</p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="h-14 px-8 rounded-xl bg-brand-accent hover:bg-white hover:text-brand-primary text-brand-primary font-black uppercase text-[11px] tracking-widest border-none transition-all shadow-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Nouveau Média
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Panel */}
                <div className="lg:col-span-1">
                    {isEditing ? (
                        <Card className="rounded-[2rem] border-2 border-slate-100 shadow-xl sticky top-24">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                        {isEditing === "new" ? "Nouveau Contenu" : "Édition Contenu"}
                                    </h3>
                                    <button onClick={() => setIsEditing(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre du média</label>
                                        <input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl px-4 h-12 text-sm font-bold focus:ring-2 focus:ring-brand-primary/10"
                                            placeholder="Ex: Interview exclusive CSR 2024"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                                className="w-full bg-slate-50 border-none rounded-xl px-4 h-12 text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 appearance-none"
                                            >
                                                <option value="video">Vidéo</option>
                                                <option value="audio">Audio / Podcast</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secteur</label>
                                            <select
                                                value={formData.sector}
                                                onChange={(e) => setFormData({ ...formData, sector: e.target.value as any })}
                                                className="w-full bg-slate-50 border-none rounded-xl px-4 h-12 text-sm font-bold focus:ring-2 focus:ring-brand-primary/10 appearance-none"
                                            >
                                                {sectors.map((s) => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Embed URL (YouTube/Spotify)</label>
                                        <div className="relative">
                                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                value={formData.embedUrl}
                                                onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                                                className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 h-12 text-sm font-medium focus:ring-2 focus:ring-brand-primary/10"
                                                placeholder="https://youtube.com/embed/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <FileUpload
                                            label="Image de Couverture"
                                            defaultValue={formData.coverImageUrl}
                                            onUploadSuccess={(url) => setFormData({ ...formData, coverImageUrl: url })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary/10 min-h-[100px]"
                                            placeholder="Résumé du contenu..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                            className={cn(
                                                "h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2",
                                                formData.featured ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                            )}
                                        >
                                            <Star className={cn("w-3.5 h-3.5", formData.featured && "fill-amber-600")} />
                                            Mise en avant
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                                            className={cn(
                                                "h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                formData.published ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                            )}
                                        >
                                            {formData.published ? "Publié" : "Brouillon"}
                                        </button>
                                    </div>
                                </div>

                                <Button onClick={handleSave} className="w-full h-14 rounded-xl bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest shadow-lg">
                                    <Save className="w-4 h-4 mr-2" /> Enregistrer le Média
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
                            <Play className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-20" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                Gérez vos interviews et podcasts. Sélectionnez un élément ou créez-en un nouveau.
                            </p>
                        </div>
                    )}
                </div>

                {/* List Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 mb-2">
                        <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                            Contenus Récents ({filteredItems.length})
                        </h2>

                        <div className="flex flex-1 max-w-md items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/10"
                            >
                                <option value="all">Tous types</option>
                                <option value="video">Vidéos</option>
                                <option value="audio">Podcasts</option>
                            </select>
                            <select
                                value={filterSector}
                                onChange={(e) => setFilterSector(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/10"
                            >
                                <option value="all">Secteurs</option>
                                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
                            ))
                        ) : filteredItems.length === 0 ? (
                            <div className="py-20 text-center opacity-30">
                                <p className="text-sm font-bold">Aucun résultat pour cette recherche.</p>
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <div
                                    key={item._id}
                                    className={cn(
                                        "bg-white p-6 rounded-2xl border transition-all hover:shadow-lg flex items-center justify-between gap-6",
                                        !item.published ? "opacity-60 border-slate-100" : "border-slate-200/60 shadow-sm"
                                    )}
                                >
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative group">
                                            {item.coverImageUrl ? (
                                                <img src={resolveImageUrl(item.coverImageUrl) || ""} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {item.type === "video" ? <Play className="w-6 h-6 text-slate-300" /> : <Mic className="w-6 h-6 text-slate-300" />}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ExternalLink className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                                    item.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {item.published ? "En Ligne" : "Brouillon"}
                                                </span>
                                                {item.featured && (
                                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                                        <Star className="w-2 h-2 fill-amber-700" /> Vedette
                                                    </span>
                                                )}
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-l pl-2 ml-1">
                                                    {item.type} • {item.sector}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-medium">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all text-[10px] font-bold uppercase tracking-wider"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-[10px] font-bold uppercase tracking-wider"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
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

export default MultimediaAdmin;
