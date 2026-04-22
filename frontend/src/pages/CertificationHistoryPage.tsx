import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Award,
    Calendar,
    Download,
    RefreshCw,
    ShieldCheck,
    Clock,
    XCircle,
    ChevronLeft,
    Loader2,
    FileText,
    Copy,
    Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { toast } from "react-hot-toast";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default function CertificationHistoryPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<any>(null);
    const [badgeData, setBadgeData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [renewingId, setRenewingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // First get the company
            const orgRes = await api.get("/companies/my-org");
            const org = orgRes.data?.data;
            setCompany(org);

            if (org?._id) {
                // Fetch certification history
                const historyRes = await api.get(`/certificates/history/${org._id}`);
                setApplications(historyRes.data?.data || []);

                // Fetch badge if certified
                if (org.status === "certified") {
                    try {
                        const badgeRes = await api.get(`/certificates/badge/${org._id}`);
                        setBadgeData(badgeRes.data?.data);
                    } catch { /* Badge not available */ }
                }
            }
        } catch (err: any) {
            console.error("Failed to load history:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (applicationId: string) => {
        try {
            const response = await api.get(`/certificates/${applicationId}/download`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `certificate_${applicationId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Certificat téléchargé !");
        } catch {
            toast.error("Échec du téléchargement");
        }
    };

    const handleRenewal = async (applicationId: string) => {
        setRenewingId(applicationId);
        try {
            const res = await api.post(`/renewals/${applicationId}`);
            const newApp = res.data?.data;
            toast.success("Renouvellement initié !");
            if (newApp?._id) {
                navigate(`/apply/${newApp._id}`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Échec du renouvellement");
        } finally {
            setRenewingId(null);
        }
    };

    const copyEmbedCode = () => {
        if (badgeData?.embedCode) {
            navigator.clipboard.writeText(badgeData.embedCode);
            setCopied(true);
            toast.success("Code d'intégration copié !");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "approved":
                return { label: "Certifié", color: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: ShieldCheck };
            case "rejected":
                return { label: "Refusé", color: "bg-red-50 text-red-600 border-red-200", icon: XCircle };
            case "expired":
                return { label: "Expiré", color: "bg-orange-50 text-orange-600 border-orange-200", icon: Clock };
            default:
                return { label: status, color: "bg-slate-50 text-slate-600 border-slate-200", icon: Clock };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-28 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => navigate("/org-hub")}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary transition-colors flex items-center gap-2 mb-4"
                    >
                        <ChevronLeft className="w-3 h-3" /> Retour au Hub
                    </button>
                    <h1 className="text-3xl font-bold text-brand-secondary tracking-tight">
                        Historique des Certifications
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {company?.name} — Archive complète de vos certifications passées et actives
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        {applications.length === 0 ? (
                            <Card className="rounded-[2rem] border-slate-200/60 shadow-lg p-12 text-center">
                                <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-brand-secondary mb-2">Aucune certification</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    Vous n'avez pas encore de certifications dans votre historique.
                                </p>
                                <Link to="/labels">
                                    <Button className="rounded-2xl bg-brand-primary text-white">
                                        Explorer les Labels
                                    </Button>
                                </Link>
                            </Card>
                        ) : (
                            <AnimatePresence>
                                {applications.map((app, idx) => {
                                    const statusInfo = getStatusInfo(app.status);
                                    const StatusIcon = statusInfo.icon;
                                    const label = app.labelId;
                                    const isExpiringSoon = app.status === "approved" && app.expiresAt &&
                                        new Date(app.expiresAt).getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000;

                                    return (
                                        <motion.div
                                            key={app._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <Card className="rounded-[2rem] border-slate-200/60 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                                <CardContent className="p-0">
                                                    {/* Card Header */}
                                                    <div className={cn(
                                                        "px-8 py-5 flex items-center justify-between",
                                                        app.status === "approved" ? "bg-emerald-50/50" : "bg-slate-50"
                                                    )}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                                                app.status === "approved" ? "bg-emerald-100 text-emerald-600" :
                                                                    app.status === "rejected" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                                                            )}>
                                                                <StatusIcon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-bold text-brand-secondary">
                                                                    {label?.name || "Label"}
                                                                </h3>
                                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                                    {label?.sector || "Secteur"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge className={cn("rounded-full text-[10px] font-black uppercase tracking-wider border", statusInfo.color)}>
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="px-8 py-6 space-y-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Émission</p>
                                                                <p className="text-sm font-bold text-brand-secondary">
                                                                    {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiration</p>
                                                                <p className={cn("text-sm font-bold", isExpiringSoon ? "text-orange-500" : "text-brand-secondary")}>
                                                                    {app.expiresAt ? new Date(app.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Certificat</p>
                                                                <p className="text-sm font-mono font-bold text-brand-secondary">
                                                                    CERT-{app._id?.slice(-8).toUpperCase()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {isExpiringSoon && (
                                                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                                                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                                                <p className="text-xs text-amber-800 font-medium">
                                                                    Cette certification expire bientôt. Pensez au renouvellement.
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Actions */}
                                                        <div className="flex gap-3 pt-2">
                                                            {app.certificateUrl && app.status === "approved" && (
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => handleDownload(app._id)}
                                                                    className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 border-slate-200"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" /> Télécharger PDF
                                                                </Button>
                                                            )}
                                                            {(app.status === "approved" || app.status === "expired") && (
                                                                <Button
                                                                    onClick={() => handleRenewal(app._id)}
                                                                    disabled={renewingId === app._id}
                                                                    className="rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-brand-primary text-white"
                                                                >
                                                                    {renewingId === app._id ? (
                                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                    ) : (
                                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                                    )}
                                                                    Renouveler
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Sidebar: Digital Badge */}
                    <div className="space-y-6">
                        {badgeData && (
                            <Card className="rounded-[2rem] border-slate-200/60 shadow-lg overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                        <Award className="w-4 h-4" /> Badge Digital
                                    </div>

                                    {/* Badge Preview */}
                                    <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-center mb-6">
                                        <div dangerouslySetInnerHTML={{ __html: badgeData.svg }} />
                                    </div>

                                    <p className="text-xs text-slate-500 mb-4">
                                        Intégrez ce badge sur votre site web pour afficher votre certification.
                                    </p>

                                    {/* Embed Code */}
                                    <div className="bg-slate-900 rounded-xl p-4 mb-4">
                                        <code className="text-[10px] text-emerald-400 break-all leading-relaxed block max-h-20 overflow-auto">
                                            {badgeData.embedCode?.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 200)}...
                                        </code>
                                    </div>

                                    <Button
                                        onClick={copyEmbedCode}
                                        variant="outline"
                                        className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 border-slate-200"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? "Copié !" : "Copier le Code"}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Stats */}
                        <Card className="rounded-[2rem] border-slate-200/60 shadow-lg overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                    <Calendar className="w-4 h-4" /> Statistiques
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                                        <span className="text-xs font-bold text-emerald-700">Certifications actives</span>
                                        <span className="text-lg font-black text-emerald-600">
                                            {applications.filter(a => a.status === "approved").length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                                        <span className="text-xs font-bold text-orange-700">Expirations passées</span>
                                        <span className="text-lg font-black text-orange-600">
                                            {applications.filter(a => a.status === "expired" || a.status === "rejected").length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <span className="text-xs font-bold text-slate-700">Total historique</span>
                                        <span className="text-lg font-black text-brand-secondary">
                                            {applications.length}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
