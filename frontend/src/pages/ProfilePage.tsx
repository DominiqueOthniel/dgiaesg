import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Lock,
    Loader2,
    Shield,
    AtSign,
    Save
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-hot-toast";

function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error("LES MOTS DE PASSE NE CORRESPONDENT PAS");
            return;
        }

        setIsLoading(true);

        try {
            const updateData: any = { name, username, email };
            if (password) updateData.password = password;

            await api.put("/auth/me", updateData);
            toast.success("PROFIL MIS À JOUR AVEC SUCCÈS");
            setPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "ERREUR LORS DE LA MISE À JOUR");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm sticky top-32">
                            <div className="w-20 h-20 bg-brand-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-primary/20">
                                <User className="w-10 h-10" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">{user?.name}</h1>
                            <p className="text-sm text-slate-400 font-medium mb-8">@{user?.username}</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <Shield className="w-5 h-5 text-brand-primary" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle Système</p>
                                        <p className="text-xs font-bold text-brand-secondary uppercase">{user?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-2/3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl"
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Paramètres du <span className="text-brand-primary">Profil</span></h2>
                            <p className="text-slate-500 mb-12">Gérez vos informations personnelles et sécurisez votre compte.</p>

                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                            />
                                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-brand-primary" /> Changer le mot de passe
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="Nouveau mot de passe"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                />
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="Confirmer"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                />
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Laissez vide pour conserver l'actuel.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-16 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-3 group"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Mettre à jour le profil <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
