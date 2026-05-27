import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { EyeOff, Link2, MessageCircleWarning, Siren, Smartphone, TriangleAlert } from "lucide-react";

const cards = [
  {
    icon: Link2,
    title: "Lenker kan se helt riktige ut",
    text: "Angripere kopierer design, logo og språk. Det som avslører dem, er ofte domenet, hastverket og at de ber om mer enn de trenger."
  },
  {
    icon: Smartphone,
    title: "Én «Allow» kan gi full tilgang",
    text: "Tillatelse til bilder eller kamera på en ukjent side kan brukes til utpressing senere – også uten at du merker det med én gang."
  },
  {
    icon: MessageCircleWarning,
    title: "Panikk er et verktøy",
    text: "Når noen vil at du skal handle raskt, tenker du mindre. Ta en pause på 30 sekunder: «Hvem sendte dette, og hvorfor nå?»"
  },
  {
    icon: EyeOff,
    title: "Det du deler, kan ikke «tas tilbake»",
    text: "Sletting hos deg stopper ikke kopier, skjermbilder eller videre deling. Derfor gjelder samtykke og tenking før sending."
  },
  {
    icon: Siren,
    title: "Utpressing bygger på skam",
    text: "Mange ofre betaler eller sender mer fordi de er redde. Politiet anbefaler: ikke betal, ta bevis, blokker, meld fra."
  },
  {
    icon: TriangleAlert,
    title: "Konsekvenser er reelle",
    text: "Rykter, mobbing, stress, skolearbeid og i alvorlige tilfeller politietterforskning. Tidlig hjelp begrenser skaden."
  }
];

export default function RiskCards() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="risks" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Konsekvenser og valg"
            title="Hva kan skje – og hva du kan gjøre med én gang"
            description="Hvert punkt er et stopp‑punkt: les det, ta ett trygt valg, og gå videre."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {cards.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, transition: { duration: 0.2 } }
                }
                className="rounded-sm border border-slate-200 bg-white p-6 transition-shadow hover:border-blue-200 hover:shadow-md"
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

          <div className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Sjekklista før du klikker</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Kjenner jeg avsenderen – og passer meldingen til dem?</li>
              <li>Er domenet helt riktig (ingen ekstra ord, bindestrek, .net i stedet for .com)?</li>
            </ol>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                Vis hele sjekklista
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Ber siden om bilder, kamera eller innlogging jeg ikke trenger?</li>
                <li>Føler jeg meg presset? → Stopp, vis meldingen til en voksen.</li>
                <li>Hva er verste utfall – og er det verdt risikoen?</li>
              </ol>
            </details>
          </div>
        </div>
      </Container>
    </section>
  );
}

