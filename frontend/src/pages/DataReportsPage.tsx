import { useTranslation } from "react-i18next";
import { FileText, Download } from "lucide-react";

const REPORTS = [
  { title: "Rapport Transition Energetique Afrique 2026", type: "PDF", year: "2026" },
  { title: "Benchmark Gouvernance ESG - Institutions Financieres", type: "PDF", year: "2026" },
  { title: "Etat des lieux Biodiversite & Agro-industrie", type: "PDF", year: "2025" },
  { title: "Cadre RSE des grandes telecoms africaines", type: "PDF", year: "2025" },
];

export default function DataReportsPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.065] [background:radial-gradient(circle_at_12%_12%,hsl(var(--brand-emerald))_0%,transparent_35%),radial-gradient(circle_at_87%_74%,hsl(var(--brand-gold))_0%,transparent_30%)]" />
      <section className="relative bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--brand-emerald)/0.35),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 mb-5">
            <FileText className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
              {t("pages.data.blocks.reports_title")}
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-extrabold text-primary-foreground tracking-tight mb-4 leading-[1.05]">
            {t("pages.data.reports.title")}
          </h1>
          <p className="text-base md:text-lg max-w-3xl text-primary-foreground/75 leading-relaxed">
            {t("pages.data.reports.subtitle")}
          </p>
        </div>
      </section>

      <div className="gradient-flow-bg mt-2">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 z-10">
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
        </section>
      </div>
    </div>
  );
}
