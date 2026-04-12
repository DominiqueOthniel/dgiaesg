import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Lock,
    Loader2,
    Shield,
    AtSign,
    Save,
    Palette,
    Check
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { resolveImageUrl } from "../lib/image";

interface ThemeOption {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    preview: string[];
}

const themes: ThemeOption[] = [
    {
        id: "default",
        name: "Coop Red (Default)",
        primary: "#E30613",
        secondary: "#000000",
        accent: "#E30613",
        surface: "#F8F6F3",
        preview: ["#E30613", "#000000", "#F8F6F3"]
    },
    {
        id: "forest",
        name: "Forest Prestige",
        primary: "#1B4332",
        secondary: "#0D1B2A",
        accent: "#D4A843",
        surface: "#F8F6F3",
        preview: ["#1B4332", "#0D1B2A", "#D4A843"]
    },
    {
        id: "ocean",
        name: "Océan Profond",
        primary: "#1E3A5F",
        secondary: "#0A1628",
        accent: "#C9A96E",
        surface: "#F5F7FA",
        preview: ["#1E3A5F", "#0A1628", "#C9A96E"]
    },
    {
        id: "bordeaux",
        name: "Bordeaux Royal",
        primary: "#7A1F3D",
        secondary: "#1A1A2E",
        accent: "#E8B75D",
        surface: "#FBF8F4",
        preview: ["#7A1F3D", "#1A1A2E", "#E8B75D"]
    },
    {
        id: "charcoal",
        name: "Charbon Élégant",
        primary: "#2D2D2D",
        secondary: "#111111",
        accent: "#B8860B",
        surface: "#FAFAFA",
        preview: ["#2D2D2D", "#111111", "#B8860B"]
    },
    {
        id: "emerald",
        name: "Émeraude Classique",
        primary: "#006B3C",
        secondary: "#003320",
        accent: "#FFD700",
        surface: "#F0FAF5",
        preview: ["#006B3C", "#003320", "#FFD700"]
    }
];


function ProfilePage() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [activeTheme, setActiveTheme] = useState(() => {
        return localStorage.getItem('dgia-esg-theme-id') || "default";
    });

    const applyTheme = (theme: ThemeOption) => {
        const root = document.documentElement;
        root.style.setProperty('--color-brand-primary', theme.primary);
        root.style.setProperty('--color-brand-secondary', theme.secondary);
        root.style.setProperty('--color-brand-accent', theme.accent);
        root.style.setProperty('--color-surface-base', theme.surface);
        setActiveTheme(theme.id);
        localStorage.setItem('dgia-esg-theme-id', theme.id);
        localStorage.setItem('dgia-esg-theme-data', JSON.stringify(theme));
        toast.success(t('theme.apply_success', "THÈME APPLIQUÉ"));
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setUsername(user.username);
            setEmail(user.email);
            setAvatar(user.avatar || "");
        }
    }, [user]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        try {
            const response = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setAvatar(response.data.data);
            toast.success("AVATAR TÉLÉCHARGÉ");
        } catch (error: any) {
            toast.error("ERREUR DE TÉLÉCHARGEMENT");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error("LES MOTS DE PASSE NE CORRESPONDENT PAS");
            return;
        }

        setIsLoading(true);

        try {
            const updateData: any = { name, username, email, avatar };
            if (password) updateData.password = password;

            const response = await api.put("/auth/me", updateData);
            updateUser(response.data.data);
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
                            <div className="relative group mb-8">
                                <div className="w-24 h-24 bg-brand-primary rounded-3xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 overflow-hidden mx-auto">
                                    {avatar ? (
                                        <img src={resolveImageUrl(avatar)} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10" />
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-tactile border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all text-brand-primary">
                                    <AtSign className="w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                </label>
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-slate-900 mb-1">{user?.name}</h1>
                                <p className="text-sm text-slate-400 font-medium mb-8">@{user?.username}</p>
                            </div>

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

                                {/* Theme Selection Section */}
                                <div className="pt-8 border-t border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-brand-primary" /> {t('theme.subtitle')}
                                    </h3>
                                    <p className="text-xs text-slate-500 mb-6 italic">{t('theme.appearance_desc')}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                type="button"
                                                onClick={() => applyTheme(theme)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-4 transition-all text-left border rounded-2xl group",
                                                    activeTheme === theme.id
                                                        ? "bg-slate-50 border-brand-primary"
                                                        : "bg-white border-slate-100 hover:border-brand-primary/30"
                                                )}
                                            >
                                                <div className="flex gap-1 shrink-0">
                                                    {theme.preview.map((color, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-widest",
                                                    activeTheme === theme.id ? "text-brand-primary" : "text-slate-600 group-hover:text-brand-primary"
                                                )}>
                                                    {t(`theme.themes.${theme.id}`)}
                                                </span>
                                                {activeTheme === theme.id && <Check className="w-3 h-3 text-brand-primary ml-auto" />}
                                            </button>
                                        ))}
                                    </div>
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

