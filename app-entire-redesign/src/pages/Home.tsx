import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Play,
  Headphones,
  Calendar,
  MapPin,
  Building2,
  Globe,
  Mail,
  ChevronRight,
  TrendingUp,
  Zap,
  Search,
} from "lucide-react";
import { useLabels } from "@/hooks/useLabels";
import { useNews } from "@/hooks/useNews";
import { useCompanies } from "@/hooks/useCompanies";
import { useEvents } from "@/hooks/useEvents";
import { useMagazines } from "@/hooks/useMagazines";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";
import type { LocalizedString } from "@/types";

const IMAGE_FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=Logo";

function getLocalized(val: LocalizedString | undefined | null, lang: string): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val["fr"] || val["en"] || "";
}

function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.target as HTMLImageElement;
  if (target.src !== IMAGE_FALLBACK) target.src = IMAGE_FALLBACK;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-muted", className)} />
);

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  actionHref,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border">
    <div className="flex items-start gap-3">
      <div className="p-2.5 bg-primary/10 rounded-xl mt-0.5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
    {action && actionHref && (
      <Link
        to={actionHref}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0"
      >
        {action}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    )}
  </div>
);

function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: labels, isLoading: labelsLoading } = useLabels();
  const { data: newsData } = useNews({ page: 1, limit: 12 });
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ limit: 6, status: "certified" });
  const { data: events, isLoading: eventsLoading } = useEvents({ limit: 6, featured: true });
  const { data: magazines, isLoading: magazinesLoading } = useMagazines();

  const news = newsData?.data || [];
  const companies = companiesData?.data || [];

  const { data: multimediaData } = useQuery({
    queryKey: ["homepage-multimedia"],
    queryFn: async () => {
      const res = await api.get("/multimedia?limit=12&published=true");
      return res.data.data || [];
    },
  });

  const { data: latestNewsletter } = useQuery({
    queryKey: ["latest-newsletter"],
    queryFn: async () => {
      const res = await api.get("/newsletter/latest");
      return res.data.data;
    },
  });

  const multimedia = multimediaData || [];
  const videoItems = multimedia.filter((m: any) => m.type === "video");
  const podcastItems = multimedia.filter((m: any) => m.type === "audio");

  const [activeSector, setActiveSector] = useState("ESG");
  const [email, setEmail] = useState("");

  /* Hero slideshow */
  const heroImages = ["/img/hero_image.jpg", "/img/hero_image2.jpg"];
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((p) => (p + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, []);

  /* Mission section observer */
  const missionRef = useRef<HTMLDivElement>(null);
  const [missionVisible, setMissionVisible] = useState(false);
  useEffect(() => {
    const el = missionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMissionVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      {/* ═══════════ 0. HERO SECTION ═══════════ */}
      <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeSlide === i ? 1 : 0 }}
              transition={{ duration: 1.2 }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" onError={handleImageError} />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(160,78%,10%)]/90 via-[hsl(160,78%,10%)]/75 to-[hsl(160,78%,10%)]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(160,78%,10%)]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-md px-4 py-2 rounded-full border border-primary-foreground/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">
                {t("home.hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
              style={{ color: "white" }}
            >
              {t("home.hero.title1")}
              <br />
              <span className="text-accent italic">{t("home.hero.title2")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/labels"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:brightness-110 transition-all shadow-lg active:scale-95"
              >
                {t("home.hero.cta_labels")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/directory"
                className="inline-flex items-center gap-2 border-2 border-primary-foreground/30 px-6 py-3 rounded-lg font-semibold text-sm backdrop-blur-sm hover:bg-primary-foreground/10 transition-all active:scale-95"
                style={{ color: "white" }}
              >
                {t("home.hero.cta_directory")}
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                activeSlide === i ? "w-10 bg-accent" : "w-4 bg-primary-foreground/30"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════ REAL-TIME NEWS TICKER ═══════════ */}
      <div className="bg-primary py-2.5 overflow-hidden relative z-30">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12">
              {news.slice(0, 5).map((item: any) => (
                <Link key={`${idx}-${item._id}`} to={`/news/${item.slug}`} className="flex items-center gap-3 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">
                    {item.sector}
                  </span>
                  <span className="text-sm font-medium text-primary-foreground/80 group-hover:text-accent transition-colors">
                    {getLocalized(item.title, lang)}
                  </span>
                </Link>
              ))}
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent uppercase tracking-widest">
                  DIRECTIVE ESG 2024 ACTIVÉE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ 1. VISION & MISSION + CERTIFIED COMPANIES ═══════════ */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Mission */}
            <div className="lg:col-span-8">
              <div
                ref={missionRef}
                className="h-full bg-card border border-border rounded-2xl p-8 md:p-12 relative overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={missionVisible ? { width: 40 } : { width: 0 }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-[2px] bg-primary rounded-full"
                    />
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                      {t("home.mission.title")}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6 max-w-2xl">
                    Le Portail Panafricain de l'Excellence{" "}
                    <span className="text-primary">Certifiée.</span>
                  </h2>

                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
                    {t("home.mission.text")}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {[
                      { text: "Certification ESG de classe mondiale", icon: ShieldCheck },
                      { text: "Transparence économique & ISO", icon: Building2 },
                      { text: "Accès aux capitaux globaux", icon: Globe },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="p-1.5 bg-brand-emerald/10 rounded-full">
                          <item.icon className="w-3.5 h-3.5 text-brand-emerald" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="flex flex-wrap gap-3 transition-all duration-700"
                    style={{
                      opacity: missionVisible ? 1 : 0,
                      transform: missionVisible ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    <Link
                      to="/labels"
                      className="inline-flex items-center gap-2 bg-brand-emerald text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary transition-all shadow-sm active:scale-95"
                    >
                      Nos Portails <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/directory"
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted transition-all border border-border active:scale-95"
                    >
                      Consulter le Registre
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Certified Companies Sidebar */}
            <div className="lg:col-span-4">
              <div className="h-full bg-primary rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full blur-[80px]" />

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 bg-primary-foreground/10 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary-foreground">
                    {t("home.companies.title")}
                  </h3>
                </div>

                <div className="space-y-3 relative z-10 flex-1 overflow-hidden">
                  {companiesLoading
                    ? [1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-primary-foreground/5 animate-pulse rounded-xl" />
                      ))
                    : companies.length > 0
                    ? companies.slice(0, 3).map((company: any) => (
                        <Link
                          key={company._id}
                          to={`/directory/${company._id}`}
                          className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all group/item"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary-foreground flex items-center justify-center p-1.5 shrink-0">
                            {company.logoUrl ? (
                              <img
                                src={resolveImageUrl(getLocalized(company.logoUrl, lang))}
                                onError={handleImageError}
                                className="w-full h-full object-contain"
                                alt={getLocalized(company.name, lang)}
                              />
                            ) : (
                              <Building2 className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-primary-foreground truncate group-hover/item:text-accent transition-colors">
                              {getLocalized(company.name, lang)}
                            </h4>
                            <span className="text-xs text-primary-foreground/50">
                              {getLocalized(company.sector, lang) || "Secteur"}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary-foreground/20 group-hover/item:text-accent transition-colors" />
                        </Link>
                      ))
                    : (
                      <p className="text-sm text-primary-foreground/40 italic text-center py-8">
                        Aucune entreprise certifiée pour le moment.
                      </p>
                    )}
                </div>

                <div className="mt-6 relative z-10">
                  <Link
                    to="/directory"
                    className="flex items-center justify-between w-full p-4 bg-accent text-accent-foreground rounded-xl hover:brightness-110 transition-all shadow-md group/btn"
                  >
                    <div>
                      <span className="text-sm font-bold block">Listing Complet</span>
                      <span className="text-xs font-medium opacity-70">Explorer l'Annuaire</span>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. INTELLIGENCE ÉDITORIALE (NEWS) ═══════════ */}
      <section className="py-16 md:py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={BookOpen}
            title={t("home.news.title")}
            subtitle={t("home.news.subtitle")}
            action={t("home.news.view_all")}
            actionHref="/news"
          />

          {news.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucun article pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Featured article */}
              {news[0] && (
                <div className="lg:col-span-8">
                  <Link
                    to={`/news/${news[0].slug}`}
                    className="group block bg-card border border-border rounded-2xl overflow-hidden hover-lift"
                  >
                    <div className="aspect-[16/9] bg-muted overflow-hidden">
                      {news[0].imageUrl ? (
                        <img
                          src={resolveImageUrl(news[0].imageUrl)}
                          alt={getLocalized(news[0].title, lang)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {news[0].sector && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                          {news[0].sector}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {getLocalized(news[0].title, lang)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {getLocalized(news[0].excerpt, lang)}
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Secondary news */}
              <div className="lg:col-span-4 space-y-4">
                {news.slice(1, 5).map((article: any) => (
                  <Link
                    key={article._id}
                    to={`/news/${article.slug}`}
                    className="group flex gap-4 bg-card border border-border rounded-xl p-4 hover-lift"
                  >
                    <div className="w-20 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                      {article.imageUrl ? (
                        <img
                          src={resolveImageUrl(article.imageUrl)}
                          alt={getLocalized(article.title, lang)}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {getLocalized(article.title, lang)}
                      </h4>
                      <span className="text-xs text-muted-foreground mt-1 block">{article.sector}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ 5. KIOSQUE & MAGAZINES ═══════════ */}
      <section className="py-16 md:py-20 bg-surface-warm border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={BookOpen}
            title={t("home.kiosk.title")}
            subtitle={t("home.kiosk.subtitle")}
            action={t("home.kiosk.view_all")}
            actionHref="/kiosk"
          />

          {magazinesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : magazines && magazines.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {magazines.slice(0, 5).map((mag: any) => (
                <Link key={mag._id} to="/kiosk" className="group hover-lift">
                  <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-shadow relative">
                    {mag.coverImageUrl ? (
                      <img
                        src={resolveImageUrl(mag.coverImageUrl)}
                        alt={getLocalized(mag.title, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-semibold text-primary-foreground">
                        {t("home.news.read_more")} →
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mt-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {getLocalized(mag.title, lang)}
                  </h4>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Aucune publication pour le moment.</p>
          )}
        </div>
      </section>

      {/* ═══════════ 6 & 7. LABELS & REGISTRY ═══════════ */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sector Sidebar */}
            <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-8">
              {/* Data Central Gateway */}
              <div className="p-6 border border-border rounded-2xl bg-muted/50 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Accès Data Central</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Consultez l'index exhaustif de l'économie africaine certifiée.
                </p>
                <Link
                  to="/directory"
                  className="flex items-center justify-center w-full py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all active:scale-95"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ouvrir le Registre
                </Link>
              </div>

              {/* Sectors */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">Data Par Secteur</h3>
                <div className="w-8 h-0.5 bg-primary rounded-full mb-4" />
                <div className="space-y-1">
                  {[
                    { name: "ESG & FINANCE", count: 124, icon: TrendingUp },
                    { name: "CSR & GOVERNANCE", count: 86, icon: ShieldCheck },
                    { name: "TECH & SUSTAINABLE", count: 54, icon: Globe },
                    { name: "ENERGY & BIO", count: 42, icon: Zap },
                    { name: "LEADERSHIP & IMPACT", count: 31, icon: Award },
                  ].map((s) => {
                    const sectorKey = s.name.split(" ")[0];
                    return (
                      <button
                        key={s.name}
                        onClick={() => setActiveSector(sectorKey)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg transition-all text-left",
                          activeSector === sectorKey
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <s.icon className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">{s.name}</span>
                        </div>
                        <span className="text-sm font-bold">{s.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Labels Grid */}
            <div className="lg:col-span-9">
              <SectionHeader
                icon={Award}
                title={t("home.labels.title")}
                action={t("home.labels.view_all")}
                actionHref="/labels"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {labelsLoading
                  ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
                  : labels?.slice(0, 6).map((label: any) => (
                      <Link
                        key={label._id}
                        to={`/labels/${label._id}`}
                        className="group bg-card border border-border rounded-xl p-6 hover-lift flex flex-col relative"
                      >
                        {/* Ribbon */}
                        <div className="absolute top-0 right-4 w-8 h-9 bg-primary/5 rounded-b-lg flex items-center justify-center border-x border-b border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <Award className="w-4 h-4" />
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 shrink-0 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden p-2 group-hover:border-primary/30 transition-colors">
                            {label.logoUrl ? (
                              <img
                                src={resolveImageUrl(getLocalized(label.logoUrl, lang))}
                                alt={getLocalized(label.name, lang)}
                                className="w-full h-full object-contain"
                                onError={handleImageError}
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
                              <span className="text-xs font-medium text-brand-emerald">
                                {t("home.labels.verified")}
                              </span>
                              {label.sector && (
                                <span className="text-xs text-muted-foreground ml-1">· {label.sector}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
                          {getLocalized(label.description, lang) ||
                            "Protocole de conformité certifié pour l'excellence institutionnelle."}
                        </p>

                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all mt-auto">
                          {t("home.labels.explore")}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 8. MULTIMEDIA (VIDEOS + PODCASTS) ═══════════ */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-primary-foreground/10">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-primary-foreground/10 rounded-xl">
                <Play className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-foreground tracking-tight">
                  {t("home.multimedia.title")}
                </h2>
              </div>
            </div>
            <Link
              to="/multimedia"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group"
            >
              {t("home.multimedia.view_all")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Videos */}
            <div className="lg:col-span-8">
              <h3 className="text-sm font-semibold text-primary-foreground/60 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Play className="w-4 h-4" />
                {t("home.multimedia.videos")}
              </h3>
              {videoItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {videoItems.slice(0, 4).map((item: any) => (
                    <Link
                      key={item._id}
                      to="/multimedia"
                      className="group rounded-xl overflow-hidden hover-lift"
                    >
                      <div className="aspect-video bg-primary-foreground/5 relative overflow-hidden rounded-xl">
                        {item.coverImageUrl ? (
                          <img
                            src={resolveImageUrl(item.coverImageUrl)}
                            alt={getLocalized(item.title, lang)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-primary-foreground/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/30">
                          <div className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary fill-primary" />
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-primary-foreground mt-3 line-clamp-2 group-hover:text-accent transition-colors">
                        {getLocalized(item.title, lang)}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary-foreground/40 italic py-8">
                  Aucune vidéo pour le moment.
                </p>
              )}
            </div>

            {/* Podcasts */}
            <div className="lg:col-span-4">
              <h3 className="text-sm font-semibold text-primary-foreground/60 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                {t("home.multimedia.podcasts")}
              </h3>
              {podcastItems.length > 0 ? (
                <div className="space-y-3">
                  {podcastItems.slice(0, 4).map((item: any) => (
                    <Link
                      key={item._id}
                      to="/multimedia"
                      className="group flex items-start gap-3 p-4 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl hover:bg-primary-foreground/10 transition-all"
                    >
                      <div className="w-10 h-10 shrink-0 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-primary-foreground line-clamp-2 group-hover:text-accent transition-colors">
                          {getLocalized(item.title, lang)}
                        </h4>
                        <p className="text-xs text-primary-foreground/50 mt-1 line-clamp-1">
                          {getLocalized(item.description, lang)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary-foreground/40 italic py-8">
                  Aucun podcast pour le moment.
                </p>
              )}

              {/* Multimedia CTA */}
              <Link
                to="/multimedia"
                className="mt-4 flex items-center justify-center w-full py-3 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:brightness-110 transition-all active:scale-95"
              >
                Explorer tout le multimédia
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 9. FINAL CTA (STATS + BENEFITS) ═══════════ */}
      <section className="py-16 md:py-20 bg-muted/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Benefits */}
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
                Développement Stratégique
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-6 leading-tight">
                Transformez votre vision en certification.
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  { title: "Expertise Panafricaine", desc: "Réseau d'influence certifié.", icon: Globe },
                  { title: "Protocoles Rigoureux", desc: "Certification étape par étape.", icon: ShieldCheck },
                  { title: "Visibilité Accrue", desc: "Indexation prioritaire.", icon: Zap },
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/directory"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  Démarrer ma certification
                </Link>
                <Link
                  to="/labels"
                  className="inline-flex items-center gap-2 bg-brand-emerald text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary transition-all active:scale-95"
                >
                  Découvrir les portails
                </Link>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "ENTITÉS", value: "2400+", icon: TrendingUp },
                { label: "PAYS", value: "24", icon: Globe },
                { label: "AUDITS", value: "850", icon: ShieldCheck },
                { label: "IMPACT", value: "A+", icon: Award },
              ].map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-card rounded-2xl flex flex-col items-center text-center group hover:shadow-lg transition-all border border-border"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-foreground leading-none mb-1">
                    {s.value}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 4. ENGAGEMENT: NEWSLETTER + EVENTS ═══════════ */}
      <section className="py-16 md:py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={Mail}
            title="Synergies & Événements"
            subtitle="Connecter l'économie réelle à l'intelligence"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Newsletter */}
            <div className="bg-primary rounded-2xl p-8 text-primary-foreground relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-[100px]" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-primary-foreground/10 rounded-xl flex items-center justify-center mb-5">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("home.newsletter.title")}</h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
                  {t("home.newsletter.subtitle")}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) {
                      api.post("/newsletter/subscribe", { email }).catch(() => {});
                      setEmail("");
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("home.newsletter.placeholder")}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent text-accent-foreground font-semibold text-sm rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-lg shrink-0"
                  >
                    {t("home.newsletter.subscribe")}
                  </button>
                </form>
              </div>
            </div>

            {/* Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t("home.events.title")}
                </h3>
                <Link
                  to="/events"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  {t("home.events.view_all")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {eventsLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              ) : events && events.length > 0 ? (
                events.slice(0, 3).map((event: any) => {
                  const startDate = new Date(event.startDate);
                  return (
                    <Link
                      key={event._id}
                      to={`/events/${event._id}`}
                      className="group flex gap-4 bg-card border border-border rounded-xl p-4 hover-lift"
                    >
                      <div className="shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-primary leading-none">
                          {startDate.getDate()}
                        </span>
                        <span className="text-[10px] font-semibold uppercase text-primary/70 mt-0.5">
                          {startDate.toLocaleString("fr", { month: "short" })}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {event.type}
                        </span>
                        <h4 className="text-sm font-semibold text-foreground mt-1.5 group-hover:text-primary transition-colors line-clamp-1">
                          {getLocalized(event.title, lang)}
                        </h4>
                        {getLocalized(event.location, lang) && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{getLocalized(event.location, lang)}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground italic py-4">Aucun événement pour le moment.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
