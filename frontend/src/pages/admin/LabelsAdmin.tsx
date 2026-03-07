import { useState } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    MoreVertical,
    Award,
    RefreshCcw,
    Download
} from 'lucide-react';
import { useLabels } from '../../hooks/useLabels';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/Modal';
import { LabelForm } from '../../components/LabelForm';
import api from '../../services/api';
import { cn } from '../../lib/utils';
import { resolveImageUrl } from '../../lib/image';
import { useQueryClient } from '@tanstack/react-query';

const LabelsAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLabel, setEditingLabel] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const { data: labels, isLoading, refetch } = useLabels(showDeleted);
    const queryClient = useQueryClient();

    const handleCreateLabel = () => {
        setEditingLabel(null);
        setIsModalOpen(true);
    };

    const handleEditLabel = (label: any) => {
        setEditingLabel(label);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingLabel) {
                await api.put(`/labels/${editingLabel._id}`, data);
                toast.success('Protocole mis à jour avec succès');
            } else {
                await api.post('/labels', data);
                toast.success('Nouveau protocole initialisé');
            }
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['labels'] });
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteLabel = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir archiver ce protocole ?')) return;
        try {
            await api.delete(`/labels/${id}`);
            toast.success('Protocole archivé');
            queryClient.invalidateQueries({ queryKey: ['labels'] });
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'archivage');
        }
    };

    const handleRestoreLabel = async (id: string) => {
        try {
            await api.put(`/labels/${id}/restore`);
            toast.success('Protocole restauré');
            queryClient.invalidateQueries({ queryKey: ['labels'] });
            refetch();
        } catch (error: any) {
            toast.error('Erreur lors de la restauration');
        }
    };

    const filteredLabels = labels?.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.sector.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="space-y-10 pb-20">

            {/* Institutional Admin Header */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            <Award className="w-3.5 h-3.5" /> Gestion des Protocoles
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary leading-none">
                            Registre des Labels
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Contrôle centralisé des standards de certification et des matrices de validation sectorielle.
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateLabel}
                        className="rounded-2xl h-16 px-10 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all font-bold uppercase tracking-widest text-[11px]"
                    >
                        <Plus className="w-5 h-5 mr-3" /> Nouveau Protocole
                    </Button>
                </div>
            </div>

            {/* Filter & Search Matrix */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher un protocole (nom, secteur)..."
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
                        <Download className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Data Management Table */}
            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocole</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secteur</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initialisé le</th>
                                <th className="px-10 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-8"><div className="h-4 bg-slate-50 rounded-full" /></td>
                                    </tr>
                                ))
                            ) : filteredLabels.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-20">
                                            <Award className="w-16 h-16 mb-6" />
                                            <p className="text-sm font-bold uppercase tracking-widest">Aucun protocole détecté</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLabels.map((label) => (
                                    <tr key={label._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-slate-200 group-hover:bg-white">
                                                    {label.logoUrl ? (
                                                        <img src={resolveImageUrl(label.logoUrl)} alt={label.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Award className="w-6 h-6 text-slate-200" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-sm font-bold text-brand-secondary block group-hover:text-brand-primary transition-colors">{label.name}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {label._id.substring(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <Badge variant="outline" className="rounded-full px-3 py-1 border-slate-200 text-slate-500 font-bold text-[9px] uppercase tracking-widest bg-slate-50/50">
                                                {label.sector}
                                            </Badge>
                                        </td>
                                        <td className="px-10 py-8">
                                            {label.deletedAt ? (
                                                <Badge className="rounded-full px-4 py-1.5 bg-rose-50 text-rose-600 border-none font-bold text-[9px] uppercase tracking-widest">
                                                    Archivé
                                                </Badge>
                                            ) : label.status === 'inactive' ? (
                                                <Badge className="rounded-full px-4 py-1.5 bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase tracking-widest">
                                                    Inactif
                                                </Badge>
                                            ) : (
                                                <Badge className="rounded-full px-4 py-1.5 bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase tracking-widest">
                                                    Actif
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-slate-600">{new Date(label.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(label.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                                {label.deletedAt ? (
                                                    <Button
                                                        onClick={() => handleRestoreLabel(label._id)}
                                                        className="w-10 h-10 p-0 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                        title="Restaurer"
                                                    >
                                                        <RefreshCcw className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            onClick={() => handleEditLabel(label)}
                                                            className="w-10 h-10 p-0 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm"
                                                            title="Modifier"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteLabel(label._id)}
                                                            className="w-10 h-10 p-0 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                            title="Archiver"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button className="w-10 h-10 p-0 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Affichage de <span className="text-brand-secondary">{filteredLabels.length}</span> protocoles enregistrés
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest disabled:opacity-30" disabled>Précédent</Button>
                        <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest disabled:opacity-30" disabled>Suivant</Button>
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingLabel ? 'Modification du Protocole' : 'Initialisation de Protocole'}
                width="lg"
            >
                <div className="p-10">
                    <LabelForm
                        initialData={editingLabel}
                        onSubmit={handleFormSubmit}
                        isLoading={isSubmitting}
                    />
                </div>
            </Modal>
        </div >
    );
};

export default LabelsAdmin;
