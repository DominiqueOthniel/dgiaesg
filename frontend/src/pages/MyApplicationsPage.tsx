import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Building2,
    Loader2,
    Plus,
    AlertCircle,
    Search
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { resolveImageUrl } from "../lib/image";

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const { data } = await api.get("/applications/my");
                setApplications(data.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'draft':
                return { label: "Brouillon", color: "bg-slate-100 text-slate-600", icon: FileText };
            case 'submitted':
                return { label: "Soumis", color: "bg-blue-50 text-blue-600", icon: Clock };
            case 'under_review':
                return { label: "En cours d'examen", color: "bg-amber-50 text-amber-600", icon: Search };
            case 'approved':
                return { label: "Approuvé", color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 };
            case 'rejected':
                return { label: "Refusé", color: "bg-red-50 text-red-600", icon: XCircle };
            case 'more_info':
                return { label: "Information requise", color: "bg-purple-50 text-purple-600", icon: AlertCircle };
            default:
                return { label: status, color: "bg-slate-100 text-slate-600", icon: FileText };
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4 text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-brand-secondary tracking-tight">Mes Candidatures</h1>
                            <p className="text-slate-500 font-medium mt-1">Suivez l'état d'avancement de vos demandes de labellisation.</p>
                        </div>
                        <Link to="/labels">
                            <button className="h-14 px-8 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all flex items-center gap-3">
                                <Plus className="w-4 h-4" /> Nouvelle Demande
                            </button>
                        </Link>
                    </div>

                    {applications.length === 0 ? (
                        <Card className="rounded-[2.5rem] border-slate-200/60 p-20 text-center bg-white shadow-xl">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-secondary">Aucune candidature active</h3>
                            <p className="text-slate-400 mt-2 max-w-sm mx-auto">Vous n'avez pas encore initié de demande de certification pour votre organisation.</p>
                            <Link to="/labels" className="inline-block mt-8 text-brand-primary font-black uppercase tracking-widest text-[11px] hover:underline">
                                Explorer les Labels disponibles
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {applications.map((app) => {
                                const status = getStatusInfo(app.status);
                                return (
                                    <Link key={app._id} to={app.status === 'draft' || app.status === 'more_info' ? `/apply/${app._id}` : '#'}>
                                        <Card className="rounded-[2rem] border-slate-200/60 hover:border-brand-primary/30 hover:shadow-xl transition-all bg-white group overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row items-stretch">
                                                    <div className="w-full md:w-32 bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                                                        {app.labelId?.logoUrl ? (
                                                            <img src={resolveImageUrl(app.labelId.logoUrl)} alt={app.labelId.name} className="w-16 h-16 object-contain" />
                                                        ) : (
                                                            <Building2 className="w-12 h-12 text-slate-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Badge className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-none", status.color)}>
                                                                    <status.icon className="w-3 h-3 mr-1.5 inline" /> {status.label}
                                                                </Badge>
                                                                {app.status === 'draft' && (
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Action requise</span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-xl font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">{app.labelId?.name}</h3>
                                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Initié le : {new Date(app.createdAt).toLocaleDateString()}</p>
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right hidden sm:block">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dernière mise à jour</p>
                                                                <p className="text-sm font-bold text-brand-secondary">{new Date(app.updatedAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                                                <ChevronRight className="w-6 h-6" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default MyApplicationsPage;
