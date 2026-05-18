import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  Flag,
  Forward,
  Image as ImageIcon,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserPlus,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Screen = "inbox" | "thread";
type Phase = "idle" | "act1" | "video" | "victim" | "end_safe" | "end";
type Side = "friend" | "me" | "system";
type MessageStatus = "Delivered" | "Opened" | "Screenshot taken";

type ChatMessage =
  | { id: string; kind: "text"; side: Side; text: string }
  | { id: string; kind: "snap"; side: Side; label: string; openedAt?: number }
  | { id: string; kind: "status"; side: "system"; text: string; status?: MessageStatus };

type ToastItem = { id: string; text: string; tone: "neutral" | "bad" };

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useBeep() {
  const enabledRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);

  function setEnabled(v: boolean) {
    enabledRef.current = v;
  }

  function beep(freq = 880, ms = 34, gain = 0.02) {
    if (!enabledRef.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    if (!audioRef.current) audioRef.current = new Ctx();
    const ctx = audioRef.current;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000);
  }

  return { setEnabled, beep };
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[460px] rounded-[46px] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="relative mx-auto h-[82dvh] min-h-[600px] w-full overflow-hidden rounded-[38px] bg-white text-slate-900 ring-1 ring-black/5">
        {children}
      </div>
    </div>
  );
}

