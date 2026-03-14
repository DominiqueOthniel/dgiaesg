import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ClipboardList,
    Search,
    Filter,
    ChevronRight,
    Loader2,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Users,
    Building2,
    Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { resolveImageUrl } from "../../lib/image";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const STATUS_OPTIONS = [
    { value: "", label: "Tous les statuts" },
    { value: "submitted", label: "Soumis" },
    { value: "under_review", label: "En cours d'examen" },
    { value: "approved", label: "Approuvé" },
    { value: "rejected", label: "Refusé" },
    { value: "more_info", label: "Info requise" },
    { value: "draft", label: "Brouillon" },
];

const getStatusInfo = (status: string) => {
    switch (status) {
        case "draft":
            return { label: "Brouillon", color: "bg-slate-100 text-slate-600", icon: FileText };
        case "submitted":
            return { label: "Soumis", color: "bg-blue-50 text-blue-600", icon: Clock };
        case "under_review":
            return { label: "En examen", color: "bg-amber-50 text-amber-600", icon: Eye };
        case "approved":
            return { label: "Approuvé", color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 };
        case "rejected":
            return { label: "Refusé", color: "bg-red-50 text-red-600", icon: XCircle };
        case "more_info":
            return { label: "Info requise", color: "bg-purple-50 text-purple-600", icon: AlertCircle };
        default:
            return { label: status, color: "bg-slate-100 text-slate-600", icon: FileText };
    }
};

const ApplicationsAdmin = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchApplications();
    }, [statusFilter]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (statusFilter) params.status = statusFilter;
            const { data } = await api.get("/applications", { params });
            setApplications(data.data || []);
        } catch (err) {
            console.error("Failed to fetch applications", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = applications.filter((app) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            app.companyId?.name?.toLowerCase().includes(q) ||
            app.labelId?.name?.toLowerCase().includes(q)
        );
    });

    // Stats
    const stats = {
        total: applications.length,
        submitted: applications.filter((a) => a.status === "submitted").length,
        under_review: applications.filter((a) => a.status === "under_review").length,
        approved: applications.filter((a) => a.status === "approved").length,
        rejected: applications.filter((a) => a.status === "rejected").length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-brand-secondary tracking-tight flex items-center gap-3">
                        <ClipboardList className="w-7 h-7 text-brand-accent" />
                        Gestion des Candidatures
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Examinez, assignez et validez les demandes de certification.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total", value: stats.total, color: "text-slate-600", bg: "bg-slate-50" },
                    { label: "Soumis", value: stats.submitted, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "En examen", value: stats.under_review, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Approuvés", value: stats.approved, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Refusés", value: stats.rejected, color: "text-red-600", bg: "bg-red-50" },
                ].map((stat) => (
                    <div key={stat.label} className={cn("rounded-2xl p-5 text-center", stat.bg)}>
                        <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <Card className="rounded-2xl border-slate-200/60 shadow-sm">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher par organisation ou label..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all appearance-none cursor-pointer min-w-[200px]"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Application List */}
            {filtered.length === 0 ? (
                <Card className="rounded-2xl border-slate-200/60 p-16 text-center">
                    <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-brand-secondary">Aucune candidature trouvée</h3>
                    <p className="text-sm text-slate-400 mt-1">Aucune candidature ne correspond à vos filtres.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filtered.map((app, idx) => {
                        const status = getStatusInfo(app.status);
                        return (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <Link to={`/admin/applications/${app._id}`}>
                                    <Card className="rounded-2xl border-slate-200/60 hover:border-brand-primary/30 hover:shadow-lg transition-all bg-white group overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex items-stretch">
                                                {/* Logo */}
                                                <div className="w-20 md:w-28 bg-slate-50 flex items-center justify-center border-r border-slate-100 shrink-0">
                                                    {app.companyId?.logoUrl ? (
                                                        <img src={resolveImageUrl(app.companyId.logoUrl)} alt={app.companyId.name} className="w-12 h-12 object-contain" />
                                                    ) : (
                                                        <Building2 className="w-8 h-8 text-slate-200" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1.5 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Badge className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none", status.color)}>
                                                                <status.icon className="w-3 h-3 mr-1 inline" />
                                                                {status.label}
                                                            </Badge>
                                                            {app.auditorId && (
                                                                <Badge className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none">
                                                                    <Users className="w-3 h-3 mr-1 inline" />
                                                                    {app.auditorId?.name || "Auditeur assigné"}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h3 className="text-base font-bold text-brand-secondary group-hover:text-brand-primary transition-colors truncate">
                                                            {app.companyId?.name || "Organisation inconnue"}
                                                        </h3>
                                                        <p className="text-xs text-slate-400 font-medium">
                                                            Label: <span className="text-brand-secondary font-bold">{app.labelId?.name}</span>
                                                            {" · "}Soumis le {new Date(app.submittedAt || app.createdAt).toLocaleDateString("fr-FR")}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-4 shrink-0">
                                                        <div className="text-right hidden sm:block">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Documents</p>
                                                            <p className="text-sm font-bold text-brand-secondary">{app.documents?.length || 0}</p>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                            <ChevronRight className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ApplicationsAdmin;
