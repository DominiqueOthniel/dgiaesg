import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    Award,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    Eye,
    Users,
    Loader2,
    MessageSquare,
    ShieldCheck,
    ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { resolveImageUrl } from "../../lib/image";
import { toast } from "react-hot-toast";
import ChatPanel from "../../components/chat/ChatPanel";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

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

const CATEGORY_LABELS: Record<string, string> = {
    governance: "Gouvernance",
    environment: "Environnement",
    social: "Social",
    economic: "Économique",
    quality: "Qualité",
};

const ApplicationReviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedAuditor, setSelectedAuditor] = useState("");
    const [assigningAuditor, setAssigningAuditor] = useState(false);
    const [auditNotes, setAuditNotes] = useState("");
    const [internalNotes, setInternalNotes] = useState("");
    const [deciding, setDeciding] = useState(false);
    const [showDecisionModal, setShowDecisionModal] = useState<string | null>(null);

    useEffect(() => {
        fetchApplication();
        fetchUsers();
    }, [id]);

    const fetchApplication = async () => {
        try {
            const { data } = await api.get(`/applications/${id}`);
            setApplication(data.data);
            setAuditNotes(data.data.auditNotes || "");
            setInternalNotes(data.data.internalNotes || "");
            setSelectedAuditor(data.data.auditorId?._id || data.data.auditorId || "");
        } catch (error) {
            toast.error("Impossible de charger la candidature");
            navigate("/admin/applications");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get("/users");
            setUsers(data.data || []);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const handleAssignAuditor = async () => {
        if (!selectedAuditor) {
            toast.error("Veuillez sélectionner un auditeur");
            return;
        }
        setAssigningAuditor(true);
        try {
            await api.put(`/applications/${id}/assign`, { auditorId: selectedAuditor });
            toast.success("Auditeur assigné avec succès");
            fetchApplication();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de l'assignation");
        } finally {
            setAssigningAuditor(false);
        }
    };

    const handleDecision = async (decision: string) => {
        setDeciding(true);
        try {
            await api.put(`/applications/${id}/review`, {
                decision,
                auditNotes,
                internalNotes,
            });
            toast.success(
                decision === "approved" ? "Candidature approuvée ! Certification émise." :
                    decision === "rejected" ? "Candidature refusée." :
                        "Demande d'informations complémentaires envoyée."
            );
            setShowDecisionModal(null);
            fetchApplication();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la décision");
        } finally {
            setDeciding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!application) return null;

    const status = getStatusInfo(application.status);
    const company = application.companyId;
    const label = application.labelId;
    const criteria = label?.criteria || [];
    const canDecide = ["submitted", "under_review"].includes(application.status);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/admin/applications")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-brand-secondary tracking-tight">
                        Examen de candidature
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {company?.name} → {label?.name}
                    </p>
                </div>
                <Badge className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none", status.color)}>
                    <status.icon className="w-3.5 h-3.5 mr-1.5 inline" />
                    {status.label}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Company Info */}
                    <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-secondary to-brand-primary p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    {company?.logoUrl ? (
                                        <img src={resolveImageUrl(company.logoUrl)} alt={company.name} className="w-10 h-10 object-contain rounded-lg" />
                                    ) : (
                                        <Building2 className="w-7 h-7" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{company?.name}</h2>
                                    <p className="text-white/70 text-sm">{company?.sector} · {company?.region}</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Label demandé</p>
                                    <p className="font-bold text-brand-secondary flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-brand-accent" />
                                        {label?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date de soumission</p>
                                    <p className="font-bold text-brand-secondary">
                                        {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString("fr-FR") : "Non soumis"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Documents</p>
                                    <p className="font-bold text-brand-secondary">{application.documents?.length || 0} fichiers</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Réponses critères</p>
                                    <p className="font-bold text-brand-secondary">{application.answers?.length || 0} / {criteria.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Criteria Answers */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-brand-secondary flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-brand-accent" />
                            Réponses aux Critères d'Évaluation
                        </h3>
                        {criteria.length === 0 ? (
                            <Card className="rounded-2xl border-slate-200/60 p-8 text-center">
                                <p className="text-slate-400 text-sm">Aucun critère défini pour ce label.</p>
                            </Card>
                        ) : (
                            criteria.map((c: any, idx: number) => {
                                const answer = application.answers?.find(
                                    (a: any) => (a.criteriaId?._id || a.criteriaId) === c._id
                                );
                                return (
                                    <motion.div
                                        key={c._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="rounded-2xl border-slate-200/60">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 space-y-3">
                                                        <div>
                                                            <Badge className="text-[9px] mb-2 bg-slate-100 text-slate-600 border-none">
                                                                {CATEGORY_LABELS[c.category] || c.category} · Poids: {c.weight}%
                                                            </Badge>
                                                            <h4 className="font-bold text-brand-secondary">{c.title}</h4>
                                                            <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                                                        </div>
                                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Réponse de l'organisation</p>
                                                            {answer?.text ? (
                                                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{answer.text}</p>
                                                            ) : (
                                                                <p className="text-sm text-slate-300 italic">Aucune réponse fournie</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Documents */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-brand-secondary flex items-center gap-2">
                            <FileText className="w-5 h-5 text-brand-accent" />
                            Documents Justificatifs
                        </h3>
                        {(application.documents?.length || 0) === 0 ? (
                            <Card className="rounded-2xl border-slate-200/60 p-8 text-center">
                                <p className="text-slate-400 text-sm">Aucun document déposé.</p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {application.documents.map((doc: any, idx: number) => (
                                    <Card key={idx} className="rounded-2xl border-slate-200/60 hover:border-brand-primary/30 transition-all">
                                        <CardContent className="p-5 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                                                <FileText className="w-6 h-6 text-brand-accent" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-brand-secondary truncate">{doc.name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{doc.type}</p>
                                            </div>
                                            <a
                                                href={resolveImageUrl(doc.url)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-brand-primary"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    {/* Auditor Assignment */}
                    <Card className="rounded-2xl border-slate-200/60 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-brand-secondary flex items-center gap-2">
                                <Users className="w-4 h-4 text-brand-accent" />
                                Assignation d'Auditeur
                            </h3>
                            <select
                                value={selectedAuditor}
                                onChange={(e) => setSelectedAuditor(e.target.value)}
                                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-slate-50"
                                disabled={!canDecide}
                            >
                                <option value="">Sélectionner un auditeur</option>
                                {users
                                    .filter((u) => u.role === "admin" || u.role === "auditor")
                                    .map((u) => (
                                        <option key={u._id} value={u._id}>
                                            {u.name} ({u.email}) — {u.role}
                                        </option>
                                    ))}
                            </select>
                            <Button
                                onClick={handleAssignAuditor}
                                isLoading={assigningAuditor}
                                disabled={!canDecide || !selectedAuditor}
                                className="w-full h-12 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs uppercase tracking-widest"
                            >
                                Assigner l'auditeur
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Audit Notes */}
                    <Card className="rounded-2xl border-slate-200/60 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-brand-secondary flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-brand-accent" />
                                Notes d'Audit
                            </h3>
                            <textarea
                                value={auditNotes}
                                onChange={(e) => setAuditNotes(e.target.value)}
                                rows={4}
                                placeholder="Notes visibles par l'organisation..."
                                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-slate-50 resize-none"
                                disabled={!canDecide}
                            />
                            <textarea
                                value={internalNotes}
                                onChange={(e) => setInternalNotes(e.target.value)}
                                rows={3}
                                placeholder="Notes internes (confidentielles)..."
                                className="w-full px-4 py-3 text-sm border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-amber-300 transition-all bg-amber-50/50 resize-none"
                                disabled={!canDecide}
                            />
                        </CardContent>
                    </Card>

                    {/* Decision Hub */}
                    {canDecide && (
                        <Card className="rounded-2xl border-2 border-brand-primary/20 shadow-lg">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-brand-secondary text-center flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-brand-accent" />
                                    Décision de Certification
                                </h3>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => setShowDecisionModal("approved")}
                                        className="w-full h-14 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-600/20"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Approuver & Certifier
                                    </Button>
                                    <Button
                                        onClick={() => setShowDecisionModal("more_info")}
                                        className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Demander des infos
                                    </Button>
                                    <Button
                                        onClick={() => setShowDecisionModal("rejected")}
                                        variant="destructive"
                                        className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Refuser
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Resolved Status */}
                    {!canDecide && application.status !== "draft" && (
                        <Card className="rounded-2xl border-slate-200/60">
                            <CardContent className="p-6 text-center space-y-2">
                                <status.icon className={cn("w-10 h-10 mx-auto", application.status === "approved" ? "text-emerald-500" : "text-red-500")} />
                                <p className="font-bold text-brand-secondary">
                                    {application.status === "approved" ? "Certification émise" : application.status === "rejected" ? "Candidature refusée" : "Statut: " + status.label}
                                </p>
                                {application.reviewedAt && (
                                    <p className="text-xs text-slate-400">
                                        Décision prise le {new Date(application.reviewedAt).toLocaleDateString("fr-FR")}
                                    </p>
                                )}
                                {application.expiresAt && (
                                    <p className="text-xs text-slate-400">
                                        Expire le {new Date(application.expiresAt).toLocaleDateString("fr-FR")}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Timeline */}
                    <Card className="rounded-2xl border-slate-200/60 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-brand-secondary text-sm">Chronologie</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-600">Créé</p>
                                        <p className="text-[10px] text-slate-400">{new Date(application.createdAt).toLocaleString("fr-FR")}</p>
                                    </div>
                                </div>
                                {application.submittedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-600">Soumis</p>
                                            <p className="text-[10px] text-slate-400">{new Date(application.submittedAt).toLocaleString("fr-FR")}</p>
                                        </div>
                                    </div>
                                )}
                                {application.reviewedAt && (
                                    <div className="flex items-start gap-3">
                                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", application.status === "approved" ? "bg-emerald-400" : "bg-red-400")} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-600">Décision rendue</p>
                                            <p className="text-[10px] text-slate-400">{new Date(application.reviewedAt).toLocaleString("fr-FR")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Decision Confirmation Modal */}
            {showDecisionModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 space-y-6"
                    >
                        <h2 className="text-xl font-bold text-brand-secondary text-center">
                            {showDecisionModal === "approved" && "Confirmer l'approbation"}
                            {showDecisionModal === "rejected" && "Confirmer le refus"}
                            {showDecisionModal === "more_info" && "Demander des informations"}
                        </h2>
                        <p className="text-sm text-slate-500 text-center">
                            {showDecisionModal === "approved" && "L'organisation sera certifiée et apparaîtra dans le registre public. La certification sera valide pour 1 an."}
                            {showDecisionModal === "rejected" && "La candidature sera marquée comme refusée. L'organisation pourra soumettre une nouvelle demande ultérieurement."}
                            {showDecisionModal === "more_info" && "L'organisation sera notifiée qu'elle doit fournir des informations supplémentaires. Elle pourra mettre à jour son dossier."}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setShowDecisionModal(null)}
                                className="px-6 h-12 rounded-xl"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={() => handleDecision(showDecisionModal)}
                                isLoading={deciding}
                                className={cn(
                                    "px-8 h-12 rounded-xl font-bold text-white",
                                    showDecisionModal === "approved" && "bg-emerald-600 hover:bg-emerald-700",
                                    showDecisionModal === "rejected" && "bg-red-600 hover:bg-red-700",
                                    showDecisionModal === "more_info" && "bg-purple-600 hover:bg-purple-700",
                                )}
                            >
                                Confirmer
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Chat Panel for communication with organization */}
            {id && <ChatPanel applicationId={id} />}
        </div>
    );
};

export default ApplicationReviewPage;
