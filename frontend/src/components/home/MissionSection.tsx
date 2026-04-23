import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import { getLocalized, handleImageError, ViewportSection } from "./_shared";

/**
 * 1. VISION & MISSION + CERTIFIED COMPANIES
 */
export function MissionSection({
  companies,
  companiesLoading,
}: {
  companies: any[];
  companiesLoading: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const missionRef = useRef<HTMLDivElement>(null);
  const [missionVisible, setMissionVisible] = useState(false);

  useEffect(() => {
    const el = missionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMissionVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ViewportSection
      id="mission"
      className="py-10 md:py-12 border-b border-border bg-gradient-to-br from-surface-warm via-background to-primary/5"
    >
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand-emerald/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 w-[480px] h-[480px] rounded-full bg-brand-gold/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Mission */}
          <div className="lg:col-span-8">
            <div
              ref={missionRef}
              className="h-full bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-10 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/15 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[100px] group-hover:bg-brand-gold/20 transition-colors duration-1000" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={missionVisible ? { width: 40 } : { width: 0 }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-[2px] bg-gradient-to-r from-primary to-brand-emerald rounded-full"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {t("home.mission.title")}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter leading-[1.05] mb-5 max-w-2xl uppercase italic">
                  {t("home.mission.headline")}{" "}
                  <span className="bg-gradient-to-r from-primary via-brand-emerald to-brand-gold-dark bg-clip-text text-transparent italic">
                    {t("home.mission.headline_accent")}
                  </span>
                </h2>

                <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mb-6 font-medium">
                  {t("home.mission.text")}
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    {
                      text: t("home.mission.bullet_esg"),
                      icon: ShieldCheck,
                      tone: "primary",
                    },
                    {
                      text: t("home.mission.bullet_iso"),
                      icon: Building2,
                      tone: "emerald",
                    },
                    {
                      text: t("home.mission.bullet_capital"),
                      icon: Globe,
                      tone: "gold",
                    },
                  ].map((item, i) => {
                    const tones: Record<string, string> = {
                      primary: "bg-primary/5 border-primary/20 text-primary",
                      emerald:
                        "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald",
                      gold: "bg-brand-gold/10 border-brand-gold/40 text-brand-gold-dark",
                    };
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-1 px-3 rounded-full border",
                            tones[item.tone],
                          )}
                        >
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {item.text}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div
                  className="flex flex-wrap gap-3 transition-all duration-700"
                  style={{
                    opacity: missionVisible ? 1 : 0,
                    transform: missionVisible
                      ? "translateY(0)"
                      : "translateY(20px)",
                  }}
                >
                  <Link
                    to="/labels"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-brand-emerald text-primary-foreground px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/25 active:scale-95"
                  >
                    {t("home.mission.cta_portals")}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Certified Companies Sidebar */}
          <div className="lg:col-span-4">
            <div className="h-full bg-gradient-to-br from-brand-dark via-primary to-brand-forest rounded-2xl p-5 md:p-6 flex flex-col relative overflow-hidden shadow-2xl shadow-black/30 border border-brand-gold/30 ring-1 ring-brand-gold/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-emerald/20 rounded-full blur-[80px]" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-brand-gold/20 rounded-xl border border-brand-gold/30">
                  <ShieldCheck className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {t("home.companies.title")}
                </h3>
              </div>

              <div className="space-y-3 relative z-10 flex-1 overflow-hidden">
                {companiesLoading ? (
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-white/5 animate-pulse rounded-xl"
                    />
                  ))
                ) : companies.length > 0 ? (
                  companies.slice(0, 3).map((company: any) => (
                    <Link
                      key={company._id}
                      to={`/directory/${company._id}`}
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-brand-gold/40 shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-brand-gold/30 hover:bg-white/10 hover:border-brand-gold hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group/item"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 shrink-0 shadow-lg group-hover/item:rotate-3 transition-transform">
                        {company.logoUrl ? (
                          <img
                            src={resolveImageUrl(
                              getLocalized(company.logoUrl, lang),
                            )}
                            onError={handleImageError}
                            className="w-full h-full object-contain"
                            alt={getLocalized(company.name, lang)}
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider truncate group-hover/item:text-brand-gold transition-colors">
                          {getLocalized(company.name, lang)}
                        </h4>
                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                          {getLocalized(company.sector, lang) ||
                            t("home.mission.sector_fallback")}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-gold/60 group-hover/item:text-brand-gold group-hover/item:translate-x-1 transition-all" />
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-white/40 italic text-center py-8">
                    {t("home.mission.no_companies")}
                  </p>
                )}
              </div>

              <div className="mt-5 relative z-10">
                <Link
                  to="/directory"
                  className="flex items-center justify-between w-full p-3.5 bg-brand-gold text-brand-gold-foreground rounded-xl hover:brightness-110 hover:shadow-2xl hover:shadow-brand-gold/40 transition-all shadow-xl shadow-brand-gold/30 group/btn"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block leading-none">
                      {t("home.mission.registry_global")}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}
