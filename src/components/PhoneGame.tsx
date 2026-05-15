import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  Forward,
  Image as ImageIcon,
  Send,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  X,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Act =
  | "idle"
  | "act1"
  | "spread"
  | "transition"
  | "victim"
  | "end_safe"
  | "end";

type Side = "friend" | "me" | "system";

type MessageStatus = "Delivered" | "Opened" | "Screenshot taken";

type ChatMessage =
  | {
      id: string;
      kind: "text";
      side: Side;
      text: string;
      time?: string;
      ephemeral?: boolean;
      fadeAfterMs?: number;
    }
  | {
      id: string;
      kind: "snap";
      side: Side;
      label: string;
      time?: string;
      openedAt?: number;
      ephemeral?: boolean;
      fadeAfterMs?: number;
    }
  | {
      id: string;
      kind: "status";
      side: "system";
      text: string;
      status?: MessageStatus;
    };

type Noti = { id: string; text: string; tone: "neutral" | "bad" };

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

  function beep(freq = 880, ms = 38, gain = 0.02) {
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
    <div className="w-full max-w-[440px] rounded-[46px] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="relative mx-auto h-[82dvh] min-h-[560px] w-full overflow-hidden rounded-[38px] bg-slate-950 text-white ring-1 ring-black/5">
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
  return <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${c.join(" ")} ring-1 ring-white/15`} />;
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

function Bubble({
  msg,
  onOpenSnap,
  onHoldSnapStart,
  onHoldSnapEnd
}: {
  msg: ChatMessage;
  onOpenSnap: (id: string) => void;
  onHoldSnapStart: (id: string) => void;
  onHoldSnapEnd: () => void;
}) {
  if (msg.kind === "status") {
    const icon =
      msg.status === "Screenshot taken" ? Zap : msg.status === "Opened" ? CheckCircle2 : TriangleAlert;
    const Icon = icon;
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/80">
          <Icon className="h-4 w-4 text-white/70" />
          {msg.text}
        </div>
      </div>
    );
  }

  const isFriend = msg.side === "friend";
  const align = isFriend ? "justify-start" : "justify-end";
  const bubble =
    msg.kind === "snap"
      ? isFriend
        ? "bg-white/10 text-white ring-1 ring-white/10"
        : "bg-blue-600 text-white ring-1 ring-white/10"
      : isFriend
        ? "bg-white/10 text-white"
        : "bg-blue-600 text-white";

  const base = "max-w-[82%] rounded-3xl px-3 py-2.5 text-[13px] leading-relaxed";

  return (
    <div className={`flex ${align}`}>
      <div className={`${base} ${bubble}`}>
        {msg.kind === "snap" ? (
          <button
            type="button"
            className="block w-full text-left"
            onClick={() => onOpenSnap(msg.id)}
            onPointerDown={() => onHoldSnapStart(msg.id)}
            onPointerUp={onHoldSnapEnd}
            onPointerCancel={onHoldSnapEnd}
            aria-label="Åpne bilde"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-2xl bg-black/30 ring-1 ring-white/10">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[12px] font-semibold">{msg.label}</div>
                  <div className="mt-0.5 text-[11px] text-white/70">Trykk for å åpne • hold for å se</div>
                </div>
              </div>
              <div className="text-[11px] text-white/60">{msg.openedAt ? "Opened" : "Delivered"}</div>
            </div>
            <div className="mt-2 overflow-hidden rounded-2xl bg-gradient-to-br from-white/18 to-white/6 p-3 ring-1 ring-white/10">
              <div className="text-[11px] text-white/70">Sladdet forhåndsvisning</div>
              <div className="mt-2 h-20 w-full rounded-xl bg-gradient-to-br from-white/20 to-white/5 blur-[2px]" />
            </div>
          </button>
        ) : (
          <span>{msg.text}</span>
        )}
      </div>
    </div>
  );
}

function InputBar({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex items-center gap-2 border-t border-white/10 bg-black/25 px-3 py-3">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/15"
        aria-label="Kamera"
        disabled={disabled}
      >
        <Camera className="h-5 w-5" />
      </button>
      <div className="flex-1 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/70">
        Skriv en melding…
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
  const [act, setAct] = useState<Act>("idle");
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState<MessageStatus | null>(null);
  const [shake, setShake] = useState(0);

  const [shareCount, setShareCount] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const [screenshotCount, setScreenshotCount] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toasts, setToasts] = useState<Noti[]>([]);

  const [snapViewer, setSnapViewer] = useState<{ id: string; hold: boolean } | null>(null);
  const holdTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => setEnabled(sound), [sound, setEnabled]);

  const reactions = useMemo(() => ["😂", "😳", "💀", "🔥", "👀", "😡"], []);
  const [floaters, setFloaters] = useState<Array<{ id: string; x: number; y: number; t: string }>>([]);

  function closeExperience() {
    onOpenChange(false);
  }

  function openExperience() {
    onOpenChange(true);
  }

  function resetScenario() {
    setAct("act1");
    setTyping(false);
    setStatus(null);
    setShake(0);
    setShareCount(0);
    setOpenedCount(0);
    setScreenshotCount(0);
    setFloaters([]);
    setToasts([]);
    setSnapViewer(null);
    setMessages([
      {
        id: uid(),
        kind: "snap",
        side: "friend",
        label: "Bilde • 3s",
        ephemeral: true,
        fadeAfterMs: 3500
      }
    ]);
  }

  useEffect(() => {
    if (!open) {
      setAct("idle");
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

  function fadeOutMessage(id: string, afterMs: number) {
    if (reduceMotion) return;
    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ephemeral: true, fadeAfterMs: 800 } : m))
      );
    }, afterMs);
  }

  function startTypingThenSend(text: string, delayMs = 700) {
    setTyping(true);
    const id = window.setTimeout(() => {
      setTyping(false);
      pushMsg({ id: uid(), kind: "text", side: "friend", text });
      beep(880, 30, 0.012);
    }, delayMs);
    return () => window.clearTimeout(id);
  }

  useEffect(() => {
    if (!open) return;
    if (act !== "act1") return;

    const c1 = startTypingThenSend("ikke del dette", 650);
    const c2 = window.setTimeout(() => startTypingThenSend("men alle sender det", 650), 1100);
    const c3 = window.setTimeout(() => startTypingThenSend("bare videresend det", 650), 1950);

    return () => {
      c1();
      window.clearTimeout(c2);
      window.clearTimeout(c3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act, open]);

  function markSnapOpened(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.kind === "snap" && m.id === id ? { ...m, openedAt: Date.now() } : m))
    );
  }

  function openSnap(id: string) {
    markSnapOpened(id);
    setSnapViewer({ id, hold: false });
    pushStatus("Opened", "Opened");
    beep(740, 35, 0.012);

    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setSnapViewer(null);
      if (!reduceMotion) fadeOutMessage(id, 250);
    }, 1600);
  }

  function holdSnapStart(id: string) {
    if (reduceMotion) return;
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      markSnapOpened(id);
      setSnapViewer({ id, hold: true });
      beep(720, 28, 0.012);
    }, 120);
  }

  function holdSnapEnd() {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    if (snapViewer?.hold) {
      setSnapViewer(null);
      pushStatus("Opened", "Opened");
    }
  }

  function deleteSnap() {
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Sletter." });
    pushStatus("Du stoppet spredningen", "Opened");
    setAct("end_safe");
  }

  function reportSnap() {
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Rapporterer." });
    pushStatus("Rapport sendt (simulering)", "Opened");
    setAct("end_safe");
  }

  function forwardSnap() {
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Videresender…" });
    setStatus("Delivered");
    pushStatus("Delivered", "Delivered");
    setAct("spread");
  }

  useEffect(() => {
    if (!open) return;
    if (act !== "spread") return;

    let ticks = 0;
    const id = window.setInterval(() => {
      ticks += 1;
      setShareCount((s) => s + 1 + Math.floor(Math.random() * 4));
      if (ticks > 2) setOpenedCount((o) => o + Math.floor(Math.random() * 3));
      if (ticks > 4 && Math.random() < 0.35) setScreenshotCount((sc) => sc + 1);

      if (!reduceMotion) {
        const rx = clamp(Math.random(), 0.1, 0.9);
        const ry = clamp(Math.random(), 0.18, 0.7);
        const em = reactions[Math.floor(Math.random() * reactions.length)]!;
        setFloaters((f) => [...f.slice(-14), { id: uid(), x: rx, y: ry, t: em }]);
      }

      beep(900 + Math.random() * 140, 22, 0.011);

      if (ticks === 4) {
        setStatus("Opened");
        pushStatus("Opened", "Opened");
      }

      if (ticks === 7) {
        setStatus("Screenshot taken");
        pushStatus("Someone took a screenshot", "Screenshot taken");
      }

      if (ticks >= 10) {
        window.clearInterval(id);
        setAct("transition");
      }
    }, reduceMotion ? 320 : 220);

    return () => window.clearInterval(id);
  }, [act, beep, open, reactions, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    if (act !== "transition") return;
    const id = window.setTimeout(() => setAct("victim"), reduceMotion ? 180 : 800);
    return () => window.clearTimeout(id);
  }, [act, open, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    if (act !== "victim") return;

    let ticks = 0;
    const bad = [
      "har du sett deg selv?",
      "alle har fått den",
      "send uten sladd",
      "LOL 😂",
      "så flaut…",
      "dette er overalt",
      "hvor fikk du den fra?"
    ];
    const id = window.setInterval(() => {
      ticks += 1;
      const tone: Noti["tone"] = Math.random() < 0.72 ? "bad" : "neutral";
      const text = tone === "bad" ? bad[Math.floor(Math.random() * bad.length)]! : "ny melding";
      setToasts((prev) => [{ id: uid(), text, tone }, ...prev].slice(0, 6));
      if (!reduceMotion) setShake((s) => (s + 1) % 4);
      beep(tone === "bad" ? 640 : 880, 26, 0.013);

      if (ticks >= 18) {
        window.clearInterval(id);
        setAct("end");
      }
    }, reduceMotion ? 300 : 190);

    return () => window.clearInterval(id);
  }, [act, beep, open, reduceMotion]);

  return (
    <section id="experience" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Scenario"
            title="Fiktiv chat-app (forsvinnende meldinger)"
            description="Dette er en fiksjon inspirert av moderne sosiale apper. Ingen logoer eller identiske UI-er er kopiert."
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
                <motion.div
                  className="absolute inset-0"
                  animate={
                    act === "transition" && !reduceMotion
                      ? {
                          filter: ["none", "contrast(1.2) saturate(1.4)", "none"],
                          x: [0, -2, 2, -1, 0],
                          y: [0, 1, -1, 0, 0]
                        }
                      : undefined
                  }
                  transition={{ duration: 0.8 }}
                />

                <div className="absolute inset-x-0 top-0 z-10 border-b border-white/10 bg-black/30 px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={closeExperience}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/15"
                        aria-label="Tilbake"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <Avatar seed={9} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">venn</div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/70">
                          <span className="inline-flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            online
                          </span>
                          {typing ? (
                            <span className="inline-flex items-center gap-2">
                              skriver <TypingDots />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-white/60">
                      {act === "spread"
                        ? "Spredning"
                        : act === "victim"
                          ? "Varsler"
                          : act === "end" || act === "end_safe"
                            ? "Oppsummering"
                            : "Chat"}
                    </div>
                  </div>

                  {act === "spread" ? (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-white/80">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                        <div className="text-white/60">Delinger</div>
                        <div className="mt-0.5 text-base font-semibold text-white">{shareCount}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                        <div className="text-white/60">Åpnet</div>
                        <div className="mt-0.5 text-base font-semibold text-white">{openedCount}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                        <div className="text-white/60">Skjermbilder</div>
                        <div className="mt-0.5 text-base font-semibold text-white">{screenshotCount}</div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="absolute inset-x-0 bottom-14 top-[108px] px-4 pb-4">
                  <div className="flex h-full flex-col justify-end">
                    <div className="space-y-2 overflow-hidden">
                      <AnimatePresence initial={false}>
                        {messages.map((m) => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Bubble
                              msg={m}
                              onOpenSnap={openSnap}
                              onHoldSnapStart={holdSnapStart}
                              onHoldSnapEnd={holdSnapEnd}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {typing ? (
                        <div className="flex justify-start">
                          <div className="rounded-3xl bg-white/10 px-4 py-3">
                            <TypingDots />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-14 px-4 pb-3">
                  {act === "act1" ? (
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
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={reportSnap}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Report
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {act === "end_safe" ? (
                    <div className="rounded-3xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-200" />
                        <div>
                          <div className="text-sm font-semibold text-white">Du stoppet spredningen</div>
                          <div className="mt-1 text-xs leading-relaxed text-white/75">
                            Å slette eller rapportere kan være det viktigste valget. Ta vare på bevis og
                            søk hjelp hvis du trenger det.
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {act === "end" ? (
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

                <AnimatePresence>
                  {snapViewer ? (
                    <motion.div
                      className="absolute inset-0 z-20 grid place-items-center bg-black/80 p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSnapViewer(null)}
                      role="dialog"
                      aria-label="Bildevisning"
                    >
                      <div className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-black/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-[12px] font-semibold text-white/80">Bilde (symbolsk)</div>
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
                          <div className="h-56 w-full bg-gradient-to-br from-white/15 to-white/5" />
                          <div className="absolute inset-x-0 bottom-0 px-4 py-3 text-[11px] text-white/70">
                            {snapViewer.hold ? "Holder for å se…" : "Åpnet (forsvinner snart)"}
                          </div>
                        </div>
                        <div className="mt-3 text-[11px] text-white/70">
                          Ikke ekte innhold. Vises kun som symbolsk plassholder.
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {act === "victim" ? (
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-10"
                      animate={
                        !reduceMotion
                          ? { x: shake === 0 ? 0 : shake === 1 ? -2 : shake === 2 ? 2 : -1 }
                          : undefined
                      }
                      transition={{ duration: 0.1 }}
                    />
                  ) : null}
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-x-0 top-[116px] z-20 px-4">
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {toasts.map((t) => (
                        <Toast key={t.id} text={t.text} tone={t.tone} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                  {act === "spread" && !reduceMotion
                    ? floaters.map((f) => (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="pointer-events-none absolute text-xl"
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

                {act === "transition" ? (
                  <div className="absolute inset-0 z-30 grid place-items-center bg-black/60 p-6 text-center">
                    <div className="max-w-[260px] rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="text-sm font-semibold">…</div>
                      <div className="mt-2 text-xs leading-relaxed text-white/75">
                        Perspektivet skifter.
                      </div>
                    </div>
                  </div>
                ) : null}

                {act === "spread" ? (
                  <div className="absolute inset-x-0 bottom-[68px] z-20 px-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/80">
                      <div className="flex items-start gap-3">
                        <Zap className="mt-0.5 h-4 w-4 text-white/80" />
                        <div>
                          <div className="font-semibold text-white">Det føles kanskje ufarlig…</div>
                          <div className="mt-1 leading-relaxed text-white/70">
                            Men spredning kan eskalere raskt — og noen mister kontroll med en gang.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {status === "Screenshot taken" ? (
                  <div className="absolute inset-x-0 bottom-[68px] z-30 px-4">
                    <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 text-xs text-white/85">
                      <div className="flex items-start gap-3">
                        <Zap className="mt-0.5 h-4 w-4 text-amber-200" />
                        <div>
                          <div className="font-semibold text-white">Skjermbilde tatt</div>
                          <div className="mt-1 leading-relaxed text-white/70">
                            Nå kan bildet lagres og deles videre — uten kontroll.
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

