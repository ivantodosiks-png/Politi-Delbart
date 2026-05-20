import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { EyeOff, Link2, MessageCircleWarning, Siren, Smartphone, TriangleAlert } from "lucide-react";

const cards = [
  {
    icon: Link2,
    title: "Falske lenker ser ekte ut",
    text: "Angripere bruker domenenavn som ligner på kjente tjenester for å lure deg til å klikke."
  },
  {
    icon: Smartphone,
    title: "Tillatelser misbrukes",
    text: "En popup som ber om tilgang til bilder/kamera kan være et forsøk på å få deg til å gi fra deg mer enn du tror."
  },
  {
    icon: MessageCircleWarning,
    title: "Press og panikkmeldinger",
    text: "«Haster!» + sterke følelser er et klassisk triks for å få deg til å handle uten å tenke."
  },
  {
    icon: EyeOff,
    title: "Tap av kontroll",
    text: "Når noe først er delt, er det vanskelig å kontrollere hvem som ser det eller hvor det havner."
  },
  {
    icon: Siren,
    title: "Sextortion",
    text: "Utpressing handler ofte om skam og frykt. Ikke betal. Ta vare på bevis og søk hjelp."
  },
  {
    icon: TriangleAlert,
    title: "Konsekvenser",
    text: "Spredning kan gi hets, rykter, psykisk stress og i noen tilfeller straffereaksjoner."
  }
];

export default function RiskCards() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="risks" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Hvorfor dette er viktig"
            title="Hva kan gå galt — og hva du kan gjøre"
            description="Tenk på disse som «stopp‑punkter» før du klikker, deler eller gir tilgang."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {cards.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
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

          <div className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Sjekklista før du klikker</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Hvem sendte dette? Gir det mening at de sender en link?</li>
              <li>Ser domenet riktig ut (ikke ekstra ord eller rare tegn)?</li>
              <li>Ber siden om noe unødvendig (bilder/kamera/innlogging)?</li>
              <li>Er du presset til å handle raskt? Stopp og spør noen.</li>
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}

