import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, Building2, MapPin, ChevronRight, LayoutGrid, List, Award, Filter } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { useLabels } from "@/hooks/useLabels";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

function DirectoryPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: companiesData, isLoading } = useCompanies({});
  const { data: labels } = useLabels();
  const companies = companiesData?.data || [];

  const filtered = companies.filter((c) =>
    getLocalized(c.name, lang).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Annuaire Institutionnel</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
              Registre Central des Sociétés
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-xl">
              Explorez l'annuaire complet des entreprises certifiées à travers l'Afrique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setView("grid")} className={cn("p-2 rounded-lg", view === "grid" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={cn("p-2 rounded-lg", view === "list" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((company, idx) => (
                <motion.div key={company._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                  <Link to={`/directory/${company._id}`} className="group block bg-card border border-border rounded-xl p-6 hover-lift">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 shrink-0 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden p-2 group-hover:border-primary/30 transition-colors">
                        {company.logoUrl ? (
                          <img src={resolveImageUrl(company.logoUrl)} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
                        ) : (
                          <Building2 className="w-6 h-6 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {getLocalized(company.name, lang)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{getLocalized(company.region, lang) || "Afrique"}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {getLocalized(company.description, lang)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-emerald">
                        <Award className="w-3 h-3" /> {getLocalized(company.sector, lang) || "Certifié"}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((company) => (
                <Link key={company._id} to={`/directory/${company._id}`} className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover-lift">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden p-1.5">
                    {company.logoUrl ? (
                      <img src={resolveImageUrl(company.logoUrl)} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
                    ) : (
                      <Building2 className="w-5 h-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{getLocalized(company.name, lang)}</h3>
                    <span className="text-xs text-muted-foreground">{getLocalized(company.sector, lang)} · {getLocalized(company.region, lang)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune entreprise trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DirectoryPage;
