import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  Menu,
  X,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMagazines } from "@/hooks/useMagazines";
import { getAdjacentMagazineIssues, getMagazineIssueBySlug } from "@/lib/revue-map";
import { IssueCover } from "@/components/revue/IssueCover";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image";

export default function RevueIssuePage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { data: reviews = [], isLoading } = useMagazines();

  const issue = useMemo(
    () => getMagazineIssueBySlug(slug, reviews, lang),
    [slug, reviews, lang],
  );
  const { newer, older } = useMemo(
    () => getAdjacentMagazineIssues(slug || "", reviews, lang),
    [slug, reviews, lang],
  );

  const [activeSection, setActiveSection] = useState("resume");
  const [isTocOpen, setIsTocOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
      setIsTocOpen(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return <Navigate to="/revue/numeros" replace />;
  }

  const pdfHref = issue.pdfUrl ? resolveImageUrl(issue.pdfUrl) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-[60] bg-background/80 backdrop-blur-md border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/revue/numeros"
              className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-border mx-2" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-1">
                {issue.monthLabel}
              </p>
              <h1 className="text-xs font-bold truncate max-w-[200px] leading-none">
                {issue.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTocOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Sommaire</span>
            </button>
            <Link to="/abonnement">
              <button
                type="button"
                className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                S'abonner
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-[380px_1fr] gap-16 items-start">
        <aside className="sticky top-28 space-y-10">
          <div className="flex justify-center lg:justify-start">
            <IssueCover issue={issue} size="lg" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">À propos</h3>
              <div className="flex gap-1">
                {newer && (
                  <Link
                    to={`/revue/numeros/${newer.slug}`}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                )}
                {older && (
                  <Link
                    to={`/revue/numeros/${older.slug}`}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-4 text-sm text-foreground/70 leading-relaxed italic">
              <p>&quot;{issue.tagline}&quot;</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Pagination</p>
                <p className="font-bold">{issue.pageCount} pages</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Edition</p>
                <p className="font-bold">N°{String(issue.number).padStart(2, "0")}</p>
              </div>
            </div>
            {pdfHref ? (
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl border-2 border-primary text-primary text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all group"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Télécharger (PDF)
              </a>
            ) : (
              <p className="text-xs text-muted-foreground text-center">PDF non disponible pour ce numéro.</p>
            )}
          </div>
        </aside>

        <main className="space-y-24 pb-20">
          {issue.sections.map((section, idx) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="flex items-baseline justify-between gap-4 mb-6 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-serif italic text-primary opacity-20">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-sm font-black uppercase tracking-[0.25em] text-primary">{section.label}</h2>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  {section.pages}
                </span>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">{section.title}</h3>
                <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">{section.excerpt}</p>

                {section.access !== "free" ? (
                  <div className="relative mt-12 p-8 md:p-12 rounded-3xl overflow-hidden bg-muted/30 border border-border/50 group">
                    <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
                      <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-bold mb-3">Contenu Premium</h4>
                      <p className="text-sm text-muted-foreground mb-8">
                        Cette section est réservée aux abonnés {section.access === "revue" ? "Revue + Digital" : "Digital"}.
                      </p>
                      <Link to="/abonnement" className="w-full sm:w-auto">
                        <button
                          type="button"
                          className="w-full sm:px-10 h-14 rounded-2xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                          Voir les formules
                        </button>
                      </Link>
                    </div>
                    <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none text-[8px] leading-tight overflow-hidden">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <p key={i}>
                          Sustainable development goals Africa strategy ESG finance carbon green bond RSE impact…
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-8 flex flex-col items-start gap-8">
                    <div className="space-y-4 text-foreground/70 leading-relaxed">
                      <p>Cette partie du numéro est en accès libre.</p>
                      <p>
                        Pour lire l’ensemble des analyses, graphiques et données, ouvrez le{" "}
                        {pdfHref ? (
                          <a href={pdfHref} className="font-bold text-primary underline" target="_blank" rel="noreferrer">
                            PDF complet
                          </a>
                        ) : (
                          "PDF complet"
                        )}
                        .
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-6 h-12 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all"
                      >
                        <Share2 className="w-4 h-4" /> Partager
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-6 h-12 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-success" /> Lu
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          ))}
        </main>
      </div>

      <AnimatePresence>
        {isTocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTocOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-sm bg-background shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black uppercase tracking-tighter">Sommaire</h2>
                <button type="button" onClick={() => setIsTocOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-muted">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-1">
                {issue.sections.map((section, idx) => (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground/70",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold opacity-30">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="text-xs font-black uppercase tracking-widest">{section.label}</span>
                    </div>
                    {section.access !== "free" && <Lock className="w-3.5 h-3.5 opacity-40" />}
                  </button>
                ))}
              </nav>
              <div className="mt-auto pt-10">
                <Link to="/abonnement">
                  <button
                    type="button"
                    className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                  >
                    S'abonner maintenant
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
