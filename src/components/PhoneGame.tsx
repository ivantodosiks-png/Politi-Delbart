import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  CircleAlert,
  Image as ImageIcon,
  Link as LinkIcon,
  Lock,
  Search,
  Send,
  Shield,
  Sparkles,
  TriangleAlert,
  Users,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Screen = "inbox" | "thread" | "fake_site";
type Phase =
  | "idle"
  | "act1"
  | "popup"
  | "allow_loading"
  | "sextortion_chat"
  | "friend_angry"
  | "learn_bad"
  | "learn_good";
type LearnOutcome = "bad" | "good" | "ignored";
type Side = "friend" | "attacker" | "me" | "system";

type ChatMessage =
  | { id: string; kind: "text"; side: Side; text: string }
  | {
      id: string;
      kind: "snap";
      side: "friend";
      title: string;
      urlText: string;
    }
  | {
      id: string;
      kind: "gallery";
      side: "attacker";
      count: number;
      caption: string;
      threat?: string;
    }
  | { id: string; kind: "status"; side: "system"; text: string };

type ToastItem = { id: string; text: string; tone: "neutral" | "bad" };

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useSound() {
  const enabledRef = useRef(false);
  const audioRef = useRef<Record<string, HTMLAudioElement>>({});

  function setEnabled(v: boolean) {
    enabledRef.current = v;
  }

  function prime(src: string) {
    if (audioRef.current[src]) return;
    const a = new Audio(src);
    a.preload = "auto";
    audioRef.current[src] = a;
  }

  function play(src: string, volume = 0.6) {
    if (!enabledRef.current) return;
    const a = audioRef.current[src] ?? new Audio(src);
    audioRef.current[src] = a;
    a.volume = volume;
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  return { setEnabled, prime, play };
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[460px] rounded-[46px] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="relative mx-auto h-[84dvh] min-h-[620px] w-full overflow-hidden rounded-[38px] bg-white text-slate-900 ring-1 ring-black/5">
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
    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${c.join(" ")} ring-1 ring-black/10`} />
  );
}

function SafetyMeter({ value }: { value: number }) {
  const pct = clamp(value, 0, 100);
  const tone =
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between text-[12px]">
        <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
          <Shield className="h-4 w-4 text-blue-700" /> Digital trygghet
        </div>
        <div className="font-semibold text-slate-700">{pct}%</div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-[11px] text-slate-600">
        Trygghetsscore: hvert risikovalg senker scoren. I virkeligheten finnes ingen «poeng» – bare
        konsekvenser.
      </div>
    </div>
  );
}

function TypingDots({ dark }: { dark: boolean }) {
  const dot = dark ? "bg-white/70" : "bg-slate-500";
  return (
    <div className="flex items-center gap-1">
      <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${dot}`} />
      <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${dot} [animation-delay:120ms]`} />
      <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${dot} [animation-delay:240ms]`} />
    </div>
  );
}

