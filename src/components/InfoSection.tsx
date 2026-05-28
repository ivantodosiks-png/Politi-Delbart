import SectionTitle from "./SectionTitle";
import Container from "./Container";
import FadeIn from "./motion/FadeIn";
import { motion, useReducedMotion } from "framer-motion";
import { Ban, FileWarning, Link2, ShieldCheck, TriangleAlert } from "lucide-react";
import CollapsibleText from "./CollapsibleText";
import { useI18n } from "../i18n/i18n";

export default function InfoSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const points = [
    { icon: Ban, title: t("info.1.title"), text: t("info.1.text") },
    { icon: Link2, title: t("info.2.title"), text: t("info.2.text") },
    { icon: FileWarning, title: t("info.3.title"), text: t("info.3.text") },
    { icon: ShieldCheck, title: t("info.4.title"), text: t("info.4.text") },
    { icon: TriangleAlert, title: t("info.5.title"), text: t("info.5.text") }
  ];
  const redFlags = [
    t("info.red1"),
    t("info.red2"),
    t("info.red3"),
    t("info.red4")
  ];

  return (
    <section id="campaign" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow={t("info.eyebrow")}
            title={t("info.title")}
            description={
              <CollapsibleText lines={2} className="text-sm leading-relaxed text-slate-700">
                {t("info.desc")}
              </CollapsibleText>
            }
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {points.map((p, idx) => (
              <motion.div
                key={p.title}
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
                <p.icon className="h-5 w-5 text-blue-700" />
                <div className="mt-3 text-sm font-semibold text-slate-900">{p.title}</div>
                <CollapsibleText lines={3} className="mt-2 text-sm leading-relaxed text-slate-700">
                  {p.text}
                </CollapsibleText>
              </motion.div>
            ))}
          </div>

          <FadeIn className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">{t("info.red_title")}</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {redFlags.slice(0, 2).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                {t("info.red_more")}
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {redFlags.slice(2).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </details>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

