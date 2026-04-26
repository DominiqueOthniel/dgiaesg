import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { PILLARS } from "@/lib/pillars";
import { cn } from "@/lib/utils";
import { useWaveReveal } from "@/hooks/useWaveReveal";

export default function ThematiquesPortal() {
  // Cards per row at the lg breakpoint of the grid (lg:grid-cols-3).
  // We compute the wave delay per card so each row reveals together,
  // and within a row each card has a small staggered delay.
  const COLS = 3;
  const ROW_DELAY = 180; // ms between rows
  const COL_DELAY = 90;  // ms between cards within a row
  const gridRef = useWaveReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen news-bg text-foreground">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Actualités
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-white/80 block mb-1">
            Portail thématique
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4 mt-2">
            <span className="h1-golden-glow">
              Six piliers éditoriaux pour comprendre la durabilité africaine.
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Chaque pilier rassemble nos enquêtes, analyses et brèves autour
            d'un enjeu structurant pour les 54 pays du continent.
          </p>
        </div>
      </section>

      {/* Pillars grid — wave reveal, elevated golden cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          ref={gridRef}
          className="grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const delay = row * ROW_DELAY + col * COL_DELAY;
            return (
              <Link
                key={p.slug}
                to={`/thematiques/${p.slug}`}
                style={{ ["--wave-delay" as string]: `${delay}ms` }}
                className="wave-item card-gold-elevated group block rounded-2xl overflow-hidden h-full flex flex-col"
              >
                {/* Golden corners for elevation effect */}
                <div className="corner corner-tl" />
                <div className="corner corner-tr" />
                <div className="corner corner-bl" />
                <div className="corner corner-br" />

                {/* Color band */}
                <div
                  className={cn(
                    "relative h-32 overflow-hidden",
                    p.color.bg,
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25),transparent_70%)]" />
                  <div className="relative h-full flex items-end p-5">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30">
                      <Icon className="w-6 h-6 text-white" />
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.18em] mb-2",
                      p.color.text,
                    )}
                  >
                    {p.label}
                  </span>
                  <h2 className="text-lg font-extrabold text-foreground group-hover:text-[hsl(var(--brand-emerald))] transition-colors line-clamp-2 mb-2 leading-snug">
                    {p.h1}
                  </h2>
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-5 leading-relaxed flex-1">
                    {p.tagline} {p.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {p.subCategories.length - 1} sous-catégories
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:text-[hsl(var(--brand-emerald))] group-hover:translate-x-1.5 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
