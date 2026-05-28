import Container from "./Container";
import SectionTitle from "./SectionTitle";
import StaggerGrid, { StaggerItem } from "./motion/StaggerGrid";
import FadeIn from "./motion/FadeIn";
import CollapsibleText from "./CollapsibleText";
import { useI18n } from "../i18n/i18n";

export default function ProcessSection() {
  const { t } = useI18n();
  const steps = [
    { n: "1", title: t("process.step1.title"), text: t("process.step1.text") },
    { n: "2", title: t("process.step2.title"), text: t("process.step2.text") },
    { n: "3", title: t("process.step3.title"), text: t("process.step3.text") }
  ];
  const audiences = [
    { label: t("process.aud1.label"), text: t("process.aud1.text") },
    { label: t("process.aud2.label"), text: t("process.aud2.text") },
    { label: t("process.aud3.label"), text: t("process.aud3.text") }
  ];

  return (
    <section id="how" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow={t("process.eyebrow")}
            title={t("process.title")}
            description={
              <CollapsibleText lines={2} className="text-sm leading-relaxed text-slate-700">
                {t("process.desc")}
              </CollapsibleText>
            }
          />

          <StaggerGrid className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <StaggerItem
                key={s.n}
                className="h-full rounded-sm border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  {t("process.step_label")} {s.n}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{s.title}</div>
                <CollapsibleText lines={3} className="mt-2 text-sm leading-relaxed text-slate-700">
                  {s.text}
                </CollapsibleText>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <FadeIn className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">{t("process.for_who")}</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <span className="font-semibold">{audiences[0]!.label}</span> – {audiences[0]!.text}
              </li>
            </ul>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                {t("common.more")}
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {audiences.slice(1).map((a) => (
                  <li key={a.label}>
                    <span className="font-semibold">{a.label}</span> – {a.text}
                  </li>
                ))}
              </ul>
            </details>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

