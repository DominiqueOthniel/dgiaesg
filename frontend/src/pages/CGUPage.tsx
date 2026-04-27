import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ChevronDown,
  ScrollText,
  UserCheck,
  Lock,
  Ban,
  Gavel,
  RefreshCw,
  Mail,
  Sparkles,
} from "lucide-react";

const ARTICLES = [
  { id: "art-1", icon: ScrollText, title: "Article 1 — Objet",
    body: `Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation du site dgiaesg.org (ci-après « le Site »), édité par DGIA ESG. Toute utilisation du Site implique l'acceptation pleine et entière des présentes CGU.` },
  { id: "art-2", icon: UserCheck, title: "Article 2 — Accès au site",
    body: `Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Certaines fonctionnalités (espace personnel, accès Premium, dépôt de candidatures à la certification) nécessitent la création d'un compte. L'utilisateur est responsable de la confidentialité de ses identifiants. DGIA ESG se réserve le droit de suspendre ou de fermer un compte en cas d'usage non conforme aux présentes CGU.` },
  { id: "art-3", icon: Lock, title: "Article 3 — Données personnelles",
    body: `Les données personnelles collectées sont traitées conformément à notre politique de confidentialité, dans le respect du RGPD et des législations africaines applicables. L'utilisateur dispose d'un droit d'accès, de rectification, de portabilité et de suppression de ses données, qu'il peut exercer en écrivant à dpo@dgiaesg.org.` },
  { id: "art-4", icon: Ban, title: "Article 4 — Comportements interdits",
    body: `Sont notamment interdits : la diffusion de contenus illicites, diffamatoires ou portant atteinte aux droits de tiers ; toute tentative de contourner les mesures de sécurité du Site ; l'extraction massive automatisée de données (scraping) sans autorisation ; l'usurpation d'identité ; la publication de fausses informations ESG. Tout manquement pourra entraîner la suspension immédiate du compte et des poursuites.` },
  { id: "art-5", icon: Gavel, title: "Article 5 — Propriété intellectuelle",
    body: `Tous les éléments du Site (méthodologies, indicateurs, classements, articles, illustrations, marques) sont protégés par les lois sur la propriété intellectuelle. Toute reproduction ou rediffusion sans autorisation écrite préalable de DGIA ESG est strictement interdite. Les contenus libres de réutilisation sont signalés explicitement (mention « Reproduction autorisée » + licence).` },
  { id: "art-6", icon: RefreshCw, title: "Article 6 — Modification des CGU",
    body: `DGIA ESG se réserve le droit de modifier les présentes CGU à tout moment afin de les adapter aux évolutions du Site et de la législation. Les utilisateurs seront informés des modifications substantielles par une notification sur le Site. La poursuite de l'utilisation après notification vaut acceptation des nouvelles CGU.` },
  { id: "art-7", icon: Mail, title: "Article 7 — Droit applicable et contact",
    body: `Les présentes CGU sont régies par le droit marocain. Tout litige relatif à leur interprétation ou exécution relèvera de la compétence exclusive des tribunaux de Casablanca, sauf disposition légale contraire. Pour toute question : contact@dgiaesg.org.` },
] as const;

/* ─── Aurora Borealis (deep emerald variant) ───────────── */
function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/3 -right-1/4 w-[80%] h-[140%] rounded-full bg-brand-emerald/30 blur-[160px] animate-aurora-wave" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[70%] h-[120%] rounded-full bg-brand-gold/18 blur-[150px] animate-aurora-drift" />
      <div className="absolute top-1/3 left-1/2 w-[40%] h-[60%] rounded-full bg-brand-emerald/15 blur-[110px] animate-aurora-pulse" />
      <div aria-hidden className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "linear-gradient(60deg, transparent 30%, hsl(160 84% 39% / 0.10) 50%, transparent 70%)", backgroundSize: "240% 240%" }} />
    </div>
  );
}

