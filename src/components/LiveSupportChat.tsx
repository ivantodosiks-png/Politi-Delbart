import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useI18n } from "../i18n/i18n";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "live_support_chat_v1";

function safeParseMessages(raw: string | null): Msg[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .map((m) => ({ role: m.role as Msg["role"], content: String(m.content).slice(0, 2000) }))
      .slice(-20);
  } catch {
    return [];
  }
}

export default function LiveSupportChat() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() => safeParseMessages(localStorage.getItem(STORAGE_KEY)));
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, busy]);

  const canSend = useMemo(() => draft.trim().length > 0 && !busy, [draft, busy]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;

    setError(null);
    setBusy(true);
    setDraft("");

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang })
      });

      const data = (await resp.json()) as any;
      if (!resp.ok) throw new Error(data?.error || "Chat error");
      setMessages((m): Msg[] => [...m, { role: "assistant", content: String(data?.text ?? "") }]);
    } catch (e: any) {
      setError(e?.message ?? "Chat error");
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">{t("support.title")}</div>
              <div className="truncate text-xs text-slate-600">{t("support.subtitle")}</div>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              onClick={() => setOpen(false)}
              aria-label={t("support.close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="max-h-[52vh] space-y-3 overflow-auto px-4 py-3">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                <div className="font-medium text-slate-900">{t("support.welcome_title")}</div>
                <div className="mt-1">{t("support.welcome_text")}</div>
              </div>
            ) : null}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-blue-600 px-3 py-2 text-sm text-white"
                    : "mr-auto w-fit max-w-[85%] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                }
              >
                {m.content}
              </div>
            ))}

            {busy ? (
              <div className="mr-auto w-fit max-w-[85%] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                {t("support.typing")}
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 px-4 py-3">
            {error ? <div className="mb-2 text-xs text-rose-700">{error}</div> : null}
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder={t("support.placeholder")}
                className="max-h-28 min-h-[44px] flex-1 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={!canSend}
                className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label={t("support.send")}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">{t("support.disclaimer")}</div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn-pulse-ring inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          onClick={() => setOpen(true)}
          aria-label={t("support.open")}
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
