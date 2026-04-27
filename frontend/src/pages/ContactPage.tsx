import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe2,
  Building2,
  Newspaper,
} from "lucide-react";
import api from "@/services/api";

/* ─── Validation ───────────────────────────────────────── */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(255),
  service: z.string().min(1, "Sélectionnez un service"),
  subject: z.string().trim().min(3, "Sujet trop court").max(200),
  message: z.string().trim().min(10, "Message trop court (10 caractères min)").max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;
type Errors = Partial<Record<keyof ContactForm, string>>;

const SERVICES = [
  { value: "general", label: "Information générale", icon: Globe2 },
  { value: "press", label: "Presse & média", icon: Newspaper },
  { value: "partner", label: "Partenariats & publicité", icon: Building2 },
  { value: "certification", label: "Certification ESG", icon: CheckCircle2 },
] as const;

const CONTACT_BLOCKS = [
  { icon: Mail, title: "Email", lines: ["contact@dgiaesg.org", "presse@dgiaesg.org"] },
  { icon: Phone, title: "Téléphone", lines: ["+212 5 22 00 00 00", "Lun–Ven · 9h–18h GMT+1"] },
  { icon: MapPin, title: "Siège", lines: ["Casablanca, Maroc", "Bureaux à Dakar, Abidjan, Nairobi"] },
  { icon: Clock, title: "Réponse garantie", lines: ["Sous 48h ouvrées", "Service prioritaire pour partenaires"] },
] as const;

/* ─── Aurora Borealis (emerald-cyan variant) ───────────── */

function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/4 right-0 w-[70%] h-[130%] rounded-full bg-brand-emerald/30 blur-[150px] animate-aurora-wave" />
      <div className="absolute -bottom-1/3 left-1/4 w-[60%] h-[100%] rounded-full bg-brand-gold/20 blur-[140px] animate-aurora-drift" />
      <div className="absolute top-1/3 -left-20 w-[40%] h-[70%] rounded-full bg-brand-emerald/15 blur-[110px] animate-aurora-pulse" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(80deg, transparent 30%, hsl(160 84% 39% / 0.10) 50%, transparent 70%)",
          backgroundSize: "250% 250%",
        }}
      />
    </div>
  );
}

