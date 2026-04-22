import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Bell, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import api from '../services/api';

export const NewsletterPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const sectors = [
        { id: 'finance', label: 'Finance' },
        { id: 'governance', label: 'Gouv.' },
        { id: 'tech', label: 'Tech' },
        { id: 'energy', label: 'Énergie' },
        { id: 'leadership', label: 'Leaders.' }
    ];

    useEffect(() => {
        const hasSubscribed = localStorage.getItem('newsletter_subscribed');
        const hasDismissed = localStorage.getItem('newsletter_dismissed');

        if (!hasSubscribed && !hasDismissed) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsVisible(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('newsletter_dismissed', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await api.post('/newsletter/subscribe', {
                email,
                interests: selectedInterests
            });
            setStatus('success');
            setMessage('Merci ! Vous êtes maintenant inscrit à notre newsletter.');
            localStorage.setItem('newsletter_subscribed', 'true');
            setTimeout(() => setIsVisible(false), 3000);
        } catch (error) {
            setStatus('error');
            setMessage('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="fixed bottom-6 right-6 z-[60] w-[calc(100%-3rem)] max-w-[340px]"
                >
                    <div className="bg-brand-secondary p-10 shadow-3xl border border-white/5 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl -mr-16 -mt-16" />

                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative">
                            <div className="w-12 h-12 bg-brand-primary flex items-center justify-center mb-8 border border-white/10">
                                <Bell className="text-white w-5 h-5 animate-bounce" />
                            </div>

                            <h3 className="text-xl font-serif italic font-bold text-white mb-4 uppercase tracking-tight">Restez à l'avant-garde</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-10">
                                Analyses exclusives sur l'ESG et la durabilité en Afrique. L'autorité éditoriale pour la transition durable.
                            </p>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center py-6 text-center"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-brand-primary mb-6" />
                                    <p className="text-brand-primary font-bold text-xs uppercase tracking-widest leading-relaxed">
                                        {message}
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="votre@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-white text-xs outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all font-medium"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Secteurs d'intérêt :</p>
                                        <div className="flex flex-wrap gap-2">
                                            {sectors.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => toggleInterest(s.id)}
                                                    className={cn(
                                                        "px-3 py-2 text-[8px] font-black uppercase tracking-widest transition-all border",
                                                        selectedInterests.includes(s.id)
                                                            ? "bg-brand-primary text-white border-brand-primary"
                                                            : "bg-white/5 text-slate-400 border-white/10 hover:border-brand-primary/30"
                                                    )}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full h-14 bg-brand-primary hover:bg-white hover:text-brand-secondary transition-all font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 group border-none shadow-lg shadow-brand-primary/10"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                S'abonner maintenant
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                    {status === 'error' && (
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
                                            {message}
                                        </p>
                                    )}
                                </form>
                            )}

                            <p className="mt-8 text-[9px] text-slate-500 text-center font-bold uppercase tracking-[0.3em]">
                                🔒 ZÉRO SPAM. JUSTE L'EXCELLENCE.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
