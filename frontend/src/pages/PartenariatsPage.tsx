import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import {
  Megaphone,
  Handshake,
  TrendingUp,
  Globe2,
  FileText,
  Sparkles,
  ArrowRight,
  Mail,
  Download,
  CheckCircle2,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */

const PARTNER_FORMATS = [
  {
    icon: Megaphone,
    title: "Display éditorial",
    desc: "Formats premium intégrés à la ligne éditoriale, ciblage par secteur ESG et géographie africaine.",
    metric: "48 000+ lecteurs/mois",
  },
  {
    icon: FileText,
    title: "Contenus sponsorisés",
    desc: "Tribunes signées, études de cas, livres blancs co-produits avec notre rédaction certifiée.",
    metric: "Audience qualifiée",
  },
  {
    icon: Handshake,
    title: "Partenariats institutionnels",
    desc: "Co-construction d'indicateurs, accès API, présence sur la Revue ESG Africa trimestrielle.",
    metric: "12 institutions",
  },
  {
    icon: Globe2,
    title: "Événementiel & conférences",
    desc: "Sponsoring des forums DGIA ESG, sessions de certification, masterclasses sectorielles.",
    metric: "55 pays couverts",
  },
] as const;

const PARTNER_BENEFITS = [
  "Visibilité auprès de décideurs ESG africains",
  "Méthodologie indépendante et auditable",
  "Multi-canal : web, revue, événements",
  "Reporting de performance détaillé",
  "Accompagnement éditorial dédié",
  "Tarifs adaptés aux ONG et institutions",
] as const;

/* ─── Aurora Borealis layer (gold/emerald variant) ─────── */

function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/3 -left-1/4 w-[80%] h-[140%] rounded-full bg-brand-gold/25 blur-[140px] animate-aurora-drift" />
      <div className="absolute -bottom-1/3 -right-1/4 w-[80%] h-[140%] rounded-full bg-brand-emerald/30 blur-[160px] animate-aurora-wave" />
      <div className="absolute top-1/4 left-1/3 w-[40%] h-[60%] rounded-full bg-brand-gold/15 blur-[100px] animate-aurora-pulse" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(120deg, transparent 35%, hsl(45 100% 50% / 0.08) 50%, transparent 65%)",
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  );
}

/* ─── Magnetic 3D card ─────────────────────────────────── */

function MagneticCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || reduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const reset = () => { x.set(0); y.set(0); };

  // ✦ Repeating entrance: iris reveal — fires every time card scrolls in
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.6, rotate: index % 2 === 0 ? -8 : 8, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative"
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */

export default function PartenariatsPage() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const beamX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="min-h-screen text-white">
      {/* Scroll indicator: gold horizontal beam at top */}
      <motion.div
        style={{ scaleX: beamX, transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-gradient-to-r from-brand-gold via-brand-gold to-brand-emerald shadow-[0_0_12px_rgba(255,193,7,0.7)]"
      />

      {/* HERO — same brand gradient as header/footer + aurora borealis */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-brand-deep via-brand-dark to-brand-forest">
        <HeroAurora />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                Publicité & Partenariats
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-8">
              Construisez l'avenir <em className="text-brand-gold">ESG africain</em> avec nous.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed font-medium max-w-2xl">
              DGIA ESG est la référence panafricaine de l'analyse ESG indépendante. Nos partenaires
              accèdent à une audience qualifiée de décideurs, investisseurs et institutions sur 55 pays.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#kit-media"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-gold text-brand-dark font-black text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand-gold/30"
              >
                <Download className="w-4 h-4" /> Télécharger le kit média
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/25 text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                <Mail className="w-4 h-4" /> Parler à l'équipe partenariats
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTENT — brand-aligned: deeper forest tone, distinct from hero */}
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--brand-dark)) 0%, hsl(160 35% 9%) 50%, hsl(var(--brand-dark)) 100%)",
        }}
      >
        {/* ✦ UNIQUE animated content background: flowing emerald ribbon + drifting orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 animate-ribbon-flow"
          style={{
            background:
              "linear-gradient(110deg, transparent 30%, hsl(160 84% 39% / 0.08) 50%, transparent 70%)",
            backgroundSize: "300% 300%",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-emerald/10 blur-[120px] animate-drift-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-gold/8 blur-[140px] animate-drift-slow"
          style={{ animationDelay: "-8s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(45 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(45 100% 50%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Partner formats */}
        <section className="relative py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mb-4"
            >
              Nos formats partenaires
            </motion.h2>
            <p className="text-base text-white/70 mb-16 max-w-2xl">
              Quatre formats complémentaires pour atteindre votre audience cible avec rigueur éditoriale.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {PARTNER_FORMATS.map((format, i) => {
                const Icon = format.icon;
                return (
                  <MagneticCard key={format.title} index={i}>
                    <div
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      className="relative h-full p-8 md:p-10 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-brand-gold/40 hover:bg-white/[0.06]"
                    >
                      <div className="relative flex items-start gap-5 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-7 h-7 text-brand-gold" />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl md:text-2xl font-black mb-1">
                            {format.title}
                          </h3>
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-gold">
                            {format.metric}
                          </span>
                        </div>
                      </div>
                      <p className="relative text-sm md:text-base text-white/75 leading-relaxed">
                        {format.desc}
                      </p>
                      <motion.div
                        className="relative mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-brand-gold"
                        animate={{ x: hovered === i ? 6 : 0 }}
                      >
                        En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                      </motion.div>
                    </div>
                  </MagneticCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section 
          className="relative py-24 border-t border-brand-primary/10 animate-fluid-mixture"
          style={{
            background: "linear-gradient(135deg, hsl(160 40% 98%) 0%, hsl(160 60% 95%) 50%, hsl(160 40% 98%) 100%)",
            backgroundSize: "400% 400%"
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.4 }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">
                  Pourquoi nous choisir
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-black mt-4 mb-6 text-brand-dark">
                  Une audience que <em className="text-brand-primary">personne d'autre</em> ne touche.
                </h2>
                <p className="text-base text-brand-dark/75 leading-relaxed">
                  Notre lectorat est composé à 78% de cadres dirigeants, investisseurs ESG, hauts
                  fonctionnaires et chercheurs sur le continent africain.
                </p>
              </motion.div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PARTNER_BENEFITS.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.4 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/60 border border-brand-primary/10 shadow-sm backdrop-blur-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-bold text-brand-dark/90">{b}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="kit-media" className="relative py-24 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <TrendingUp className="w-12 h-12 text-brand-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-5xl font-black mb-6">
              Prêt à construire ensemble ?
            </h2>
            <p className="text-base md:text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Notre équipe partenariats vous répond sous 48h ouvrées avec une proposition
              personnalisée et le kit média complet.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-brand-gold text-brand-dark font-black text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand-gold/40"
            >
              Démarrer la conversation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
