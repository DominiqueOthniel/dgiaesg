import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Mail, Plus, Edit2, Trash2, Search, Loader2,
    Globe, CheckCircle2, Clock, Send
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { cn } from "../../lib/utils";
import { Modal } from "../../components/Modal";

interface INewsletter {
    _id: string;
    title: { fr: string; en: string };
    summary: { fr: string; en: string };
    content: { fr: string; en: string };
    imageUrl: string;
    category: string;
    status: "draft" | "published" | "scheduled";
    publishedAt: string | null;
    sendEmail: boolean;
    createdAt: string;
}

const NewsletterAdmin = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<INewsletter | null>(null);

    const [formData, setFormData] = useState({
        title: { fr: "", en: "" },
        summary: { fr: "", en: "" },
        content: { fr: "", en: "" },
        imageUrl: "",
        category: "general",
        status: "draft",
        sendEmail: false,
    });

    const { data: newsletters, isLoading } = useQuery({
        queryKey: ["admin-newsletters"],
        queryFn: async () => {
            const response = await api.get("/newsletter/all");
            return response.data.data as INewsletter[];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/newsletter/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-newsletters"] });
            toast.success("Newsletter supprimée");
        },
    });

    const upsertMutation = useMutation({
        mutationFn: (data: any) => {
            if (editingItem) return api.put(`/newsletter/${editingItem._id}`, data);
            return api.post("/newsletter", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-newsletters"] });
            toast.success(editingItem ? "Mis à jour" : "Créée");
            handleCloseModal();
        },
        onError: () => {
            toast.error("Erreur lors de l'opération");
        },
    });

    const handleOpenModal = (item?: INewsletter) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                summary: item.summary,
                content: item.content,
                imageUrl: item.imageUrl || "",
                category: item.category,
                status: item.status,
                sendEmail: item.sendEmail,
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: { fr: "", en: "" },
                summary: { fr: "", en: "" },
                content: { fr: "", en: "" },
                imageUrl: "",
                category: "general",
                status: "draft",
                sendEmail: false,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        upsertMutation.mutate(formData);
    };

    const filteredNewsletters = newsletters?.filter((n) =>
        n.title.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.title.en.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            draft: "bg-slate-100 text-slate-500",
            published: "bg-green-100 text-green-700",
            scheduled: "bg-amber-100 text-amber-700",
        };
        const labels: Record<string, string> = {
            draft: "Brouillon",
            published: "Publiée",
            scheduled: "Programmée",
        };
        return (
            <span className={cn("px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full", styles[status])}>
                {labels[status] || status}
            </span>
        );
    };

    if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Gestion des Newsletters</h1>
                    <p className="text-slate-500 font-medium">Créez, publiez et distribuez vos newsletters.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-brand-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nouvelle Newsletter
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-black text-slate-900">{newsletters?.length || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Publiées</p>
                        <p className="text-2xl font-black text-slate-900">{newsletters?.filter((n) => n.status === "published").length || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Brouillons</p>
                        <p className="text-2xl font-black text-slate-900">{newsletters?.filter((n) => n.status === "draft").length || 0}</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une newsletter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 uppercase text-[9px] font-black tracking-[0.2em] text-slate-400">
                                <th className="px-8 py-5">Newsletter</th>
                                <th className="px-8 py-5">Catégorie</th>
                                <th className="px-8 py-5">Statut</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredNewsletters?.map((nl) => (
                                <tr key={nl._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors">{nl.title.fr}</p>
                                            <p className="text-[10px] text-slate-400 font-bold italic mt-1 line-clamp-1">{nl.summary.fr}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{nl.category}</span>
                                    </td>
                                    <td className="px-8 py-6">{statusBadge(nl.status)}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {nl.publishedAt ? new Date(nl.publishedAt).toLocaleDateString("fr-FR") : new Date(nl.createdAt).toLocaleDateString("fr-FR")}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(nl)}
                                                className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Supprimer cette newsletter ?")) deleteMutation.mutate(nl._id);
                                                }}
                                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? "Modifier la Newsletter" : "Nouvelle Newsletter"} width="2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Titre (FR)
                            </label>
                            <input
                                required
                                value={formData.title.fr}
                                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })}
                                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Title (EN)
                            </label>
                            <input
                                required
                                value={formData.title.en}
                                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Résumé (FR)</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.summary.fr}
                                onChange={(e) => setFormData({ ...formData, summary: { ...formData.summary, fr: e.target.value } })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Summary (EN)</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.summary.en}
                                onChange={(e) => setFormData({ ...formData, summary: { ...formData.summary, en: e.target.value } })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contenu (FR)</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.content.fr}
                                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, fr: e.target.value } })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content (EN)</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.content.en}
                                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })}
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Catégorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            >
                                <option value="general">Général</option>
                                <option value="esg">ESG</option>
                                <option value="finance">Finance</option>
                                <option value="governance">Gouvernance</option>
                                <option value="technology">Technologie</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            >
                                <option value="draft">Brouillon</option>
                                <option value="published">Publier maintenant</option>
                                <option value="scheduled">Programmer</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Image URL</label>
                            <input
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://..."
                                className="w-full h-12 px-4 bg-slate-50 border-none rounded-xl text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={formData.sendEmail}
                            onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20"
                        />
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                            <Send className="w-3.5 h-3.5" /> Envoyer par email aux abonnés
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={upsertMutation.isPending}
                        className="w-full h-14 bg-brand-primary text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all text-[11px] flex items-center justify-center gap-3"
                    >
                        {upsertMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingItem ? "Sauvegarder" : "Créer la Newsletter")}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default NewsletterAdmin;
