import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Award, Search, ShieldCheck, ChevronRight, Globe, Filter } from "lucide-react";
import { useLabels } from "@/hooks/useLabels";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

const sectors = [
  { value: "Tous", label: "Tous les secteurs" },
  { value: "finance", label: "Finance" },
  { value: "tech", label: "Technologie" },
  { value: "energy", label: "Énergie" },
  { value: "governance", label: "Gouvernance" },
  { value: "leadership", label: "Leadership" },
];

function LabelsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: labels, isLoading } = useLabels();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSector, setActiveSector] = useState("Tous");

  const filteredLabels = labels?.filter((label) => {
    const name = getLocalized(label?.name, lang).toLowerCase();
    const desc = getLocalized(label?.description, lang).toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchesSector = activeSector === "Tous" || label.sector === activeSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">
                Portails de Certification
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Labels & Certifications
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              Découvrez les standards d'excellence qui structurent l'économie africaine certifiée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un label..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {sectors.map((s) => (
              <button
                key={s.value}
                onClick={() => setActiveSector(s.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  activeSector === s.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredLabels && filteredLabels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabels.map((label, idx) => (
              <motion.div
                key={label._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/labels/${label._id}`}
                  className="group block bg-card border border-border rounded-xl p-6 hover-lift h-full flex flex-col relative"
                >
                  <div className="absolute top-0 right-4 w-8 h-9 bg-primary/5 rounded-b-lg flex items-center justify-center border-x border-b border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 shrink-0 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden p-2 group-hover:border-primary/30 transition-colors">
                      {label.logoUrl ? (
                        <img
                          src={resolveImageUrl(getLocalized(label.logoUrl as any, lang))}
                          alt={getLocalized(label.name, lang)}
                          className="w-full h-full object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }}
                        />
                      ) : (
                        <Award className="w-6 h-6 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-1 pr-6">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {getLocalized(label.name, lang)}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                        <span className="text-xs font-medium text-brand-emerald">Vérifié</span>
                        {label.sector && <span className="text-xs text-muted-foreground ml-1">· {label.sector}</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
                    {getLocalized(label.description, lang) || "Protocole de conformité certifié pour l'excellence institutionnelle."}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all mt-auto">
                    Explorer le label <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Globe className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun label trouvé pour cette recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LabelsPage;
