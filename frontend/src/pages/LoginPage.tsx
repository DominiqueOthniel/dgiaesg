import { motion } from "framer-motion";
import { useState } from "react";
import {
    ShieldCheck,
    Mail,
    Lock,
    ArrowRight,
    AlertCircle,
    Loader2,
    ChevronLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast, Toaster } from "react-hot-toast";

function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            login(response.data.token);
            toast.success("ACCÈS AUTORISÉ — REDIRECTION EN COURS");
            setTimeout(() => navigate("/admin"), 1000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "AUTHENTIFICATION ÉCHOUÉE");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-forest flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Toaster position="top-right" />

            {/* Geometric Accents */}
            <div className="absolute top-0 right-0 w-px h-full bg-cream/10 -translate-x-32" />
            <div className="absolute top-0 right-0 w-px h-full bg-cream/10 -translate-x-40" />

            <Link to="/" className="absolute top-12 left-12 flex items-center gap-4 text-xs font-bold text-cream/50 hover:text-indigo-action transition-all uppercase tracking-[0.2em] group">
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
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-forest uppercase tracking-tighter mb-2">
                                Authentification <span className="text-indigo-action">Système</span>
                            </h1>
                            <p className="text-[10px] text-slate-neutral font-bold uppercase tracking-widest">
                                Monitoring Central & Certifications
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-10">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-3 group">
                                    <label className="text-[9px] font-bold text-forest/50 uppercase tracking-[0.3em]">Identifiant Réseau</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            placeholder="USER_ID@NETWORK"
                                            className="w-full bg-transparent border-b-2 border-forest/10 py-3 text-forest focus:outline-none focus:border-indigo-action transition-all font-bold placeholder:text-forest/10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 group-focus-within:text-indigo-action transition-colors" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 group">
                                    <label className="text-[9px] font-bold text-forest/50 uppercase tracking-[0.3em]">Code d'Accès</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-b-2 border-forest/10 py-3 text-forest focus:outline-none focus:border-indigo-action transition-all font-bold placeholder:text-forest/10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20 group-focus-within:text-indigo-action transition-colors" />
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
                                        Initialiser la Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <div className="pt-8 flex flex-col gap-4 text-start">
                                <div className="flex items-center gap-3 text-[9px] font-bold text-forest/30 uppercase tracking-widest">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Accès restreint — Protocole Niveau 3
                                </div>
                                <Link to="/" className="text-[10px] font-bold text-indigo-action hover:text-indigo-action-hover transition-colors">
                                    RÉCUPÉRER L'IDENTIFIANT
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center opacity-30 px-2">
                    <p className="text-[9px] font-bold text-cream uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} — COOPLABEL_CORE
                    </p>
                    <div className="flex gap-4">
                        <div className="w-2 h-2 bg-cream rounded-full" />
                        <div className="w-2 h-2 bg-cream rounded-full" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPage;
