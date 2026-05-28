import Container from "./Container";
import SectionTitle from "./SectionTitle";
import FadeIn from "./motion/FadeIn";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n/i18n";

export default function CasesSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const cases = [
    { title: t("cases.1.title"), text: t("cases.1.text") },
    { title: t("cases.2.title"), text: t("cases.2.text") }
  ];

  return (
    <section id="cases" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow={t("cases.eyebrow")}
            title={t("cases.title")}
            description={t("cases.desc")}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {cases.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, transition: { duration: 0.2 } }
                }
                className="rounded-sm border border-slate-200 bg-white p-6 transition-shadow hover:border-blue-200 hover:shadow-md"
              >
                <div className="text-base font-semibold text-slate-900">{c.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{c.text}</div>
              </motion.div>
            ))}
          </div>

          <FadeIn className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <p className="leading-relaxed italic">
              {t("cases.quote")}
            </p>
            <footer className="mt-3 text-xs font-semibold text-slate-900 not-italic">
              {t("cases.quote_by")}
            </footer>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

