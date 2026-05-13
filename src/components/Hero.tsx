import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldCheck, Smartphone } from "lucide-react";
import Container from "./Container";
import logoPartner from "../assets/logo-partner.png";
import logoMain from "../assets/logo-main.png";

const bullets = [
  { icon: ShieldCheck, title: "Понятно", text: "Коротко объясняем риски и привычки защиты." },
  { icon: Smartphone, title: "Практично", text: "Mini‑spill тренирует реакцию и внимательность." },
  { icon: Lock, title: "Современно", text: "Дизайн и анимации без перегруза и лишних зависимостей." }
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />

      <Container>
        <div className="relative grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Профессиональный одностраничный сайт + mini‑spill
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              Защити себя в интернете —<br className="hidden sm:block" />
              <span className="text-sky-300">за 3 минуты</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
            >
              Небольшой интерактивный сайт: ключевые риски, простые советы и мини‑игра, которая
              помогает закрепить навыки кибербезопасности.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#game"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow hover:bg-sky-400"
              >
                Перейти к игре <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#help"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Быстрые советы
              </a>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {bullets.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <b.icon className="h-5 w-5 text-sky-300" />
                  <div className="mt-3 text-sm font-semibold text-white">{b.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-slate-300">{b.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-glow"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={logoMain}
                    alt="Logo main"
                    className="h-10 w-10 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10"
                    loading="lazy"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Проверка привычек</div>
                    <div className="text-xs text-slate-400">1 мин • 5 правил</div>
                  </div>
                </div>
                <img
                  src={logoPartner}
                  alt="Partner"
                  className="h-10 w-10 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10"
                  loading="lazy"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Быстрый чек‑лист
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300" />
                    Не вводи данные по ссылкам из сообщений
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300" />
                    Включи 2FA и обновления
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300" />
                    Проверяй домен и отправителя
                  </li>
                </ul>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-white/90">Меньше ошибок</div>
                  <div className="mt-1 text-2xl font-semibold text-white">≈ 40%</div>
                  <div className="mt-1">когда есть правила</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-white/90">Сильнее пароли</div>
                  <div className="mt-1 text-2xl font-semibold text-white">+ 2FA</div>
                  <div className="mt-1">на важных аккаунтах</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

