import { motion } from "framer-motion";
import { Award, ArrowRight, Search, Filter, ShieldCheck, Tag, ChevronRight, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useLabels } from "../hooks/useLabels";
import { BackButton } from "../components/ui/BackButton";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { cn } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../lib/utils";

function LabelsPage() {
    const { t, i18n } = useTranslation();
    const { data: labels, isLoading } = useLabels();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSector, setActiveSector] = useState("Tous");
    const [activeRegion, setActiveRegion] = useState("Tous");

    const sectors = [
        { value: 'Tous', label: t('common.all_sectors') || 'Tous les secteurs' },
        { value: 'finance', label: t('sectors.finance') || 'Finance' },
        { value: 'tech', label: t('sectors.tech') || 'Technologie' },
        { value: 'energy', label: t('sectors.energy') || 'Énergie' },
        { value: 'governance', label: t('sectors.governance') || 'Gouvernance' },
        { value: 'leadership', label: t('sectors.leadership') || 'Leadership' }
    ];

    const regions = ["Tous", 'Afrique de l\'Ouest', 'Afrique de l\'Est', 'Afrique Centrale', 'Afrique du Nord', 'Afrique Australe'];

    const filteredLabels = labels?.filter(label => {
        const nameLocalized = getLocalized(label?.name, i18n.language);
        const descLocalized = getLocalized(label?.description, i18n.language);
        
        const matchesSearch = 
            nameLocalized.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descLocalized.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesSector = activeSector === "Tous" || label?.sector === activeSector;
        const matchesRegion = activeRegion === "Tous" || (label as any)?.region === activeRegion;
        return matchesSearch && matchesSector && matchesRegion;
    }) || [];

    return (
        <div className="bg-white min-h-screen">
            {/* Elegant Hero Header */}
            <section className="bg-brand-secondary pt-24 pb-32 md:pb-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <BackButton />
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            {t('labels.certification_standards')}
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            {t('labels.registry_title_prefix')} <span className="text-brand-accent">{t('labels.registry_title_accent')}</span>
                        </h1>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                            {t('labels.hero_desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Filtering & Search Interface */}
            <section className="-mt-12 relative z-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-2 border border-slate-100">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t('labels.search_placeholder') || "Rechercher un label..."}
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl text-brand-secondary font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4 px-6 border-t lg:border-t-0 lg:border-l border-slate-100 min-w-[200px]">
                                <Filter className="w-4 h-4 text-brand-primary shrink-0" />
                                <div className="relative flex-1">
                                    <select
                                        value={activeSector}
                                        onChange={(e) => setActiveSector(e.target.value)}
                                        className="w-full bg-transparent border-none text-sm font-bold text-brand-secondary focus:ring-0 cursor-pointer appearance-none pr-8"
                                    >
                                        {sectors.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-6 border-t lg:border-t-0 lg:border-l border-slate-100 min-w-[200px]">
                                <Globe className="w-4 h-4 text-brand-primary shrink-0" />
                                <div className="relative flex-1">
                                    <select
                                        value={activeRegion}
                                        onChange={(e) => setActiveRegion(e.target.value)}
                                        className="w-full bg-transparent border-none text-sm font-bold text-brand-secondary focus:ring-0 cursor-pointer appearance-none pr-8"
                                    >
                                        <option value="Tous">{t('common.all_regions')}</option>
                                        {regions.filter(r => r !== "Tous").map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Display */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-[400px] rounded-3xl bg-slate-50 animate-pulse border border-slate-100" />
                            ))}
                        </div>
                    ) : filteredLabels?.length === 0 ? (
                        <div className="py-32 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center px-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-8">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-secondary mb-2">{t('common.no_results')}</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">{t('common.no_results_desc')}</p>
                            <Button variant="outline" className="mt-8 rounded-full" onClick={() => { setSearchTerm(""); setActiveSector("Tous"); setActiveRegion("Tous"); }}>
                                {t('common.reset_filters')}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredLabels?.map((label) => (
                                <motion.div
                                    key={label._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link to={`/labels/${label._id}`} className="block h-full">
                                        <Card className="h-full border border-slate-200 hover:border-brand-primary hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col">
                                            <CardContent className="p-0 flex flex-col h-full">
                                                <div className="aspect-video bg-slate-50 flex items-center justify-center p-12 relative overflow-hidden group-hover:bg-brand-primary/5 transition-colors">
                                                    <div className="absolute top-4 right-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-primary">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    {label.logoUrl ? (
                                                        <img src={resolveImageUrl(label.logoUrl)} alt={getLocalized(label.name, i18n.language)} className="w-full h-full object-cover transition-all duration-500" />
                                                    ) : (
                                                        <Award className="w-16 h-16 text-slate-300 group-hover:text-brand-primary transition-colors" />
                                                    )}
                                                </div>
                                                <div className="p-8 space-y-4 flex-1 flex flex-col">
                                                    <div className="flex justify-between items-center">
                                                        <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-bold border-slate-200 text-slate-400 bg-white">
                                                            {label?.sector || "Secteur"}
                                                        </Badge>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={cn("w-2 h-2 rounded-full", (label?.status || 'active') === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t('labels.certified')}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-brand-secondary group-hover:text-brand-primary transition-colors leading-tight">
                                                        {getLocalized(label?.name, i18n.language)}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                                                        {getLocalized(label?.description, i18n.language) || t('common.no_description')}
                                                    </p>
                                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-primary uppercase tracking-widest">
                                                        <span>{t('labels.protocol_details')}</span>
                                                        <Tag className="w-4 h-4 text-slate-300" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default LabelsPage;
