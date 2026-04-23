import { useMemo, useRef, useState, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { cn, getLocalized } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { searchEntities } from "@/services/SearchService";
import { interpretUserMessage, type ChatIntent } from "@/services/chatbotOrchestrator";

const suggestions = ["Chat with me", "Besoin d'aide ?"];

type ChatRole = "user" | "assistant";
type ChatActionType = "route" | "quick";

interface ChatAction {
  id: string;
  label: string;
  type: ChatActionType;
  value: string;
}

interface ChatResultItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  intent?: ChatIntent;
  actions?: ChatAction[];
  results?: ChatResultItem[];
}

interface ChatTelemetry {
  totalMessages: number;
  fallbackCount: number;
  searchNoResultCount: number;
  intents: Record<string, number>;
  actionClicks: number;
}

const CHAT_HISTORY_KEY = "coop_chatbot_history_v1";
const CHAT_TELEMETRY_KEY = "coop_chatbot_telemetry_v1";
const COOLDOWN_MS = 900;

const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const makeAction = (label: string, type: ChatActionType, value: string): ChatAction => ({
  id: makeId(),
  label,
  type,
  value,
});

export const ChatbotWidget = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSentAt, setLastSentAt] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialAssistantMessage = useMemo<ChatMessage>(
    () => ({
      id: makeId(),
      role: "assistant",
      text: t("chatbot.greeting"),
      actions: [
        makeAction(t("chatbot.quick.find_labels"), "quick", t("chatbot.quick.find_labels_prompt")),
        makeAction(t("chatbot.quick.latest_news"), "quick", t("chatbot.quick.latest_news_prompt")),
        makeAction(t("chatbot.quick.show_pricing"), "route", "/pricing"),
      ],
    }),
    [t]
  );

  const onEnter = () => {
    setHovered(true);
    setTipIdx((i) => (i + 1) % suggestions.length);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!raw) {
        setMessages([initialAssistantMessage]);
        return;
      }
      const parsed = JSON.parse(raw) as ChatMessage[];
      setMessages(Array.isArray(parsed) && parsed.length ? parsed : [initialAssistantMessage]);
    } catch {
      setMessages([initialAssistantMessage]);
    }
  }, [initialAssistantMessage]);

  useEffect(() => {
    if (!messages.length) return;
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages]);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  const trackTelemetry = (patch: Partial<ChatTelemetry>) => {
    const base: ChatTelemetry = {
      totalMessages: 0,
      fallbackCount: 0,
      searchNoResultCount: 0,
      intents: {},
      actionClicks: 0,
    };

    try {
      const prevRaw = localStorage.getItem(CHAT_TELEMETRY_KEY);
      const prev = prevRaw ? (JSON.parse(prevRaw) as ChatTelemetry) : base;
      const mergedIntents = { ...prev.intents };
      for (const [intent, value] of Object.entries(patch.intents || {})) {
        mergedIntents[intent] = (mergedIntents[intent] || 0) + value;
      }

      const merged: ChatTelemetry = {
        totalMessages: prev.totalMessages + (patch.totalMessages || 0),
        fallbackCount: prev.fallbackCount + (patch.fallbackCount || 0),
        searchNoResultCount: prev.searchNoResultCount + (patch.searchNoResultCount || 0),
        actionClicks: prev.actionClicks + (patch.actionClicks || 0),
        intents: mergedIntents,
      };
      localStorage.setItem(CHAT_TELEMETRY_KEY, JSON.stringify(merged));
    } catch {
      // no-op telemetry fallback
    }
  };

  const localize = (value: any) => getLocalized(value, i18n.language);

  const formatSearchResults = (results: Awaited<ReturnType<typeof searchEntities>>): ChatResultItem[] => {
    const labelResults = (results.labels || []).slice(0, 2).map((item: any) => ({
      id: item._id,
      title: localize(item.name),
      subtitle: t("chatbot.kinds.label"),
      href: `/labels/${item._id}`,
    }));

    const companyResults = (results.companies || []).slice(0, 2).map((item: any) => ({
      id: item._id,
      title: localize(item.name),
      subtitle: t("chatbot.kinds.company"),
      href: `/directory/${item._id}`,
    }));

    const newsResults = (results.news || []).slice(0, 2).map((item: any) => ({
      id: item._id,
      title: localize(item.title),
      subtitle: t("chatbot.kinds.news"),
      href: `/news/${item.slug}`,
    }));

    const multimediaResults = (results.multimedia || []).slice(0, 2).map((item: any) => ({
      id: item._id,
      title: localize(item.title),
      subtitle: t("chatbot.kinds.multimedia"),
      href: `/multimedia`,
    }));

    return [...labelResults, ...companyResults, ...newsResults, ...multimediaResults].slice(0, 8);
  };

  const pushAssistantMessage = (payload: Omit<ChatMessage, "id" | "role">) => {
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: "assistant",
        ...payload,
      },
    ]);
  };

  const handleAction = (action: ChatAction) => {
    trackTelemetry({ actionClicks: 1 });
    if (action.type === "route") {
      navigate(action.value);
      setOpen(false);
      return;
    }
    void handleSend(action.value);
  };

  const handleSend = async (forcedInput?: string) => {
    const content = (forcedInput ?? input).trim();
    if (!content || typing) return;

    const now = Date.now();
    if (now - lastSentAt < COOLDOWN_MS) {
      pushAssistantMessage({
        text: t("chatbot.cooldown"),
        intent: "fallback",
      });
      return;
    }

    setLastSentAt(now);
    setError(null);
    setTyping(true);

    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: "user",
        text: content,
      },
    ]);
    setInput("");

    const { intent, query, navigationTarget } = interpretUserMessage(content);
    const startedAt = performance.now();
    trackTelemetry({
      totalMessages: 1,
      intents: { [intent]: (1 as number) },
      fallbackCount: intent === "fallback" ? 1 : 0,
    });

    try {
      if (intent === "search_content") {
        const results = await searchEntities({ query: query || content });
        const items = formatSearchResults(results);
        if (!items.length) {
          trackTelemetry({ searchNoResultCount: 1 });
          pushAssistantMessage({
            intent,
            text: t("chatbot.no_results", { query: query || content }),
            actions: [
              makeAction(t("chatbot.quick.show_all_labels"), "route", "/labels"),
              makeAction(t("chatbot.quick.show_all_news"), "route", "/news"),
            ],
          });
        } else {
          pushAssistantMessage({
            intent,
            text: t("chatbot.search_results"),
            results: items,
            actions: [
              makeAction(t("chatbot.quick.refine_search"), "quick", t("chatbot.quick.refine_search_prompt")),
              makeAction(t("chatbot.quick.open_multimedia"), "route", "/multimedia"),
            ],
          });
        }
      } else if (intent === "navigate" && navigationTarget) {
        pushAssistantMessage({
          intent,
          text: t("chatbot.navigate_message", { target: t(`chatbot.nav_targets.${navigationTarget.key}`) }),
          actions: [
            makeAction(t("chatbot.open_page"), "route", navigationTarget.route),
            makeAction(t("chatbot.quick.search_in_page"), "quick", t("chatbot.quick.search_in_page_prompt", { target: t(`chatbot.nav_targets.${navigationTarget.key}`) })),
          ],
        });
      } else if (intent === "pricing_help") {
        pushAssistantMessage({
          intent,
          text: t("chatbot.pricing_message"),
          actions: [
            makeAction(t("chatbot.quick.show_pricing"), "route", "/pricing"),
            makeAction(t("chatbot.quick.find_premium_news"), "quick", t("chatbot.quick.find_premium_news_prompt")),
          ],
        });
      } else if (intent === "contact_help") {
        pushAssistantMessage({
          intent,
          text: t("chatbot.contact_message"),
          actions: [
            makeAction(t("chatbot.quick.go_news"), "route", "/news"),
            makeAction(t("chatbot.quick.go_events"), "route", "/events"),
            makeAction(t("chatbot.quick.show_pricing"), "route", "/pricing"),
          ],
        });
      } else {
        pushAssistantMessage({
          intent: "fallback",
          text: t("chatbot.fallback"),
          actions: [
            makeAction(t("chatbot.quick.find_labels"), "quick", t("chatbot.quick.find_labels_prompt")),
            makeAction(t("chatbot.quick.latest_news"), "quick", t("chatbot.quick.latest_news_prompt")),
            makeAction(t("chatbot.quick.show_pricing"), "route", "/pricing"),
          ],
        });
      }

      const elapsed = Math.round(performance.now() - startedAt);
      console.info(`[chatbot] intent=${intent} elapsedMs=${elapsed}`);
    } catch (err) {
      console.error("[chatbot] error", err);
      setError(t("chatbot.error"));
      pushAssistantMessage({
        intent: "fallback",
        text: t("chatbot.error"),
        actions: [makeAction(t("chatbot.quick.retry"), "quick", content)],
      });
    } finally {
      setTyping(false);
    }
  };

  const resetConversation = () => {
    setMessages([initialAssistantMessage]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setError(null);
    setTyping(false);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50">
      {/* Popup chat */}
      <div
        className={cn(
          "absolute bottom-20 left-0 w-[min(340px,calc(100vw-2rem))] rounded-2xl bg-white border-2 border-brand-gold/40 shadow-2xl shadow-primary/30 overflow-hidden transition-all duration-300 origin-bottom-left",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none",
        )}
      >
        <div className="bg-gradient-to-br from-brand-deep via-primary to-brand-forest p-4 text-primary-foreground relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gold/30 rounded-full blur-2xl animate-aurora" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/25 border border-brand-gold/50 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <p className="text-sm font-black italic">{t("chatbot.title")}</p>
              <p className="text-[10px] uppercase tracking-widest text-primary-foreground/70">{t("chatbot.online")}</p>
            </div>
            <button
              onClick={resetConversation}
              aria-label={t("chatbot.reset")}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label={t("chatbot.close")}
              className="ml-auto w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-surface-warm">
          <div className="rounded-xl bg-white border border-brand-gold/20 p-3 text-xs text-brand-dark font-medium leading-relaxed shadow-sm space-y-2 max-h-72 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-lg px-2.5 py-2",
                  msg.role === "assistant" ? "bg-brand-gold/10 border border-brand-gold/25" : "bg-brand-dark text-primary-foreground"
                )}
              >
                <p>{msg.text}</p>

                {msg.results && msg.results.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {msg.results.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        className="w-full text-left rounded-md border border-brand-gold/30 bg-white px-2 py-1.5 hover:bg-brand-gold/10 transition-colors"
                        onClick={() => {
                          navigate(result.href);
                          setOpen(false);
                        }}
                      >
                        <p className="text-[11px] font-bold text-brand-dark line-clamp-1">{result.title}</p>
                        {result.subtitle && <p className="text-[10px] text-brand-dark/60 uppercase tracking-wide">{result.subtitle}</p>}
                      </button>
                    ))}
                  </div>
                )}

                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.actions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleAction(action)}
                        className="px-2 py-1 rounded-full bg-brand-dark text-primary-foreground text-[10px] font-bold uppercase tracking-wide hover:brightness-110 transition-all"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="rounded-lg px-2.5 py-2 bg-brand-gold/10 border border-brand-gold/25 inline-flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-brand-dark" />
                <span className="text-[11px] text-brand-dark/80">{t("chatbot.typing")}</span>
              </div>
            )}
            {error && <p className="text-[10px] text-red-600 font-semibold">{error}</p>}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
            className="mt-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              className="flex-1 px-3 py-2 rounded-lg bg-white border border-brand-gold/30 text-xs text-brand-dark placeholder:text-brand-dark/40 outline-none focus:ring-2 focus:ring-brand-gold/50 font-medium"
            />
            <button
              type="submit"
              aria-label={t("chatbot.send")}
              disabled={!input.trim() || typing}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-emerald to-primary text-primary-foreground flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/30"
            >
              {typing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>

      {/* Hover tooltip */}
      <div
        className={cn(
          "absolute bottom-1/2 translate-y-1/2 left-16 whitespace-nowrap px-3 py-1.5 rounded-full bg-brand-dark text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg transition-all duration-200 hidden sm:block",
          hovered && !open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none",
        )}
      >
        {suggestions[tipIdx]}
      </div>

      {/* Trigger button — animated head */}
      <button
        type="button"
        aria-label={t("chatbot.open")}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={onEnter}
        onMouseLeave={() => setHovered(false)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold via-brand-gold-dark to-brand-emerald text-brand-dark shadow-2xl shadow-brand-gold/50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-pulse-glow"
      >
        <span className="absolute inset-0 rounded-full bg-brand-gold/50 blur-xl animate-aurora-slow" />
        <span className="relative flex flex-col items-center justify-center">
          <MessageCircle className="w-6 h-6 animate-float-y" strokeWidth={2.5} />
        </span>
      </button>
    </div>
  );
};
