import { useState } from "react";
import {
    Search,
    Filter,
    MapPin,
    ChevronRight,
    Building2,
    LayoutGrid,
    List as ListIcon,
    Award,
    Globe,
    Briefcase,
    Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCompanies } from "../hooks/useCompanies";
import { useLabels } from "../hooks/useLabels";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { resolveImageUrl } from "../lib/image";

function DirectoryPage() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [filters, setFilters] = useState({
        sector: "",
        region: "",
        labelId: "",
        searchTerm: ""
    });

    const { data: companiesData, isLoading: companiesLoading } = useCompanies({
        sector: filters.sector || undefined,
        region: filters.region || undefined,
        labelId: filters.labelId || undefined
    });

    const { data: labels } = useLabels();
    const companies = companiesData?.data || [];
    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Professional Hero Header */}
            <section className="bg-brand-secondary pt-24 pb-40 md:pb-56 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/5 -skew-x-12 translate-x-1/2" />

                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest mb-8"
                            >
                                <Building2 className="w-4 h-4" />
                                Annuaire Institutionnel
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                                Registre Central des <span className="text-brand-accent">Sociétés</span>
                            </h1>
                            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                                Accédez à l'index exhaustif des entités certifiées. Suivez en temps réel les performances d'impact et la conformité aux standards coopératifs.
                            </p>
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
                            <button
                                onClick={() => setView("grid")}
                                className={cn("p-4 rounded-xl transition-all", view === "grid" ? "bg-white text-brand-secondary shadow-lg" : "text-white/40 hover:text-white")}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setView("list")}
                                className={cn("p-4 rounded-xl transition-all", view === "list" ? "bg-white text-brand-secondary shadow-lg" : "text-white/40 hover:text-white")}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content & Discovery Section */}
            <section className="-mt-24 md:-mt-32 relative z-20 pb-32">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

                        {/* Professional Filtering Sidebar */}
                        <aside className="lg:col-span-3">
                            <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40 sticky top-28 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100">
                                        <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-wider">
                                            <Filter className="w-4 h-4" />
                                            Filtres de recherche
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Award className="w-3.5 h-3.5" /> Programme de Label
                                            </label>
                                            <select
                                                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-brand-secondary focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
                                                onChange={(e) => setFilters(f => ({ ...f, labelId: e.target.value }))}
                                                value={filters.labelId}
                                            >
                                                <option value="">Tous les labels</option>
                                                {labels?.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Briefcase className="w-3.5 h-3.5" /> Secteur d'Activité
                                            </label>
                                            <select
                                                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-brand-secondary focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
                                                onChange={(e) => setFilters(f => ({ ...f, sector: e.target.value }))}
                                                value={filters.sector}
                                            >
                                                <option value="">Tous les secteurs</option>
                                                {['Agriculture', 'Technologie', 'Industrie', 'Services'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Globe className="w-3.5 h-3.5" /> Zone Géographique
                                            </label>
                                            <select
                                                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-brand-secondary focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
                                                onChange={(e) => setFilters(f => ({ ...f, region: e.target.value }))}
                                                value={filters.region}
                                            >
                                                <option value="">Toutes les régions</option>
                                                {['Europe', 'Afrique', 'Amérique', 'Asie'].map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            className="w-full py-6 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-brand-primary"
                                            onClick={() => setFilters({ sector: "", region: "", labelId: "", searchTerm: "" })}
                                        >
                                            Réinitialiser l'index
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Search & Dynamic Results */}
                        <div className="lg:col-span-9 space-y-10">
                            {/* Modern Search Bar */}
                            <Card className="rounded-3xl border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <CardContent className="p-2">
                                    <div className="relative group p-1">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher une entité certifiée par son nom..."
                                            className="w-full pl-14 pr-8 py-6 bg-transparent border-none text-xl font-bold tracking-tight text-brand-secondary placeholder:text-slate-200 focus:outline-none focus:ring-0 transition-all"
                                            value={filters.searchTerm}
                                            onChange={(e) => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* View Content Logic */}
                            {companiesLoading ? (
                                <div className={cn("grid gap-8", view === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-64 rounded-[2rem] bg-white animate-pulse border border-slate-100 shadow-sm" />
                                    ))}
                                </div>
                            ) : filteredCompanies.length === 0 ? (
                                <div className="py-40 text-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white shadow-inner flex flex-col items-center justify-center px-10">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                                        <Building2 className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-secondary mb-3">Aucune entité trouvée</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">Nous n'avons trouvé aucune correspondance pour votre recherche dans le registre actuel.</p>
                                    <Button variant="outline" className="mt-10 rounded-full px-8" onClick={() => setFilters({ sector: "", region: "", labelId: "", searchTerm: "" })}>
                                        Effacer les critères
                                    </Button>
                                </div>
                            ) : (
                                <div className={cn("grid gap-8", view === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                                    {filteredCompanies.map((company) => (
                                        <motion.div
                                            key={company._id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Link to={`/directory/${company._id}`} className="block group">
                                                <Card className="rounded-[2.5rem] border-slate-200/60 shadow-lg shadow-slate-200/20 hover:shadow-2xl hover:shadow-brand-primary/5 hover:border-brand-primary/30 transition-all duration-500 overflow-hidden h-full flex flex-col">
                                                    <CardContent className="p-10 flex flex-col h-full">
                                                        <div className="flex items-start justify-between mb-8">
                                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-300 text-xs overflow-hidden group-hover:bg-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                                                                {company.logoUrl ? (
                                                                    <img src={resolveImageUrl(company.logoUrl)} alt={company.name} className="w-full h-full object-cover transition-all" />
                                                                ) : company.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="text-right space-y-3">
                                                                <Badge variant="outline" className={cn(
                                                                    "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                                                                    (company?.status || 'certified') === 'certified'
                                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                                        : "bg-red-50 text-red-600 border-red-100"
                                                                )}>
                                                                    {company?.status || "Inactif"}
                                                                </Badge>
                                                                {typeof company?.labelId !== 'string' && company?.labelId && (
                                                                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                                                                        <Zap className="w-3 h-3 fill-brand-primary" />
                                                                        {company.labelId.name}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4 mb-10 flex-1">
                                                            <h3 className="text-2xl font-bold text-brand-secondary group-hover:text-brand-primary transition-colors leading-tight">
                                                                {company?.name}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
                                                                <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                                    <Briefcase className="w-3 h-3" />
                                                                    {company?.sector || "Secteur"}
                                                                </span>
                                                                <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {company?.region || "Localisation"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                                                            <div className="space-y-3 w-full max-w-[200px]">
                                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                                    <span className="text-slate-400">Indice de Maturité</span>
                                                                    <span className="text-brand-secondary">{company.score || 0}%</span>
                                                                </div>
                                                                <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        whileInView={{ width: `${company.score || 0}%` }}
                                                                        className="h-full bg-brand-primary rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="w-12 h-12 rounded-full border border-slate-100 text-slate-300 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary group-hover:shadow-lg shadow-brand-primary/20 transition-all duration-300">
                                                                <ChevronRight className="w-5 h-5 mx-auto" />
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
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DirectoryPage;
