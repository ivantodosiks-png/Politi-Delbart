import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Link2, PhoneCall, ShieldCheck, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ThreatType = "phishing" | "malware" | "scam" | "unknown";

type Threat = {
  id: string;
  type: ThreatType;
  x: number; // 0..1
  y: number; // 0..1+
  speed: number; // units/sec
};

const threatMeta: Record<
  ThreatType,
  { label: string; icon: typeof TriangleAlert; color: string }
> = {
  phishing: { label: "Фишинг", icon: Link2, color: "bg-amber-500/20 text-amber-200 ring-amber-400/25" },
  malware: { label: "Вирус", icon: Bug, color: "bg-rose-500/20 text-rose-200 ring-rose-400/25" },
  scam: { label: "Развод", icon: PhoneCall, color: "bg-fuchsia-500/20 text-fuchsia-200 ring-fuchsia-400/25" },
  unknown: { label: "Неизвестно", icon: TriangleAlert, color: "bg-sky-500/20 text-sky-200 ring-sky-400/25" }
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const GAME_HEIGHT = 520;
const GAME_WIDTH = 320;
const PADDLE_W = 96;
const PADDLE_H = 18;
const THREAT_SIZE = 44;

export default function PhoneGame() {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paddle, setPaddle] = useState(0.5);
  const [best, setBest] = useState<number>(() => {
    const raw = localStorage.getItem("bestScore");
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  });
  const [threats, setThreats] = useState<Threat[]>([]);
  const [blockFx, setBlockFx] = useState<Array<{ id: string; x: number; y: number }>>([]);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const pointerDown = useRef(false);
  const paddleX = useRef(0.5); // 0..1
  const lastT = useRef<number | null>(null);
  const spawnAcc = useRef(0);

  const difficulty = useMemo(() => {
    // 0..1, scales with score
    return clamp(score / 25, 0, 1);
  }, [score]);

  function reset() {
    setScore(0);
    setLives(3);
    setThreats([]);
    setBlockFx([]);
    paddleX.current = 0.5;
    setPaddle(0.5);
    lastT.current = null;
    spawnAcc.current = 0;
  }

  function start() {
    reset();
    setRunning(true);
  }

  function endGame(finalScore: number) {
    setRunning(false);
    setBest((prev) => {
      const next = Math.max(prev, finalScore);
      localStorage.setItem("bestScore", String(next));
      return next;
    });
  }

  function onPointerMove(clientX: number) {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const nx = clamp(x, 0.05, 0.95);
    paddleX.current = nx;
    setPaddle(nx);
  }

  useEffect(() => {
    function onUp() {
      pointerDown.current = false;
    }
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, []);

  useEffect(() => {
    if (!running) return;

    let raf = 0;
    const tick = (t: number) => {
      const prevT = lastT.current ?? t;
      const dt = Math.min(0.05, (t - prevT) / 1000);
      lastT.current = t;

      spawnAcc.current += dt;
      const spawnEvery = 0.9 - difficulty * 0.45; // 0.45..0.9 sec
      const baseSpeed = 0.32 + difficulty * 0.18; // units/sec

      if (spawnAcc.current >= spawnEvery) {
        spawnAcc.current = 0;
        const types: ThreatType[] = ["phishing", "malware", "scam", "unknown"];
        const type = types[Math.floor(Math.random() * types.length)]!;
        setThreats((prev) => [
          ...prev,
          {
            id: uid(),
            type,
            x: clamp(Math.random(), 0.08, 0.92),
            y: -0.1,
            speed: baseSpeed + Math.random() * 0.12
          }
        ]);
      }

      setThreats((prev) => {
        if (prev.length === 0) return prev;

        const px = paddleX.current;
        const paddleLeft = px * GAME_WIDTH - PADDLE_W / 2;
        const paddleTop = GAME_HEIGHT - 22;
        const paddleRight = paddleLeft + PADDLE_W;
        const paddleBottom = paddleTop + PADDLE_H;

        let blocked = 0;
        let missed = 0;
        const next: Threat[] = [];

        for (const th of prev) {
          const ny = th.y + th.speed * dt;
          const cx = th.x * GAME_WIDTH;
          const cy = ny * GAME_HEIGHT;
          const thLeft = cx - THREAT_SIZE / 2;
          const thRight = cx + THREAT_SIZE / 2;
          const thTop = cy - THREAT_SIZE / 2;
          const thBottom = cy + THREAT_SIZE / 2;

          const hit =
            thRight >= paddleLeft &&
            thLeft <= paddleRight &&
            thBottom >= paddleTop &&
            thTop <= paddleBottom;

          if (hit) {
            blocked += 1;
            const fx = { id: uid(), x: clamp(th.x, 0.1, 0.9), y: clamp(ny, 0.72, 0.92) };
            setBlockFx((f) => [...f.slice(-8), fx]);
            continue;
          }

          if (ny > 1.08) {
            missed += 1;
            continue;
          }

          next.push({ ...th, y: ny });
        }

        if (blocked) setScore((s) => s + blocked);
        if (missed) {
          setLives((l) => {
            const nl = l - missed;
            if (nl <= 0) {
              // end with current score (sync-ish)
              queueMicrotask(() => endGame(score + blocked));
            }
            return nl;
          });
        }

        return next;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // score is intentionally not a dependency; we update via setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, difficulty]);

  return (
    <section id="game" className="border-t border-white/10 bg-slate-950">
      <Container>
        <div className="py-14 lg:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <SectionTitle
                eyebrow="Mini‑spill"
                title="Поймай угрозы щитом"
                description={
                  <>
                    Двигай щит внизу экрана и блокируй угрозы. Управление работает мышью и на
                    телефоне. Цель — не пропустить три угрозы.
                  </>
                }
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">Лучший</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{best}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">Сейчас</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{score}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">Жизни</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{Math.max(0, lives)}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {!running ? (
                  <motion.button
                    type="button"
                    onClick={start}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow hover:bg-sky-400"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Старт
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setRunning(false)}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Пауза
                  </motion.button>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Сброс
                </button>
                <div className="text-xs text-slate-400">
                  Подсказка: удерживай палец/мышь и води по экрану.
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-[360px]">
              <div className="rounded-[42px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-glow">
                <div
                  ref={boxRef}
                  className="relative mx-auto overflow-hidden rounded-[32px] bg-slate-950/40 ring-1 ring-white/10"
                  style={{ width: GAME_WIDTH, height: GAME_HEIGHT, touchAction: "none" }}
                  onPointerDown={(e) => {
                    pointerDown.current = true;
                    onPointerMove(e.clientX);
                  }}
                  onPointerMove={(e) => {
                    if (!pointerDown.current) return;
                    onPointerMove(e.clientX);
                  }}
                >
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[11px] text-slate-300">
                    <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                      {running ? "В процессе" : lives <= 0 ? "Игра окончена" : "Готово"}
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                      Score: {score}
                    </div>
                  </div>

                  <AnimatePresence>
                    {threats.map((th) => {
                      const meta = threatMeta[th.type];
                      const Icon = meta.icon;
                      return (
                        <motion.div
                          key={th.id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className={`absolute grid place-items-center rounded-2xl ring-1 ${meta.color}`}
                          style={{
                            width: THREAT_SIZE,
                            height: THREAT_SIZE,
                            left: `${th.x * 100}%`,
                            top: `${th.y * 100}%`,
                            transform: "translate(-50%, -50%)"
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <AnimatePresence>
                    {blockFx.map((fx) => (
                      <motion.div
                        key={fx.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="pointer-events-none absolute rounded-full bg-sky-400/25 blur-sm"
                        style={{
                          width: 48,
                          height: 48,
                          left: `${fx.x * 100}%`,
                          top: `${fx.y * 100}%`,
                          transform: "translate(-50%, -50%)"
                        }}
                        onAnimationComplete={() => {
                          setBlockFx((prev) => prev.filter((p) => p.id !== fx.id));
                        }}
                      />
                    ))}
                  </AnimatePresence>

                  <div
                    className="absolute rounded-full bg-sky-400 shadow-glow"
                    style={{
                      width: PADDLE_W,
                      height: PADDLE_H,
                      left: `${paddle * 100}%`,
                      top: GAME_HEIGHT - 22,
                      transform: "translate(-50%, 0)"
                    }}
                  />

                  {!running ? (
                    <div className="absolute inset-0 grid place-items-center p-6 text-center">
                      <div className="max-w-[240px] rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm font-semibold text-white">
                          {lives <= 0 ? "Игра окончена" : "Готов начать?"}
                        </div>
                        <div className="mt-2 text-xs leading-relaxed text-slate-300">
                          Заблокируй угрозы, двигая щит. На телефоне — удерживай палец и води по
                          экрану.
                        </div>
                        <div className="mt-4 text-xs text-slate-400">
                          Угрозы:{" "}
                          <span className="text-slate-200">
                            {Object.values(threatMeta)
                              .map((m) => m.label)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2 lg:grid-cols-1">
                {Object.entries(threatMeta).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className={`grid h-7 w-7 place-items-center rounded-xl ring-1 ${v.color}`}>
                      <v.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-slate-200">{v.label}</div>
                      <div className="text-[11px]">
                        Блокируй — не пропускай вниз
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
