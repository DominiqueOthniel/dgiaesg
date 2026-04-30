import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Filter,
  LayoutGrid,
  Newspaper,
  Search,
  Star,
  X,
} from "lucide-react";
import { ControlsBar } from "@/components/ui/ControlsBar";
import { cn } from "@/lib/utils";

export type HomeSource = "all" | "journal" | "revue";

export type HomeFormat =
  | "all"
  | "breve"
  | "analyse"
  | "enquete"
  | "interview"
  | "communique";

export type HomeTheme =
  | "all"
  | "finance-durable"
  | "mines-energie"
  | "climat"
  | "social"
  | "infrastructure"
  | "agro-industrie";

export interface HomeFilterState {
  source: HomeSource;
  search: string;
  format: HomeFormat;
  theme: HomeTheme;
  featuredOnly: boolean;
}

export const DEFAULT_HOME_FILTERS: HomeFilterState = {
  source: "all",
  search: "",
  format: "all",
  theme: "all",
  featuredOnly: false,
};

const FORMAT_PILL_ACTIVE =
  "bg-primary text-primary-foreground border-primary shadow-md";

const FORMAT_PILL_IDLE =
  "bg-[hsl(var(--primary)/0.04)] border-primary/10 text-foreground/80 hover:bg-white hover:border-[hsl(var(--brand-emerald)/0.4)] hover:text-primary hover:shadow-sm";

const THEME_PILL_ACTIVE =
  "bg-[hsl(var(--brand-gold)/0.18)] border-[hsl(var(--brand-gold)/0.6)] text-foreground";

/** Même lecture visuelle que les pastilles Format (bordure discrète sur tout l’état inactif). */
const THEME_PILL_IDLE = FORMAT_PILL_IDLE;

/**
 * Filtres unifiés Journal + Revue, dans le style ControlsBar utilisé partout
 * sur le site (glass card + or + chips primary/gold).
 */
