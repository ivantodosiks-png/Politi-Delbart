import SectionTitle from "./SectionTitle";
import Container from "./Container";
import { motion, useReducedMotion } from "framer-motion";
import { Ban, FileWarning, Link2, ShieldCheck, TriangleAlert } from "lucide-react";

const points = [
  {
    icon: Ban,
    title: "Del aldri videre",
    text: "Å dele intime bilder uten samtykke kan være straffbart — selv om du «bare sender til en venn»."
  },
  {
    icon: Link2,
    title: "Falske lenker (phishing)",
    text: "Lenker kan se «normale» ut, men lede til falske sider som prøver å få deg til å gi fra deg informasjon eller tillatelser."
  },
  {
    icon: FileWarning,
    title: "Tillatelser og tilgang",
    text: "Gi ikke tilgang til bilder/kamera uten at du er helt sikker på appen/nettsiden. Spør en voksen hvis du er i tvil."
  },
  {
    icon: ShieldCheck,
    title: "Slik gjør du det tryggere",
    text: "Sjekk URL, tenk før du klikker, bruk sterke passord og totrinnsbekreftelse (2FA) på viktige kontoer."
  },
  {
    icon: TriangleAlert,
    title: "Sextortion (utpressing)",
    text: "Nettkriminelle bruker frykt og press: «betal ellers…». Ikke betal, ta vare på bevis og søk hjelp."
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
            title="Hva handler dette om?"
            description="Dette er en kort guide til falske lenker (phishing), tillatelser til bilder og sextortion. Målet er å hjelpe deg å ta tryggere valg."
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
            <div className="font-semibold text-slate-900">Røde flagg du bør reagere på</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>«Haster!!!» eller «ER DETTE DEG!?» som presser deg til å klikke.</li>
              <li>Ukjente domener som ligner på kjente tjenester.</li>
              <li>Popups som ber om tilgang til bilder/kamera uten god forklaring.</li>
              <li>Trusler, skam eller krav om penger.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

