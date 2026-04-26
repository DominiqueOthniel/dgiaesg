import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Logic: Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Logic: Toggle button visibility on scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Retour en haut"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full",
        "bg-gradient-to-br from-[hsl(var(--brand-emerald))] to-primary text-primary-foreground",
        "shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] border border-white/20",
        "flex items-center justify-center transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] active:scale-90",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"
      )}
    >
      <ArrowUp className="w-6 h-6" />
      {/* Golden ring effect */}
      <div className="absolute -inset-1 rounded-full border border-[hsl(var(--brand-gold)/0.4)] animate-pulse" />
    </button>
  );
};
