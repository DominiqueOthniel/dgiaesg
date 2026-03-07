import { motion } from "framer-motion";
import { useState } from "react";
import {
    Mail,
    ArrowRight,
    Loader2,
    ChevronLeft,
    Key
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import api from "../services/api";
import { toast } from "react-hot-toast";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/auth/forgot-password", { email });
            toast.success("CODE DE RÉCUPÉRATION GÉNÉRÉ");
            setIsSent(true);
            // In a real environment, we would show a message that email was sent.
            // For this demo, we can show the token or redirect to reset.
            console.log("Reset Token:", response.data.token);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "ERREUR SYSTÈME");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-forest flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Geometric Accents */}
            <div className="absolute top-0 right-0 w-px h-full bg-cream/10 -translate-x-32" />

            <Link to="/login" className="absolute top-12 left-12 flex items-center gap-4 text-xs font-bold text-cream/50 hover:text-indigo-action transition-all uppercase tracking-[0.2em] group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                COMMAND CENTER
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-cream p-1 rounded-geometric shadow-tactile">
                    <div className="border border-forest/10 p-8 md:p-12">
                        <div className="flex flex-col items-start mb-12">
                            <div className="w-12 h-12 bg-forest flex items-center justify-center text-cream mb-8">
                                <Key className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-forest uppercase tracking-tighter mb-2">
                                RECUPERATION <span className="text-indigo-action">ACCÈS</span>
                            </h1>
                            <p className="text-[10px] text-slate-neutral font-bold uppercase tracking-widest">
                                Procédure de réinitialisation
                            </p>
                        </div>

                        {!isSent ? (
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-3 group">
                                        <label className="text-[9px] font-bold text-forest/50 uppercase tracking-[0.3em]">Email Réseau</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                required
                                                placeholder="USER@COOPLABEL.COM"
                                                className="w-full bg-transparent border-b-2 border-forest/10 py-3 text-forest focus:outline-none focus:border-indigo-action transition-all font-bold placeholder:text-forest/10"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 group-focus-within:text-indigo-action transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full action-brick-primary h-14"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Rechercher l'accès <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6">
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                    Si votre compte existe, un code de réinitialisation a été généré dans la console (Simulation).
                                </div>
                                <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-action uppercase tracking-widest hover:text-indigo-action-hover transition-colors">
                                    Retourner à la connexion <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPasswordPage;
