import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { Bug, Link2, PhoneCall, TriangleAlert } from "lucide-react";

const risks = [
  {
    icon: TriangleAlert,
    title: "Срочность и давление",
    text: "Если «нужно прямо сейчас», остановись. Проверь источник, перезвони по официальному номеру."
  },
  {
    icon: Link2,
    title: "Ссылки из сообщений",
    text: "Наведи курсор/долгий тап: смотри домен. Лучше набрать адрес вручную."
  },
  {
    icon: Bug,
    title: "Сомнительные файлы",
    text: "Не открывай вложения от неизвестных. На телефоне — не устанавливай APK вне магазинов."
  },
  {
    icon: PhoneCall,
    title: "Звонки «из банка»",
    text: "Не сообщай коды. Банк/полиция не просит одноразовые пароли и удалённый доступ."
  }
];

export default function RiskCards() {
  return (
    <section id="risks" className="border-t border-white/10 bg-slate-950">
      <Container>
        <div className="py-14 lg:py-20">
          <SectionTitle
            eyebrow="Риски"
            title="4 ситуации, где чаще всего ошибаются"
            description="Карточки ниже — это короткие «триггеры», которые помогают вовремя остановиться и проверить."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {risks.map((r, idx) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.55, delay: idx * 0.05 }}
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/8 to-white/5 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <r.icon className="h-5 w-5 text-sky-300" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-white">{r.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-300">{r.text}</div>
                  </div>
                </div>

                <div className="mt-5 h-px w-full bg-white/10" />

                <div className="mt-4 text-xs text-slate-400">
                  Подсказка: <span className="text-slate-200">если сомневаешься — проверь 2 раза.</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
