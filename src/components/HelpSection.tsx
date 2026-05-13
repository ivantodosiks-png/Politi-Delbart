import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { CircleCheck, KeyRound, MailWarning, Shield, Smartphone } from "lucide-react";

const tips = [
  {
    icon: MailWarning,
    title: "Проверяй отправителя",
    text: "Смотри домен, адрес и детали. Фишинг часто «почти» совпадает."
  },
  {
    icon: KeyRound,
    title: "Пароли + 2FA",
    text: "Менеджер паролей + второй фактор для почты, банка, соцсетей."
  },
  {
    icon: Smartphone,
    title: "Обновления",
    text: "Включи авто‑обновления ОС и приложений, удаляй лишние программы."
  },
  {
    icon: Shield,
    title: "Сомневаешься — остановись",
    text: "Перезвони по официальному номеру. Не действуй под давлением."
  }
];

export default function HelpSection() {
  return (
    <section id="help" className="border-t border-white/10 bg-slate-950">
      <Container>
        <div className="py-14 lg:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <SectionTitle
              eyebrow="Помощь"
              title="5 простых правил на каждый день"
              description={
                <>
                  Это короткий набор привычек. Он занимает минуты, но экономит часы и деньги.
                </>
              }
            />

            <div className="max-w-xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-glow">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CircleCheck className="h-5 w-5 text-emerald-300" />
                Сохрани себе
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Можно использовать как чек‑лист перед оплатой/вводом данных.
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  "Не вводи коды и пароли по просьбе «службы безопасности».",
                  "Не устанавливай приложения из неизвестных источников.",
                  "Проверяй ссылки: домен, https, орфография, лишние символы.",
                  "Делай резервные копии важных данных.",
                  "Если сомневаешься — остановись и спроси взрослого/специалиста."
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-slate-200">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-300" />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tips.map((tip, idx) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <tip.icon className="h-5 w-5 text-sky-300" />
                <div className="mt-3 text-sm font-semibold text-white">{tip.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-300">{tip.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
