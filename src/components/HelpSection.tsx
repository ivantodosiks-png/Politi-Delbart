import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Phone, ShieldAlert, Trash2, UserRoundCheck } from "lucide-react";
import CollapsibleText from "./CollapsibleText";
import { useI18n } from "../i18n/i18n";

export default function HelpSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const steps = [
    { icon: Trash2, title: t("help.step1.title"), text: t("help.step1.text") },
    { icon: FileText, title: t("help.step2.title"), text: t("help.step2.text") },
    { icon: UserRoundCheck, title: t("help.step3.title"), text: t("help.step3.text") },
    { icon: ShieldAlert, title: t("help.step4.title"), text: t("help.step4.text") }
  ];
  const sextortionTips = [
    t("help.sext1"),
    t("help.sext2"),
    t("help.sext3"),
    t("help.sext4"),
    t("help.sext5")
  ];
  const protectTips = [
    t("help.prot1"),
    t("help.prot2"),
    t("help.prot3"),
    t("help.prot4"),
    t("help.prot5"),
    t("help.prot6"),
    t("help.prot7")
  ];

  return (
    <section id="help" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <SectionTitle
              eyebrow={t("help.eyebrow")}
              title={t("help.title")}
              description={
                <CollapsibleText lines={2} className="text-sm leading-relaxed text-slate-700">
                  {t("help.desc")}
                </CollapsibleText>
              }
            />

            <div className="w-full max-w-xl rounded-sm border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">{t("help.contact")}</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 hover:bg-slate-100"
                  href="tel:112"
                >
                  <Phone className="h-4 w-4 text-blue-700" />
                  {t("help.emergency")}: 112
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 hover:bg-slate-100"
                  href="tel:02800"
                >
                  <Phone className="h-4 w-4 text-blue-700" />
                  {t("help.police")}: 02800
                </a>
              </div>

              <CollapsibleText lines={3} className="mt-4 text-sm leading-relaxed text-slate-700">
                {t("help.contact_text")}
              </CollapsibleText>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, idx) => (
              <motion.div
                key={s.title}
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
                <s.icon className="h-5 w-5 text-blue-700" />
                <div className="mt-3 text-sm font-semibold text-slate-900">{s.title}</div>
                <CollapsibleText lines={3} className="mt-2 text-sm leading-relaxed text-slate-700">
                  {s.text}
                </CollapsibleText>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{t("help.sext_title")}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {sextortionTips.slice(0, 3).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                  {t("common.more")}
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {sextortionTips.slice(3).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </details>
            </div>

            <div className="rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{t("help.protect_title")}</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {protectTips.slice(0, 4).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                  {t("common.more")}
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {protectTips.slice(4).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

