import { ArrowRight } from "lucide-react";
import Container from "./Container";

const services = [
  {
    title: "Pass og ID-kort",
    text: "Søke pass eller ID-kort, bestille time, åpningstider, huskeliste og pris.",
    href: "#help"
  },
  {
    title: "Politiattest",
    text: "Søke om politiattest, sjekke status, formål og bekreftelse.",
    href: "#help"
  },
  {
    title: "Våpen",
    text: "Søke om våpentillatelse, våpenkort, regler og reise med våpen.",
    href: "#help"
  },
  {
    title: "Anmelde",
    text: "Hvordan anmelde, hva som skjer etter at du har levert anmeldelsen.",
    href: "#help"
  },
  {
    title: "Tips politiet",
    text: "Er det noe politiet burde vite? Send tips.",
    href: "#help"
  },
  {
    title: "Namsmann og forliksråd",
    text: "Gjeldsordning, utlegg, forliksklage, utkasting og tvang.",
    href: "#help"
  }
];

export default function Hero() {
  return (
    <section id="top" className="bg-white">
      <Container>
        <div className="py-10 sm:py-12">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Hva kan vi hjelpe deg med?
          </h1>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <a
                key={s.title}
                href={s.href}
                className="politi-card group relative rounded-sm border border-blue-100 p-6 transition hover:border-blue-200"
              >
                <div className="text-lg font-semibold text-slate-900">{s.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{s.text}</div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
                  Les mer <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 text-right text-sm">
            <a className="inline-flex items-center gap-2 text-blue-700 hover:underline" href="#help">
              Til alle tjenester <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

