import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";

const benefits = [
  {
    title: "Mindre spredning",
    text: "Jo raskere du stopper, jo færre kopier og skjermbilder finnes ute."
  },
  {
    title: "Bedre bevis",
    text: "Tidlig dokumentasjon gjør det enklere for politiet og skolen å følge opp."
  },
  {
    title: "Mindre stress",
    text: "Du slipper å bære hemmeligheten alene når du snakker med noen du stoler på."
  },
  {
    title: "Tydeligere valg",
    text: "02800 og trygge voksne kan veilede uten at du må gjette hva som er riktig."
  }
];

export default function BenefitsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="benefits" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Hvorfor handle tidlig"
            title="Fordeler med å ta grep med én gang"
            description="Små handlinger tidlig kan begrense skade – for deg og for andre."
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

