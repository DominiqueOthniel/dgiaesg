import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Award, ArrowLeft, ShieldCheck, ChevronRight, Bookmark, 
  BarChart3, Scale, Zap, Info, Target, Users, CheckCircle2 
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useLabel, useLabels } from "@/hooks/useLabels";
import { useCriteria } from "@/hooks/useCriteria";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { cn, getLocalized } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

function LabelDetailPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const { id } = useParams<{ id: string }>();
  
  const { data: label, isLoading: labelLoading } = useLabel(id);
  const { data: labelsData, isLoading: labelsLoading } = useLabels();
  const { data: criteria, isLoading: criteriaLoading } = useCriteria(id);
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ labelId: id, limit: 6 });
  const { user, isAuthenticated, updateSavedLabels } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (user && label) {
      setIsSaved((user.savedLabels || []).includes(label._id));
    }
  }, [user, label]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour sauvegarder ce protocole.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post('/users/save-label', { labelId: label?._id });
      if (response.data.success) {
        updateSavedLabels(response.data.data);
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Retiré de votre bibliothèque" : "Ajouté à votre bibliothèque");
      }
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSaving(false);
    }
  };

  const companies = companiesData?.data || [];
  const relatedLabels = useMemo(() => {
    if (!labelsData || !label) return [];
    const sameSector = labelsData.filter((item) => item._id !== label._id && item.sector === label.sector);
    const fallback = labelsData.filter((item) => item._id !== label._id);
    const source = sameSector.length ? sameSector : fallback;
    return [...source].slice(0, 3);
  }, [labelsData, label]);

  if (labelLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!label) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Award className="w-12 h-12 text-muted-foreground/20" />
        <h2 className="text-xl font-bold text-foreground">Protocole non trouvé</h2>
        <Link to="/labels" className="text-sm font-semibold text-primary hover:underline">← Retour à l'index</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <Link to="/labels" className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à l'index
            </Link>
            <button
              onClick={handleToggleSave}
              disabled={isSaving}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                isSaved ? "bg-accent border-accent text-accent-foreground" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              )}
            >
              <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 text-primary-foreground/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {getLocalized(label.sector, lang)}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Standard de Conformité
                </div>
              </div>
              <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-6 leading-tight">
                {getLocalized(label.name, lang)}
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/75 leading-relaxed max-w-3xl line-clamp-6">
                {getLocalized(label.description, lang)}
              </p>
            </div>
            <div className="w-full lg:w-72 shrink-0">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center justify-center shadow-2xl relative min-h-[200px]">
                {label.logoUrl && !logoError ? (
                  <img
                    src={resolveImageUrl(label.logoUrl)}
                    alt={getLocalized(label.name, lang)}
                    className="w-full max-w-[180px] h-auto object-contain relative z-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                      setLogoError(true);
                    }}
                  />
                ) : (
                  <Award className="w-32 h-32 text-white/5" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Critères d'Excellence</h2>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Référentiel de Validation</p>
                </div>
              </div>

              <div className="grid gap-6">
                {criteriaLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)
                ) : !criteria || criteria.length === 0 ? (
                  <div className="py-12 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                    <Info className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm font-medium">Aucun critère configuré pour ce protocole.</p>
                  </div>
                ) : (
                  criteria.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                              {item.category || "Critère"}
                            </span>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {getLocalized(item.title as any, lang)}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {getLocalized(item.description as any, lang)}
                          </p>
                        </div>
                        <div className="bg-muted px-4 py-2 rounded-lg text-center min-w-[80px] group-hover:bg-primary/5 transition-colors">
                          <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Impact</span>
                          <span className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{item.weight}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Cluster Sidebar */}
            <div className="bg-primary rounded-2xl p-8 text-primary-foreground shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
               <div className="flex items-center gap-3 mb-6 relative z-10">
                 <Users className="w-5 h-5 text-accent" />
                 <h3 className="text-lg font-bold">Cluster Actif</h3>
               </div>
               <div className="space-y-3 relative z-10">
                 {companiesLoading ? (
                   Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)
                 ) : !companies || companies.length === 0 ? (
                   <p className="text-xs text-primary-foreground/50 border border-white/10 border-dashed rounded-xl p-4 text-center">Aucune entité certifiée</p>
                 ) : (
                   companies.map((company) => (
                     <Link key={company._id} to={`/directory/${company._id}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white hover:text-primary transition-all group">
                       <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs group-hover:bg-primary/10 transition-colors">
                         {getLocalized(company.name, lang).substring(0, 2).toUpperCase()}
                       </div>
                       <div className="min-w-0 flex-1">
                         <p className="text-sm font-bold truncate">{getLocalized(company.name, lang)}</p>
                         <p className="text-[10px] text-primary-foreground/50 uppercase tracking-widest">{getLocalized(company.sector, lang)}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                     </Link>
                   ))
                 )}
               </div>
               <Link to="/directory" className="block mt-6 pt-6 border-t border-white/10">
                 <button className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-lg">
                   Explorer le Registre
                 </button>
               </Link>
            </div>

            {/* Workflow Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
               <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-6">
                 <Zap className="w-4 h-4 text-accent fill-accent" /> Workflow de Validation
               </h4>
               <div className="space-y-6 relative">
                 {(label.validationWorkflow || [
                   { step: "Analyse documentaire", status: "complete" },
                   { step: "Inspection sur site", status: "active" },
                   { step: "Audit de conformité éthique", status: "pending" },
                   { step: "Certification finale", status: "pending" }
                 ]).map((step: any, idx: number) => (
                   <div key={idx} className="flex items-start gap-4 relative">
                     <div className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10">
                        {step.status === 'complete' ? (
                          <div className="w-full h-full rounded-full bg-brand-emerald border-brand-emerald flex items-center justify-center text-white"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                        ) : step.status === 'active' ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        )}
                     </div>
                     <div className="flex-1">
                       <p className={cn("text-xs font-bold uppercase tracking-widest", step.status === 'complete' ? "text-muted-foreground line-through" : step.status === 'active' ? "text-foreground" : "text-muted-foreground/50")}>
                         {step.step}
                       </p>
                     </div>
                     {idx < (label.validationWorkflow?.length || 4) - 1 && <div className="absolute left-[11px] top-6 w-[2px] h-6 bg-border" />}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Related Labels */}
        <div className="mt-20 pt-20 border-t border-border/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Labels Similaires</h2>
            <Link to="/labels" className="text-sm font-bold text-primary hover:underline">Voir tout</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedLabels.map((item) => (
              <Link key={item._id} to={`/labels/${item._id}`} className="group bg-card border border-border rounded-xl p-6 hover-lift">
                 <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                   {item.logoUrl ? (
                     <img
                       src={resolveImageUrl(item.logoUrl)}
                       alt={getLocalized(item.name, lang)}
                       className="w-full h-full object-contain p-2"
                       onError={(e) => {
                         (e.target as HTMLImageElement).src = IMAGE_FALLBACK;
                       }}
                     />
                   ) : (
                     <Award className="w-6 h-6 text-muted-foreground/30" />
                   )}
                 </div>
                 <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-2">{getLocalized(item.name, lang)}</h3>
                 <p className="text-xs text-muted-foreground line-clamp-2">{getLocalized(item.description, lang)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabelDetailPage;
