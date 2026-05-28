import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { EyeOff, Link2, MessageCircleWarning, Siren, Smartphone, TriangleAlert } from "lucide-react";
import { useI18n } from "../i18n/i18n";

export default function RiskCards() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const cards = [
    { icon: Link2, title: t("risks.1.title"), text: t("risks.1.text") },
    { icon: Smartphone, title: t("risks.2.title"), text: t("risks.2.text") },
    { icon: MessageCircleWarning, title: t("risks.3.title"), text: t("risks.3.text") },
    { icon: EyeOff, title: t("risks.4.title"), text: t("risks.4.text") },
    { icon: Siren, title: t("risks.5.title"), text: t("risks.5.text") },
    { icon: TriangleAlert, title: t("risks.6.title"), text: t("risks.6.text") }
  ];

  return (
    <section id="risks" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow={t("risks.eyebrow")}
            title={t("risks.title")}
            description={t("risks.desc")}
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {cards.map((c, idx) => (
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
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-sm bg-blue-50 text-blue-700">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-900">{c.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-700">{c.text}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">{t("risks.checklist_title")}</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>{t("risks.check1")}</li>
              <li>{t("risks.check2")}</li>
            </ol>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                {t("risks.check_more")}
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>{t("risks.check3")}</li>
                <li>{t("risks.check4")}</li>
                <li>{t("risks.check5")}</li>
              </ol>
            </details>
          </div>
        </div>
      </Container>
    </section>
  );
}

