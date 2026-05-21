import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";

const cases = [
  {
    title: "Falsk lenke i chat",
    text: "En elev fikk snap: «Er dette deg?». Lenken gikk til en falsk «story»-side som ba om bilder. Ved å si nei unngikk hen panikk og mulig utpressing."
  },
  {
    title: "Sextortion etter «allow»",
    text: "Etter at noen ga tilgang til bilder, kom trusler om penger. Ved å ikke betale, dokumentere og ringe 02800, stoppet situasjonen før innholdet ble delt videre."
  }
];

export default function CasesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="cases" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Eksempler"
            title="Slik starter mange saker"
            description="Navn og detaljer er endret. Poenget er å vise mønstre – ikke skremme."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {cases.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                className="rounded-sm border border-slate-200 bg-white p-6"
              >
                <div className="text-base font-semibold text-slate-900">{c.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{c.text}</div>
              </motion.div>
            ))}
          </div>

          <blockquote className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <p className="leading-relaxed italic">
              «Mange saker starter med ett klikk og skam. Jo tidligere vi får melding, jo bedre kan
              vi begrense skaden.»
            </p>
            <footer className="mt-3 text-xs font-semibold text-slate-900 not-italic">
              Etterforsker, nettkriminalitet
            </footer>
          </blockquote>
        </div>
      </Container>
    </section>
  );
}