function Avatar({ seed = 7 }: { seed?: number }) {
  const colors = [
    ["from-fuchsia-500", "to-sky-500"],
    ["from-emerald-500", "to-blue-500"],
    ["from-amber-500", "to-rose-500"],
    ["from-purple-500", "to-cyan-500"]
  ];
  const c = colors[seed % colors.length]!;
  return (
    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${c.join(" ")} ring-1 ring-white/15`} />
  );
}

function BadgeDot({ tone }: { tone: "new" | "received" | "opened" }) {
  const dot =
    tone === "new"
      ? "bg-rose-500"
      : tone === "received"
        ? "bg-sky-500"
        : "bg-emerald-500";
  return <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70 [animation-delay:120ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70 [animation-delay:240ms]" />
    </div>
  );
}

function StatusPill({ text, status }: { text: string; status?: MessageStatus }) {
  const icon =
    status === "Screenshot taken" ? Zap : status === "Opened" ? CheckCircle2 : TriangleAlert;
  const Icon = icon;
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/80">
        <Icon className="h-4 w-4 text-white/70" />
        {text}
      </div>
    </div>
  );
}

function MessageBubble({
  msg,
  friendLabel,
  onOpenSnap,
  onHoldStart,
  onHoldEnd
}: {
  msg: ChatMessage;
  friendLabel: string;
  onOpenSnap: (id: string) => void;
  onHoldStart: (id: string) => void;
  onHoldEnd: () => void;
}) {
  if (msg.kind === "status") return <StatusPill text={msg.text} status={msg.status} />;

  const isFriend = msg.side === "friend";
  const align = isFriend ? "justify-start" : "justify-end";
  const base = "max-w-[86%] rounded-3xl px-3 py-2.5 text-[14px] leading-relaxed";

  return (
    <div className={`flex ${align}`}>
      <div
        className={[
          base,
          isFriend ? "bg-transparent" : "bg-slate-100 text-slate-900 ring-1 ring-black/5"
        ].join(" ")}
      >
        {msg.kind === "snap" ? (
          <button
            type="button"
            className="block w-full text-left"
            onClick={() => onOpenSnap(msg.id)}
            onPointerDown={() => onHoldStart(msg.id)}
            onPointerUp={onHoldEnd}
            onPointerCancel={onHoldEnd}
            aria-label="Åpne bilde"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-2xl bg-slate-100 ring-1 ring-black/5">
                    <ImageIcon className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-slate-900">{msg.label}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      Trykk for å åpne • hold for å se
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">{msg.openedAt ? "Åpnet" : "Mottatt"}</div>
              </div>

              <div className="mt-2 overflow-hidden rounded-2xl bg-slate-50 p-3 ring-1 ring-black/5">
                <div className="text-[11px] text-slate-500">Sladdet forhåndsvisning</div>
                <div className="mt-2 h-20 w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 blur-[2px]" />
              </div>
            </div>
          </button>
        ) : (
          <div className="flex items-start gap-3">
            {isFriend ? <div className="mt-1 h-10 w-0.5 rounded-full bg-sky-500" /> : null}
            <div>
              {isFriend ? (
                <div className="text-sm font-semibold text-sky-600">{friendLabel}</div>
              ) : null}
              <div className="text-[15px] leading-relaxed text-slate-900">{msg.text}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputBar({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex items-center gap-2 border-t border-black/5 bg-white px-3 py-3">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 disabled:opacity-60"
        aria-label="Kamera"
        disabled={disabled}
      >
        <Camera className="h-5 w-5" />
      </button>
      <div className="flex-1 rounded-full bg-slate-100 px-4 py-2 text-[13px] text-slate-500">
        Send chat
      </div>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
        aria-label="Send"
        disabled={disabled}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}

function Toast({ text, tone }: { text: string; tone: "neutral" | "bad" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={[
        "rounded-2xl border px-3 py-3 shadow-sm",
        tone === "bad" ? "border-rose-500/25 bg-rose-500/10" : "border-white/10 bg-white/5"
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="text-[13px] leading-snug text-white">{text}</div>
    </motion.div>
  );
}

function ChatCell({
  name,
  subtitle,
  isNew,
  badge,
  onClick
}: {
  name: string;
  subtitle: string;
  isNew?: boolean;
  badge?: "new_snap" | "received" | "opened";
  onClick?: () => void;
}) {
  const badgeDot =
    badge === "new_snap"
      ? "bg-rose-500"
      : badge === "received"
        ? "bg-sky-500"
        : badge === "opened"
          ? "bg-emerald-500"
          : "bg-white/25";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-black/5 bg-white px-4 py-3 text-left text-slate-900 hover:bg-slate-50"
    >
      <div className="relative">
        <Avatar seed={name.length} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ${badgeDot}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate text-sm font-semibold">{name}</div>
          {isNew ? <span className="h-2 w-2 rounded-full bg-rose-500" /> : null}
        </div>
        <div className="mt-0.5 truncate text-[12px] text-slate-600">{subtitle}</div>
      </div>
      <div className="text-[12px] text-slate-500">{isNew ? "New" : ""}</div>
    </button>
  );
}

export default function PhoneGame({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const { setEnabled, beep } = useBeep();

  const [sound, setSound] = useState(false);
  const [screen, setScreen] = useState<Screen>("inbox");
  const [phase, setPhase] = useState<Phase>("idle");
  const [typing, setTyping] = useState(false);
  const [choiceReady, setChoiceReady] = useState(false);
  const [status, setStatus] = useState<MessageStatus | null>(null);
  const [shake, setShake] = useState(0);
  const [friendName, setFriendName] = useState("Elias");
  const [friendSeed, setFriendSeed] = useState(9);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [floaters, setFloaters] = useState<Array<{ id: string; x: number; y: number; t: string }>>([]);

  const [snapViewer, setSnapViewer] = useState<{ id: string; hold: boolean } | null>(null);
  const holdTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => setEnabled(sound), [sound, setEnabled]);

  const reactions = useMemo(() => ["рџ‚", "рџі", "рџ’Ђ", "рџ”Ґ", "рџ‘Ђ", "рџЎ"], []);

  function closeExperience() {
    onOpenChange(false);
  }

  function openExperience() {
    onOpenChange(true);
  }

  function resetScenario() {
    setScreen("inbox");
    setPhase("idle");
    setTyping(false);
    setChoiceReady(false);
    setStatus(null);
    setShake(0);
    setMessages([]);
    setToasts([]);
    setFloaters([]);
    setSnapViewer(null);
    setVideoError(false);
  }

  useEffect(() => {
    if (!open) {
      resetScenario();
      return;
    }
    resetScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeExperience();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function pushMsg(msg: ChatMessage) {
    setMessages((prev) => [...prev, msg]);
  }

  function pushStatus(text: string, s?: MessageStatus) {
    pushMsg({ id: uid(), kind: "status", side: "system", text, status: s });
  }

  function openThread() {
    setScreen("thread");
    setPhase("act1");
    setChoiceReady(false);
    setTyping(false);
    setStatus(null);
    setFriendName("Elias");
    setFriendSeed(9);
    setMessages([
      { id: uid(), kind: "snap", side: "friend", label: "Bilde • 3s" },
      { id: uid(), kind: "status", side: "system", text: "New Snap", status: "Delivered" }
    ]);
    beep(880, 28, 0.012);
  }

  function backToInbox() {
    setScreen("inbox");
    setPhase("idle");
    setTyping(false);
    setChoiceReady(false);
    setStatus(null);
    setMessages([]);
    setToasts([]);
    setFloaters([]);
    setSnapViewer(null);
    setVideoError(false);
  }

  function markSnapOpened(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.kind === "snap" && m.id === id ? { ...m, openedAt: Date.now() } : m))
    );
  }

  function openSnap(id: string) {
    markSnapOpened(id);
    setSnapViewer({ id, hold: false });
    pushStatus("Opened", "Opened");
    setStatus("Opened");
    beep(740, 32, 0.012);

    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setSnapViewer(null), 1500);
  }

  function holdSnapStart(id: string) {
    if (reduceMotion) return;
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      markSnapOpened(id);
      setSnapViewer({ id, hold: true });
      beep(720, 26, 0.012);
    }, 120);
  }

  function holdSnapEnd() {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    if (snapViewer?.hold) {
      setSnapViewer(null);
      pushStatus("Opened", "Opened");
      setStatus("Opened");
    }
  }

  useEffect(() => {
    if (!open) return;
    if (screen !== "thread") return;
    if (phase !== "act1") return;

    setTyping(true);
    const t1 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({ id: uid(), kind: "text", side: "friend", text: "Hei… du må se dette 😳" });
      beep(880, 26, 0.012);
    }, 650);

    const t2 = window.setTimeout(() => {
      setTyping(true);
    }, 980);

    const t3 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({ id: uid(), kind: "text", side: "friend", text: "ikke send det videre, seriøst" });
      beep(880, 26, 0.012);
    }, 1550);

    const t4 = window.setTimeout(() => setTyping(true), 1880);
    const t5 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({ id: uid(), kind: "text", side: "friend", text: "men alle deler det i grupper nå…" });
      beep(880, 26, 0.012);
    }, 2480);

    const t6 = window.setTimeout(() => setTyping(true), 2850);
    const t7 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({ id: uid(), kind: "text", side: "friend", text: "bare send det til én da… 😅" });
      beep(880, 26, 0.012);
      setChoiceReady(true);
    }, 3450);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
      window.clearTimeout(t6);
      window.clearTimeout(t7);
    };
  }, [open, phase, screen, beep]);

  function deleteSnap() {
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Sletter." });
    pushStatus("Du stoppet spredningen", "Opened");
    setPhase("end_safe");
    setChoiceReady(false);
  }

  function reportSnap() {
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Rapporterer." });
    pushStatus("Rapport sendt (simulering)", "Opened");
    setPhase("end_safe");
    setChoiceReady(false);
  }

  function forwardSnap() {
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Sender videre..." });
    setChoiceReady(false);

    setStatus("Delivered");
    pushStatus("Delivered", "Delivered");

    const t1 = window.setTimeout(() => {
      setStatus("Opened");
      pushStatus("Opened", "Opened");
      beep(760, 26, 0.012);
    }, 700);

    const t2 = window.setTimeout(() => {
      setStatus("Screenshot taken");
      pushStatus("Someone took a screenshot", "Screenshot taken");
      beep(640, 26, 0.012);
    }, 1400);

    const t3 = window.setTimeout(() => {
      setPhase("video");
    }, 1900);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }

  useEffect(() => {
    if (!open) return;
    if (phase !== "video") return;
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, [open, phase]);

  useEffect(() => {
    if (!open) return;
    if (phase !== "victim") return;

    let ticks = 0;
    const bad = [
      "har du sett deg selv?",
      "alle har den nГҐ",
      "send uten sladd",
      "LOL рџ‚",
      "dette er overalt",
      "so embarrassingвЂ¦",
      "er dette deg?"
    ];

    const id = window.setInterval(() => {
      ticks += 1;
      const tone: ToastItem["tone"] = Math.random() < 0.72 ? "bad" : "neutral";
      const text = tone === "bad" ? bad[Math.floor(Math.random() * bad.length)]! : "new notification";
      setToasts((prev) => [{ id: uid(), text, tone }, ...prev].slice(0, 6));

      if (!reduceMotion) setShake((s) => (s + 1) % 4);
      beep(tone === "bad" ? 640 : 880, 26, 0.013);

      if (!reduceMotion && Math.random() < 0.4) {
        const rx = clamp(Math.random(), 0.12, 0.88);
        const ry = clamp(Math.random(), 0.2, 0.7);
        const em = reactions[Math.floor(Math.random() * reactions.length)]!;
        setFloaters((f) => [...f.slice(-10), { id: uid(), x: rx, y: ry, t: em }]);
      }

      if (ticks >= 18) {
        window.clearInterval(id);
        setPhase("end");
      }
    }, reduceMotion ? 300 : 190);

    return () => window.clearInterval(id);
  }, [beep, open, phase, reactions, reduceMotion]);

  return (
    <section id="experience" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Scenario"
            title="Fiktiv chat-app (forsvinnende meldinger)"
            description="Du fГҐr et sladdet bilde. Velg hva du gjГёr. Etter В«ForwardВ» spiller vi en video (du legger den inn senere)."
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openExperience}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Start scenario
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="checkbox"
                className="accent-blue-700"
                checked={sound}
                onChange={(e) => setSound(e.target.checked)}
              />
              Lyd
            </label>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4">
              <div className="text-sm font-semibold text-white">Delbart</div>
              <button
                type="button"
                onClick={closeExperience}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
              >
                Lukk (Esc)
              </button>
            </div>

            <div className="flex h-full items-center justify-center px-4 pb-8 pt-16">
              <PhoneFrame>
                <div
                  className={[
                    "absolute inset-x-0 top-0 z-10 px-3 py-3",
                    screen === "inbox"
                      ? "border-b border-black/5 bg-white text-slate-900"
                      : "border-b border-black/5 bg-white text-slate-900"
                  ].join(" ")}
                >
                  {screen === "inbox" ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar seed={3} />
                          <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-white ring-1 ring-black/10">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          </span>
                        </div>
                        <div className="text-base font-semibold">Chat</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
                          aria-label="Søk"
                        >
                          <Search className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="relative grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
                          aria-label="Varsler"
                        >
                          <Zap className="h-5 w-5" />
                          <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                            1
                          </span>
                        </button>
                        <button
                          type="button"
                          className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 text-slate-900 hover:bg-amber-200"
                          aria-label="Legg til"
                        >
                          <UserPlus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={backToInbox}
                          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
                          aria-label="Tilbake"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-3">
                          <Avatar seed={friendSeed} />
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold">{friendName}</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {typing ? "skriver…" : "i dag"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
                          aria-label="Ring"
                        >
                          <Phone className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
                          aria-label="Video"
                        >
                          <Video className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {screen === "inbox" ? (
                  <div className="absolute inset-0 bg-white pt-[72px] text-slate-900">
                    <div className="sticky top-0 z-10 border-b border-black/5 bg-white px-4 pb-2 pt-3">
                      <div className="flex gap-6 overflow-auto text-sm font-semibold text-slate-700">
                        {["Nær meg", "Samtaler", "Grupper", "Svar", "Bestevenner", "Streaks"].map((t) => (
                          <div key={t} className="whitespace-nowrap">
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-full overflow-auto">
                      <ChatCell name="Maja" subtitle="Mottatt • 8 t" badge="received" />
                      <ChatCell name="Noah" subtitle="Mottatt • 1 m" badge="received" />
                      <ChatCell name="Sander" subtitle="Chat • 4 m" badge="opened" />
                      <ChatCell
                        name="Elias"
                        subtitle="Nytt bilde! • nå"
                        badge="new_snap"
                        isNew
                        onClick={openThread}
                      />
                      <ChatCell name="Ida" subtitle="Levert • 2 t" badge="opened" />
                      <ChatCell name="Aksel" subtitle="Åpnet • 2 t" badge="opened" />
                      <ChatCell name="Linnea" subtitle="Mottatt • 2 t" badge="received" />
                      <ChatCell name="Jonas" subtitle="Mottatt • 4 t" badge="received" />
                      <ChatCell name="Hanna" subtitle="Åpnet • 4 t" badge="opened" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 border-t border-black/5 bg-white px-4 py-3 text-slate-600">
                      <div className="flex items-center justify-around">
                        <div className="grid place-items-center gap-1 text-[11px]">
                          <Users className="h-5 w-5" />
                          Chat
                        </div>
                        <div className="grid place-items-center gap-1 text-[11px]">
                          <Camera className="h-5 w-5" />
                          Kamera
                        </div>
                        <div className="grid place-items-center gap-1 text-[11px]">
                          <Send className="h-5 w-5" />
                          Send
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Ny chat"
                      className="absolute bottom-20 right-5 grid h-14 w-14 place-items-center rounded-full bg-amber-300 text-slate-900 shadow-lg ring-1 ring-black/10 hover:bg-amber-200"
                    >
                      <Plus className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-x-0 top-[72px] border-b border-black/5 bg-slate-50 px-4 py-2 text-[12px] text-slate-600">
                      Ikke gå glipp av meldinger fra {friendName}!{" "}
                      <span className="font-semibold text-blue-700">Aktiver varsler</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-14 top-[120px] bg-white px-4 py-4 text-slate-900">
                      <div className="flex h-full flex-col justify-end">
                        <div className="space-y-2 overflow-hidden">
                          <div className="flex items-center justify-center py-1 text-[11px] font-semibold tracking-wider text-slate-400">
                            I DAG
                          </div>
                          <AnimatePresence initial={false}>
                            {messages.map((m) => (
                              <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <MessageBubble
                                  msg={m}
                                  friendLabel={friendName}
                                  onOpenSnap={openSnap}
                                  onHoldStart={holdSnapStart}
                                  onHoldEnd={holdSnapEnd}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-14 px-4 pb-3">
                      {phase === "act1" && choiceReady ? (
                        <div className="grid gap-2">
                          <button
                            type="button"
                            onClick={forwardSnap}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                          >
                            <Forward className="h-4 w-4" /> Forward
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={deleteSnap}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                            <button
                              type="button"
                              onClick={reportSnap}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                            >
                              <Flag className="h-4 w-4" /> Report
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {phase === "end_safe" ? (
                        <div className="rounded-3xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                          <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-200" />
                            <div>
                              <div className="text-sm font-semibold text-white">Du stoppet spredningen</div>
                              <div className="mt-1 text-xs leading-relaxed text-white/75">
                                Å slette/rapportere kan være det viktigste valget. Ta vare på bevis og søk hjelp ved
                                behov.
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {phase === "end" ? (
                        <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                          <div className="text-sm font-semibold text-white">For deg var det ett klikk.</div>
                          <div className="mt-1 text-xs leading-relaxed text-white/75">
                            For noen andre kan det endre alt. Tenk før du deler.
                          </div>
                          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                            <ShieldAlert className="mt-0.5 h-5 w-5 text-white/80" />
                            <div className="text-xs leading-relaxed text-white/75">
                              Ved akutt fare: ring 112. For råd og veiledning: ring 02800.
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="absolute inset-x-0 bottom-0">
                      <InputBar disabled />
                    </div>
                  </>
                )}

                <AnimatePresence>
                  {snapViewer ? (
                    <motion.div
                      className="absolute inset-0 z-30 grid place-items-center bg-black/80 p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSnapViewer(null)}
                      role="dialog"
                      aria-label="Bildevisning"
                    >
                      <div className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-black/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-[12px] font-semibold text-white/80">Photo (symbolic)</div>
                          <button
                            type="button"
                            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/15"
                            onClick={() => setSnapViewer(null)}
                            aria-label="Lukk"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-white/10">
                          <div className="h-60 w-full bg-gradient-to-br from-white/15 to-white/5 blur-[1px]" />
                          <div className="absolute inset-x-0 bottom-0 px-4 py-3 text-[11px] text-white/70">
                            {snapViewer.hold ? "Hold to viewвЂ¦" : "Opened (disappears soon)"}
                          </div>
                        </div>
                        <div className="mt-3 text-[11px] text-white/70">
                          No real content. This is a symbolic placeholder only.
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {phase === "video" ? (
                    <motion.div
                      className="absolute inset-0 z-40 bg-black/90 p-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">Video</div>
                        <button
                          type="button"
                          onClick={() => setPhase("victim")}
                          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                        >
                          Skip
                        </button>
                      </div>

                      <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/40">
                        <video
                          ref={videoRef}
                          className="h-[62dvh] min-h-[360px] w-full object-cover"
                          src="/scene-forward.mp4"
                          playsInline
                          controls
                          autoPlay
                          onError={() => setVideoError(true)}
                          onEnded={() => setPhase("victim")}
                        />
                      </div>

                      {videoError ? (
                        <div className="mt-4 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 text-xs text-white/85">
                          <div className="flex items-start gap-3">
                            <Zap className="mt-0.5 h-4 w-4 text-amber-200" />
                            <div>
                              <div className="font-semibold text-white">Video mangler</div>
                              <div className="mt-1 leading-relaxed text-white/70">
                                Legg inn videoen som `public/scene-forward.mp4` (i prosjektet). Trykk В«SkipВ» for ГҐ
                                fortsette.
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {phase === "victim" ? (
                    <motion.div
                      className="pointer-events-none absolute inset-x-0 top-[76px] z-30 px-4"
                      animate={
                        !reduceMotion
                          ? { x: shake === 0 ? 0 : shake === 1 ? -2 : shake === 2 ? 2 : -1 }
                          : undefined
                      }
                      transition={{ duration: 0.1 }}
                    >
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {toasts.map((t) => (
                            <Toast key={t.id} text={t.text} tone={t.tone} />
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {phase === "victim" && !reduceMotion
                    ? floaters.map((f) => (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="pointer-events-none absolute z-20 text-xl"
                          style={{
                            left: `${f.x * 100}%`,
                            top: `${f.y * 100}%`,
                            transform: "translate(-50%, -50%)"
                          }}
                        >
                          {f.t}
                        </motion.div>
                      ))
                    : null}
                </AnimatePresence>

                {status === "Screenshot taken" && screen === "thread" ? (
                  <div className="absolute inset-x-0 bottom-[68px] z-30 px-4">
                    <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 text-xs text-white/85">
                      <div className="flex items-start gap-3">
                        <Zap className="mt-0.5 h-4 w-4 text-amber-200" />
                        <div>
                          <div className="font-semibold text-white">Screenshot taken</div>
                          <div className="mt-1 leading-relaxed text-white/70">
                            Now it can be saved and shared again вЂ” without control.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </PhoneFrame>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}


