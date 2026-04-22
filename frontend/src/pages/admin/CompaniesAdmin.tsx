import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Filter,
    CheckCircle2,
    XCircle,
    Loader2,
    ExternalLink,
    Download,
    RefreshCcw,
    Building2,
    MapPin,
    BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompanies } from '../../hooks/useCompanies';
import { useLabels } from '../../hooks/useLabels';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useTranslation } from "react-i18next";
import { toast } from 'react-hot-toast';
import { Modal } from '../../components/Modal';
import { CompanyForm, type CompanyFormData } from '../../components/CompanyForm';
import api from '../../services/api';
import { cn, getLocalized } from '../../lib/utils';
import { resolveImageUrl } from '../../lib/image';
import { useQueryClient } from '@tanstack/react-query';

const CompaniesAdmin = () => {
    const { i18n } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [labelFilter, setLabelFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const queryClient = useQueryClient();

    const { data: companiesData, isLoading } = useCompanies({
        search: searchTerm,
        labelId: labelFilter,
        page,
        limit: 10,
        includeDeleted: showDeleted
    });

    const { data: labels } = useLabels();
    const companies = companiesData?.data || [];
    const pagination = companiesData?.pagination;

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.scrollTop = 0;
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateCompany = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleEditCompany = (company: any) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: CompanyFormData) => {
        setIsSubmitting(true);
        try {
            if (editingCompany) {
                await api.put(`/companies/${editingCompany._id}`, data);
                toast.success('Entité mise à jour avec succès');
            } else {
                await api.post('/companies', data);
                toast.success('Nouvelle entité certifiée');
            }
            setIsModalOpen(false);
            await queryClient.invalidateQueries({ queryKey: ['companies'] });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCompany = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir archiver cette entité ?')) return;
        try {
            await api.delete(`/companies/${id}`);
            toast.success('Entité archivée');
            await queryClient.invalidateQueries({ queryKey: ['companies'] });
        } catch (error: any) {
            toast.error('Erreur lors de l\'archivage');
        }
    };

    const handleRestoreCompany = async (id: string) => {
        try {
            await api.put(`/companies/${id}/restore`);
            toast.success('Entité restaurée');
            await queryClient.invalidateQueries({ queryKey: ['companies'] });
        } catch (error: any) {
            toast.error('Erreur lors de la restauration');
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await api.get('/companies/export/csv', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'export-registre.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Export généré avec succès');
        } catch (error: any) {
            toast.error('Échec de l\'exportation');
        }
    };

    return (
        <div className="space-y-10 pb-20">

            {/* Institutional Header */}
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            <Building2 className="w-3.5 h-3.5" /> Registre National des Certifications
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary leading-none">
                            Gestion des Entités
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl">
                            Supervision et validation des organisations certifiées au sein du réseau COOP_LOGIC.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleExportCSV}
                            className="rounded-2xl h-16 px-8 border-slate-200 bg-white text-slate-500 hover:bg-slate-50 shadow-sm font-bold uppercase tracking-widest text-[10px]"
                        >
                            <Download className="w-4 h-4 mr-3" /> Exporter
                        </Button>
                        <Button
                            onClick={handleCreateCompany}
                            className="rounded-2xl h-16 px-10 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all font-bold uppercase tracking-widest text-[11px]"
                        >
                            <Plus className="w-5 h-5 mr-3" /> Certifier une Entité
                        </Button>
                    </div>
                </div>
            </div>

            {/* Query & Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher une organisation..."
                        className="w-full pl-16 pr-8 h-16 bg-white border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm font-medium transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="lg:col-span-3">
                    <select
                        className="w-full h-16 px-8 bg-white border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-xs font-bold uppercase tracking-widest appearance-none cursor-pointer shadow-sm text-slate-500"
                        value={labelFilter}
                        onChange={(e) => setLabelFilter(e.target.value)}
                    >
                        <option value="">Tous les protocoles</option>
                         {labels?.map(l => (
                            <option key={l._id} value={l._id}>{getLocalized(l.name, i18n.language)}</option>
                        ))}
                    </select>
                </div>
                <div className="lg:col-span-4 flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowDeleted(!showDeleted)}
                        className={cn(
                            "h-16 px-8 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex-1 border-slate-200 transition-all",
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

            {/* Master Data Registry */}
            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organisation</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validation & Score</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localisation</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                                <th className="px-10 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opérations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-10"><div className="h-4 bg-slate-50 rounded-full" /></td>
                                    </tr>
                                ))
                            ) : companies.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center opacity-20">
                                        <Building2 className="w-16 h-16 mx-auto mb-6" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Registre vide</p>
                                    </td>
                                </tr>
                            ) : (
                                companies.map((company) => (
                                    <tr key={company._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                 <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3 relative group-hover:scale-110 group-hover:shadow-lg group-hover:bg-white transition-all">
                                                    {company.logoUrl ? (
                                                        <img src={resolveImageUrl(company.logoUrl)} alt={getLocalized(company.name, i18n.language)} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="w-6 h-6 text-slate-200" />
                                                    )}
                                                </div>
                                                 <div className="space-y-1">
                                                    <p className="text-sm font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">{getLocalized(company.name, i18n.language)}</p>
                                                    {company.website && (
                                                        <a href={company.website} target="_blank" rel="noreferrer" className="text-[9px] text-slate-400 hover:text-brand-primary font-bold uppercase tracking-widest flex items-center gap-2 group/link">
                                                            <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" /> Accéder au portail
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-3 max-w-[200px]">
                                                 <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{getLocalized((company.labelId as any)?.name, i18n.language) || 'Sans protocole'}</span>
                                                    <span className="text-[10px] font-bold text-brand-primary">{company.score}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${company.score}%` }}
                                                        className="h-full bg-brand-primary"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                 <div className="space-y-0.5">
                                                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{getLocalized(company.region, i18n.language)}</p>
                                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{getLocalized(company.sector, i18n.language)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            {company.status === 'certified' ? (
                                                <Badge className="rounded-full px-4 py-1.5 bg-brand-primary/10 text-brand-primary border-none font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 w-fit">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Certifié
                                                </Badge>
                                            ) : company.status === 'pending' ? (
                                                <Badge className="rounded-full px-4 py-1.5 bg-amber-50 text-amber-600 border-none font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 w-fit">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> En attente
                                                </Badge>
                                            ) : (
                                                <Badge className="rounded-full px-4 py-1.5 bg-rose-50 text-rose-600 border-none font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 w-fit">
                                                    <XCircle className="w-3.5 h-3.5" /> Expiré
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {company.deletedAt ? (
                                                    <button
                                                        onClick={() => handleRestoreCompany(company._id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-[10px] font-bold uppercase tracking-wider"
                                                    >
                                                        <RefreshCcw className="w-3.5 h-3.5" /> Restaurer
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditCompany(company)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all text-[10px] font-bold uppercase tracking-wider"
                                                            title="Modifier"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" /> Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCompany(company._id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-[10px] font-bold uppercase tracking-wider"
                                                            title="Archiver"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Archiver
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Registry Navigation */}
                <div className="px-10 py-10 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <BarChart3 className="w-5 h-5 text-slate-300" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Volume Total de Données : <span className="text-brand-secondary">{pagination?.total || 0} entités</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="h-12 px-8 rounded-xl border-slate-200 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                        >
                            Précédent
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!pagination || page === pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="h-12 px-8 rounded-xl border-slate-200 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                        >
                            Suivant
                        </Button>
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCompany ? 'Modification de l\'Organisation' : 'Initialisation de Certification'}
                width="2xl"
            >
                <div className="p-10">
                    <CompanyForm
                        initialData={editingCompany}
                        labels={labels || []}
                        users={users}
                        onSubmit={handleFormSubmit as any}
                        isLoading={isSubmitting}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default CompaniesAdmin;
