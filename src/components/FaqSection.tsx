import Container from "./Container";
import SectionTitle from "./SectionTitle";
import StaggerGrid, { StaggerItem } from "./motion/StaggerGrid";
import { useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useI18n } from "../i18n/i18n";

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="faq-details group rounded-sm border border-slate-200 bg-white p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{q}</span>
        <ChevronDown className="faq-chevron h-4 w-4 shrink-0 text-blue-700" aria-hidden />
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{a}</p>
    </details>
  );
}

export default function FaqSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const faq = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") }
  ];

  return (
    <section id="faq" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow={t("faq.eyebrow")}
            title={t("faq.title")}
            description={t("faq.desc")}
          />

          {reduceMotion ? (
            <div className="mt-10 space-y-4">
              {faq.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          ) : (
            <StaggerGrid className="mt-10 space-y-4">
              {faq.map((item) => (
                <StaggerItem key={item.q}>
                  <FaqItem q={item.q} a={item.a} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </Container>
    </section>
  );
}

