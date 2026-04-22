import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestions = ["Chat with me", "Besoin d'aide ?"];

export const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  const onEnter = () => {
    setHovered(true);
    setTipIdx((i) => (i + 1) % suggestions.length);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Popup chat */}
      <div
        className={cn(
          "absolute bottom-20 left-0 w-[300px] rounded-2xl bg-white border-2 border-brand-gold/40 shadow-2xl shadow-primary/30 overflow-hidden transition-all duration-300 origin-bottom-left",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none",
        )}
      >
        <div className="bg-gradient-to-br from-brand-deep via-primary to-brand-forest p-4 text-primary-foreground relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gold/30 rounded-full blur-2xl animate-aurora" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/25 border border-brand-gold/50 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <p className="text-sm font-black italic">Co-op Assistant</p>
              <p className="text-[10px] uppercase tracking-widest text-primary-foreground/70">En ligne</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="ml-auto w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-surface-warm">
          <div className="rounded-xl bg-white border border-brand-gold/20 p-3 text-xs text-brand-dark font-medium leading-relaxed shadow-sm">
            👋 Bonjour ! Comment pouvons-nous vous aider à certifier votre structure aujourd'hui ?
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mt-3 flex gap-2"
          >
            <input
              type="text"
              placeholder="Écrire un message…"
              className="flex-1 px-3 py-2 rounded-lg bg-white border border-brand-gold/30 text-xs text-brand-dark placeholder:text-brand-dark/40 outline-none focus:ring-2 focus:ring-brand-gold/50 font-medium"
            />
            <button
              type="submit"
              aria-label="Envoyer"
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-emerald to-primary text-primary-foreground flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Hover tooltip */}
      <div
        className={cn(
          "absolute bottom-1/2 translate-y-1/2 left-16 whitespace-nowrap px-3 py-1.5 rounded-full bg-brand-dark text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg transition-all duration-200",
          hovered && !open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none",
        )}
      >
        {suggestions[tipIdx]}
      </div>

      {/* Trigger button — animated head */}
      <button
        type="button"
        aria-label="Ouvrir le chat"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={onEnter}
        onMouseLeave={() => setHovered(false)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold via-brand-gold-dark to-brand-emerald text-brand-dark shadow-2xl shadow-brand-gold/50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-pulse-glow"
      >
        <span className="absolute inset-0 rounded-full bg-brand-gold/50 blur-xl animate-aurora-slow" />
        <span className="relative flex flex-col items-center justify-center">
          <MessageCircle className="w-6 h-6 animate-float-y" strokeWidth={2.5} />
        </span>
      </button>
    </div>
  );
};
