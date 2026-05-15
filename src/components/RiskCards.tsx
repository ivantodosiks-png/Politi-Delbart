import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { EyeOff, MessageCircleWarning, Siren, Users } from "lucide-react";

const cards = [
  {
    icon: Users,
    title: "Spredning skjer raskt",
    text: "Det som deles i en chat kan ende opp på mange plattformer på minutter."
  },
  {
    icon: EyeOff,
    title: "Tap av kontroll",
    text: "Når et bilde er delt videre, mister du ofte kontroll over hvem som ser det."
  },
  {
    icon: MessageCircleWarning,
    title: "Press og trusler",
    text: "Mange opplever press, hets og rykter når innhold spres uten samtykke."
  },
  {
    icon: Siren,
    title: "Straffbart",
    text: "Deling av intime bilder uten samtykke kan være ulovlig. Det gjelder også videresending."
  }
];

export default function RiskCards() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Konsekvenser"
            title="Hvorfor «bare én gang» kan bli mange"
            description="Målet er å forebygge: stopp spredningen tidlig, og søk hjelp hvis du er utsatt."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {cards.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="rounded-sm border border-slate-200 bg-white p-6"
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
        </div>
      </Container>
    </section>
  );
}

