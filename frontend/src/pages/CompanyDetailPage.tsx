import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Building2, MapPin, ShieldCheck, ArrowLeft, ExternalLink, 
  Award, BarChart3, Globe, Download, Share2, Briefcase 
} from "lucide-react";
import { useCompany } from "@/hooks/useCompanies";
import { useLabel } from "@/hooks/useLabels";
import { getLocalized, cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import DigitalBadge from "@/components/badges/DigitalBadge";
import { Button } from "@/components/ui/Button";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

function CompanyDetailPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const { id } = useParams<{ id: string }>();
  
  const { data: company, isLoading: companyLoading } = useCompany(id);
  const labelId = typeof company?.labelId === "string" ? company.labelId : (company?.labelId as any)?._id;
  const { data: label } = useLabel(labelId);

  if (companyLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Building2 className="w-12 h-12 text-muted-foreground/20" />
        <h2 className="text-xl font-bold text-foreground">Société non trouvée</h2>
        <Link to="/directory" className="text-sm font-semibold text-primary hover:underline">← Retour à l'annuaire</Link>
      </div>
    );
  }

  const scores = [
    { label: "Score Global", value: company.score, icon: BarChart3, color: "text-primary" },
    { label: "Social", value: company.socialScore, icon: ShieldCheck, color: "text-brand-emerald" },
    { label: "Gouvernance", value: company.governanceScore, icon: Award, color: "text-accent" },
  ].filter((s) => s.value != null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <Link to="/directory" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l'annuaire
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] flex items-center justify-center p-5 shrink-0 shadow-2xl relative">
              {company.logoUrl ? (
                <img src={resolveImageUrl(company.logoUrl)} alt={getLocalized(company.name, lang)} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = IMAGE_FALLBACK; }} />
              ) : (
                <Building2 className="w-12 h-12 text-muted-foreground/20" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                  getLocalized(company.status as any, lang) === "certified" 
                    ? "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                  <ShieldCheck className="w-3.5 h-3.5" /> {getLocalized(company.status as any, lang) === "certified" ? "Certifié" : "Inactif"}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary-foreground/40 uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-accent" /> {getLocalized(company.region, lang)}
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-tight">
                {getLocalized(company.name, lang)}
              </h1>
              <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>{getLocalized(company.sector, lang)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <Button className="flex-1 md:flex-none rounded-full px-8 shadow-xl shadow-black/20" onClick={() => window.open(company.website, '_blank')}>
                 Visiter le Site <ExternalLink className="w-4 h-4 ml-2" />
               </Button>
               <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-white/20 text-white hover:bg-white/10">
                 <Share2 className="w-5 h-5" />
               </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {scores.map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-6 text-center group hover:border-primary/30 transition-all">
                  <s.icon className={cn("w-5 h-5 mx-auto mb-3", s.color)} />
                  <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{s.value}%</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-2">{s.label}</div>
                  <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} className={cn("h-full rounded-full bg-current", s.color)} />
                  </div>
                </div>
              ))}
            </div>

            {/* About Card */}
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" /> Synthèse de Profil
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium whitespace-pre-wrap">
                {getLocalized(company.description, lang) || "Aucune description institutionnelle n'a été fournie pour cette entité."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Digital Badge Section */}
            <DigitalBadge 
              companyId={company._id}
              companyName={getLocalized(company.name, lang)}
              status={getLocalized(company.status as any, lang)}
            />

            {/* Detailed Info Card */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 border-b border-border pb-4">Détails de Certification</h3>
              <dl className="space-y-6">
                <div>
                  <dt className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Date d'Émission</dt>
                  <dd className="font-bold text-foreground text-sm">{company.certificationDate ? new Date(company.certificationDate).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }) : "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Validité du Badge</dt>
                  <dd className="font-bold text-foreground text-sm">{company.expiryDate ? new Date(company.expiryDate).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }) : "Indéterminée"}</dd>
                </div>
                {company.website && (
                  <div>
                    <dt className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Portail Officiel</dt>
                    <dd className="truncate">
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-primary font-bold text-sm hover:underline inline-flex items-center gap-1.5">
                        Consulter <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
              <Button variant="outline" className="w-full mt-8 rounded-xl h-12 text-xs font-bold uppercase tracking-widest gap-2 bg-muted/30 border-none hover:bg-mutedTransition flex items-center justify-center">
                <Download className="w-4 h-4" /> Rapports d'Impact
              </Button>
            </div>

            {/* Related Label Card */}
            {label && (
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">Label de Référence</h3>
                <Link to={`/labels/${labelId}`} className="group block space-y-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Award className="w-7 h-7 text-accent group-hover:text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold group-hover:text-accent transition-colors leading-tight">{getLocalized(label.name, lang)}</h4>
                    <p className="text-xs opacity-50 font-bold uppercase tracking-widest mt-1">{label.sector}</p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent group-hover:gap-4 transition-all">
                    Explorer le Referentiel <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
