import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, ChevronRight, Newspaper, BarChart3, ArrowLeft } from "lucide-react";

type LocalizedText = { fr: string; en: string };

type RegionData = {
  title: LocalizedText;
  countries: Array<{
    name: LocalizedText;
    esgProfile: LocalizedText;
    headlines: LocalizedText[];
    companies: LocalizedText[];
    indicators: Array<{ label: LocalizedText; value: string }>;
  }>;
};

const REGIONS: Record<string, RegionData> = {
  "afrique-ouest": {
    title: { fr: "Afrique de l'Ouest", en: "West Africa" },
    countries: [
      {
        name: { fr: "Sénégal", en: "Senegal" },
        esgProfile: {
          fr: "Accélération des politiques climat et des projets d'énergie propre.",
          en: "Acceleration of climate policies and clean energy projects.",
        },
        headlines: [
          { fr: "Taxonomie verte en discussion", en: "Green taxonomy under discussion" },
          { fr: "Programme solaire régional en extension", en: "Regional solar program expanding" },
        ],
        companies: [
          { fr: "Sonatel", en: "Sonatel" },
          { fr: "Société Générale Sénégal", en: "Societe Generale Senegal" },
          { fr: "SEN'EAU", en: "SEN'EAU" },
        ],
        indicators: [
          { label: { fr: "Énergies renouvelables", en: "Renewable energy" }, value: "31%" },
          { label: { fr: "Score gouvernance", en: "Governance score" }, value: "B+" },
        ],
      },
      {
        name: { fr: "Côte d'Ivoire", en: "Cote d'Ivoire" },
        esgProfile: {
          fr: "Priorité donnée aux chaînes agricoles durables et au reporting ESG.",
          en: "Priority given to sustainable agricultural value chains and ESG reporting.",
        },
        headlines: [
          { fr: "Cadre RSE cacao renforcé", en: "Cocoa CSR framework strengthened" },
          { fr: "Marché obligations vertes en croissance", en: "Green bond market growing" },
        ],
        companies: [
          { fr: "NSIA", en: "NSIA" },
          { fr: "SIFCA", en: "SIFCA" },
          { fr: "Orange CI", en: "Orange CI" },
        ],
        indicators: [
          { label: { fr: "Investissements verts", en: "Green investments" }, value: "1.8 B$" },
          { label: { fr: "Score social", en: "Social score" }, value: "B" },
        ],
      },
    ],
  },
  "afrique-centrale": {
    title: { fr: "Afrique centrale", en: "Central Africa" },
    countries: [
      {
        name: { fr: "Cameroun", en: "Cameroon" },
        esgProfile: {
          fr: "Focus sur la gouvernance extractive et la transition énergétique locale.",
          en: "Focus on extractive governance and local energy transition.",
        },
        headlines: [
          { fr: "Projet hydro relancé", en: "Hydro project relaunched" },
          { fr: "Feuille de route climat publiée", en: "Climate roadmap published" },
        ],
        companies: [
          { fr: "MTN Cameroon", en: "MTN Cameroon" },
          { fr: "Société Générale Cameroun", en: "Societe Generale Cameroon" },
          { fr: "Dangote Cement", en: "Dangote Cement" },
        ],
        indicators: [
          { label: { fr: "Électrification rurale", en: "Rural electrification" }, value: "67%" },
          { label: { fr: "Score gouvernance", en: "Governance score" }, value: "B-" },
        ],
      },
      {
        name: { fr: "Gabon", en: "Gabon" },
        esgProfile: {
          fr: "Positionnement fort sur biodiversité, forêts et marchés carbone.",
          en: "Strong positioning on biodiversity, forests, and carbon markets.",
        },
        headlines: [
          { fr: "Crédits carbone forestiers", en: "Forest carbon credits" },
          { fr: "Plan national biodiversité renforcé", en: "National biodiversity plan strengthened" },
        ],
        companies: [
          { fr: "BGFI Bank", en: "BGFI Bank" },
          { fr: "Comilog", en: "Comilog" },
          { fr: "TotalEnergies Gabon", en: "TotalEnergies Gabon" },
        ],
        indicators: [
          { label: { fr: "Couverture forestière", en: "Forest coverage" }, value: "88%" },
          { label: { fr: "Score climat", en: "Climate score" }, value: "A-" },
        ],
      },
    ],
  },
  "afrique-nord": {
    title: { fr: "Afrique du Nord", en: "North Africa" },
    countries: [
      {
        name: { fr: "Maroc", en: "Morocco" },
        esgProfile: {
          fr: "Écosystème mature sur finance verte, industrie et énergies renouvelables.",
          en: "Mature ecosystem for green finance, industry, and renewable energy.",
        },
        headlines: [
          { fr: "Nouveaux PPP verts", en: "New green PPPs" },
          { fr: "Reporting climat bancaire renforcé", en: "Stronger climate banking disclosures" },
        ],
        companies: [
          { fr: "OCP", en: "OCP" },
          { fr: "Attijariwafa bank", en: "Attijariwafa bank" },
          { fr: "MASEN", en: "MASEN" },
        ],
        indicators: [
          { label: { fr: "Capacité renouvelable", en: "Renewable capacity" }, value: "38%" },
          { label: { fr: "Score finance ESG", en: "ESG finance score" }, value: "A" },
        ],
      },
      {
        name: { fr: "Égypte", en: "Egypt" },
        esgProfile: {
          fr: "Croissance rapide des obligations vertes et infrastructures bas carbone.",
          en: "Rapid growth in sovereign green bonds and low-carbon infrastructure.",
        },
        headlines: [
          { fr: "Green bonds souverains", en: "Sovereign green bonds" },
          { fr: "Hydrogène vert en expansion", en: "Green hydrogen expansion" },
        ],
        companies: [
          { fr: "CIB", en: "CIB" },
          { fr: "Elsewedy Electric", en: "Elsewedy Electric" },
          { fr: "Orascom", en: "Orascom" },
        ],
        indicators: [
          { label: { fr: "Investissements climatiques", en: "Climate investments" }, value: "6.2 B$" },
          { label: { fr: "Score social", en: "Social score" }, value: "B+" },
        ],
      },
    ],
  },
  "afrique-est": {
    title: { fr: "Afrique de l'Est", en: "East Africa" },
    countries: [
      {
        name: { fr: "Kenya", en: "Kenya" },
        esgProfile: {
          fr: "Leader régional sur innovation climat, fintech verte et inclusion.",
          en: "Regional leader in climate innovation, green fintech, and inclusion.",
        },
        headlines: [
          { fr: "Cadre ESG fintech publié", en: "Fintech ESG framework published" },
          { fr: "Nouveaux projets géothermiques", en: "New geothermal projects" },
        ],
        companies: [
          { fr: "Safaricom", en: "Safaricom" },
          { fr: "KCB Group", en: "KCB Group" },
          { fr: "KenGen", en: "KenGen" },
        ],
        indicators: [
          { label: { fr: "Mix renouvelable", en: "Renewable mix" }, value: "74%" },
          { label: { fr: "Score inclusion", en: "Inclusion score" }, value: "A-" },
        ],
      },
      {
        name: { fr: "Rwanda", en: "Rwanda" },
        esgProfile: {
          fr: "Cadre institutionnel solide et pilotage data des politiques ESG.",
          en: "Strong institutional framework and data-driven ESG policy steering.",
        },
        headlines: [
          { fr: "Plateforme data climat", en: "Climate data platform" },
          { fr: "Normes RSE publiques étendues", en: "Expanded public CSR standards" },
        ],
        companies: [
          { fr: "Bank of Kigali", en: "Bank of Kigali" },
          { fr: "MTN Rwanda", en: "MTN Rwanda" },
          { fr: "I&M Bank Rwanda", en: "I&M Bank Rwanda" },
        ],
        indicators: [
          { label: { fr: "Indice ESG digital", en: "Digital ESG index" }, value: "A" },
          { label: { fr: "Score gouvernance", en: "Governance score" }, value: "A-" },
        ],
      },
    ],
  },
  "afrique-australe": {
    title: { fr: "Afrique australe", en: "Southern Africa" },
    countries: [
      {
        name: { fr: "Afrique du Sud", en: "South Africa" },
        esgProfile: {
          fr: "Marché ESG structuré avec forte profondeur de reporting et d'audit.",
          en: "Structured ESG market with strong reporting and audit depth.",
        },
        headlines: [
          { fr: "Transition juste : nouveaux financements", en: "Just transition: new financing" },
          { fr: "Normes climat entreprises élargies", en: "Expanded corporate climate standards" },
        ],
        companies: [
          { fr: "Standard Bank", en: "Standard Bank" },
          { fr: "Nedbank", en: "Nedbank" },
          { fr: "Sasol", en: "Sasol" },
        ],
        indicators: [
          { label: { fr: "Émissions scope publiées", en: "Published scope emissions" }, value: "92%" },
          { label: { fr: "Score gouvernance", en: "Governance score" }, value: "A" },
        ],
      },
      {
        name: { fr: "Mozambique", en: "Mozambique" },
        esgProfile: {
          fr: "Montée en puissance sur biodiversité, agriculture durable et adaptation.",
          en: "Growing momentum on biodiversity, sustainable agriculture, and adaptation.",
        },
        headlines: [
          { fr: "Programme résilience côtière", en: "Coastal resilience program" },
          { fr: "Cadre RSE minier actualisé", en: "Updated mining CSR framework" },
        ],
        companies: [
          { fr: "BCI", en: "BCI" },
          { fr: "Vodacom Mozambique", en: "Vodacom Mozambique" },
          { fr: "EDM", en: "EDM" },
        ],
        indicators: [
          { label: { fr: "Projets d'adaptation", en: "Adaptation projects" }, value: "48" },
          { label: { fr: "Score climat", en: "Climate score" }, value: "B" },
        ],
      },
    ],
  },
};

