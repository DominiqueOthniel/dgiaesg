import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Building2, MapPin, ShieldCheck, ArrowLeft, ExternalLink, Award, BarChart3, CalendarCheck2, Globe } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { useLabel } from "@/hooks/useLabel";
import { getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

function CompanyDetailPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading } = useCompany(id);
  const labelId = typeof company?.labelId === "string" ? company.labelId : (company?.labelId as any)?._id;
  const { data: label } = useLabel(labelId);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Société non trouvée</h2>
        <Link to="/directory" className="text-sm font-semibold text-primary hover:underline">← Retour à l'annuaire</Link>
      </div>
    );
  }

  const scores = [
    { label: "Score Global", value: company.score, icon: BarChart3 },
    { label: "Social", value: company.socialScore, icon: ShieldCheck },
    { label: "Gouvernance", value: company.governanceScore, icon: Award },
  ].filter((s) => s.value != null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <Link to="/directory" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l'annuaire
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-foreground rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-lg">
              {company.logoUrl ? (
                <img src={resolveImageUrl(company.logoUrl)} alt={getLocalized(company.name, lang)} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
              ) : (
                <Building2 className="w-10 h-10 text-primary" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent">
                  <ShieldCheck className="w-3.5 h-3.5" /> Certifié
                </span>
                <span className="text-xs text-primary-foreground/50">{getLocalized(company.status as any, lang)}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-primary-foreground tracking-tight mb-2">
                {getLocalized(company.name, lang)}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-primary-foreground/60">
                {getLocalized(company.region, lang) && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{getLocalized(company.region, lang)}</span>
                )}
                {getLocalized(company.sector, lang) && (
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{getLocalized(company.sector, lang)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Scores */}
            {scores.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {scores.map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center">
                    <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-foreground mb-4">À propos</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {getLocalized(company.description, lang) || "Aucune description disponible."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Détails</h3>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-muted-foreground text-xs">Certification</dt><dd className="font-semibold text-foreground">{new Date(company.certificationDate).toLocaleDateString("fr-FR")}</dd></div>
                <div><dt className="text-muted-foreground text-xs">Expiration</dt><dd className="font-semibold text-foreground">{new Date(company.expiryDate).toLocaleDateString("fr-FR")}</dd></div>
                {company.website && (
                  <div>
                    <dt className="text-muted-foreground text-xs">Site web</dt>
                    <dd><a href={company.website} target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">{company.website} <ExternalLink className="w-3 h-3" /></a></dd>
                  </div>
                )}
              </dl>
            </div>

            {label && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">Label associé</h3>
                <Link to={`/labels/${labelId}`} className="group flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <Award className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{getLocalized(label.name, lang)}</h4>
                    <span className="text-xs text-muted-foreground">{label.sector}</span>
                  </div>
                </Link>
              </div>
            )}

            <Link to="/directory" className="flex items-center justify-center w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95">
              Voir tout l'annuaire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
