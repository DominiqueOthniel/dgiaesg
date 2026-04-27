import { useTranslation } from "react-i18next";
import { FileText, Download } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";

const REPORTS = [
  { title: "Rapport Transition Energetique Afrique 2026", type: "PDF", year: "2026" },
  { title: "Benchmark Gouvernance ESG - Institutions Financieres", type: "PDF", year: "2026" },
  { title: "Etat des lieux Biodiversite & Agro-industrie", type: "PDF", year: "2025" },
  { title: "Cadre RSE des grandes telecoms africaines", type: "PDF", year: "2025" },
];

export default function DataReportsPage() {
  const { t } = useTranslation();

  return (
    <HubSubpageShell
      badgeIcon={FileText}
      badgeLabel={t("pages.data.blocks.reports_title")}
      titleLead={t("pages.data.reports.hero_title_lead")}
      titleBrand={t("pages.data.reports.hero_title_brand")}
      subtitle={t("pages.data.reports.subtitle")}
    >
      <div className="golden-glow relative rounded-3xl border-border/90 bg-card overflow-hidden shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)]">
        <div className="pointer-events-none absolute inset-0 opacity-75 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />
        <div className="divide-y divide-border">
          {REPORTS.map((report) => (
            <div key={report.title} className="px-5 md:px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-foreground">{report.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.type} • {report.year}
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-wider shadow-[0_12px_22px_-14px_rgba(13,77,51,0.65)]">
                <Download className="w-4 h-4" />
                {t("pages.data.reports.download")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </HubSubpageShell>
  );
}
