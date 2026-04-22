import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  Globe,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import {
  getLocalized,
  handleImageError,
  Skeleton,
  ViewportSection,
} from "./_shared";

const SECTORS = [
  { name: "ESG & FINANCE", count: 124, icon: TrendingUp, key: "Finance" },
  { name: "CSR & GOVERNANCE", count: 86, icon: ShieldCheck, key: "Gouvernance" },
  { name: "TECH & SUSTAINABLE", count: 54, icon: Globe, key: "Tech" },
  { name: "ENERGY & BIO", count: 42, icon: Zap, key: "Énergie" },
  { name: "LEADERSHIP & IMPACT", count: 31, icon: Award, key: "Leadership" },
];

/**
 * 4. CERTIFIED ENTERPRISES (ANNUAIRE)
 */
export function AnnuaireSection({
  companies,
  companiesLoading,
}: {
  companies: any[];
  companiesLoading: boolean;
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [activeSector, setActiveSector] = useState("Finance");

  return (
    <ViewportSection
      id="annuaire"
      className="py-10 md:py-14 bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sector Sidebar */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-5">
            <div className="p-5 border border-border rounded-2xl bg-muted/30 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  Accès DATA Direct
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 font-bold">
                Accédez à l'index exhaustif de l'économie africaine certifiée.
              </p>
              <Link
                to="/directory"
                className="flex items-center justify-center w-full py-3 bg-brand-gold text-brand-gold-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-brand-gold/10"
              >
                Ouvrir le Registre
              </Link>
            </div>

            <div className="p-3">
              <h3 className="text-[10px] font-black text-foreground mb-3 uppercase tracking-[0.3em] opacity-60">
                Data Par Secteur
              </h3>
              <div className="space-y-1">
                {SECTORS.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setActiveSector(s.key)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-left",
                      activeSector === s.key
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground/80 hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <s.icon
                        className={cn(
                          "w-3.5 h-3.5",
                          activeSector === s.key
                            ? "text-brand-gold"
                            : "opacity-40",
                        )}
                      />
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-black opacity-30">
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Listing */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-emerald/10 rounded-lg">
                  <Award className="w-5 h-5 text-brand-emerald" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  Certified Enterprises
                </h2>
              </div>
              <Link
                to="/directory"
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
              >
                Voir l'Annuaire →
              </Link>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              {companiesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))
              ) : companies && companies.length > 0 ? (
                companies.slice(0, 4).map((company: any) => (
                  <Link
                    key={company._id}
                    to={`/directory/${company._id}`}
                    className="group/dir relative block border-flow-gold-emerald rounded-[14px] p-[2.5px] overflow-hidden transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15),0_0_15px_-5px_color-mix(in_oklch,var(--brand-gold)_40%,transparent)] hover:shadow-[0_22px_50px_-10px_rgba(0,0,0,0.25),0_0_25px_-5px_color-mix(in_oklch,var(--brand-emerald)_50%,transparent)] hover:-translate-y-1.5"
                  >
                    <div className="flex items-stretch gap-3 sm:gap-5 bg-white rounded-[11px] p-3 sm:p-4 group-hover/dir:bg-white/95 transition-colors">
                      <div className="shrink-0 w-12 sm:w-16 flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-brand-emerald/15 to-brand-emerald/5 border border-brand-emerald/30 shadow-inner">
                        {company.logoUrl ? (
                          <img
                            src={resolveImageUrl(
                              getLocalized(company.logoUrl, lang),
                            )}
                            className="w-8 h-8 object-contain mb-1"
                            onError={handleImageError}
                            alt=""
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-brand-emerald mb-0.5" />
                        )}
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-emerald/70">
                          Indexé
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-6">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold-dark">
                              {getLocalized(company.sector, lang) ||
                                "EXCELLENCE"}
                            </span>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                              <ShieldCheck className="w-3 h-3 text-brand-emerald" />
                              Certifié
                            </span>
                          </div>
                          <h3 className="font-serif text-base sm:text-xl font-semibold text-foreground leading-tight tracking-tight group-hover/dir:text-brand-gold-dark transition-colors line-clamp-1 italic">
                            {getLocalized(company.name, lang)}
                          </h3>
                        </div>

                        <div className="shrink-0 mt-3 sm:mt-0">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold-dark group-hover/dir:bg-brand-gold group-hover/dir:text-white group-hover/dir:border-brand-gold transition-all duration-300">
                            Fiche profil
                            <ChevronRight className="w-3.5 h-3.5 group-hover/dir:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-12 border-2 border-dashed border-border rounded-2xl">
                  Aucun enregistrement indexé dans ce secteur.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}