function Toast({ text, tone }: { text: string; tone: "neutral" | "bad" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      className={[
        "rounded-2xl border px-3 py-3 shadow-sm backdrop-blur",
        tone === "bad"
          ? "border-rose-500/25 bg-rose-500/10 text-white"
          : "border-white/10 bg-white/10 text-white"
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="text-[13px] leading-snug">{text}</div>
    </motion.div>
  );
}

function MessageBubble({
  msg,
  friendLabel,
  attackerLabel,
  friendSeed,
  attackerSeed,
  snapLocked,
  onOpenSnap,
  onIgnoreSnap
}: {
  msg: ChatMessage;
  friendLabel: string;
  attackerLabel: string;
  friendSeed: number;
  attackerSeed: number;
  snapLocked: boolean;
  onOpenSnap: () => void;
  onIgnoreSnap: () => void;
}) {
  if (msg.kind === "status") {
    return (
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-700">
          <Sparkles className="h-4 w-4 text-slate-500" />
          {msg.text}
        </div>
      </div>
    );
  }

  const isLeft = msg.side === "friend" || msg.side === "attacker";
  const align = isLeft ? "justify-start" : "justify-end";
  const showAvatar = isLeft;
  const avatarSeed = msg.side === "friend" ? friendSeed : attackerSeed;
  const label = msg.side === "friend" ? friendLabel : attackerLabel;

  return (
    <div className={`flex ${align}`}>
      {showAvatar ? (
        <div className="mr-2 mt-1 shrink-0">
          <Avatar seed={avatarSeed} />
        </div>
      ) : null}
      <div
        className={[
          "max-w-[88%] rounded-3xl px-3 py-2.5 text-[14px] leading-relaxed",
          isLeft ? "bg-transparent" : "bg-slate-100 text-slate-900 ring-1 ring-black/5"
        ].join(" ")}
      >
        {msg.kind === "snap" ? (
          <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{label}</div>
            <div className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-slate-900">
              {msg.title}
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-black/5">
              <div className="flex items-center justify-between px-3 py-2 text-[12px] text-slate-600">
                <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                  <ImageIcon className="h-4 w-4" />
                  Sladdet bilde
                </span>
                <span className="inline-flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  {msg.urlText}
                </span>
              </div>
              <div className="h-28 w-full bg-gradient-to-br from-slate-200 to-slate-100 blur-[2px]" />
              <div className="border-t border-black/5 bg-white px-3 py-2 text-[12px] text-slate-600">
                Trykk «Åpne» for å se
              </div>
            </div>

            {snapLocked ? (
              <div className="mt-3 text-center text-[12px] font-medium text-slate-500">Lenke åpnet</div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onIgnoreSnap}
                  className="rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Ignorer
                </button>
                <button
                  type="button"
                  onClick={onOpenSnap}
                  className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Åpne lenke
                </button>
              </div>
            )}
          </div>
        ) : msg.kind === "gallery" ? (
          <div className="rounded-3xl border border-rose-500/25 bg-rose-500/8 p-4 ring-1 ring-rose-500/15">
            <div className="text-sm font-semibold text-rose-800">{label}</div>
            <div className="mt-2 text-[15px] font-semibold leading-relaxed text-slate-900">
              {msg.caption}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Array.from({ length: msg.count }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-slate-300 to-slate-200 ring-1 ring-rose-500/20"
                >
                  <div className="absolute inset-0 backdrop-blur-md" />
                  <div className="absolute inset-0 flex items-center justify-center text-lg opacity-60">
                    ?
                  </div>
                </div>
              ))}
            </div>
            {msg.threat ? (
              <div className="mt-3 rounded-2xl border border-rose-500/25 bg-white px-3 py-2.5 text-[13px] font-semibold leading-snug text-rose-900">
                {msg.threat}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-start gap-3">
            {isLeft ? <div className="mt-1 h-10 w-0.5 rounded-full bg-sky-500" /> : null}
            <div>
              {isLeft ? (
                <div
                  className={[
                    "text-sm font-semibold",
                    msg.side === "attacker" ? "text-rose-700" : "text-sky-700"
                  ].join(" ")}
                >
                  {label}
                </div>
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

function ExplainScreen({
  outcome,
  reduceMotion,
  onTryAgain,
  onHelp
}: {
  outcome: LearnOutcome;
  reduceMotion: boolean | null;
  onTryAgain: () => void;
  onHelp: () => void;
}) {
  const isBad = outcome === "bad";
  const steps =
    outcome === "bad"
      ? [
          { t: "1", title: "Du klikket på en ukjent lenke", body: "En falsk «story»-side etterlignet en kjent app." },
          {
            t: "2",
            title: "Du ga tilgang til bilder",
            body: "Med «Tillat» kan angripere hente eller kopiere innhold fra telefonen din."
          },
          {
            t: "3",
            title: "Press og trusler i chat",
            body: "Ukjente kontoer bruker skam, latter og trusler om å dele til alle – dette er sextortion."
          },
          {
            t: "→",
            title: "Dette kan føre til",
            body: "Utpressing, rykter, stress, deling i klassen – og i alvorlige tilfeller politietterforskning."
          }
        ]
      : outcome === "good"
        ? [
            {
              t: "✓",
              title: "Du sa nei til tilgang",
              body: "Du stoppet angrepet før ukjente fikk bildene dine."
            },
            {
              t: "!",
              title: "Vennen ble sint",
              body: "Manipulering kan se ut som vennskapelig press – «stol på meg», «haster»."
            },
            {
              t: "→",
              title: "I virkeligheten",
              body: "Sinthet og banning er også et rødt flagg. Snakk med en voksen hvis noen presser deg."
            }
          ]
        : [
            {
              t: "✓",
              title: "Du åpnet ikke lenken",
              body: "Det er ofte det tryggeste når meldingen virker stressende eller uvanlig."
            },
            {
              t: "→",
              title: "Husk",
              body: "Sjekk alltid avsender og domene. Ved tvil: vis meldingen til en voksen eller ring 02800."
            }
          ];

  return (
    <motion.div
      className={[
        "absolute inset-0 z-50 flex flex-col overflow-hidden",
        isBad ? "bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white" : "bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white"
      ].join(" ")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            Dette skjedde nå
          </p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight">
            {isBad
              ? "Slik kan ett klikk bli utpressing"
              : outcome === "good"
                ? "Du stoppet det – men presset var reelt"
                : "Smart valg i chatten"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            {isBad
              ? "Dette er en simulering. I virkeligheten kan konsekvensene bli alvorlige og vare lenge."
              : "Dette er en simulering – men mønstrene er ekte. Slik gjenkjenner du dem neste gang."}
          </p>
        </motion.div>

        <div className="mt-6 space-y-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex gap-3">
                <span
                  className={[
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                    isBad ? "bg-rose-500/30 text-rose-100" : "bg-emerald-500/25 text-emerald-100"
                  ].join(" ")}
                >
                  {s.t}
                </span>
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-white/70">{s.body}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {isBad ? (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm leading-relaxed text-rose-100"
          >
            Ikke betal. Ta skjermbilder, blokker kontoen, snakk med en trygg voksen og ring{" "}
            <span className="font-semibold">02800</span>.
          </motion.p>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-white/10 bg-black/40 px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Prøv igjen
          </button>
          <button
            type="button"
            onClick={onHelp}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Hvordan beskytte deg
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FakeSite({
  onRequestPhotos
}: {
  onRequestPhotos: () => void;
}) {
  return (
    <div className="h-full bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/35 px-4 py-3">
        <div className="inline-flex items-center gap-2 text-[12px] text-white/80">
          <Lock className="h-4 w-4" />
          snap-profile-story.net
        </div>
        <div className="text-[12px] text-white/60">Story viewer</div>
      </div>

      <div className="p-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold">Se story</div>
          <div className="mt-2 text-xs leading-relaxed text-white/70">
            Denne siden etterligner en kjent tjeneste. Sjekk alltid domenet før du trykker «Åpne».
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="h-44 w-full bg-gradient-to-br from-white/10 to-white/5 blur-[1px]" />
            <div className="border-t border-white/10 bg-black/30 px-4 py-3 text-[12px] text-white/75">
              Tap to view
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestPhotos}
            className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Åpne
          </button>
        </div>
      </div>
    </div>
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
  const { setEnabled, prime, play } = useSound();

  const [sound, setSound] = useState(false);
  const [screen, setScreen] = useState<Screen>("inbox");
  const [phase, setPhase] = useState<Phase>("idle");
  const [typing, setTyping] = useState(false);
  const [friendName, setFriendName] = useState("Elias");
  const [friendSeed, setFriendSeed] = useState(9);
  const [attackerName, setAttackerName] = useState("Ukjent konto");
  const [attackerSeed, setAttackerSeed] = useState(17);
  const [chatPartner, setChatPartner] = useState<"friend" | "attacker">("friend");
  const [snapLocked, setSnapLocked] = useState(false);
  const [learnOutcome, setLearnOutcome] = useState<LearnOutcome>("bad");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [safety, setSafety] = useState(85);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [stress, setStress] = useState(0);
  const [galleryFx, setGalleryFx] = useState<Array<{ id: string; x: number; y: number; d: number }>>([]);

  const reactions = useMemo(() => ["😂", "😳", "💀", "🔥", "👀", "😡"], []);
  const [floaters, setFloaters] = useState<Array<{ id: string; x: number; y: number; t: string }>>([]);

  useEffect(() => setEnabled(sound), [sound, setEnabled]);

  useEffect(() => {
    // sound placeholders (files can be added later)
    prime("/sfx/notification.mp3");
    prime("/sfx/warning.mp3");
    prime("/sfx/success.mp3");
  }, [prime]);

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
    setFriendName("Elias");
    setFriendSeed(9);
    setAttackerName("Ukjent konto");
    setAttackerSeed(17);
    setChatPartner("friend");
    setSnapLocked(false);
    setLearnOutcome("bad");
    setSafety(85);
    setMessages([]);
    setToasts([]);
    setStress(0);
    setFloaters([]);
    setGalleryFx([]);
  }

  useEffect(() => {
    if (!open) {
      resetScenario();
      return;
    }
    resetScenario();
    const t = window.setTimeout(() => openThread(), 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, typing, reduceMotion]);

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

  function openThread() {
    setScreen("thread");
    setPhase("act1");
    setTyping(false);
    setChatPartner("friend");
    setSnapLocked(false);
    setMessages([
      { id: uid(), kind: "status", side: "system", text: "I dag" },
      {
        id: uid(),
        kind: "snap",
        side: "friend",
        title: "BRO ER DETTE DEG!!!?? 😭💀\nSjekk denne…",
        urlText: "snap-profile-story.net"
      }
    ]);
    play("/sfx/notification.mp3", 0.45);
  }

  function backToInbox() {
    setScreen("inbox");
    setPhase("idle");
    setTyping(false);
    setMessages([]);
    setToasts([]);
    setStress(0);
    setGalleryFx([]);
    setFloaters([]);
  }

  useEffect(() => {
    if (!open) return;
    if (screen !== "thread") return;
    if (phase !== "act1") return;

    setTyping(true);
    const t1 = window.setTimeout(() => setTyping(false), 900);
    const t2 = window.setTimeout(() => {
      pushMsg({ id: uid(), kind: "text", side: "friend", text: "Trykk på linken fort 😅" });
      play("/sfx/notification.mp3", 0.45);
    }, 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open, phase, play, screen]);

  function openSnapFlow() {
    setSnapLocked(true);
    setSafety((s) => Math.max(10, s - 12));
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Åpner lenken…" });
    setScreen("fake_site");
    play("/sfx/notification.mp3", 0.35);
  }

  function ignoreSnapFlow() {
    setSnapLocked(true);
    setSafety((s) => Math.min(100, s + 8));
    play("/sfx/success.mp3", 0.5);
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Nei, jeg åpner ikke den." });
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "text",
        side: "friend",
        text: "Hæ?? Det tar 2 sek. Tro meg da 🙄"
      });
      window.setTimeout(() => {
        setLearnOutcome("ignored");
        setPhase("learn_good");
      }, 1400);
    }, 900);
  }

  function requestPhotosPopup() {
    setPhase("popup");
  }

  function denyAccess() {
    setSafety((s) => Math.min(100, s + 10));
    play("/sfx/success.mp3", 0.5);
    setScreen("thread");
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Nei – ikke gi tilgang." });
    setPhase("friend_angry");
  }

  function allowAccess() {
    setSafety((s) => Math.max(0, s - 35));
    play("/sfx/warning.mp3", 0.6);
    setPhase("allow_loading");
    pushMsg({ id: uid(), kind: "text", side: "me", text: "Tillater tilgang til bilder…" });
  }

  useEffect(() => {
    if (!open) return;
    if (phase !== "allow_loading") return;

    setScreen("thread");
    const t = window.setTimeout(() => setPhase("sextortion_chat"), reduceMotion ? 350 : 1200);
    return () => window.clearTimeout(t);
  }, [open, phase, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    if (phase !== "friend_angry") return;

    setScreen("thread");
    setChatPartner("friend");
    setTyping(true);

    const t1 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "text",
        side: "friend",
        text: "Hæ?? Var det ikke DU som ba meg sende den?? 😤"
      });
    }, 700);

    const t2 = window.setTimeout(() => setTyping(true), 1400);

    const t3 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "text",
        side: "friend",
        text: "Du stoler jo ikke på meg engang. Whatever."
      });
    }, 2100);

    const t4 = window.setTimeout(() => setTyping(true), 2800);

    const t5 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "text",
        side: "friend",
        text: "Dra til helvete da 🙄"
      });
      play("/sfx/warning.mp3", 0.4);
    }, 3500);

    const t6 = window.setTimeout(() => {
      setLearnOutcome("good");
      setPhase("learn_good");
    }, 4800);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
      window.clearTimeout(t6);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, phase]);

  useEffect(() => {
    if (!open) return;
    if (phase !== "sextortion_chat") return;

    setScreen("thread");
    setChatPartner("attacker");
    setAttackerName("Ukjent konto");
    setTyping(true);

    const t1 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "text",
        side: "attacker",
        text: "Haha 😂 Vi har bildene dine nå."
      });
      play("/sfx/warning.mp3", 0.55);
    }, 650);

    const t2 = window.setTimeout(() => setTyping(true), 1100);

    const t3 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "gallery",
        side: "attacker",
        count: 6,
        caption: "Er dette deg?? 😂"
      });
      play("/sfx/warning.mp3", 0.55);

      if (!reduceMotion) {
        const rx = clamp(Math.random(), 0.12, 0.88);
        const ry = clamp(Math.random(), 0.22, 0.78);
        const em = reactions[Math.floor(Math.random() * reactions.length)]!;
        setFloaters((f) => [...f.slice(-10), { id: uid(), x: rx, y: ry, t: em }]);
        const items = Array.from({ length: 8 }).map(() => ({
          id: uid(),
          x: Math.random(),
          y: Math.random(),
          d: (Math.random() * 2 - 1) * 1
        }));
        setGalleryFx(items);
        window.setTimeout(() => setGalleryFx([]), 1200);
      }
    }, 1700);

    const t4 = window.setTimeout(() => setTyping(true), 2400);

    const t5 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "text",
        side: "attacker",
        text: "Jeg sender dette til ALLE i klassen med mindre du gjør som jeg sier 😈"
      });
      play("/sfx/warning.mp3", 0.55);
      if (!reduceMotion) setStress((s) => (s + 1) % 4);
    }, 3100);

    const t6 = window.setTimeout(() => setTyping(true), 3800);

    const t7 = window.setTimeout(() => {
      setTyping(false);
      pushMsg({
        id: uid(),
        kind: "gallery",
        side: "attacker",
        count: 3,
        caption: "Siste sjanse.",
        threat: "Send 500 kr nå – ellers går det ut til foreldrene dine også."
      });
      play("/sfx/warning.mp3", 0.55);
      window.setTimeout(() => {
        setLearnOutcome("bad");
        setPhase("learn_bad");
      }, reduceMotion ? 500 : 2200);
    }, 4500);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
      window.clearTimeout(t6);
      window.clearTimeout(t7);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, phase]);

  function tryAgain() {
    resetScenario();
    openThread();
  }

  function goProtection() {
    closeExperience();
    window.setTimeout(() => {
      document.getElementById("help")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  const inboxNames = useMemo(
    () => [
      { name: "Maja", sub: "Mottatt • 8 t" },
      { name: "Noah", sub: "Mottatt • 1 m" },
      { name: "Linnea", sub: "Åpnet • 2 t" }
    ],
    []
  );

  return (
    <section id="experience" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Interaktiv øvelse"
            title="Opplev phishing og sextortion – trygt"
            description="Et kort, fiktivt scenario i en chat-app. Du velger selv: ignorere, åpne eller gi tillatelse. Ingen ekte data samles inn – målet er å lære mønstrene før det skjer på ekte."
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openExperience}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Start øvelsen
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="checkbox"
                className="accent-blue-700"
                checked={sound}
                onChange={(e) => setSound(e.target.checked)}
              />
              Lydeffekter
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
                {/* Phone status bar */}
                <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-white px-5 py-3 text-[12px] text-slate-700">
                  <div className="font-semibold">09:06</div>
                  <div className="inline-flex items-center gap-2 text-slate-500">
                    <span className="h-1.5 w-10 rounded-full bg-slate-200" />
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                    <span className="h-3 w-3 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="absolute inset-x-0 top-[44px] z-10 border-b border-black/5 bg-white px-4 py-3">
                  {screen === "inbox" ? (
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
                        <Avatar seed={3} />
                      </div>
                      <div className="text-base font-semibold">Chat</div>
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
                          className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 text-slate-900 hover:bg-amber-200"
                          aria-label="Venner"
                        >
                          <Users className="h-5 w-5" />
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
                          <Avatar seed={chatPartner === "friend" ? friendSeed : attackerSeed} />
                          <div className="min-w-0">
                            <div
                              className={[
                                "truncate text-base font-semibold",
                                chatPartner === "attacker" ? "text-rose-700" : ""
                              ].join(" ")}
                            >
                              {chatPartner === "friend" ? friendName : attackerName}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {typing ? "skriver…" : chatPartner === "attacker" ? "ukjent" : "i dag"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200"
                          aria-label="Info"
                        >
                          <CircleAlert className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Safety meter (overlay on both screens) */}
                <div className="absolute left-4 right-4 top-[110px] z-10">
                  <SafetyMeter value={safety} />
                </div>

                {screen === "inbox" ? (
                  <div className="absolute inset-0 bg-white pt-[200px]">
                    <div className="sticky top-[200px] z-0 px-4 pb-3">
                      <div className="flex gap-6 overflow-auto text-sm font-semibold text-slate-700">
                        {["Nær meg", "Samtaler", "Grupper", "Svar", "Bestevenner"].map((t) => (
                          <div key={t} className="whitespace-nowrap">
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2">
                      {inboxNames.map((c) => (
                        <div
                          key={c.name}
                          className="flex items-center gap-3 border-b border-black/5 bg-white px-4 py-3"
                        >
                          <Avatar seed={c.name.length} />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold">{c.name}</div>
                            <div className="mt-0.5 text-[12px] text-slate-600">{c.sub}</div>
                          </div>
                          <button
                            type="button"
                            className="rounded-full bg-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-200"
                          >
                            Kamera
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={openThread}
                        className="flex w-full items-center gap-3 border-b border-black/5 bg-white px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <Avatar seed={friendSeed} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="truncate text-sm font-semibold">{friendName}</div>
                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                          </div>
                          <div className="mt-0.5 truncate text-[12px] text-slate-600">
                            Nytt snap • nå
                          </div>
                        </div>
                        <div className="text-[12px] font-semibold text-rose-600">New</div>
                      </button>
                    </div>
                  </div>
                ) : null}

                {screen === "thread" ? (
                  <>
                    {chatPartner === "friend" && phase === "act1" ? (
                      <div className="absolute inset-x-0 top-[200px] border-b border-black/5 bg-slate-50 px-4 py-2 text-[12px] text-slate-600">
                        Ikke gå glipp av chats fra {friendName}!{" "}
                        <span className="font-semibold text-blue-700">Aktiver varsler</span>
                      </div>
                    ) : null}

                    <div
                      className={[
                        "absolute inset-x-0 bottom-14 bg-white px-4 py-4",
                        chatPartner === "friend" && phase === "act1" ? "top-[248px]" : "top-[200px]"
                      ].join(" ")}
                    >
                      <div className="flex h-full flex-col justify-end">
                        <div className="max-h-full space-y-2 overflow-y-auto overscroll-contain pr-1">
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
                                  attackerLabel={attackerName}
                                  friendSeed={friendSeed}
                                  attackerSeed={attackerSeed}
                                  snapLocked={snapLocked}
                                  onOpenSnap={openSnapFlow}
                                  onIgnoreSnap={ignoreSnapFlow}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {typing ? (
                            <div className="flex justify-start">
                              <div className="rounded-3xl bg-slate-100 px-4 py-3">
                                <TypingDots dark={false} />
                              </div>
                            </div>
                          ) : null}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-14 px-4 pb-3" />

                    <div className="absolute inset-x-0 bottom-0">
                      <InputBar disabled />
                    </div>
                  </>
                ) : null}

                {/* Fake site screen */}
                {screen === "fake_site" ? (
                  <div className="absolute inset-0 top-[44px] z-10">
                    <FakeSite onRequestPhotos={requestPhotosPopup} />
                  </div>
                ) : null}

                {/* Popup */}
                <AnimatePresence>
                  {screen === "fake_site" && phase === "popup" ? (
                    <motion.div
                      className="absolute inset-0 z-40 grid place-items-center bg-black/55 p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.22 }}
                        className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-slate-950/90 p-5 text-white shadow-xl backdrop-blur"
                        role="dialog"
                        aria-label="Tillatelse"
                      >
                        <div className="flex items-start gap-3">
                          <TriangleAlert className="mt-0.5 h-5 w-5 text-amber-300" />
                          <div>
                            <div className="text-sm font-semibold">Gi tilgang til bilder?</div>
                            <div className="mt-1 text-xs leading-relaxed text-white/70">
                              Ukjent side ber om tilgang. Dette er et typisk phishing-mønster – si nei hvis du er
                              usikker.
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={denyAccess}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                          >
                            Avslå
                          </button>
                          <button
                            type="button"
                            onClick={allowAccess}
                            className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500"
                          >
                            Tillat
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Allow loading */}
                <AnimatePresence>
                  {phase === "allow_loading" ? (
                    <motion.div
                      className="absolute inset-0 z-50 grid place-items-center bg-slate-950 text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                        <div className="text-sm font-semibold">Laster…</div>
                        <div className="mt-2 text-xs text-white/70">
                          Dette er hvordan falske sider kan føles «normale» – mens de ber om tilgang.
                        </div>
                        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className="h-full bg-rose-500"
                            initial={{ width: "8%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: reduceMotion ? 0.4 : 1.0 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Sextortion / stress */}
                <AnimatePresence>
                  {phase === "sextortion_chat" ? (
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-rose-600/15 via-transparent to-black/15"
                        animate={
                          reduceMotion
                            ? undefined
                            : {
                                x: stress === 0 ? 0 : stress === 1 ? -2 : stress === 2 ? 2 : -1,
                                filter: ["none", "contrast(1.25) saturate(1.4)", "none"]
                              }
                        }
                        transition={{ duration: 0.25 }}
                      />

                      {/* flying thumbnails */}
                      {!reduceMotion ? (
                        <div className="pointer-events-none absolute inset-0">
                          <AnimatePresence>
                            {galleryFx.map((g) => (
                              <motion.div
                                key={g.id}
                                className="absolute rounded-2xl bg-white/10 ring-1 ring-white/10"
                                style={{
                                  width: 64,
                                  height: 64,
                                  left: `${g.x * 100}%`,
                                  top: `${g.y * 100}%`,
                                  transform: "translate(-50%, -50%)"
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                  opacity: [0, 1, 0],
                                  scale: [0.9, 1, 0.85],
                                  x: [0, g.d * 120],
                                  y: [0, -140]
                                }}
                                transition={{ duration: 1.0 }}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : null}

                      {/* floaters */}
                      {!reduceMotion ? (
                        <div className="pointer-events-none absolute inset-0">
                          <AnimatePresence>
                            {floaters.map((f) => (
                              <motion.div
                                key={f.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                                className="absolute text-xl"
                                style={{
                                  left: `${f.x * 100}%`,
                                  top: `${f.y * 100}%`,
                                  transform: "translate(-50%, -50%)"
                                }}
                              >
                                {f.t}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : null}

                      {/* toast stack */}
                      <div className="absolute inset-x-0 top-[140px] z-20 px-4">
                        <div className="space-y-2">
                          <AnimatePresence initial={false}>
                            {toasts.map((t) => (
                              <Toast key={t.id} text={t.text} tone={t.tone} />
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Fullskjerm forklaring */}
                <AnimatePresence>
                  {phase === "learn_bad" || phase === "learn_good" ? (
                    <ExplainScreen
                      outcome={learnOutcome}
                      reduceMotion={reduceMotion}
                      onTryAgain={tryAgain}
                      onHelp={goProtection}
                    />
                  ) : null}
                </AnimatePresence>
              </PhoneFrame>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

