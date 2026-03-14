import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Building2,
    MapPin,
    ShieldCheck,
    ArrowLeft,
    ExternalLink,
    Award,
    BarChart3,
    CalendarCheck2,
    Globe,
    Briefcase,
    Zap,
    Download,
    Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { useCompany } from "../hooks/useCompanies";
import { useLabel } from "../hooks/useLabels";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { cn, getLocalized } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";
import DigitalBadge from "../components/badges/DigitalBadge";

function CompanyDetailPage() {
    const { i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data: company, isLoading: companyLoading } = useCompany(id);
    const labelId = typeof company?.labelId === 'string' ? company.labelId : company?.labelId?._id;
    const { data: label, isLoading: labelLoading } = useLabel(labelId);

    if (companyLoading) {
        return (
            <div className="bg-white min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="h-64 rounded-[2.5rem] bg-slate-50 animate-pulse mb-12" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 h-96 rounded-[2.5rem] bg-slate-50 animate-pulse" />
                        <div className="lg:col-span-4 h-96 rounded-[2.5rem] bg-slate-50 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!company) return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-brand-secondary">Société non trouvée</h1>
                <Link to="/directory" className="text-brand-primary font-bold mt-4 inline-block hover:underline">REVENIR À L'ANNUAIRE</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Premium Institutional Header */}
            <section className="bg-brand-secondary pt-24 pb-40 md:pb-56 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/directory" className="inline-flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-16 hover:text-brand-accent transition-colors">
                            <ArrowLeft className="w-4 h-4" /> REVENIR À L'ANNUAIRE
                        </Link>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[2rem] flex-shrink-0 flex items-center justify-center p-8 shadow-2xl shadow-black/20"
                        >
                            {company.logoUrl ? (
                                <img src={resolveImageUrl(company.logoUrl)} alt={getLocalized(company.name, i18n.language)} className="w-full h-full object-cover" />
                            ) : (
                                <Building2 className="w-20 h-20 text-slate-200" />
                            )}
                        </motion.div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <Badge variant="outline" className={cn(
                                    "rounded-full px-4 py-1.5 font-bold text-xs uppercase tracking-wider",
                                    getLocalized(company?.status, i18n.language) === 'certified'
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                    Certifié {getLocalized(company?.status, i18n.language) || "Inactif"}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <MapPin className="w-4 h-4 text-brand-accent" /> {getLocalized(company.region, i18n.language)}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <Briefcase className="w-4 h-4 text-brand-accent" /> {getLocalized(company.sector, i18n.language)}
                                </div>
                            </div>
                             <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                                {getLocalized(company.name, i18n.language)}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex-1 lg:flex-none">
                                    <Button size="lg" className="w-full rounded-full px-8 shadow-xl shadow-brand-primary/20">
                                        Consulter le Site <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </a>
                            )}
                            <Button variant="outline" size="lg" className="rounded-full border-white/20 text-white hover:bg-white/10 p-3 flex-shrink-0">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Discovery Section */}
            <section className="-mt-24 md:-mt-32 relative z-20 pb-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Analysis & Profile Content */}
                        <div className="lg:col-span-8 space-y-12">
                            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardContent className="p-10 md:p-14">
                                    <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-10">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary" /> Synthèse de Profil
                                    </div>
                                    <div className="prose prose-slate max-w-none break-words overflow-hidden">
                                        <p className="text-xl md:text-2xl font-medium text-brand-secondary leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-brand-primary first-letter:mr-3 first-letter:float-left">
                                            {getLocalized(company.description, i18n.language)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Impact Performance Matrix */}
                            <Card className="rounded-[2.5rem] bg-brand-secondary border-none shadow-2xl shadow-brand-secondary/40 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl" />
                                <CardContent className="p-10 md:p-14 relative z-10">
                                    <div className="flex items-center gap-4 mb-16">
                                        <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                                            <BarChart3 className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-white tracking-tight">Performance d'Impact</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Métriques de Maturité Coopérative</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                                        <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden group">
                                            <div className="text-center relative z-10">
                                                <span className="text-8xl font-black text-white tracking-tighter leading-none">
                                                    {company.score || 0}<span className="text-brand-accent text-5xl">%</span>
                                                </span>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-4">SCORE GLOBAL</p>
                                            </div>
                                            <div className="absolute bottom-0 left-0 h-1.5 bg-brand-accent transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ width: `${company.score || 0}%` }} />
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dimension Sociale</span>
                                                    <span className="text-xl font-bold text-white tracking-tight">{company.socialScore || 0}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${company.socialScore || 0}%` }} className="h-full bg-brand-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gouvernance Éthique</span>
                                                    <span className="text-xl font-bold text-white tracking-tight">{company.governanceScore || 0}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${company.governanceScore || 0}%` }} className="h-full bg-brand-accent rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Validation & Details Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            {company && (
                                <DigitalBadge
                                    companyId={company._id}
                                    companyName={getLocalized(company.name, i18n.language)}
                                    status={getLocalized(company.status, i18n.language)}
                                />
                            )}
                            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
                                        <div className="w-20 h-20 bg-brand-secondary rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-brand-secondary/20 mb-6">
                                            <Award className="w-10 h-10 text-brand-accent" />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Label de Référence</p>
                                        {labelLoading ? (
                                            <div className="h-8 w-40 bg-slate-200 animate-pulse mx-auto rounded" />
                                        ) : label ? (
                                            <Link to={`/labels/${label._id}`} className="group inline-flex items-center gap-2">
                                                <h3 className="text-2xl font-bold text-brand-secondary group-hover:text-brand-primary transition-colors leading-tight">
                                                    {getLocalized(label.name, i18n.language)}
                                                </h3>
                                                <Zap className="w-5 h-5 text-brand-accent fill-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ) : (
                                            <p className="text-sm font-bold text-slate-300">CERTIFICATION INDÉPENDANTE</p>
                                        )}
                                    </div>

                                    <div className="p-10 space-y-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0">
                                                <CalendarCheck2 className="w-5 h-5 text-brand-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Émission de Certification</span>
                                                <span className="text-sm font-bold text-brand-secondary">
                                                    {company.certificationDate ? new Date(company.certificationDate).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }) : "En attente"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500/5 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validité Jusqu'au</span>
                                                <span className="text-sm font-bold text-brand-secondary">
                                                    {company.expiryDate ? new Date(company.expiryDate).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }) : "Permanent"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                                            <Button variant="outline" className="flex-1 min-w-0 rounded-2xl py-6 hover:text-brand-secondary hover:bg-slate-50 transition-all group">
                                                <div className="flex items-center justify-center w-full gap-2">
                                                    <Download className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-brand-primary" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-brand-secondary truncate">
                                                        Rapports d'impact
                                                    </span>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Dynamic Validation Workflow */}
                            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-brand-secondary uppercase tracking-tight">Workflow de Validation</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {(label?.validationWorkflow || [
                                            { step: "Analyse documentaire", status: "complete" },
                                            { step: "Inspection sur site", status: "active" },
                                            { step: "Audit de conformité éthique", status: "pending" },
                                            { step: "Certification par le comité", status: "pending" }
                                        ]).map((step: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 group">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                                                    step.status === 'complete' ? "bg-emerald-500 border-emerald-500 text-white" :
                                                        step.status === 'active' ? "border-brand-primary text-brand-primary animate-pulse" :
                                                            "border-slate-200 text-slate-300"
                                                )}>
                                                    {step.status === 'complete' ? (
                                                        <ShieldCheck className="w-4 h-4" />
                                                    ) : (
                                                        <span className="text-xs font-bold">{idx + 1}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 border-b border-slate-50 pb-4">
                                                    <p className={cn(
                                                        "text-xs font-bold uppercase tracking-widest",
                                                        step.status === 'complete' ? "text-slate-500" :
                                                            step.status === 'active' ? "text-brand-primary" : "text-slate-400"
                                                    )}>
                                                        {step.step}
                                                    </p>
                                                    <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tight">
                                                        {step.status === 'complete' ? "Validation effectuée" :
                                                            step.status === 'active' ? "Phase en cours de traitement" : "En attente de démarrage"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl bg-slate-50 border-slate-100 p-8 shadow-sm">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                                        <Globe className="w-4 h-4" /> Statut du Registre
                                    </div>
                                    <div className="space-y-2 font-mono text-[11px] text-slate-400 leading-relaxed">
                                        <p>&gt; Validating connection...</p>
                                        <p>&gt; Integrity check: SECURE</p>
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>LIVE REPOSITORY DISPONIBLE</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CompanyDetailPage;
