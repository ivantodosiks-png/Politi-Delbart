import Container from "./Container";
import SectionTitle from "./SectionTitle";
import StaggerGrid, { StaggerItem } from "./motion/StaggerGrid";
import FadeIn from "./motion/FadeIn";
import CollapsibleText from "./CollapsibleText";

const steps = [
  {
    n: "1",
    title: "Les grunnleggende",
    text: "Konsekvenser, røde flagg og sjekkliste – slik at du kjenner mønstrene før noe skjer."
  },
  {
    n: "2",
    title: "Prøv scenarioet",
    text: "Et kort, fiktivt forløp i en chat-app. Du velger selv: ignorere, åpne eller gi tillatelse."
  },
  {
    n: "3",
    title: "Velg neste steg",
    text: "Hjelp, 02800 eller en voksen du stoler på. Du har ikke gjort noe galt ved å be om støtte."
  }
];

export default function ProcessSection() {
  const audiences = [
    { label: "Ungdom", text: "før du sender, klikker eller svarer på press." },
    { label: "Foreldre", text: "samtale hjemme om samtykke og hva barnet skal gjøre." },
    { label: "Skole", text: "undervisning, klassemøte og digital kompetanse." }
  ];

  return (
    <section id="how" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Slik bruker du siden"
            title="Tre steg – fra forståelse til handling"
            description={
              <CollapsibleText lines={2} className="text-sm leading-relaxed text-slate-700">
                Siden er bygget for å gi deg oversikt før du tar valg på ekte. Bruk den i den
                rekkefølgen som passer deg.
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
                  Steg {s.n}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{s.title}</div>
                <CollapsibleText lines={3} className="mt-2 text-sm leading-relaxed text-slate-700">
                  {s.text}
                </CollapsibleText>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <FadeIn className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">For hvem er dette?</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <span className="font-semibold">{audiences[0]!.label}</span> – {audiences[0]!.text}
              </li>
            </ul>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                Vis mer
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

