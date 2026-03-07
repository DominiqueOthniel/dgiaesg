import { motion } from "framer-motion";
import { useState } from "react";
import {
    Lock,
    ArrowRight,
    Loader2,
    ChevronLeft,
    ShieldCheck,
    Mail
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import api from "../services/api";
import { toast } from "react-hot-toast";

function ResetPasswordPage() {
    const { token } = useParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("LES MOTS DE PASSE NE CORRESPONDENT PAS");
            return;
        }

        setIsLoading(true);

        try {
            await api.post(`/auth/reset-password/${token}`, { email, password });
            toast.success("MOT DE PASSE RÉINITIALISÉ");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "LIEN INVALIDE OU EXPIRE");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-forest flex flex-col items-center justify-center p-6 relative overflow-hidden">

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
                        <div className="flex flex-col items-start mb-10">
                            <div className="w-12 h-12 bg-indigo-action flex items-center justify-center text-cream mb-8 shadow-lg shadow-indigo-action/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-forest uppercase tracking-tighter mb-2">
                                REINITIALISER <span className="text-indigo-action">ACCÈS</span>
                            </h1>
                            <p className="text-[10px] text-slate-neutral font-bold uppercase tracking-widest">
                                Définir un nouveau code maître
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-bold text-forest/50 uppercase tracking-[0.3em]">Email Associé</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            placeholder="USER@COOPLABEL.COM"
                                            className="w-full bg-transparent border-b-2 border-forest/10 py-2 text-forest focus:outline-none focus:border-indigo-action transition-all font-bold placeholder:text-forest/10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 group-focus-within:text-indigo-action transition-colors" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-bold text-forest/50 uppercase tracking-[0.3em]">Nouveau Code</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-b-2 border-forest/10 py-2 text-forest focus:outline-none focus:border-indigo-action transition-all font-bold placeholder:text-forest/10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 group-focus-within:text-indigo-action transition-colors" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 group">
                                    <label className="text-[9px] font-bold text-forest/50 uppercase tracking-[0.3em]">Confirmation</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-b-2 border-forest/10 py-2 text-forest focus:outline-none focus:border-indigo-action transition-all font-bold placeholder:text-forest/10"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 group-focus-within:text-indigo-action transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full action-brick-primary h-14 mt-4"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Appliquer les changements <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default ResetPasswordPage;
