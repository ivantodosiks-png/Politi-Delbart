import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n/i18n";

export default function BenefitsSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const benefits = [
    { title: t("benefits.1.title"), text: t("benefits.1.text") },
    { title: t("benefits.2.title"), text: t("benefits.2.text") },
    { title: t("benefits.3.title"), text: t("benefits.3.text") },
    { title: t("benefits.4.title"), text: t("benefits.4.text") }
  ];

  return (
    <section id="benefits" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow={t("benefits.eyebrow")}
            title={t("benefits.title")}
            description={t("benefits.desc")}
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, idx) => (
              <motion.div
                key={b.title}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, transition: { duration: 0.2 } }
                }
                className="rounded-sm border border-slate-200 bg-white p-5 transition-shadow hover:border-blue-200 hover:shadow-md"
              >
                <div className="text-sm font-semibold text-slate-900">{b.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{b.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

