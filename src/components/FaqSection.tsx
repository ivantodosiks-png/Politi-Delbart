import Container from "./Container";
import SectionTitle from "./SectionTitle";
import StaggerGrid, { StaggerItem } from "./motion/StaggerGrid";
import { useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faq = [
  {
    q: "Er det straffbart å dele intime bilder videre?",
    a: "Ja. Deling uten samtykke kan være straffbart i Norge – også blant ungdom, og også når du «bare sender til en venn»."
  },
  {
    q: "Hva om jeg allerede har klikket på en mistenkelig lenke?",
    a: "Ikke panikk. Gi ikke mer tilgang, lukk siden, dokumenter (skjermbilder, URL), og snakk med en voksen eller ring 02800."
  },
  {
    q: "Skal jeg betale ved sextortion?",
    a: "Nei. Betaling stopper sjelden truslene og kan øke presset. Ta bevis, blokker, rapporter i appen, og kontakt politiet."
  },
  {
    q: "Kan politiet hjelpe uten at foreldre får vite?",
    a: "Ring 02800 og spør. De forklarer hva som er mulig ut fra din alder og situasjon – du bestemmer ikke alene."
  },
  {
    q: "Hva er forskjellen på 112 og 02800?",
    a: "112 brukes ved akutt fare eller trusler om vold. 02800 er for råd, veiledning og anmeldelse av nettkriminalitet."
  }
];

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

  return (
    <section id="faq" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Ofte stilte spørsmål"
            title="Svar på det mange lurer på"
            description="Korte svar – ring 02800 hvis du er usikker på din situasjon."
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

