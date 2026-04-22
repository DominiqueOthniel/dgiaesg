import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Retour en haut"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full",
        "bg-gradient-to-br from-brand-emerald to-primary text-primary-foreground",
        "shadow-xl shadow-primary/40 border border-brand-gold/40",
        "flex items-center justify-center transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/40 active:scale-90",
        "animate-pulse-glow",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