/* ─── Typewriter ───────────────────────────────────────── */

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span>
      {shown}
      <span className="inline-block w-[2px] h-[0.9em] bg-brand-gold ml-1 animate-pulse" />
    </span>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "", email: "", service: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState<string>("");

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactForm;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      await api.post("/contact", parsed.data);
      setStatus("success");
      setServerMsg("Votre message a bien été transmis. Notre équipe vous répondra sous 48h ouvrées.");
      setForm({ name: "", email: "", service: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      const fallback = "Une erreur est survenue. Veuillez réessayer ou nous écrire directement à contact@dgiaesg.org.";
      const e = err as { response?: { data?: { message?: string } } };
      setServerMsg(e?.response?.data?.message || fallback);
    }
  };

  const { scrollYProgress } = useScroll();
  const dotsY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen text-white">
      {/* Scroll indicator */}
      <div className="fixed top-0 right-3 sm:right-6 h-screen w-2 z-50 pointer-events-none hidden sm:block">
        <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-[2px] bg-white/10 rounded-full" />
        <motion.div
          style={{ top: dotsY }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_20px_rgba(255,193,7,0.9)]"
        >
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-brand-gold"
          />
        </motion.div>
      </div>

      {/* HERO + aurora */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-brand-deep via-brand-dark to-brand-forest">
        <HeroAurora />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                  Contact
                </span>
              </div>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8 min-h-[1.1em] h1-golden-glow relative">
              <Typewriter text="Parlons d'impact." />
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed font-medium max-w-2xl">
              Une question, un projet, une opportunité de collaboration ? L'équipe DGIA ESG est à votre
              écoute. Choisissez le service concerné — votre message sera dirigé au bon interlocuteur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT — brand forest variant (Very Light version synced with theme) */}
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, hsl(160 20% 25%) 0%, hsl(210 15% 20%) 50%, hsl(160 20% 25%) 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, hsl(160 84% 39% / 0.1) 90deg, transparent 180deg, hsl(45 100% 50% / 0.08) 270deg, transparent 360deg)",
            animation: "aurora-pulse 22s linear infinite",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-brand-emerald/15 blur-[130px] animate-drift-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-brand-gold/10 blur-[140px] animate-drift-slow"
          style={{ animationDelay: "-10s" }}
        />

        <section className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Form Side — Ensuring absolute presence with entrance animation */}
              <div className="lg:col-span-3">
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="p-8 md:p-10 rounded-3xl bg-white/[0.08] border border-white/20 backdrop-blur-lg shadow-2xl"
                  noValidate
                >
                  <h2 className="font-serif text-2xl md:text-3xl font-black mb-2 text-white">
                    Formulaire de contact
                  </h2>
                  <p className="text-sm text-white/60 mb-8 font-bold">Tous les champs sont obligatoires.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Nom complet" error={errors.name} input={
                      <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} maxLength={100} className="contact-input" placeholder="Aïcha Diallo" />
                    } />
                    <Field label="Email professionnel" error={errors.email} input={
                      <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} maxLength={255} className="contact-input" placeholder="vous@organisation.com" />
                    } />
                  </div>

                  <div className="mt-5">
                    <Field label="Service concerné" error={errors.service} input={
                      <div className="grid grid-cols-2 gap-2">
                        {SERVICES.map((s) => {
                          const Icon = s.icon;
                          const active = form.service === s.value;
                          return (
                            <button key={s.value} type="button" onClick={() => handleChange("service", s.value)}
                              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold text-left transition-all ${
                                active
                                  ? "bg-brand-gold text-brand-dark border-brand-gold shadow-lg shadow-brand-gold/30"
                                  : "bg-white/10 text-white/80 border-white/15 hover:border-brand-gold/40 hover:bg-white/20"
                              }`}>
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{s.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    } />
                  </div>

                  <div className="mt-5">
                    <Field label="Sujet" error={errors.subject} input={
                      <input type="text" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} maxLength={200} className="contact-input" placeholder="Demande de partenariat éditorial" />
                    } />
                  </div>

                  <div className="mt-5">
                    <Field label="Message" error={errors.message} hint={`${form.message.length}/2000`} input={
                      <textarea value={form.message} onChange={(e) => handleChange("message", e.target.value)} maxLength={2000} rows={6} className="contact-input resize-none" placeholder="Décrivez votre demande, vos objectifs et votre calendrier…" />
                    } />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-gold text-brand-dark font-black text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                          Envoi…
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Envoyer le message
                      </>
                    )}
                  </button>

                  {status === "success" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-brand-emerald/15 border border-brand-emerald/40 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-bold text-white/90">{serverMsg}</p>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-bold text-white/90">{serverMsg}</p>
                    </motion.div>
                  )}
                </motion.form>
              </div>

              {/* Info Side */}
              <div className="lg:col-span-2 space-y-4">
                {CONTACT_BLOCKS.map((block, i) => {
                  const Icon = block.icon;
                  return (
                    <motion.div
                      key={block.title}
                      initial={{ opacity: 0, y: 40, rotate: -2, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                      viewport={{ amount: 0.2 }}
                      transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 150, damping: 20 }}
                      className="group relative p-6 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-brand-gold/40 hover:bg-white/[0.1] transition-all overflow-hidden shadow-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative w-12 h-12 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-brand-gold" />
                          <span className="absolute inset-0 rounded-xl border-2 border-brand-gold/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2">
                            {block.title}
                          </h3>
                          {block.lines.map((line) => (
                            <p key={line} className="text-sm font-bold text-white/85 leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Status card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 relative overflow-hidden mt-6 shadow-xl"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Système opérationnel</span>
                    </div>
                    <h4 className="font-serif text-xl font-black text-white mb-2">Support Prioritaire</h4>
                    <p className="text-sm text-white/70 leading-relaxed font-medium">
                      Nos membres Premium bénéficient d'une ligne directe et d'un temps de réponse garanti de moins de 4 heures.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .contact-input {
          width: 100%;
          background: hsl(0 0% 100% / 0.08);
          border: 1px solid hsl(0 0% 100% / 0.15);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          outline: none;
          transition: all 0.25s ease;
        }
        .contact-input::placeholder { color: hsl(0 0% 100% / 0.35); font-weight: 500; }
        .contact-input:focus {
          border-color: hsl(var(--brand-gold));
          background: hsl(0 0% 100% / 0.12);
          box-shadow: 0 0 0 4px hsl(var(--brand-gold) / 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, input, error, hint }: { label: string; input: React.ReactNode; error?: string; hint?: string }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{label}</span>
        {hint && <span className="text-[10px] font-bold text-white/40">{hint}</span>}
      </div>
      {input}
      {error && (
        <p className="mt-2 text-xs font-bold text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </label>
  );
}
