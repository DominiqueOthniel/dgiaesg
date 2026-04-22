export type ChatIntent =
  | "search_content"
  | "navigate"
  | "pricing_help"
  | "contact_help"
  | "fallback";

export interface NavigationTarget {
  route: string;
  key:
    | "labels"
    | "directory"
    | "news"
    | "kiosk"
    | "multimedia"
    | "pricing"
    | "events";
}

export interface ChatInterpretation {
  intent: ChatIntent;
  query: string;
  navigationTarget?: NavigationTarget;
}

const NAV_KEYWORDS: Array<{
  key: NavigationTarget["key"];
  route: string;
  patterns: RegExp[];
}> = [
  { key: "labels", route: "/labels", patterns: [/\blabel(s)?\b/i, /\bcertification(s)?\b/i] },
  { key: "directory", route: "/directory", patterns: [/\bannuaire\b/i, /\bdirectory\b/i, /\bentreprise(s)?\b/i] },
  { key: "news", route: "/news", patterns: [/\bnews\b/i, /\bactualit[eé]s?\b/i, /\bjournal\b/i] },
  { key: "kiosk", route: "/kiosk", patterns: [/\bkiosk\b/i, /\bkiosque\b/i, /\bpublication(s)?\b/i, /\brevue(s)?\b/i] },
  { key: "multimedia", route: "/multimedia", patterns: [/\bmultim[eé]dia\b/i, /\bvideo(s)?\b/i, /\bpodcast(s)?\b/i, /\bm[eé]diath[eè]que\b/i] },
  { key: "pricing", route: "/pricing", patterns: [/\bpricing\b/i, /\bprix\b/i, /\btarif(s)?\b/i, /\babonnement(s)?\b/i, /\bpremium\b/i] },
  { key: "events", route: "/events", patterns: [/\bevent(s)?\b/i, /\b[eé]v[eé]nement(s)?\b/i, /\bagenda\b/i] },
];

const SEARCH_HINTS = [
  /\bcherche(r)?\b/i,
  /\brecherche(r)?\b/i,
  /\btrouve(r)?\b/i,
  /\bfind\b/i,
  /\bsearch\b/i,
  /\bmontre\b/i,
  /\bshow\b/i,
];

const CONTACT_HINTS = [
  /\bcontact\b/i,
  /\bsupport\b/i,
  /\baide\b/i,
  /\bhelp\b/i,
  /\bemail\b/i,
  /\bt[eé]l[eé]phone\b/i,
  /\bhumain\b/i,
];

const PRICING_HINTS = [/\bpricing\b/i, /\bprix\b/i, /\btarif(s)?\b/i, /\bc[oô]ut\b/i, /\babonnement(s)?\b/i, /\bpremium\b/i];

function normalizeQuery(input: string): string {
  return input
    .replace(/\b(cherche(r)?|recherche(r)?|trouve(r)?|find|search|montre|show)\b/gi, "")
    .replace(/\b(sur|dans|pour|les|des|de|du|la|le|un|une)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findNavigationTarget(input: string): NavigationTarget | undefined {
  for (const item of NAV_KEYWORDS) {
    if (item.patterns.some((re) => re.test(input))) {
      return { key: item.key, route: item.route };
    }
  }
  return undefined;
}

export function interpretUserMessage(rawInput: string): ChatInterpretation {
  const input = rawInput.trim();
  const normalized = normalizeQuery(input);
  const navigationTarget = findNavigationTarget(input);

  if (CONTACT_HINTS.some((re) => re.test(input))) {
    return { intent: "contact_help", query: normalized || input, navigationTarget };
  }

  if (PRICING_HINTS.some((re) => re.test(input))) {
    return { intent: "pricing_help", query: normalized || input, navigationTarget };
  }

  if (navigationTarget && !SEARCH_HINTS.some((re) => re.test(input))) {
    return { intent: "navigate", query: normalized || input, navigationTarget };
  }

  if (SEARCH_HINTS.some((re) => re.test(input)) || input.length >= 6) {
    return { intent: "search_content", query: normalized || input, navigationTarget };
  }

  return { intent: "fallback", query: normalized || input, navigationTarget };
}

