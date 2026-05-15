import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Forward,
  PhoneIncoming,
  ShieldAlert,
  Smartphone,
  Trash2,
  X,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Act = "idle" | "act1" | "spread" | "transition" | "video" | "act3" | "end_safe" | "end";

type ChatMsg = {
  id: string;
  side: "left" | "right";
  text?: string;
  kind?: "text" | "blurred";
  time?: string;
};

type Noti = {
  id: string;
  app: "DM" | "Kommentarer" | "Skjermbilder" | "Anrop";
  text: string;
  tone: "neutral" | "bad";
};

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

  function beep(freq = 880, ms = 40, gain = 0.02) {
    if (!enabledRef.current) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    if (!audioRef.current) audioRef.current = new Ctx();
    const ctx = audioRef.current;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + ms / 1000);
  }

  return { setEnabled, beep };
}

function PhoneFrame({
  children,
  dark = true
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="w-full max-w-[420px] rounded-[44px] border border-slate-200 bg-white p-3 shadow-sm">
      <div
        className={[
          "relative mx-auto h-[78dvh] min-h-[520px] w-full overflow-hidden rounded-[36px] ring-1 ring-black/5",
          dark ? "bg-slate-950 text-white" : "bg-white text-slate-900"
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const isLeft = msg.side === "left";
  const base =
    "max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed";
  const colors = isLeft
    ? "bg-white/10 text-white"
    : "bg-blue-600 text-white";

  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      <div className={`${base} ${colors}`}>
        {msg.kind === "blurred" ? (
          <div className="relative overflow-hidden rounded-xl bg-white/10 p-3">
            <div className="text-[11px] text-white/80">Bilde (sladdet)</div>
            <div className="mt-2 h-20 w-44 rounded-lg bg-gradient-to-br from-white/20 to-white/5 blur-[2px]" />
            <div className="mt-2 text-[11px] text-white/70">
              Symbolsk plassholder — ikke ekte innhold.
            </div>
          </div>
        ) : (
          <span>{msg.text}</span>
        )}
      </div>
    </div>
  );
}

function NotiToast({ n, onClose }: { n: Noti; onClose: () => void }) {
  const icon =
    n.app === "Anrop" ? PhoneIncoming : n.app === "Skjermbilder" ? Zap : Bell;
  const Icon = icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={[
        "rounded-2xl border px-3 py-3 shadow-sm",
        n.tone === "bad"
          ? "border-rose-500/25 bg-rose-500/10"
          : "border-white/10 bg-white/5"
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-white/10">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-white/80">{n.app}</div>
          <div className="mt-0.5 text-[13px] leading-snug text-white">{n.text}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Lukk varsel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
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
  const [choice, setChoice] = useState<"forward" | "delete" | "ignore" | null>(null);

  const [chat, setChat] = useState<ChatMsg[]>(() => [
    { id: uid(), side: "left", text: "BRO LOOK 💀", kind: "text", time: "12:04" },
    { id: uid(), side: "left", text: "Ikke send til noen", kind: "text", time: "12:04" },
    { id: uid(), side: "left", kind: "blurred", time: "12:05" },
    { id: uid(), side: "left", text: "Dette er helt sykt…", kind: "text", time: "12:05" }
  ]);

  const [shares, setShares] = useState(0);
  const [views, setViews] = useState(0);
  const [screens, setScreens] = useState(0);
  const [reactions, setReactions] = useState<Array<{ id: string; x: number; y: number; t: string }>>([]);

  const [noti, setNoti] = useState<Noti[]>([]);
  const [shake, setShake] = useState(0);

  useEffect(() => setEnabled(sound), [sound, setEnabled]);

  const canChoose = act === "act1";

  const reactionPool = useMemo(() => ["😂", "😳", "💀", "🔥", "👀", "🤡", "😡"], []);

  function reset() {
    setChoice(null);
    setShares(0);
    setViews(0);
    setScreens(0);
    setReactions([]);
    setNoti([]);
    setShake(0);
    setChat([
      { id: uid(), side: "left", text: "BRO LOOK 💀", kind: "text", time: "12:04" },
      { id: uid(), side: "left", text: "Ikke send til noen", kind: "text", time: "12:04" },
      { id: uid(), side: "left", kind: "blurred", time: "12:05" },
      { id: uid(), side: "left", text: "Dette er helt sykt…", kind: "text", time: "12:05" }
    ]);
    setAct("act1");
  }

  function openExperience() {
    onOpenChange(true);
  }

  function closeExperience() {
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) {
      setAct("idle");
      return;
    }
    reset();
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

  useEffect(() => {
    if (act === "idle") return;

    if (act === "spread") {
      let t = 0;
      const id = window.setInterval(() => {
        t += 1;
        setShares((s) => s + 1 + Math.floor(Math.random() * 3));
        setViews((v) => v + 5 + Math.floor(Math.random() * 12));
        if (t % 2 === 0) setScreens((sc) => sc + (Math.random() < 0.45 ? 1 : 0));

        if (!reduceMotion) {
          const rx = clamp(Math.random(), 0.12, 0.88);
          const ry = clamp(Math.random(), 0.18, 0.74);
          const em = reactionPool[Math.floor(Math.random() * reactionPool.length)]!;
          setReactions((r) => [...r.slice(-10), { id: uid(), x: rx, y: ry, t: em }]);
        }
        beep(880 + Math.random() * 180, 28, 0.012);

        if (t >= 9) {
          window.clearInterval(id);
          setAct("transition");
        }
      }, 240);

      return () => window.clearInterval(id);
    }

    if (act === "transition") {
      const id = window.setTimeout(() => setAct("video"), reduceMotion ? 200 : 650);
      return () => window.clearTimeout(id);
    }

    if (act === "video") {
      const id = window.setTimeout(() => setAct("act3"), reduceMotion ? 450 : 1400);
      return () => window.clearTimeout(id);
    }

    if (act === "act3") {
      let ticks = 0;
      const bad = [
        "Har du sett deg selv?",
        "Alle har den nå",
        "LOL 😂",
        "Send uten sladd",
        "Så flaut…",
        "Alle snakker om deg",
        "Dette er overalt"
      ];
      const neutral = ["Ny melding", "Ny kommentar", "Nytt varsel", "Noen tagget deg"];

      const id = window.setInterval(() => {
        ticks += 1;
        const tone: Noti["tone"] = Math.random() < 0.7 ? "bad" : "neutral";
        const app: Noti["app"] =
          Math.random() < 0.18
            ? "Anrop"
            : Math.random() < 0.35
              ? "Skjermbilder"
              : Math.random() < 0.6
                ? "Kommentarer"
                : "DM";
        const text =
          tone === "bad"
            ? bad[Math.floor(Math.random() * bad.length)]!
            : neutral[Math.floor(Math.random() * neutral.length)]!;

        setNoti((n) => [{ id: uid(), app, text, tone }, ...n].slice(0, 6));
        if (!reduceMotion) setShake((s) => (s + 1) % 4);
        beep(tone === "bad" ? 620 : 880, 30, 0.014);

        if (ticks >= 18) {
          window.clearInterval(id);
          setAct("end");
        }
      }, reduceMotion ? 260 : 190);

      return () => window.clearInterval(id);
    }
  }, [act, beep, reduceMotion, reactionPool]);

  function chooseNext(next: "forward" | "delete" | "ignore") {
    setChoice(next);
    if (next === "forward") {
      setChat((c) => [
        ...c,
        { id: uid(), side: "right", text: "Sender videre…", kind: "text", time: "12:05" }
      ]);
      setAct("spread");
      return;
    }
    setChat((c) => [
      ...c,
      {
        id: uid(),
        side: "right",
        text: next === "delete" ? "Sletter." : "Lar det være.",
        kind: "text",
        time: "12:05"
      }
    ]);
    setAct("end_safe");
  }

  return (
    <section id="experience" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Scenario"
            title="Velg hva du gjør i chatten"
            description="Trykk «Start scenario» øverst på siden. Scenarioet åpnes i fullskjerm."
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openExperience}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Smartphone className="h-4 w-4" />
              Åpne scenario
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
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
                Lukk
              </button>
            </div>

            <div className="flex h-full items-center justify-center px-4 pb-8 pt-16">
              <PhoneFrame dark>
                <motion.div
                  className="absolute inset-0"
                  animate={
                    act === "transition" && !reduceMotion
                      ? {
                          filter: ["none", "contrast(1.25) saturate(1.4)", "none"],
                          x: [0, -2, 2, -1, 0],
                          y: [0, 1, -1, 0, 0]
                        }
                      : undefined
                  }
                  transition={{ duration: 0.8 }}
                />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[11px] text-white/70">
                  <div className="rounded-full bg-white/10 px-2 py-1">Snap</div>
                  <div className="rounded-full bg-white/10 px-2 py-1">
                    {act === "act3"
                      ? "Varsler"
                      : act === "spread"
                        ? "Spredning"
                        : act === "video"
                          ? "…"
                          : act === "end" || act === "end_safe"
                            ? "Oppsummering"
                            : "Meldinger"}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 top-12 px-4 pb-4">
                  {act === "idle" ? (
                    <div className="grid h-full place-items-center text-center">
                      <div className="max-w-[260px] rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm font-semibold">Start scenario</div>
                        <div className="mt-2 text-xs leading-relaxed text-white/75">
                          Du får en melding med et sladdet bilde. Hva gjør du?
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {act === "act1" || act === "spread" || act === "transition" || act === "end_safe" ? (
                    <div className="flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">DM</div>
                        <div className="text-[11px] text-white/60">venn • nå</div>
                      </div>

                      <div className="mt-4 flex-1 space-y-2 overflow-hidden">
                        {chat.map((m) => (
                          <Bubble key={m.id} msg={m} />
                        ))}

                        {act === "spread" ? (
                          <div className="mt-3 grid gap-2 text-[12px] text-white/80">
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                              <div className="flex items-center justify-between">
                                <span>Delinger</span>
                                <span className="font-semibold text-white">{shares}</span>
                              </div>
                              <div className="mt-1 flex items-center justify-between">
                                <span>Visninger</span>
                                <span className="font-semibold text-white">{views}</span>
                              </div>
                              <div className="mt-1 flex items-center justify-between">
                                <span>Skjermbilder</span>
                                <span className="font-semibold text-white">{screens}</span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                              <div className="text-[11px] font-semibold text-white/80">
                                Reaksjoner
                              </div>
                              <div className="mt-1 text-[12px] text-white/70">
                                Det føles kanskje ufarlig… i starten.
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {canChoose ? (
                        <div className="mt-4 grid gap-2">
                          <button
                            type="button"
                            onClick={() => chooseNext("forward")}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                          >
                            <Forward className="h-4 w-4" /> Videresend
                          </button>
                          <button
                            type="button"
                            onClick={() => chooseNext("delete")}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                          >
                            <Trash2 className="h-4 w-4" /> Slett
                          </button>
                          <button
                            type="button"
                            onClick={() => chooseNext("ignore")}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                          >
                            <X className="h-4 w-4" /> Ignorer
                          </button>
                        </div>
                      ) : null}

                      {act === "end_safe" ? (
                        <div className="mt-4 rounded-3xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-200" />
                            <div>
                              <div className="text-sm font-semibold text-white">
                                Du stoppet spredningen
                              </div>
                              <div className="mt-1 text-xs leading-relaxed text-white/75">
                                Å slette/ikke dele kan være det viktigste valget. Hvis du er
                                bekymret for noen: snakk med en trygg voksen, skole eller kontakt
                                politiet ved behov.
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {act === "transition" ? (
                    <div className="grid h-full place-items-center text-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-[260px] rounded-3xl border border-white/10 bg-white/5 p-5"
                      >
                        <div className="text-sm font-semibold">…</div>
                        <div className="mt-2 text-xs leading-relaxed text-white/75">
                          Perspektivet skifter.
                        </div>
                      </motion.div>
                    </div>
                  ) : null}

                  {act === "video" ? (
                    <div className="grid h-full place-items-center text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[280px] rounded-3xl border border-white/10 bg-black/40 p-5"
                      >
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
                          Senere
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">
                          Én videresending blir til mange.
                        </div>
                        <div className="mt-2 text-xs leading-relaxed text-white/75">
                          Perspektivet skifter til den som rammes.
                        </div>
                      </motion.div>
                    </div>
                  ) : null}

                  {act === "act3" || act === "end" ? (
                    <motion.div
                      className="relative h-full"
                      animate={
                        !reduceMotion && act === "act3"
                          ? { x: shake === 0 ? 0 : shake === 1 ? -2 : shake === 2 ? 2 : -1 }
                          : undefined
                      }
                      transition={{ duration: 0.1 }}
                    >
                      <div className="text-sm font-semibold">Varsler</div>
                      <div className="mt-1 text-[11px] text-white/60">
                        Det stopper ikke når du prøver å lukke det.
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                        <div className="text-[11px] font-semibold text-white/80">DM</div>
                        <div className="mt-1 text-[13px] leading-snug text-white">
                          Har du sett deg selv? Alle har fått den.
                        </div>
                        <div className="mt-1 text-[11px] text-white/60">
                          Ukjent konto • akkurat nå
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <AnimatePresence initial={false}>
                          {noti.map((n) => (
                            <NotiToast
                              key={n.id}
                              n={n}
                              onClose={() => setNoti((prev) => prev.filter((p) => p.id !== n.id))}
                            />
                          ))}
                        </AnimatePresence>
                      </div>

                      {act === "end" ? (
                        <div className="absolute inset-x-0 bottom-0">
                          <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                            <div className="text-sm font-semibold text-white">
                              For deg var det ett klikk.
                            </div>
                            <div className="mt-1 text-xs leading-relaxed text-white/75">
                              For noen andre kan det endre alt.
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </motion.div>
                  ) : null}
                </div>
              </PhoneFrame>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
