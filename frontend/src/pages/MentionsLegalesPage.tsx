import { useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import {
  Building2,
  Scale,
  Server,
  ShieldCheck,
  FileText,
  Mail,
  Sparkles,
  Copyright,
} from "lucide-react";

const SECTIONS = [
  { id: "editeur", icon: Building2, title: "Éditeur du site",
    body: `Le site dgiaesg.org est édité par DGIA ESG, association à but non lucratif de droit marocain, dont le siège social est situé à Casablanca, Maroc. Numéro d'enregistrement : à compléter. Représentant légal : le Président de l'association.` },
  { id: "directeur", icon: Scale, title: "Directeur de la publication",
    body: `Le Directeur de la publication est le Président de DGIA ESG. La rédaction est placée sous la responsabilité éditoriale du Comité éditorial, indépendant des partenaires institutionnels et financiers de l'association.` },
  { id: "hebergement", icon: Server, title: "Hébergement",
    body: `Le site est hébergé par un prestataire technique conforme aux standards de sécurité internationaux. Les serveurs sont localisés en Union Européenne. Le détail du prestataire d'hébergement peut être communiqué sur demande à contact@dgiaesg.org.` },
  { id: "propriete", icon: Copyright, title: "Propriété intellectuelle",
    body: `L'ensemble des contenus présents sur ce site (textes, articles, indicateurs, classements, illustrations, logos, marques) sont la propriété exclusive de DGIA ESG ou de ses partenaires, et sont protégés par les lois en vigueur sur la propriété intellectuelle. Toute reproduction, totale ou partielle, sans autorisation préalable et écrite est strictement interdite.` },
  { id: "donnees", icon: ShieldCheck, title: "Protection des données personnelles",
    body: `DGIA ESG s'engage à respecter la confidentialité des données personnelles collectées via le site, conformément au Règlement Général sur la Protection des Données (RGPD) et aux législations africaines applicables. Pour exercer vos droits (accès, rectification, suppression), écrivez à : dpo@dgiaesg.org.` },
  { id: "responsabilite", icon: FileText, title: "Limitation de responsabilité",
    body: `Les informations publiées sur ce site sont fournies à titre informatif. Malgré tout le soin apporté à leur sélection et à leur vérification, DGIA ESG ne saurait être tenue responsable des erreurs, omissions ou de l'utilisation qui pourrait en être faite par des tiers. Les indicateurs ESG publiés ne constituent pas un conseil en investissement.` },
  { id: "contact", icon: Mail, title: "Contact",
    body: `Pour toute question relative aux présentes mentions légales, vous pouvez nous écrire à : contact@dgiaesg.org. Pour les questions liées à la protection des données : dpo@dgiaesg.org.` },
] as const;

/* ─── Aurora Borealis (gold-amber variant) ─────────────── */
function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/4 left-0 w-[80%] h-[140%] rounded-full bg-brand-gold/25 blur-[150px] animate-aurora-drift" />
      <div className="absolute -bottom-1/4 right-0 w-[60%] h-[110%] rounded-full bg-brand-emerald/20 blur-[140px] animate-aurora-wave" />
      <div className="absolute top-1/4 right-1/4 w-[45%] h-[60%] rounded-full bg-brand-gold/15 blur-[120px] animate-aurora-pulse" />
      <div aria-hidden className="absolute inset-0 opacity-40"
        style={{ backgroundImage: "linear-gradient(140deg, transparent 30%, hsl(45 100% 50% / 0.10) 50%, transparent 70%)", backgroundSize: "220% 220%" }} />
    </div>
  );
}

function TimelineSection({ section, index }: { section: (typeof SECTIONS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 }); // ✦ no `once` — replays each scroll
  const Icon = section.icon;

  return (
    <div ref={ref} id={section.id} className="relative pl-12 sm:pl-16 pb-14 last:pb-0">
      <motion.div
        initial={false}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute left-0 top-1 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/15 border-2 border-brand-gold flex items-center justify-center z-10"
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
      </motion.div>

      <motion.div
        initial={false}
        animate={inView ? { opacity: 1, x: 0, skewX: 0 } : { opacity: 0, x: 60, skewX: -4 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-black mt-2 mb-4">{section.title}</h2>
        <p className="text-base text-white/80 leading-[1.75] font-medium">{section.body}</p>
      </motion.div>
    </div>
  );
}

export default function MentionsLegalesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const lineHeight = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen text-white">
      {/* HERO + aurora */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-brand-deep via-brand-dark to-brand-forest">
        <HeroAurora />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">
                Document légal
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(20px)" }}
              animate={{ opacity: 1, letterSpacing: "normal", filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-6 flex flex-wrap"
            >
              {"Mentions légales".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                  style={{ transformOrigin: "bottom" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
              Informations relatives à l'éditeur, à l'hébergement et au cadre juridique du site
              dgiaesg.org. Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT — brand forest variant */}
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, hsl(160 32% 9%) 0%, hsl(160 28% 7%) 50%, hsl(160 32% 9%) 100%)",
        }}
      >
        {/* ✦ UNIQUE animated content background: vertical scanning beam + paper grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -inset-x-20 top-0 h-[60%] opacity-20 animate-shimmer-beam"
            style={{
              background: "linear-gradient(110deg, transparent 40%, hsl(45 100% 50% / 0.5) 50%, transparent 60%)",
            }}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-brand-gold/10 blur-[130px] animate-drift-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-1/4 right-0 w-[450px] h-[450px] rounded-full bg-brand-emerald/10 blur-[140px] animate-drift-slow"
          style={{ animationDelay: "-9s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, hsl(45 100% 50%) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, hsl(45 100% 50%) 0 1px, transparent 1px 4px)",
          }}
        />

        <section ref={containerRef} className="relative py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-white/10" />
              <motion.div
                style={{ scaleY: lineHeight, transformOrigin: "top" }}
                className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-gold via-brand-gold/60 to-transparent"
              />
              {SECTIONS.map((s, i) => (
                <TimelineSection key={s.id} section={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
