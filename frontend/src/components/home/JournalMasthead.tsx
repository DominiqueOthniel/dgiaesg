import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Masthead compacte « entête de journal » : nom du journal centré, fines règles
 * dorées, sous-titre éditorial, navigation horizontale.
 */
export function JournalMasthead() {
  const { t } = useTranslation();

  return (
    <header className="relative bg-[hsl(var(--surface-warm))] text-foreground">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-primary/40" />

      <div className="relative max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8 py-6 md:py-7">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="hidden md:block flex-1 h-px bg-primary/15" />
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-primary">
            {t("home.journal.masthead_kicker")}
          </p>
          <span className="hidden md:block flex-1 h-px bg-primary/15" />
        </div>
        <h1 className="font-serif text-center text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary leading-[1.02] px-1 break-words">
          {t("home.journal.masthead_title")}
        </h1>
        <p className="text-center font-serif italic text-sm md:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t("home.journal.masthead_tagline")}
        </p>

        <nav
          aria-label={t("home.journal.nav_aria")}
          className="mt-5 pt-4 border-t border-primary/15 grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-3 md:gap-x-7"
        >
          {[
            { to: "/news", label: t("home.journal.nav_journal") },
            { to: "/revue", label: t("home.journal.nav_revue") },
            { to: "/revue/numeros", label: t("home.journal.nav_archive") },
            { to: "/donnees", label: t("home.news_front.nav_data") },
            { to: "/multimedia", label: t("home.news_front.nav_video") },
            { to: "/events", label: t("home.news_front.nav_events") },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-center sm:text-left text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-foreground hover:text-primary transition-colors py-1 leading-snug"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
