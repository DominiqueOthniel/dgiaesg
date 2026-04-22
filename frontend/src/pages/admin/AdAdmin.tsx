import { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Activity,
    Eye,
    MousePointer2,
    Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/Modal';
import api from '../../services/api';
import { resolveImageUrl } from '../../lib/image';
import { cn } from '../../lib/utils';
import { FileUpload } from '../../components/ui/FileUpload';

const AdAdmin = () => {
    const [ads, setAds] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPosition, setFilterPosition] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAds = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ads');
            if (response.data.success) {
                setAds(response.data.data);
            }
        } catch (error) {
            toast.error('Erreur lors du chargement des publicités');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleCreateAd = () => {
        setEditingAd(null);
        setIsModalOpen(true);
    };

    const handleEditAd = (ad: any) => {
        setEditingAd(ad);
        setIsModalOpen(true);
    };

    const handleDeleteAd = async (id: string) => {
        if (!window.confirm('Supprimer cette publicité ?')) return;
        try {
            await api.delete(`/ads/${id}`);
            toast.success('Publicité supprimée');
            fetchAds();
        } catch (error) {
            toast.error('Erreur de suppression');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Convert checkbox to boolean
        const payload = {
            ...data,
            active: formData.get('active') === 'on'
        };

        try {
            if (editingAd) {
                await api.put(`/ads/${editingAd._id}`, payload);
                toast.success('Publicité mise à jour');
            } else {
                await api.post('/ads', payload);
                toast.success('Publicité créée');
            }
            setIsModalOpen(false);
            fetchAds();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAds = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ad.targetUrl.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPosition = filterPosition === "all" || ad.position === filterPosition;
        const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? ad.active : !ad.active);
        return matchesSearch && matchesPosition && matchesStatus;
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            <Activity className="w-3.5 h-3.5" /> Ad Manager & Analytics
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary">Gestion Publicitaire</h1>
                        <p className="text-slate-400 font-medium max-w-xl">Pilotez les campagnes de vos partenaires et suivez les performances d'affichage.</p>
                    </div>
                    <Button onClick={handleCreateAd} className="rounded-2xl h-16 px-10 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg font-bold uppercase tracking-widest text-[11px]">
                        <Plus className="w-5 h-5 mr-3" /> Nouvelle Campagne
                    </Button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                <div className="flex-1 w-full max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une campagne ou URL..."
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all shadow-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterPosition}
                        onChange={e => setFilterPosition(e.target.value)}
                        className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/5 shadow-sm"
                    >
                        <option value="all">Déploiements</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="top">Top Banner</option>
                        <option value="inline">Inline</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-primary/5 shadow-sm"
                    >
                        <option value="all">Statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Désactivés</option>
                    </select>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Impressions", val: ads.reduce((acc, a) => acc + (a.impressions || 0), 0), icon: Eye, color: "text-blue-600" },
                    { label: "Total Clicks", val: ads.reduce((acc, a) => acc + (a.clicks || 0), 0), icon: MousePointer2, color: "text-emerald-600" },
                    { label: "Average CTR", val: ((ads.reduce((acc, a) => acc + (a.clicks || 0), 0) / (ads.reduce((acc, a) => acc + (a.impressions || 0), 0) || 1)) * 100).toFixed(2) + "%", icon: Activity, color: "text-brand-primary" },
                ].map((stat, i) => (
                    <Card key={i} className="rounded-3xl border-slate-200/60 shadow-sm overflow-hidden">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-brand-secondary">{stat.val}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Ads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-64 animate-pulse bg-slate-50 rounded-[2rem]" />)
                ) : filteredAds.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-30 text-xs font-black uppercase tracking-widest italic">Aucun résultat pour cette recherche</div>
                ) : (
                    filteredAds.map((ad) => (
                        <Card key={ad._id} className="group overflow-hidden rounded-[2rem] border-slate-200/60 transition-all hover:shadow-xl">
                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                                <img src={resolveImageUrl(ad.imageUrl)} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4">
                                    <Badge className={cn("rounded-full px-4 py-1.5 font-bold text-[9px] uppercase tracking-widest border-none shadow-lg", ad.active ? "bg-emerald-500 text-white" : "bg-slate-400 text-white")}>
                                        {ad.active ? 'Active' : 'Désactivée'}
                                    </Badge>
                                </div>
                                <div className="absolute top-4 right-4 bg-brand-secondary/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                                    {ad.position}
                                </div>
                            </div>
                            <CardContent className="p-8">
                                <h3 className="text-lg font-bold text-brand-secondary mb-2 line-clamp-1">{ad.title}</h3>
                                <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-1 flex items-center gap-2">
                                    <ExternalLink className="w-3 h-3" /> {ad.targetUrl}
                                </p>
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 mb-8 text-center text-xs font-bold uppercase tracking-widest">
                                    <div className="space-y-1">
                                        <p className="text-slate-400 text-[10px]">Impressions</p>
                                        <p className="text-brand-secondary">{ad.impressions || 0}</p>
                                    </div>
                                    <div className="space-y-1 border-l border-slate-50">
                                        <p className="text-slate-400 text-[10px]">Clicks</p>
                                        <p className="text-emerald-500">{ad.clicks || 0}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => handleEditAd(ad)} className="flex-1 h-12 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-brand-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                                        <Edit2 className="w-4 h-4 mr-2" /> Modifier
                                    </Button>
                                    <Button onClick={() => handleDeleteAd(ad._id)} className="w-12 h-12 p-0 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAd ? 'Éditer Campagne' : 'Nouveau Partenaire Ad'} width="xl">
                <form onSubmit={handleFormSubmit} className="p-10 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Titre de la campagne</label>
                        <input name="title" required defaultValue={editingAd?.title} placeholder="Nom du partenaire / campagne..." className="w-full h-14 bg-slate-50 rounded-xl px-5 border-none text-sm font-semibold focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                    <div className="space-y-4">
                        <FileUpload
                            label="Image de la Campagne"
                            defaultValue={editingAd?.imageUrl}
                            onUploadSuccess={(url) => {
                                // Since we are using standard form submission, we can't easily set a hidden input value 
                                // without a ref or state. Let's use a hidden input.
                                const input = document.getElementById('ad-imageUrl-input') as HTMLInputElement;
                                if (input) input.value = url;
                            }}
                        />
                        <input type="hidden" name="imageUrl" id="ad-imageUrl-input" defaultValue={editingAd?.imageUrl} />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lien de redirection</label>
                        <input name="targetUrl" required defaultValue={editingAd?.targetUrl} placeholder="https://..." className="w-full h-14 bg-slate-50 rounded-xl px-5 border-none text-sm font-semibold focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Position</label>
                            <select name="position" defaultValue={editingAd?.position || 'sidebar'} className="w-full h-14 bg-slate-50 rounded-xl px-5 border-none text-sm font-semibold focus:ring-2 focus:ring-brand-primary/20">
                                <option value="sidebar">Sidebar</option>
                                <option value="top">Top Banner</option>
                                <option value="inline">Inline</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 pt-10">
                            <input type="checkbox" name="active" id="active" defaultChecked={editingAd?.active !== false} className="w-6 h-6 rounded-lg text-brand-primary focus:ring-brand-primary/20 border-slate-200" />
                            <label htmlFor="active" className="text-xs font-bold text-brand-secondary uppercase tracking-widest cursor-pointer">Campagne Active</label>
                        </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-2xl bg-brand-primary text-white hover:bg-brand-secondary transition-all font-black text-xs uppercase tracking-widest mt-6">
                        {isSubmitting ? 'Progression...' : (editingAd ? 'Mettre à jour' : 'Lancer la Campagne')}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default AdAdmin;
