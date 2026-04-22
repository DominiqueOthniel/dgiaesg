import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    FileText,
    ShieldCheck,
    Upload,
    Save,
    Send,
    Loader2,
    AlertCircle,
    Info,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { toast } from "react-hot-toast";
import ChatPanel from "../components/chat/ChatPanel";

const ApplyPage = () => {
    const { id } = useParams<{ id: string }>(); // This is the Application ID
    const navigate = useNavigate();

    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState(1);

    const [answers, setAnswers] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const { data } = await api.get(`/applications/${id}`);
                const appData = data.data;
                setApplication(appData);
                setAnswers(appData.answers || []);
                setDocuments(appData.documents || []);

                // If criteria are empty on the label, fetch them directly
                if (appData.labelId && (!appData.labelId.criteria || appData.labelId.criteria.length === 0)) {
                    try {
                        const labelId = appData.labelId._id || appData.labelId;
                        const criteriaRes = await api.get(`/criteria?labelId=${labelId}`);
                        if (criteriaRes.data?.data?.length > 0) {
                            setApplication((prev: any) => ({
                                ...prev,
                                labelId: {
                                    ...prev.labelId,
                                    criteria: criteriaRes.data.data,
                                },
                            }));
                        }
                    } catch (err) {
                        console.warn("Could not fetch criteria fallback", err);
                    }
                }

                // If it's already submitted and not in more_info, redirect to tracker
                if (appData.status !== 'draft' && appData.status !== 'more_info') {
                    // navigate('/org-hub');
                }
            } catch (error) {
                toast.error("Impossible de charger la candidature");
                navigate('/org-hub');
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id, navigate]);

    const handleSaveDraft = async () => {
        setSaving(true);
        try {
            await api.put(`/applications/${id}`, {
                answers,
                documents,
                status: application.status // keep same status
            });
            toast.success("Brouillon sauvegardé");
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('image', file); // API expects 'image' field for uploads

            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                const newDoc = {
                    name: file.name,
                    url: data.data,
                    type: file.type
                };
                setDocuments(prev => [...prev, newDoc]);
                toast.success("Document ajouté");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de l'upload");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitApplication = async () => {
        setSaving(true);
        try {
            await api.put(`/applications/${id}`, {
                answers,
                documents,
                status: 'submitted'
            });
            toast.success("Candidature soumise avec succès !");
            navigate('/org-hub');
        } catch (error) {
            toast.error("Erreur lors de la soumission");
        } finally {
            setSaving(false);
        }
    };

    const updateAnswer = (criteriaId: string, text: string) => {
        setAnswers(prev => {
            const index = prev.findIndex(a => a.criteriaId === criteriaId || a.criteriaId?._id === criteriaId);
            if (index > -1) {
                const newAnswers = [...prev];
                newAnswers[index] = { ...newAnswers[index], text };
                return newAnswers;
            } else {
                return [...prev, { criteriaId, text }];
            }
        });
    };

    const getAnswer = (criteriaId: string) => {
        const ans = answers.find(a => a.criteriaId === criteriaId || a.criteriaId?._id === criteriaId);
        return ans?.text || "";
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chargement du protocole...</p>
            </div>
        </div>
    );

    const steps = [
        { id: 1, title: "Identification", icon: FileText },
        { id: 2, title: "Auto-Évaluation", icon: ShieldCheck },
        { id: 3, title: "Justificatifs", icon: Upload },
        { id: 4, title: "Validation", icon: Send },
    ];

    return (
        <>
            <div className="min-h-screen bg-slate-50 pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Progress Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <Link to="/org-hub" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary transition-colors flex items-center gap-2 mb-2">
                                    <ChevronLeft className="w-3 h-3" /> Retour au Hub
                                </Link>
                                <h1 className="text-3xl font-bold text-brand-secondary tracking-tight">Candidature au Label</h1>
                                <p className="text-sm font-medium text-slate-500">{application.labelId?.name}</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleSaveDraft}
                                    isLoading={saving}
                                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-white"
                                >
                                    <Save className="w-4 h-4 mr-2" /> Brouillon
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {steps.map((s) => (
                                <div key={s.id} className="relative">
                                    <div className={cn(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        step >= s.id ? "bg-brand-primary" : "bg-slate-200"
                                    )} />
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                            step >= s.id ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "bg-slate-200 text-slate-400"
                                        )}>
                                            <s.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest hidden md:block",
                                            step >= s.id ? "text-brand-secondary" : "text-slate-400"
                                        )}>{s.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {step === 1 && (
                                <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl p-10 bg-white">
                                    <div className="max-w-2xl">
                                        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8">
                                            <Info className="w-8 h-8 text-brand-primary" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-brand-secondary mb-4 tracking-tight">Bienvenue dans le processus de certification</h2>
                                        <p className="text-slate-500 leading-relaxed mb-10">
                                            Vous allez entamer une démarche de validation pour le label <span className="font-bold text-brand-secondary">{application.labelId?.name}</span>.
                                            Ce parcours se compose d'une auto-évaluation basée sur nos critères d'excellence et d'un dépôt de pièces justificatives.
                                        </p>

                                        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 mb-10">
                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                            <div className="text-xs text-amber-800 font-medium leading-relaxed">
                                                Assurez-vous que les informations de votre profil organisationnel sont à jour avant de finaliser cette demande. Les changements ultérieurs pourraient affecter le processus d'audit.
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => setStep(2)}
                                            className="h-14 px-10 rounded-2xl bg-brand-secondary text-white hover:bg-brand-primary transition-all font-black uppercase tracking-widest text-[11px]"
                                        >
                                            Commencer l'auto-évaluation <ArrowRight className="ml-3 w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-brand-secondary tracking-tight">Référentiel de Critères</h2>
                                        <Badge className="bg-slate-100 text-brand-secondary border-none px-4 py-2 rounded-xl text-[10px] font-black">
                                            {application.labelId?.name}
                                        </Badge>
                                    </div>

                                    {application.labelId?.criteria?.map((c: any, idx: number) => (
                                        <Card key={c._id || idx} className="rounded-[2rem] border-slate-200/60 hover:border-brand-primary/30 transition-all shadow-sm">
                                            <CardContent className="p-8">
                                                <div className="flex gap-6">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100">
                                                        <span className="text-[10px] font-black text-slate-400">#</span>
                                                        <span className="text-lg font-bold text-brand-secondary">{idx + 1}</span>
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <div>
                                                            <Badge className="bg-brand-primary/5 text-brand-primary border-none text-[9px] uppercase font-black px-2 py-0.5 rounded-md mb-2">
                                                                {c.category}
                                                            </Badge>
                                                            <h3 className="text-lg font-bold text-brand-secondary tracking-tight">{c.title}</h3>
                                                            <p className="text-sm text-slate-500 mt-1">{c.description}</p>
                                                        </div>

                                                        <textarea
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-brand-primary/5 focus:bg-white transition-all outline-none min-h-[100px]"
                                                            placeholder="Décrivez comment votre organisation répond à ce critère..."
                                                            value={getAnswer(c._id)}
                                                            onChange={(e) => updateAnswer(c._id, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase">Pondération</span>
                                                        <span className="text-2xl font-black text-brand-primary">{c.weight}%</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <div className="flex justify-between pt-10">
                                        <Button variant="outline" onClick={() => setStep(1)} className="rounded-2xl h-14 px-8 border-slate-200">
                                            <ChevronLeft className="mr-2 w-4 h-4" /> Précédent
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (answers.length < (application.labelId?.criteria?.length || 0)) {
                                                    toast.error("Veuillez répondre à tous les critères avant de continuer.");
                                                    return;
                                                }
                                                setStep(3);
                                            }}
                                            className="rounded-2xl h-14 px-10 bg-brand-secondary text-white font-black uppercase tracking-widest text-[11px]"
                                        >
                                            Suivant: Justificatifs <ChevronRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl p-10 bg-white">
                                    <div className="max-w-3xl">
                                        <h2 className="text-2xl font-bold text-brand-secondary mb-2 tracking-tight">Vault de Conformité</h2>
                                        <p className="text-slate-500 mb-10">Téléchargez les documents requis pour attester de vos déclarations. Formats acceptés: PDF, JPG, PNG.</p>

                                        <div
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                            className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center bg-slate-50 hover:bg-slate-100/50 hover:border-brand-primary/30 transition-all cursor-pointer group mb-10"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                                {saving ? <Loader2 className="w-8 h-8 text-brand-primary animate-spin" /> : <Upload className="w-8 h-8 text-brand-primary" />}
                                            </div>
                                            <p className="text-sm font-bold text-brand-secondary mb-1">Cliquer pour uploader</p>
                                            <p className="text-xs text-slate-400 font-medium tracking-tight">Glissez-déposez vos fichiers ici (Max 10MB)</p>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Documents Indexés</h4>
                                            {documents.length === 0 ? (
                                                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                                                    <p className="text-xs text-slate-400 italic">Aucun document pour le moment</p>
                                                </div>
                                            ) : (
                                                documents.map((doc, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-brand-primary transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="w-5 h-5 text-brand-primary" />
                                                            <span className="text-xs font-bold text-brand-secondary">{doc.name}</span>
                                                        </div>
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] uppercase font-black tracking-widest">Vérifié</Badge>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex justify-between pt-16">
                                            <Button variant="outline" onClick={() => setStep(2)} className="rounded-2xl h-14 px-8 border-slate-200">
                                                <ChevronLeft className="mr-2 w-4 h-4" /> Précédent
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (documents.length === 0) {
                                                        toast.error("Veuillez uploader au moins un document justificatif.");
                                                        return;
                                                    }
                                                    setStep(4);
                                                }}
                                                className="rounded-2xl h-14 px-10 bg-brand-secondary text-white font-black uppercase tracking-widest text-[11px]"
                                            >
                                                Suivant: Revue Finale <ChevronRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {step === 4 && (
                                <div className="space-y-8">
                                    <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl overflow-hidden bg-white">
                                        <div className="bg-brand-secondary p-10 text-white flex justify-between items-center">
                                            <div>
                                                <h2 className="text-2xl font-bold tracking-tight">Récapitulatif de Soumission</h2>
                                                <p className="text-white/60 text-sm mt-1">Veuillez vérifier vos informations avant l'envoi définitif.</p>
                                            </div>
                                            <ShieldCheck className="w-12 h-12 text-brand-accent opacity-20" />
                                        </div>
                                        <div className="p-10 space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Status des Critères</h4>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-brand-secondary">{answers.length} / {application.labelId?.criteria?.length}</p>
                                                            <p className="text-xs text-slate-500 font-medium">Réponses complétées</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Vault Justificatif</h4>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                                            <Upload className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-brand-secondary">{documents.length} fichiers</p>
                                                            <p className="text-xs text-slate-500 font-medium">Prêts pour l'audit</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                                <div className="flex gap-4">
                                                    <AlertCircle className="w-6 h-6 text-brand-primary shrink-0" />
                                                    <div className="space-y-3">
                                                        <p className="text-sm font-bold text-brand-secondary">Déclaration sur l'honneur</p>
                                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                            En soumettant cette demande, vous certifiez que toutes les informations fournies sont exactes et sincères. Toute fausse déclaration pourra entraîner un rejet définitif de l'organisation. L'audit débutera dès réception des frais de dossier.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <div className="flex justify-between pt-10">
                                        <Button variant="outline" onClick={() => setStep(3)} className="rounded-2xl h-14 px-8 border-slate-200">
                                            <ChevronLeft className="mr-2 w-4 h-4" /> Précédent
                                        </Button>
                                        <Button
                                            onClick={handleSubmitApplication}
                                            isLoading={saving}
                                            className="rounded-2xl h-14 px-12 bg-brand-primary text-white hover:bg-brand-secondary shadow-xl shadow-brand-primary/20 transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-4"
                                        >
                                            Soumettre le Dossier Permanent <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Chat Panel for communication with auditor */}
            {application?._id && <ChatPanel applicationId={application._id} />}
        </>
    );
};


const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default ApplyPage;
