import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PenLine, ArrowLeft, CheckCircle } from "lucide-react";
import { HubSubpageShell } from "@/components/hub/HubCinematicHero";
import { motion } from "framer-motion";

type Step = { step: string; label: string; desc: string };
type Format = { label: string; desc: string };

export default function ContributePage() {
  const { t } = useTranslation();
  const formats = t("pages.contribute.formats", { returnObjects: true }) as Format[];
  const steps = t("pages.contribute.process_steps", { returnObjects: true }) as Step[];

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", org: "", role: "", email: "", topic: "", format: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <HubSubpageShell
      badgeIcon={PenLine}
      badgeLabel={t("pages.contribute.badge")}
      sectionsKicker={t("pages.contribute.sections_kicker")}
      titleLead={t("pages.contribute.hero_title_lead")}
      titleBrand={t("pages.contribute.hero_title_brand")}
      subtitle={t("pages.contribute.hero_subtitle")}
      beforeBadge={
        <Link
          to="/a-propos"
          className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {t("pages.contribute.back_about")}
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left column — Why + Formats + Process */}
        <div className="lg:col-span-1 space-y-6">

          {/* Why */}
          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-3">
              {t("pages.contribute.why_title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("pages.contribute.why_body")}
            </p>
          </div>

          {/* Formats */}
          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">
              {t("pages.contribute.formats_title")}
            </h2>
            <ul className="space-y-3">
              {Array.isArray(formats) && formats.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 shadow-[0_24px_58px_-26px_rgba(13,77,51,0.5)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_65%)]" />
            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">
              {t("pages.contribute.process_title")}
            </h2>
            <ol className="space-y-4">
              {Array.isArray(steps) && steps.map((s) => (
                <li key={s.step} className="flex items-start gap-3">
                  <span className="text-2xl font-black text-primary/20 leading-none shrink-0 tabular-nums">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right column — Form */}
        <div className="lg:col-span-2">
          <div className="golden-glow relative rounded-3xl border-border/90 bg-card p-6 md:p-8 shadow-[0_28px_66px_-28px_rgba(13,77,51,0.52)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(ellipse_at_top,_hsl(var(--brand-gold)/0.1),transparent_66%)]" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center py-16 gap-5"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Contribution reçue !</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Merci pour votre envoi. Notre équipe éditoriale reviendra vers vous sous 5 jours ouvrés.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", org: "", role: "", email: "", topic: "", format: "", message: "" }); }}
                  className="mt-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Soumettre une autre contribution
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                    {t("pages.contribute.cta_title")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{t("pages.contribute.cta_desc")}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "name", label: t("pages.contribute.form_name"), type: "text" },
                      { key: "org", label: t("pages.contribute.form_org"), type: "text" },
                      { key: "role", label: t("pages.contribute.form_role"), type: "text" },
                      { key: "email", label: t("pages.contribute.form_email"), type: "email" },
                      { key: "topic", label: t("pages.contribute.form_topic"), type: "text" },
                    ].map(({ key, label, type }) => (
                      <div key={key} className={key === "topic" ? "sm:col-span-2" : ""}>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                          {label}
                        </label>
                        <input
                          required
                          type={type}
                          value={form[key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full rounded-xl border border-border/70 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                        {t("pages.contribute.form_format")}
                      </label>
                      <select
                        value={form.format}
                        onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
                        required
                        className="w-full rounded-xl border border-border/70 bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                      >
                        <option value="" disabled>—</option>
                        {Array.isArray(formats) && formats.map((f, i) => (
                          <option key={i} value={f.label}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                        {t("pages.contribute.form_message")}
                      </label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        required
                        className="w-full rounded-xl border border-border/70 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    <PenLine className="w-4 h-4" />
                    {t("pages.contribute.form_submit")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </HubSubpageShell>
  );
}