export default function CGUPage() {
  const [open, setOpen] = useState<string | null>("art-1");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen text-white">
      {/* Reading bar */}
      <motion.div
        style={{ scaleX: progress, transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-gradient-to-r from-brand-emerald via-brand-gold to-brand-emerald shadow-[0_0_18px_rgba(255,193,7,0.65)]"
      />

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
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-6 h1-golden-glow"
            >
              Conditions Générales d'Utilisation
            </motion.h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
              Cadre contractuel régissant l'utilisation du site dgiaesg.org et de ses services.
              Version en vigueur au {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT — brand-aligned dark forest */}
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, hsl(160 28% 8%) 0%, hsl(165 32% 6%) 50%, hsl(160 28% 8%) 100%)",
        }}
      >
        {/* ✦ UNIQUE animated content background: dual diagonal aurora ribbons */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50 animate-ribbon-flow"
          style={{
            background:
              "linear-gradient(125deg, transparent 25%, hsl(160 84% 39% / 0.10) 50%, transparent 75%)",
            backgroundSize: "300% 300%",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 animate-ribbon-flow"
          style={{
            background:
              "linear-gradient(-125deg, transparent 30%, hsl(45 100% 50% / 0.07) 50%, transparent 70%)",
            backgroundSize: "300% 300%",
            animationDelay: "-9s",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-emerald/10 blur-[140px] animate-drift-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-brand-gold/8 blur-[130px] animate-drift-slow"
          style={{ animationDelay: "-10s" }}
        />

        {/* Quick TOC */}
        <section className="relative border-b border-white/10 bg-black/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-2">
              {ARTICLES.map((a, i) => (
                <a key={a.id} href={`#${a.id}`} onClick={() => setOpen(a.id)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-brand-gold/40">
                  Art. {i + 1}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Accordion — Flagrant 'living' animated background */}
        <section 
          className="relative py-16 md:py-24 overflow-hidden"
          style={{
            background: "linear-gradient(180deg, hsl(160 40% 98%) 0%, hsl(210 40% 98%) 50%, hsl(160 40% 98%) 100%)",
          }}
        >
          {/* Amazing living background effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1.1, 1],
                x: [-150, 250, -80],
                y: [-100, 150, -180],
                rotate: [0, 120, 240, 360]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-primary/25 blur-[180px] rounded-full mix-blend-multiply opacity-60"
            />
            <motion.div
              animate={{ 
                scale: [1.3, 0.9, 1.2, 1],
                x: [250, -150, 120],
                y: [180, -80, 250],
                rotate: [360, 240, 120, 0]
              }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-brand-gold/25 blur-[180px] rounded-full mix-blend-multiply opacity-60"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 0.8, 1],
                x: [-220, 120, 0],
                y: [280, -280, 120],
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-blue-400/15 blur-[160px] rounded-full mix-blend-multiply opacity-50"
            />
            
            {/* Shimmering glass lines */}
            <div 
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(45deg, transparent 45%, hsl(var(--brand-gold)) 50%, transparent 55%)`,
                backgroundSize: "200% 200%",
                animation: "shimmer-beam 8s linear infinite"
              }}
            />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-3">
              {ARTICLES.map((article, i) => {
                const Icon = article.icon;
                const isOpen = open === article.id;
                return (
                  <motion.div
                    key={article.id}
                    id={article.id}
                    /* ✦ Repeating: 3D flip-in fires every scroll */
                    initial={{ opacity: 0, rotateX: -85, y: 40, transformPerspective: 1000 }}
                    whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ delay: (i % 4) * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "top" }}
                    className="rounded-2xl border border-brand-primary/10 bg-white/70 overflow-hidden hover:border-brand-gold/60 transition-all shadow-lg shadow-brand-primary/5 backdrop-blur-md group"
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : article.id)}
                      className="w-full flex items-center gap-4 p-5 sm:p-6 text-left relative overflow-hidden"
                      aria-expanded={isOpen}
                    >
                      {/* Golden lightning effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                      </div>

                      <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0 relative group-hover:border-brand-gold group-hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all">
                        <Icon className="w-5 h-5 text-brand-primary group-hover:text-brand-gold transition-colors" />
                        <div className="absolute inset-0 rounded-xl border border-brand-gold opacity-0 group-hover:opacity-100 animate-ping pointer-events-none" />
                      </div>
                      <h2 className="flex-1 font-serif text-lg sm:text-xl md:text-2xl font-black text-brand-dark group-hover:text-brand-gold transition-colors">
                        {article.title}
                      </h2>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-9 h-9 rounded-full bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:border-brand-gold transition-all"
                      >
                        <ChevronDown className="w-4 h-4 text-brand-primary/70 group-hover:text-brand-gold transition-colors" />
                      </motion.div>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pl-[calc(2.75rem+1rem+1rem)] sm:pl-[calc(2.75rem+1rem+1.5rem)]">
                        <p className="text-base text-brand-dark/80 leading-[1.75] font-medium">
                          {article.body}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
