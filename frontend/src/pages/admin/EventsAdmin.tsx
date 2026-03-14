import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    Calendar, Plus, Edit2, Trash2, 
    Search, Loader2, Globe, Clock,
    CheckCircle2, AlertCircle
} from "lucide-react";
import api from "../../services/api";
import type { IEvent } from "../../types";
import { toast } from "react-hot-toast";
import { getLocalized } from "../../lib/utils";
import Modal from "../../components/Modal";
import { useTranslation } from "react-i18next";

const EventsAdmin = () => {
    const { i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: { fr: "", en: "" },
        description: { fr: "", en: "" },
        type: "workshop",
        startDate: "",
        endDate: "",
        location: { fr: "", en: "" },
        organizer: { fr: "", en: "" },
        imageUrl: "",
        registrationUrl: "",
        featured: false,
        published: true
    });

    const { data: events, isLoading } = useQuery({
        queryKey: ['admin-events'],
        queryFn: async () => {
            const response = await api.get('/events');
            return response.data.data as IEvent[];
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/events/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-events'] });
            toast.success("Événement supprimé");
        }
    });

    const upsertMutation = useMutation({
        mutationFn: (data: any) => {
            if (editingEvent) return api.put(`/events/${editingEvent._id}`, data);
            return api.post('/events', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-events'] });
            toast.success(editingEvent ? "Mis à jour" : "Créé");
            handleCloseModal();
        }
    });

    const handleOpenModal = (event?: IEvent) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: typeof event.title === 'string' ? { fr: event.title, en: event.title } : (event.title as any),
                description: typeof event.description === 'string' ? { fr: event.description, en: event.description } : (event.description as any) || { fr: "", en: "" },
                type: event.type,
                startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
                endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
                location: typeof event.location === 'string' ? { fr: event.location, en: event.location } : (event.location as any) || { fr: "", en: "" },
                organizer: typeof event.organizer === 'string' ? { fr: event.organizer, en: event.organizer } : (event.organizer as any) || { fr: "", en: "" },
                imageUrl: event.imageUrl || "",
                registrationUrl: event.registrationUrl || "",
                featured: event.featured,
                published: event.published
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: { fr: "", en: "" },
                description: { fr: "", en: "" },
                type: "workshop",
                startDate: "",
                endDate: "",
                location: { fr: "", en: "" },
                organizer: { fr: "", en: "" },
                imageUrl: "",
                registrationUrl: "",
                featured: false,
                published: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        upsertMutation.mutate(formData);
    };

    const filteredEvents = events?.filter(event => {
        const matchesSearch = getLocalized(event.title, i18n.language).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || event.type === typeFilter;
        return matchesSearch && matchesType;
    });

    if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Gestion de l'Agenda</h1>
                    <p className="text-slate-500 font-medium">Planifiez et publiez les événements institutionnels.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-brand-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nouvel Événement
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-black text-slate-900">{events?.length || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Publiés</p>
                        <p className="text-2xl font-black text-slate-900">{events?.filter(e => e.published).length || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Mise en avant</p>
                        <p className="text-2xl font-black text-slate-900">{events?.filter(e => e.featured).length || 0}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Rechercher un événement (FR/EN)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="h-12 px-6 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-primary/10"
                        >
                            <option value="all">Tous les types</option>
                            <option value="workshop">Workshop</option>
                            <option value="conference">Conférence</option>
                            <option value="training">Formation</option>
                            <option value="certification">Certification</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 uppercase text-[9px] font-black tracking-[0.2em] text-slate-400">
                                <th className="px-8 py-5">Événement</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Dates</th>
                                <th className="px-8 py-5">Statut</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEvents?.map((event) => (
                                <tr key={event._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80"} 
                                                    className="w-full h-full object-cover" 
                                                    alt="thumb"
                                                />
                                            </div>
                                             <div>
                                                <p className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors">{getLocalized(event.title, i18n.language)}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{getLocalized(event.description, i18n.language)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold uppercase text-slate-500">
                                        {event.type}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black uppercase text-brand-secondary flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" /> {new Date(event.startDate).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ml-0.5">
                                                <Clock className="w-3 h-3" /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {event.published ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full">Publié</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full">Brouillon</span>
                                            )}
                                            {event.featured && (
                                                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-full">Featured</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(event)}
                                                className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm("Supprimer cet événement ?")) deleteMutation.mutate(event._id);
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

            {/* Event Form Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEvent ? "Modifier l'événement" : "Nouveau Événement"}>
                <form onSubmit={handleSubmit} className="space-y-8 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bilingual Titles */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Titre (FR)
                            </label>
                            <input 
                                required
                                value={formData.title.fr} 
                                onChange={(e) => setFormData({...formData, title: {...formData.title, fr: e.target.value}})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Title (EN)
                            </label>
                            <input 
                                required
                                value={formData.title.en} 
                                onChange={(e) => setFormData({...formData, title: {...formData.title, en: e.target.value}})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</label>
                            <select 
                                value={formData.type} 
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            >
                                <option value="workshop">Workshop</option>
                                <option value="conference">Conférence</option>
                                <option value="training">Formation</option>
                                <option value="networking">Networking</option>
                                <option value="certification">Certification</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date de début</label>
                            <input 
                                type="datetime-local"
                                required
                                value={formData.startDate} 
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Lieu (FR)</label>
                            <input 
                                required
                                value={formData.location.fr} 
                                onChange={(e) => setFormData({...formData, location: {...formData.location, fr: e.target.value}})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location (EN)</label>
                            <input 
                                required
                                value={formData.location.en} 
                                onChange={(e) => setFormData({...formData, location: {...formData.location, en: e.target.value}})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Organisateur (FR)</label>
                            <input 
                                value={formData.organizer.fr} 
                                onChange={(e) => setFormData({...formData, organizer: {...formData.organizer, fr: e.target.value}})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Organizer (EN)</label>
                            <input 
                                value={formData.organizer.en} 
                                onChange={(e) => setFormData({...formData, organizer: {...formData.organizer, en: e.target.value}})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Description (FR)</label>
                            <textarea 
                                required
                                value={formData.description.fr} 
                                onChange={(e) => setFormData({...formData, description: {...formData.description, fr: e.target.value}})}
                                className="w-full min-h-[100px] p-6 bg-slate-50 border-none rounded-xl text-sm font-bold resize-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description (EN)</label>
                            <textarea 
                                required
                                value={formData.description.en} 
                                onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                                className="w-full min-h-[100px] p-6 bg-slate-50 border-none rounded-xl text-sm font-bold resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Image URL</label>
                            <input 
                                value={formData.imageUrl} 
                                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Registration URL</label>
                            <input 
                                value={formData.registrationUrl} 
                                onChange={(e) => setFormData({...formData, registrationUrl: e.target.value})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date de fin</label>
                            <input 
                                type="datetime-local"
                                required
                                value={formData.endDate} 
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                className="w-full h-12 px-6 bg-slate-50 border-none rounded-xl text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" /> Statut & Options
                        </label>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.published} 
                                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                                    className="w-5 h-5 rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20"
                                />
                                <span className="text-xs font-bold text-slate-600">Publier immédiatement</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.featured} 
                                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                                    className="w-5 h-5 rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20"
                                />
                                <span className="text-xs font-bold text-slate-600">Mettre en avant</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            type="submit"
                            disabled={upsertMutation.isPending}
                            className="w-full h-14 bg-brand-primary text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all text-[11px] flex items-center justify-center gap-3"
                        >
                            {upsertMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingEvent ? "Sauvegarder les modifications" : "Créer l'événement")}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EventsAdmin;