export function HomeFilters({
  state,
  onChange,
  newsCount,
  newsFiltered,
  revueCount,
  revueFiltered,
}: {
  state: HomeFilterState;
  onChange: (next: HomeFilterState) => void;
  newsCount: number;
  newsFiltered: number;
  revueCount: number;
  revueFiltered: number;
}) {
  const { t } = useTranslation();

  const SOURCES: { value: HomeSource; label: string; icon: any }[] = [
    {
      value: "all",
      label: t("home.news_front.source_all", "Tout"),
      icon: LayoutGrid,
    },
    {
      value: "journal",
      label: t("home.news_front.source_journal", "Journal"),
      icon: Newspaper,
    },
    {
      value: "revue",
      label: t("home.news_front.source_revue", "Revue"),
      icon: BookOpen,
    },
  ];

  const FORMATS: { value: HomeFormat; label: string }[] = [
    { value: "all", label: t("home.news_front.filter_all", "Tout") },
    { value: "breve", label: t("news.format.breve", "Brèves") },
    { value: "analyse", label: t("news.format.analyse", "Analyses") },
    { value: "enquete", label: t("news.format.enquete", "Enquêtes") },
    { value: "interview", label: t("news.format.interview", "Interviews") },
    { value: "communique", label: t("news.format.communique", "Communiqués") },
  ];

  const THEMES: { value: HomeTheme; label: string }[] = [
    { value: "all", label: t("news.themes.all", "Tous les thèmes") },
    { value: "finance-durable", label: t("sectors.finance", "Finance") },
    { value: "mines-energie", label: t("sectors.energy", "Énergie") },
    { value: "climat", label: t("home.news_front.theme_climate", "Climat") },
    { value: "social", label: t("home.news_front.theme_social", "Social") },
    {
      value: "infrastructure",
      label: t("home.news_front.theme_infra", "Infrastructure"),
    },
    { value: "agro-industrie", label: t("home.news_front.theme_agro", "Agro") },
  ];

  const set = (patch: Partial<HomeFilterState>) =>
    onChange({ ...state, ...patch });

  const isActive =
    state.format !== "all" ||
    state.theme !== "all" ||
    state.search.trim() !== "" ||
    state.featuredOnly ||
    state.source !== "all";

  const showJournalFilters =
    state.source === "all" || state.source === "journal";
  const showRevueFilters = state.source === "all" || state.source === "revue";

  return (
    <div className="sticky top-0 z-30 w-full max-w-[100vw] min-w-0 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="max-w-7xl mx-auto min-w-0 px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <ControlsBar
          footer={
            <>
              <div className="flex min-w-0 w-full items-center gap-2.5 flex-wrap sm:flex-1">
                <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-primary/20 bg-primary/10 text-xs font-black tabular-nums text-primary">
                  <Newspaper className="w-3 h-3" />
                  {newsFiltered}/{newsCount}
                </span>
                <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-[hsl(var(--brand-gold)/0.5)] bg-[hsl(var(--brand-gold)/0.10)] text-xs font-black tabular-nums text-[hsl(var(--brand-gold-dark))]">
                  <BookOpen className="w-3 h-3" />
                  {revueFiltered}/{revueCount}
                </span>

                {isActive && (
                  <div className="flex items-center gap-1.5 flex-wrap pl-1.5 border-l border-border/50">
                    <Filter className="w-3 h-3 text-muted-foreground" />
                    {state.search && (
                      <ActiveChip
                        label={`"${
                          state.search.length > 16
                            ? state.search.slice(0, 16) + "…"
                            : state.search
                        }"`}
                        onClear={() => set({ search: "" })}
                      />
                    )}
                    {state.source !== "all" && (
                      <ActiveChip
                        label={
                          SOURCES.find((s) => s.value === state.source)?.label
                        }
                        onClear={() => set({ source: "all" })}
                      />
                    )}
                    {state.format !== "all" && (
                      <ActiveChip
                        label={
                          FORMATS.find((f) => f.value === state.format)?.label
                        }
                        onClear={() => set({ format: "all" })}
                      />
                    )}
                    {state.theme !== "all" && (
                      <ActiveChip
                        label={
                          THEMES.find((th) => th.value === state.theme)?.label
                        }
                        onClear={() => set({ theme: "all" })}
                      />
                    )}
                    {state.featuredOnly && (
                      <ActiveChip
                        label={t("home.news_front.featured_only", "À la une")}
                        onClear={() => set({ featuredOnly: false })}
                      />
                    )}
                  </div>
                )}
              </div>

              {isActive && (
                <button
                  type="button"
                  onClick={() => onChange(DEFAULT_HOME_FILTERS)}
                  className="inline-flex items-center gap-1.5 text-[10px] text-primary font-black uppercase tracking-[0.18em] hover:underline sm:ml-auto w-full justify-center sm:w-auto sm:justify-start pt-1 sm:pt-0 border-t border-border/40 sm:border-0 mt-1 sm:mt-0"
                >
                  <X className="w-3 h-3" />
                  {t("common.reset", "Réinitialiser")}
                </button>
              )}
            </>
          }
        >
          {/* Search */}
          <div className="relative w-full min-w-0 max-w-full shrink-0 group lg:max-w-[26rem] xl:max-w-[30rem]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-[hsl(var(--brand-gold-dark))] transition-colors" />
            </div>
            <input
              value={state.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder={t(
                "home.news_front.search_placeholder_combined",
                "Rechercher dans le journal & la revue…",
              )}
              className="w-full min-w-0 h-11 sm:h-12 pl-10 sm:pl-11 pr-9 sm:pr-10 rounded-xl sm:rounded-2xl text-[13px] sm:text-sm bg-white/80 border border-primary/10 shadow-inner placeholder:text-muted-foreground/60 focus:outline-none focus:bg-white focus:border-brand-emerald/40 focus:ring-4 focus:ring-brand-emerald/5 transition-all"
            />
            {state.search && (
              <button
                type="button"
                onClick={() => set({ search: "" })}
                aria-label={t("common.clear_search", "Effacer la recherche")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Source + featured — retour à la ligne sur petit écran ; défilement à partir de md */}
          <div className="flex min-w-0 w-full max-w-full flex-wrap items-center justify-start gap-2 px-0.5 py-1 sm:gap-2.5 md:flex-nowrap md:overflow-x-auto md:scrollbar-hide md:overscroll-x-contain md:touch-pan-x lg:flex-1 lg:justify-end lg:px-0">
            {SOURCES.map((s) => {
              const Icon = s.icon;
              const active = state.source === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set({ source: s.value })}
                  className={cn(
                    "inline-flex items-center gap-1.5 h-10 sm:h-11 px-3 sm:px-4 rounded-full border text-[11px] sm:text-xs font-bold transition-all md:shrink-0 md:whitespace-nowrap md:snap-start",
                    active
                      ? "border-[hsl(var(--brand-gold)/0.5)] bg-[hsl(var(--brand-gold)/0.08)] text-foreground shadow-sm"
                      : "bg-white/80 border-primary/10 text-muted-foreground hover:bg-white hover:text-primary hover:border-brand-emerald/40 hover:shadow-md",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      active
                        ? "text-[hsl(var(--brand-gold-dark))]"
                        : "text-muted-foreground",
                    )}
                  />
                  {s.label}
                </button>
              );
            })}
            {showRevueFilters && (
              <button
                type="button"
                onClick={() => set({ featuredOnly: !state.featuredOnly })}
                className={cn(
                  "inline-flex items-center gap-1.5 h-10 sm:h-11 px-3 sm:px-4 rounded-full border text-[11px] sm:text-xs font-bold transition-all md:shrink-0 md:whitespace-nowrap md:snap-start",
                  state.featuredOnly
                    ? "border-[hsl(var(--brand-gold)/0.6)] bg-[hsl(var(--brand-gold)/0.18)] text-foreground shadow-sm"
                    : "bg-white/80 border-primary/10 text-muted-foreground hover:bg-white hover:text-primary hover:border-brand-emerald/40 hover:shadow-md",
                )}
              >
                <Star
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    state.featuredOnly
                      ? "text-[hsl(var(--brand-gold-dark))] fill-current"
                      : "text-muted-foreground",
                  )}
                />
                {t("home.news_front.featured_only", "À la une")}
              </button>
            )}
          </div>
        </ControlsBar>

        {/* Format & Thèmes — affichés uniquement si journal visible */}
        {showJournalFilters && (
          <div className="mt-3 space-y-3 sm:space-y-2">
            <div
              aria-label={t("home.news_front.filter_format", "Format")}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 min-w-0"
            >
              <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground sm:pt-0.5 sm:w-auto">
                {t("home.news_front.filter_format", "Format")}
                <span className="hidden sm:inline"> :</span>
              </span>
              <div className="flex flex-wrap gap-2 min-w-0 w-full md:flex-nowrap md:gap-2 md:overflow-x-auto md:overscroll-x-contain md:pb-1 md:scrollbar-hide md:-mx-1 md:px-1 md:touch-pan-x md:snap-x">
                {FORMATS.map((f) => {
                  const active = state.format === f.value;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => set({ format: f.value })}
                      className={cn(
                        "min-h-9 px-3 py-2 sm:min-h-10 sm:px-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.14em] border transition-all text-center md:shrink-0 md:whitespace-nowrap md:snap-start md:py-0 md:flex md:items-center leading-tight max-w-[100%]",
                        active ? FORMAT_PILL_ACTIVE : FORMAT_PILL_IDLE,
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              aria-label={t("home.news_front.filter_theme", "Thématique")}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 min-w-0"
            >
              <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground sm:pt-0.5">
                {t("home.news_front.filter_theme", "Thèmes")}
                <span className="hidden sm:inline"> :</span>
              </span>
              <div className="flex flex-wrap gap-2 min-w-0 w-full md:flex-nowrap md:gap-2 md:overflow-x-auto md:overscroll-x-contain md:pb-1 md:scrollbar-hide md:-mx-1 md:px-1 md:touch-pan-x md:snap-x">
                {THEMES.map((th) => {
                  const active = state.theme === th.value;
                  return (
                    <button
                      key={th.value}
                      type="button"
                      onClick={() => set({ theme: th.value })}
                      className={cn(
                        "min-h-9 px-3 py-2 sm:px-3 rounded-full text-[10px] sm:text-[11px] font-bold transition-all border text-center md:shrink-0 md:whitespace-nowrap md:snap-start md:py-0 md:min-h-8 md:flex md:items-center leading-tight max-w-[100%]",
                        active ? THEME_PILL_ACTIVE : THEME_PILL_IDLE,
                      )}
                    >
                      {th.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveChip({
  label,
  onClear,
}: {
  label?: string;
  onClear: () => void;
}) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-[hsl(var(--brand-gold)/0.12)] border border-[hsl(var(--brand-gold)/0.3)] text-[10px] font-bold text-foreground">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="hover:text-destructive"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

/**
 * Filtre côté client : retourne les news qui matchent l'état.
 */
export function applyHomeFilters(
  news: any[],
  state: HomeFilterState,
  lang: string,
  getLocalized: (val: any, lang: string) => string,
): any[] {
  if (state.source === "revue") return [];
  let list = [...news];
  if (state.format !== "all") {
    list = list.filter((n: any) => n.format === state.format);
  }
  if (state.theme !== "all") {
    list = list.filter((n: any) => {
      const t = (n.category || n.theme || n.sector || "")
        .toString()
        .toLowerCase();
      return t.includes(state.theme.split("-")[0]);
    });
  }
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    list = list.filter((n: any) => {
      const title = getLocalized(n.title, lang).toLowerCase();
      const excerpt = getLocalized(n.excerpt, lang).toLowerCase();
      return title.includes(q) || excerpt.includes(q);
    });
  }
  return list;
}

/**
 * Filtre côté client pour les magazines (revue) : recherche + à la une.
 */
export function applyMagazineFilters(
  magazines: any[],
  state: HomeFilterState,
  lang: string,
  getLocalized: (val: any, lang: string) => string,
): any[] {
  if (state.source === "journal") return [];
  let list = [...magazines];
  if (state.featuredOnly) {
    list = list.filter((m: any) => m.featured);
  }
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    list = list.filter((m: any) => {
      const title = getLocalized(m.title, lang).toLowerCase();
      return title.includes(q);
    });
  }
  return list;
}
