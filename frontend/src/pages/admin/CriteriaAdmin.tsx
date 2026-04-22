import { useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Award,
    Dna,
    Scale,
    Layers,
    ChevronDown,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabels } from '../../hooks/useLabels';
import { useCriteria } from '../../hooks/useCriteria';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/Modal';
import { CriteriaForm } from '../../components/CriteriaForm';
import api from '../../services/api';
import { useTranslation } from "react-i18next";
import { useQueryClient } from '@tanstack/react-query';
import { getLocalized } from '../../lib/utils';

const CriteriaAdmin = () => {
    const { i18n } = useTranslation();
    const { data: labels } = useLabels();
    const [selectedLabelId, setSelectedLabelId] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const { data: criteria, isLoading, refetch } = useCriteria(selectedLabelId);
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCriteria, setEditingCriteria] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateCriteria = () => {
        if (!selectedLabelId) {
            toast.error('Veuillez d\'abord choisir un critère/protocole dans la liste');
            return;
        }
        setEditingCriteria(null);
        setIsModalOpen(true);
    };

    const handleEditCriteria = (item: any) => {
        setEditingCriteria(item);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingCriteria) {
                await api.put(`/criteria/${editingCriteria._id}`, data);
                toast.success('Critère normatif mis à jour');
            } else {
                await api.post('/criteria', data);
                toast.success('Nouveau critère injecté dans la matrice');
            }
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['criteria', selectedLabelId] });
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la modification de la matrice');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCriteria = async (id: string) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce critère de la matrice ?')) return;
        try {
            await api.delete(`/criteria/${id}`);
            toast.success('Critère retiré de la norme');
            queryClient.invalidateQueries({ queryKey: ['criteria', selectedLabelId] });
            refetch();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-10 pb-20">

            {/* Protocol Architecture Header */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            <Dna className="w-3.5 h-3.5" /> Architecture Normative
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary leading-none">
                            Matrice de Validation
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Configuration des piliers d'évaluation et pondération des critères de certification par protocole.
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateCriteria}
                        className="rounded-2xl h-16 px-10 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all font-bold uppercase tracking-widest text-[11px]"
                    >
                        <Plus className="w-5 h-5 mr-3" /> Nouveau Critère
                    </Button>
                </div>
            </div>

            {/* Selection Matrix */}
            <div className="bg-white rounded-[2.5rem] p-4 border border-slate-200/60 shadow-sm flex flex-col lg:flex-row items-stretch gap-4">
                <div className="flex-1 relative flex items-center p-4 bg-slate-50/50 rounded-2xl group border-2 border-slate-100 focus-within:border-brand-primary/20 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-brand-primary/5 transition-all cursor-pointer">
                    <Award className="w-5 h-5 text-brand-primary/40 mr-4 group-focus-within:text-brand-primary transition-colors" />
                    <div className="flex-1 flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 ml-1">Sélectionner un protocole</span>
                        <div className="relative">
                            <select
                                className="w-full bg-transparent border-none p-0 text-base font-bold text-brand-secondary focus:ring-0 appearance-none cursor-pointer pr-10"
                                value={selectedLabelId}
                                onChange={(e) => {
                                    console.log("Select changed to:", e.target.value);
                                    setSelectedLabelId(e.target.value);
                                }}
                            >
                                <option value="">Choisir dans le référentiel...</option>
                                 {labels?.map(l => (
                                    <option key={l._id} value={l._id}>{getLocalized(l.name, i18n.language)}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-brand-primary transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Filter Input */}
                <div className="flex-1 relative flex items-center p-4 bg-slate-50/50 rounded-2xl group border-2 border-slate-100 focus-within:border-brand-primary/20 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-brand-primary/5 transition-all">
                    <Search className="w-5 h-5 text-brand-primary/40 mr-4 group-focus-within:text-brand-primary transition-colors" />
                    <div className="flex-1 flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 ml-1">Rechercher un critère</span>
                        <input
                            type="text"
                            placeholder="Titre ou catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-base font-bold text-brand-secondary focus:ring-0 placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <div className="hidden lg:flex items-center px-10 border-x border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Critères</p>
                            <p className="text-sm font-bold text-brand-secondary">{criteria?.length || 0} Segment(s)</p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center px-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Poids Total</p>
                            <p className="text-sm font-bold text-brand-secondary">
                                {criteria?.reduce((sum: number, c: any) => sum + (c.weight || 0), 0)} %
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Criteria Evolution Grid */}
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-48 rounded-[2.5rem] bg-slate-50 animate-pulse" />
                    ))
                ) : !selectedLabelId ? (
                    <div className="py-40 text-center rounded-[3rem] border border-dashed border-slate-200 opacity-30">
                        <Award className="w-20 h-20 mx-auto mb-8" />
                        <p className="text-sm font-bold uppercase tracking-widest">En attente de sélection de protocole</p>
                    </div>
                ) : criteria?.filter((c: any) =>
                    getLocalized(c.title, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
                    getLocalized(c.category, i18n.language).toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                    <div className="py-40 text-center rounded-[3rem] border border-dashed border-slate-200 opacity-30">
                        <Search className="w-20 h-20 mx-auto mb-8" />
                        <p className="text-sm font-bold uppercase tracking-widest">Aucun critère ne correspond à votre recherche</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {criteria?.filter((c: any) =>
                            getLocalized(c.title, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
                            getLocalized(c.category, i18n.language).toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((item, idx) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="group overflow-hidden rounded-[2.5rem] border-slate-200 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 bg-white">
                                    <div className="p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] flex items-center justify-center -translate-y-4 translate-x-4 opacity-50">
                                            <span className="text-4xl font-bold text-slate-100 select-none">#{idx + 1}</span>
                                        </div>

                                        <div className="w-28 h-28 rounded-3xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-500 shadow-inner">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white/40 mb-1">Impact</span>
                                            <span className="text-4xl font-bold text-brand-secondary group-hover:text-white tracking-tighter transition-colors">{item.weight}%</span>
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-4">
                                            <div className="flex items-center gap-4">
                                                 <Badge className="rounded-full px-4 py-1 bg-brand-primary/5 text-brand-primary border-none font-bold text-[9px] uppercase tracking-widest shadow-sm">
                                                    {getLocalized(item.category, i18n.language)}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">ID_{item._id.substring(18)}</span>
                                            </div>
                                             <h3 className="text-2xl font-bold text-brand-secondary tracking-tight group-hover:text-brand-primary transition-colors uppercase leading-none">{getLocalized(item.title, i18n.language)}</h3>
                                            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-3xl">{getLocalized(item.description, i18n.language)}</p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 relative z-10">
                                            <Button
                                                onClick={() => handleEditCriteria(item)}
                                                className="w-12 h-12 p-0 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteCriteria(item._id)}
                                                className="w-12 h-12 p-0 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCriteria ? 'Modification du Critère Normatif' : 'Injection de Critère Matrix'}
                width="lg"
            >
                <div className="p-10">
                    <CriteriaForm
                        initialData={editingCriteria}
                        labels={labels || []}
                        defaultLabelId={selectedLabelId}
                        onSubmit={handleFormSubmit}
                        isLoading={isSubmitting}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default CriteriaAdmin;
