import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { BadgeCheck, Fingerprint, GlobeLock, KeyRound } from "lucide-react";

const items = [
  {
    icon: GlobeLock,
    title: "Фишинг",
    text: "Поддельные сайты и сообщения, которые пытаются украсть данные."
  },
  {
    icon: KeyRound,
    title: "Пароли",
    text: "Слабые или повторяющиеся пароли — самый частый вход для злоумышленников."
  },
  {
    icon: Fingerprint,
    title: "2FA",
    text: "Второй фактор (приложение/ключ) снижает риск взлома в разы."
  },
  {
    icon: BadgeCheck,
    title: "Обновления",
    text: "Патчи закрывают уязвимости — это простая привычка с большим эффектом."
  }
];

export default function InfoSection() {
  return (
    <section id="info" className="border-t border-white/10 bg-slate-950">
      <Container>
        <div className="py-14 lg:py-20">
          <SectionTitle
            eyebrow="О проекте"
            title="Коротко и по делу — без перегруза"
            description="Страница построена как быстрый тренажёр: сначала понятные тезисы, затем карточки рисков и mini‑spill на телефоне/ПК."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it, idx) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <it.icon className="h-5 w-5 text-sky-300" />
                <div className="mt-3 text-sm font-semibold text-white">{it.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-300">{it.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
