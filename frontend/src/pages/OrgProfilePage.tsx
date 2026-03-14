import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Building2,
    Globe,
    ShieldCheck,
    MapPin,
    LayoutDashboard,
    Save,
    CheckCircle2,
    Loader2,
    FileText,
    Award
} from "lucide-react";
import api from "../services/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { resolveImageUrl } from "../lib/image";
import { useLabels } from "../hooks/useLabels";

const OrgProfilePage = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        website: "",
    });
    const [newOrgData, setNewOrgData] = useState({
        name: "",
        description: "",
        sector: "",
        region: "",
        labelId: ""
    });
    const { data: labels } = useLabels();
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchOrg = async () => {
            try {
                const { data } = await api.get("/companies/my-org");
                setCompany(data.data);
                setFormData({
                    description: data.data.description || "",
                    website: data.data.website || "",
                });
            } catch (error) {
                console.error("Failed to fetch organization", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrg();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;
        setSaving(true);
        try {
            await api.put(`/companies/${company._id}`, formData);
            toast.success("Profil mis à jour avec succès");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setSaving(false);
        }
    };

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOrgData.labelId) {
            toast.error("Veuillez sélectionner un label");
            return;
        }
        setIsCreating(true);
        try {
            const { data } = await api.post("/companies", {
                ...newOrgData,
                certificationDate: new Date().toISOString(),
                expiryDate: new Date().toISOString()
            });
            if (data.success) {
                setCompany(data.data);
                setFormData({
                    description: data.data.description || "",
                    website: data.data.website || "",
                });
                toast.success("Organisation créée avec succès !");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la création");
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </div>
    );

    if (!company) return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl overflow-hidden bg-white p-10">
                        <div className="text-center mb-10">
                            <Building2 className="w-16 h-16 text-brand-primary/20 mx-auto mb-6" />
                            <h1 className="text-2xl font-bold text-brand-secondary mb-2">Configurez votre Organisation</h1>
                            <p className="text-slate-500 text-sm italic font-medium uppercase tracking-[0.05em]">Initialisez votre profil pour accéder aux outils d'audit.</p>
                        </div>

                        <form onSubmit={handleCreateOrg} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom de l'Organisation</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                                    value={newOrgData.name}
                                    onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                                    placeholder="Ex: GreenTech Africa"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secteur</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                                        value={newOrgData.sector}
                                        onChange={(e) => setNewOrgData({ ...newOrgData, sector: e.target.value })}
                                        placeholder="Ex: Agri-Business"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Région</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                                        value={newOrgData.region}
                                        onChange={(e) => setNewOrgData({ ...newOrgData, region: e.target.value })}
                                        placeholder="Ex: Dakar, Sénégal"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Label Ciblé</label>
                                <select
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none appearance-none"
                                    value={newOrgData.labelId}
                                    onChange={(e) => setNewOrgData({ ...newOrgData, labelId: e.target.value })}
                                >
                                    <option value="">Sélectionner un label...</option>
                                    {labels?.map(l => (
                                        <option key={l._id} value={l._id}>{typeof l.name === 'string' ? l.name : (l.name?.[lang] || l.name?.fr || "")}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                                    value={newOrgData.description}
                                    onChange={(e) => setNewOrgData({ ...newOrgData, description: e.target.value })}
                                    placeholder="Décrivez l'impact et la mission de votre organisation..."
                                />
                            </div>

                            <Button
                                type="submit"
                                isLoading={isCreating}
                                className="w-full rounded-2xl h-16 bg-brand-primary text-white hover:bg-brand-secondary shadow-xl shadow-brand-primary/20 transition-all font-black uppercase tracking-widest text-[11px]"
                            >
                                <Award className="w-5 h-5 mr-3" /> Initialiser mon Profil
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                >
                    {/* Header Card */}
                    <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl overflow-hidden bg-white">
                        <div className="bg-brand-secondary p-10 text-white relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-24 h-24 bg-white rounded-3xl p-4 shadow-2xl border border-white/20">
                                    {company.logoUrl ? (
                                        <img src={resolveImageUrl(company.logoUrl)} alt={typeof company.name === 'string' ? company.name : (company.name?.[lang] || company.name?.fr || "")} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 className="w-full h-full text-slate-200" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className="bg-brand-primary/20 text-brand-accent border-none text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                                            {company.status === 'certified' ? 'Certifié' : 'En Audit'}
                                        </Badge>
                                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">ID: {company._id?.substring(0, 8)}</span>
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight">{typeof company.name === 'string' ? company.name : (company.name?.[lang] || company.name?.fr || "")}</h1>
                                    <div className="flex items-center gap-4 mt-4 text-white/60 text-xs font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {company.region}</span>
                                        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {company.sector}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-brand-primary transition-all">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indice ESG</p>
                                        <p className="text-2xl font-bold text-brand-secondary">{company.score}%</p>
                                    </div>
                                    <ShieldCheck className="w-10 h-10 text-brand-primary opacity-20 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-brand-primary transition-all">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocole Actif</p>
                                        <p className="text-sm font-bold text-brand-secondary">{(typeof company.labelId?.name === 'string' ? company.labelId.name : (company.labelId?.name?.[lang] || company.labelId?.name?.fr || "")) || "Standard ESG"}</p>
                                    </div>
                                    <LayoutDashboard className="w-10 h-10 text-brand-accent opacity-20 group-hover:opacity-100 transition-all" />
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">{t("org_profile.description_label")}</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-brand-primary/5 focus:bg-white transition-all outline-none min-h-[150px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Décrivez l'impact et la mission de votre organisation..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">{t("org_profile.website_label")}</label>
                                    <div className="relative">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-3xl pl-14 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-brand-primary/5 focus:bg-white transition-all outline-none"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="https://votre-site.com"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t("org_profile.verified_badge")}</span>
                                    </div>
                                    <Button
                                        type="submit"
                                        isLoading={saving}
                                        className="rounded-2xl h-14 px-10 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 transition-all font-black uppercase tracking-widest text-[11px]"
                                    >
                                        <Save className="w-4 h-4 mr-3" /> {t("org_profile.save_button")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Mes Candidatures", desc: "Suivre l'état de vos demandes", icon: FileText, href: "/org-hub/applications" },
                            { title: "Historique & Certificats", desc: "Archive de vos certifications", icon: Award, href: "/org-hub/history" },
                            { title: "Documents Audit", desc: "Consulter votre coffre-fort numérique", icon: ShieldCheck },
                            { title: "Assistance", desc: "Contacter un conseiller expert", icon: Globe },
                        ].map((item, i) => (
                            <Link key={i} to={item.href || "#"} className="block">
                                <Card className="p-8 rounded-[2rem] border-slate-200 hover:border-brand-primary/30 transition-all cursor-pointer group bg-white shadow-sm hover:shadow-xl h-full text-left">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
                                        <item.icon className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-brand-secondary mb-2">{item.title}</h3>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.05em]">{item.desc}</p>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrgProfilePage;
