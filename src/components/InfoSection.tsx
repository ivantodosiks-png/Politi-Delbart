import SectionTitle from "./SectionTitle";
import Container from "./Container";
import { motion, useReducedMotion } from "framer-motion";
import { Ban, FileWarning, Link2, ShieldCheck, TriangleAlert } from "lucide-react";

const points = [
  {
    icon: Ban,
    title: "Del aldri uten samtykke",
    text: "Å sende intime bilder videre – også til én «venn» – kan være straffbart og ødelegge tillit. Spør alltid: Har personen sagt ja til at dette deles?"
  },
  {
    icon: Link2,
    title: "Sjekk lenken – ikke bare avsenderen",
    text: "Kjente navn og logoer kan kopieres. Hold musepekeren over lenken, se hele domenet, og vær ekstra skeptisk i DM og gruppechatter."
  },
  {
    icon: FileWarning,
    title: "Gi minst mulig tilgang",
    text: "En popup om «bilder» eller «kamera» fra ukjent side er ofte første steg i et angrep. Si nei, lukk fanen, og spør en voksen du stoler på."
  },
  {
    icon: ShieldCheck,
    title: "Gjør kontoene dine vanskeligere å ta",
    text: "Sterke passord, unike passord per tjeneste og totrinnsbekreftelse (2FA) på e-post og sosiale medier reduserer risiko for innbrudd og utpressing."
  },
  {
    icon: TriangleAlert,
    title: "Ikke betal – dokumenter – få hjelp",
    text: "Betaling stopper sjelden truslene. Ta bevis, blokker, rapporter i appen, og kontakt politiet (02800) eller en trygg voksen."
  }
];

export default function InfoSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="campaign" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Digital trygghet"
            title="Slik beskytter du deg – og andre"
            description="Kampanjen Delbart handler om samtykke, falske lenker og digital utpressing. Her får du fem konkrete prinsipper du kan bruke i hverdagen – før noe skjer."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          <div className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Røde flagg – stopp før du klikker</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Meldinger med panikk: «HASTER!!!», «ER DETTE DEG!?», «slett innen 10 min».</li>
              <li>
                Domener som ligner kjente tjenester, men med ekstra ord eller rare tegn (f.eks.{" "}
                <span className="font-mono text-xs">snap-profile-story.net</span>).
              </li>
              <li>
                Forespørsler om bilder, kamera, mikrofon eller «bekreft konto» uten tydelig grunn.
              </li>
              <li>Trusler, skam, krav om penger, Vipps eller «flere bilder hvis ikke…».</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
