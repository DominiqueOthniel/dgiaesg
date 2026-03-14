import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

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

interface ThemeOption {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    preview: string[];
}

interface ThemePickerProps {
    forcedOpen?: boolean;
    onClose?: () => void;
}

const ThemePicker = ({ forcedOpen, onClose }: ThemePickerProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTheme, setActiveTheme] = useState(() => {
        return localStorage.getItem('cooplabel-theme-id') || "default";
    });

    useEffect(() => {
        if (forcedOpen !== undefined) {
            setIsOpen(forcedOpen);
        }
    }, [forcedOpen]);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const applyTheme = (theme: ThemeOption) => {
        const root = document.documentElement;
        root.style.setProperty('--color-brand-primary', theme.primary);
        root.style.setProperty('--color-brand-secondary', theme.secondary);
        root.style.setProperty('--color-brand-accent', theme.accent);
        root.style.setProperty('--color-surface-base', theme.surface);
        setActiveTheme(theme.id);
        localStorage.setItem('cooplabel-theme-id', theme.id);
        localStorage.setItem('cooplabel-theme-data', JSON.stringify(theme));
        handleClose();
    };

    useEffect(() => {
        const savedData = localStorage.getItem('cooplabel-theme-data');
        if (savedData) {
            try {
                const theme = JSON.parse(savedData) as ThemeOption;
                const root = document.documentElement;
                root.style.setProperty('--color-brand-primary', theme.primary);
                root.style.setProperty('--color-brand-secondary', theme.secondary);
                root.style.setProperty('--color-brand-accent', theme.accent);
                root.style.setProperty('--color-surface-base', theme.surface);
                setActiveTheme(theme.id);
            } catch (e) {
                // ignore
            }
        }
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                    />
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[210] p-8 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-10 pb-4 border-b border-surface-muted">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">{t('theme.title')}</h3>
                                <p className="text-xl font-serif font-black text-brand-secondary">{t('theme.subtitle')}</p>
                            </div>
                            <button onClick={handleClose} className="p-2 hover:bg-surface-base rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {themes.map((theme) => (
                                <button
                                    key={theme.name}
                                    onClick={() => applyTheme(theme)}
                                    className={cn(
                                        "w-full group flex items-center gap-4 px-4 py-5 transition-all text-left border-l-4",
                                        activeTheme === theme.id
                                            ? "bg-surface-base border-brand-primary shadow-sm"
                                            : "hover:bg-surface-base border-transparent"
                                    )}
                                >
                                    <div className="flex -space-x-1 shrink-0">
                                        {theme.preview.map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                                            activeTheme === theme.id ? "text-brand-primary" : "text-brand-secondary"
                                        )}>
                                            {t(`theme.themes.${theme.id}`)}
                                        </p>
                                    </div>
                                    {activeTheme === theme.id && (
                                        <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-surface-base rounded-sm border border-surface-muted">
                            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                {t('theme.save_desc')}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ThemePicker;
