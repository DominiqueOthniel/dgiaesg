import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Award, ArrowLeft, ShieldCheck, ChevronRight, Building2, BarChart3, Target } from "lucide-react";
import { useLabel } from "@/hooks/useLabel";
import { useLabels } from "@/hooks/useLabels";
import { useCriteria } from "@/hooks/useCriteria";
import { useCompanies } from "@/hooks/useCompanies";
import { getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

function LabelDetailPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { id } = useParams<{ id: string }>();
  const { data: label, isLoading } = useLabel(id);
  const { data: labels } = useLabels();
  const { data: criteria } = useCriteria(id);
  const { data: companiesData } = useCompanies({});

  const companies = (companiesData?.data || []).filter((c: any) => {
    const lid = typeof c.labelId === "string" ? c.labelId : c.labelId?._id;
    return lid === id;
  });

  const relatedLabels = labels?.filter((l) => l._id !== id).slice(0, 3);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!label) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Label introuvable</h2>
        <Link to="/labels" className="text-sm font-semibold text-primary hover:underline">← Retour aux labels</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <Link to="/labels" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour aux labels
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-foreground rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-lg">
              {label.logoUrl ? (
                <img src={resolveImageUrl(getLocalized(label.logoUrl as any, lang))} alt={getLocalized(label.name, lang)} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
              ) : (
                <Award className="w-10 h-10 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent">Certifié · {label.sector}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-primary-foreground tracking-tight">
                {getLocalized(label.name, lang)}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Description
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {getLocalized(label.description, lang) || "Aucune description disponible."}
              </p>
            </div>

            {/* Criteria */}
            {criteria && criteria.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Critères d'évaluation
                </h2>
                <div className="space-y-4">
                  {criteria.map((c: any) => (
                    <div key={c._id} className="p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground">{getLocalized(c.name, lang)}</h4>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{c.weight}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{getLocalized(c.description, lang)}</p>
                      <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${c.weight}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certified Companies */}
            {companies.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> Entreprises certifiées ({companies.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {companies.slice(0, 6).map((company: any) => (
                    <Link key={company._id} to={`/directory/${company._id}`} className="group flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center p-1 shrink-0">
                        {company.logoUrl ? (
                          <img src={resolveImageUrl(company.logoUrl)} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
                        ) : (
                          <Building2 className="w-4 h-4 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{getLocalized(company.name, lang)}</h4>
                        <span className="text-xs text-muted-foreground">{getLocalized(company.sector, lang)}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Informations</h3>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-muted-foreground text-xs">Secteur</dt><dd className="font-semibold text-foreground">{label.sector || "—"}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Statut</dt><dd className="font-semibold text-foreground capitalize">{label.status}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Entreprises certifiées</dt><dd className="font-semibold text-foreground">{companies.length}</dd></div>
              </dl>
            </div>

            {relatedLabels && relatedLabels.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">Autres labels</h3>
                <div className="space-y-3">
                  {relatedLabels.map((l) => (
                    <Link key={l._id} to={`/labels/${l._id}`} className="group flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <Award className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{getLocalized(l.name, lang)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link to="/labels" className="flex items-center justify-center w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95">
              Voir tous les labels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabelDetailPage;
