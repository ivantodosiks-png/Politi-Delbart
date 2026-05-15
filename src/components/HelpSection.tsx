import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Phone, ShieldAlert, Trash2, UserRoundCheck } from "lucide-react";

const steps = [
  {
    icon: Trash2,
    title: "Stans spredning",
    text: "Be om at innhold slettes. Ikke videresend. Ikke «lagre for sikkerhets skyld»."
  },
  {
    icon: FileText,
    title: "Ta vare på bevis",
    text: "Skjermbilder, lenker, brukernavn og tidspunkt. Noter hvor det ligger."
  },
  {
    icon: UserRoundCheck,
    title: "Snakk med noen",
    text: "Kontakt en trygg voksen, skole, helsetjeneste eller rådgiver. Du skal ikke stå alene."
  },
  {
    icon: ShieldAlert,
    title: "Meld fra",
    text: "Hvis du ønsker å anmelde eller få veiledning, ta kontakt med politiet."
  }
];

export default function HelpSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="help" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <SectionTitle
              eyebrow="Hjelp og kontakt"
              title="Hva gjør du hvis et bilde deles uten samtykke?"
              description="Dette er en generell veiledning. Ved akutt fare: ring 112."
            />

            <div className="w-full max-w-xl rounded-sm border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">Kontakt</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 hover:bg-slate-100"
                  href="tel:112"
                >
                  <Phone className="h-4 w-4 text-blue-700" />
                  Nød: 112
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 hover:bg-slate-100"
                  href="tel:02800"
                >
                  <Phone className="h-4 w-4 text-blue-700" />
                  Politiet: 02800
                </a>
              </div>

              <div className="mt-4 text-sm text-slate-700">
                Hvis du ikke vil ringe: snakk med en trygg voksen eller bruk lokale hjelpe- og
                støttetjenester (skole, helsestasjon, rådgiver).
              </div>
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
                className="rounded-sm border border-slate-200 bg-white p-5"
              >
                <s.icon className="h-5 w-5 text-blue-700" />
                <div className="mt-3 text-sm font-semibold text-slate-900">{s.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{s.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