export default function CountryRegionPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith("en");
  const { region } = useParams<{ region: string }>();
  const data = region ? REGIONS[region] : undefined;

  if (!data) return <Navigate to="/pays" replace />;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_18%_10%,hsl(var(--brand-emerald))_0%,transparent_34%),radial-gradient(circle_at_85%_75%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="bg-primary relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(45deg,white_0_1px,transparent_1px_18px)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <Link to="/pays" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-6 px-3 py-1.5 rounded-full border border-white/15 bg-white/10">
            <ArrowLeft className="w-4 h-4" /> {t("pages.countries.back_regions")}
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4">
            {isEn ? data.title.en : data.title.fr}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75">
            {t("pages.countries.region_subtitle")}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15">
            <span className="text-xl font-black text-brand-gold leading-none">{data.countries.length}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">
              {isEn ? "featured countries" : "pays en focus"}
            </span>
          </div>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-7 z-10">
          {data.countries.map((country) => (
            <article key={country.name.fr} className="group relative rounded-3xl border border-border/80 bg-card/98 p-6 md:p-8 overflow-hidden shadow-[0_20px_52px_-26px_rgba(0,0,0,0.34)]">
              <div className="pointer-events-none absolute inset-0 bg-white/90" />
              <div className="pointer-events-none absolute inset-0 opacity-28 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-35 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--brand-emerald)/0.08)_100%)]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {isEn ? country.name.en : country.name.fr}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80 px-2 py-1 rounded-full bg-background border border-border/70">
                    ESG
                  </span>
                </div>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6">
                  {isEn ? country.esgProfile.en : country.esgProfile.fr}
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="rounded-2xl border border-border/75 bg-background p-4 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-3">
                    <Newspaper className="w-4 h-4" /> {t("pages.countries.section_news")}
                  </div>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {country.headlines.map((line) => (
                      <li key={line.fr} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>{isEn ? line.en : line.fr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/75 bg-background p-4 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-3">
                    <Building2 className="w-4 h-4" /> {t("pages.countries.section_companies")}
                  </div>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {country.companies.map((line) => (
                      <li key={line.fr} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>{isEn ? line.en : line.fr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/75 bg-background p-4 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-3">
                    <BarChart3 className="w-4 h-4" /> {t("pages.countries.section_indicators")}
                  </div>
                  <dl className="space-y-3">
                    {country.indicators.map((kpi) => (
                      <div key={kpi.label.fr} className="flex items-center justify-between gap-3 pb-2 border-b border-border/40 last:border-0 last:pb-0">
                        <dt className="text-xs font-semibold text-foreground/70">
                          {isEn ? kpi.label.en : kpi.label.fr}
                        </dt>
                        <dd className="text-sm font-black text-foreground bg-primary/10 px-2 py-0.5 rounded-md">{kpi.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
