import Container from "./Container";
import SectionTitle from "./SectionTitle";

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
  return (
    <section id="how" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Slik bruker du siden"
            title="Tre steg – fra forståelse til handling"
            description="Siden er bygget for å gi deg oversikt før du tar valg på ekte. Bruk den i den rekkefølgen som passer deg."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Steg {s.n}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{s.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">For hvem er dette?</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <span className="font-semibold">Ungdom</span> – før du sender, klikker eller svarer på
                press.
              </li>
              <li>
                <span className="font-semibold">Foreldre</span> – samtale hjemme om samtykke og hva
                barnet skal gjøre.
              </li>
              <li>
                <span className="font-semibold">Skole</span> – undervisning, klassemøte og digital
                kompetanse.
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
