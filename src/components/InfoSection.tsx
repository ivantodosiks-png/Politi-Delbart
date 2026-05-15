import SectionTitle from "./SectionTitle";
import Container from "./Container";
import { motion, useReducedMotion } from "framer-motion";
import { Ban, FileWarning, ShieldCheck, Scale } from "lucide-react";

const points = [
  {
    icon: Ban,
    title: "Del aldri videre",
    text: "Å dele intime bilder uten samtykke kan være straffbart — selv om du «bare sender til en venn»."
  },
  {
    icon: ShieldCheck,
    title: "Stopp før du trykker",
    text: "Hvis du er i tvil: stopp. Tenk på konsekvensene for den som blir rammet."
  },
  {
    icon: FileWarning,
    title: "Ta vare på bevis",
    text: "Skjermbilder, lenker og tidspunkt kan være viktig for å stoppe spredning og etterforske."
  },
  {
    icon: Scale,
    title: "Rettigheter og støtte",
    text: "Du kan få hjelp til å rapportere, få innhold fjernet og få støtte hvis du er utsatt."
  }
];

export default function InfoSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="campaign" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Kampanje"
            title="Én klikk kan endre alt"
            description="Deling av intime bilder uten samtykke kan få alvorlige konsekvenser. Her er en kort oversikt over hva du kan gjøre — og hvorfor det betyr noe."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {points.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                className="rounded-sm border border-slate-200 bg-white p-5"
              >
                <p.icon className="h-5 w-5 text-blue-700" />
                <div className="mt-3 text-sm font-semibold text-slate-900">{p.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{p.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

