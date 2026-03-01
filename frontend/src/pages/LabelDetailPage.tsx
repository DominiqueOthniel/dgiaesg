import { useParams, Link } from "react-router-dom";
import {
    Award,
    ArrowLeft,
    ChevronRight,
    CheckCircle2,
    Info,
    BarChart3,
    ShieldCheck,
    Zap,
    Scale,
    Target,
    Users
} from "lucide-react";
import { motion } from "framer-motion";
import { useLabel } from "../hooks/useLabels";
import { useCriteria } from "../hooks/useCriteria";
import { useCompanies } from "../hooks/useCompanies";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";

function LabelDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: label, isLoading: labelLoading } = useLabel(id);
    const { data: criteria, isLoading: criteriaLoading } = useCriteria(id);
    const { data: companiesData, isLoading: companiesLoading } = useCompanies({ labelId: id, limit: 10 });

    const companies = companiesData?.data || [];

    if (labelLoading) {
        return (
            <div className="bg-white min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="h-72 rounded-[3rem] bg-slate-50 animate-pulse mb-12" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 h-96 rounded-[2.5rem] bg-slate-50 animate-pulse" />
                        <div className="lg:col-span-4 h-96 rounded-[2.5rem] bg-slate-50 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!label) return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Award className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-brand-secondary">Protocole non trouvé</h1>
                <Link to="/labels" className="text-brand-primary font-bold mt-4 inline-block hover:underline">REVENIR À L'INDEX</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Majestic Protocol Header */}
            <section className="bg-brand-secondary pt-24 pb-48 md:pb-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/labels" className="inline-flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-16 hover:text-brand-accent transition-colors">
                            <ArrowLeft className="w-4 h-4" /> REVENIR À L'INDEX DES LABELS
                        </Link>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center">
                        <div className="flex-1 order-2 lg:order-1">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap items-center gap-4 mb-8"
                            >
                                <Badge variant="secondary" className="rounded-full px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest bg-brand-primary/20 text-brand-primary border-none">
                                    {label.sector}
                                </Badge>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4 text-brand-accent" /> Standard de Conformité V2.4
                                </div>
                            </motion.div>
                            <h1 className="text-4xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-none">
                                {label.name}
                            </h1>
                            <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-3xl">
                                {label.description}
                            </p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full lg:w-[400px] order-1 lg:order-2"
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] flex items-center justify-center shadow-2xl relative group">
                                <div className="absolute inset-0 bg-brand-primary/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                {label.logoUrl ? (
                                    <img src={resolveImageUrl(label.logoUrl)} alt={label.name} className="w-full h-full object-cover relative z-10" />
                                ) : (
                                    <Award className="w-48 h-48 text-white/5 relative z-10" />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Matrix of Standards Section */}
            <section className="-mt-32 md:-mt-40 relative z-20 pb-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Professional Criteria Grid */}
                        <div className="lg:col-span-8 space-y-12">
                            <Card className="rounded-[3rem] border-slate-200/60 shadow-2xl shadow-slate-200/40 overflow-hidden">
                                <CardContent className="p-10 md:p-14">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-12 border-b border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-xl shadow-brand-primary/20">
                                                <BarChart3 className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-bold text-brand-secondary tracking-tight">Critères d'Excellence</h2>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Référentiel de Validation Sectorielle</p>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl">
                                            <Scale className="w-5 h-5 text-brand-primary" />
                                            <span className="text-sm font-bold text-brand-secondary">Standard Pondéré</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-8">
                                        {criteriaLoading ? (
                                            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse" />)
                                        ) : criteria?.length === 0 ? (
                                            <div className="py-24 text-center rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center">
                                                <Info className="w-12 h-12 text-slate-200 mb-6" />
                                                <h3 className="text-lg font-bold text-slate-400">Aucun critère configuré</h3>
                                                <p className="text-sm text-slate-300">Ce protocole est en cours de déploiement.</p>
                                            </div>
                                        ) : (
                                            criteria?.map((item, idx) => (
                                                <motion.div
                                                    key={item._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="p-8 md:p-10 rounded-[2rem] border border-slate-200/60 bg-white hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group"
                                                >
                                                    <div className="flex flex-col md:flex-row gap-10 items-start">
                                                        <div className="flex-1 space-y-6">
                                                            <div className="flex items-center gap-4">
                                                                <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-[9px] uppercase tracking-widest text-brand-primary border-brand-primary/20 bg-brand-primary/5">
                                                                    {item.category}
                                                                </Badge>
                                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                                <h3 className="text-xl font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">{item.title}</h3>
                                                            </div>
                                                            <p className="text-slate-500 leading-relaxed font-medium">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 flex md:flex-col items-center md:items-end gap-3 bg-slate-50 group-hover:bg-brand-primary/5 px-6 py-4 rounded-2xl transition-colors min-w-[120px]">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact</span>
                                                            <span className="text-3xl font-black text-brand-secondary group-hover:text-brand-primary transition-colors">{item.weight}%</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Governance & Stakeholders Sidebar */}
                        <aside className="lg:col-span-4 space-y-10">
                            {/* Stakeholder Cluster */}
                            <Card className="rounded-[3rem] bg-brand-secondary border-none shadow-2xl shadow-brand-secondary/40 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent" />
                                <CardContent className="p-10 space-y-12">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white tracking-tight">Cluster Actif</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Derniers Stakeholders</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {companiesLoading ? (
                                            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
                                        ) : companies.length === 0 ? (
                                            <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl opacity-40">
                                                <p className="text-xs font-bold text-white uppercase tracking-widest">Aucune entité certifiée</p>
                                            </div>
                                        ) : (
                                            companies.map((company) => (
                                                <Link key={company._id} to={`/directory/${company._id}`} className="flex items-center gap-5 p-5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white hover:text-brand-secondary transition-all group/item">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-[11px] text-white group-hover/item:bg-brand-secondary group-hover/item:text-white transition-colors">
                                                        {company.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold uppercase tracking-tight truncate">{company.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 group-hover/item:text-slate-500 uppercase tracking-widest">{company.sector}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover/item:text-brand-primary transition-colors" />
                                                </Link>
                                            ))
                                        )}
                                    </div>

                                    <Link to="/directory" className="block pt-8 border-t border-white/10">
                                        <Button className="w-full rounded-2xl py-7 bg-white text-brand-secondary hover:bg-brand-accent hover:text-white shadow-xl shadow-black/20 transition-all font-bold uppercase tracking-widest text-[11px]">
                                            Explorer le Registre <Target className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Verification Workflow */}
                            <Card className="rounded-[2.5rem] bg-slate-50 border-slate-200/60 p-10 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <h4 className="text-[11px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-3 mb-10">
                                    <Zap className="w-4 h-4" /> Workflow de Validation
                                </h4>
                                <div className="space-y-8">
                                    {[
                                        { step: "Analyse documentaire", status: "complete" },
                                        { step: "Inspection sur site", status: "active" },
                                        { step: "Audit de conformité éthique", status: "pending" },
                                        { step: "Certification par le comité", status: "pending" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-5 relative group">
                                            <div className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors">
                                                {item.status === 'complete' ? (
                                                    <div className="w-full h-full rounded-full bg-emerald-500 border-emerald-500 flex items-center justify-center">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                ) : item.status === 'active' ? (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                                                )}
                                            </div>
                                            <span className={cn(
                                                "text-[11px] font-bold uppercase tracking-widest leading-relaxed",
                                                item.status === 'complete' ? "text-slate-400 line-through" :
                                                    item.status === 'active' ? "text-brand-secondary" : "text-slate-300"
                                            )}>
                                                {item.step}
                                            </span>
                                            {idx < 3 && <div className="absolute left-3 top-6 w-[2px] h-6 bg-slate-100" />}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LabelDetailPage;
