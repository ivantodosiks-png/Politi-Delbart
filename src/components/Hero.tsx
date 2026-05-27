import Container from "./Container";
import AnimatedCard from "./motion/AnimatedCard";
import StaggerGrid, { StaggerItem } from "./motion/StaggerGrid";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUp } from "../lib/motion";
import CollapsibleText from "./CollapsibleText";

const heroCards = [
  {
    title: "Stopp spredning med én gang",
    text: "Ikke videresend, ikke lagre «for sikkerhet» og ikke kommenter i grupper. Be personen som delte om å slette, og be mottakere om det samme."
  },
  {
    title: "Dokumenter det som skjedde",
    text: "Ta skjermbilder av meldinger, lenker, profiler og tidspunkt. Ikke endre eller slett noe før du har snakket med en voksen eller politiet."
  },
  {
    title: "Du trenger ikke å klare det alene",
    text: (
      <>
        Akutt fare eller trusler om vold: <span className="font-semibold">112</span>. Råd, veiledning
        og anmeldelse: <span className="font-semibold">02800</span> (døgnåpent).
      </>
    )
  }
];

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const kortForklart = [
    {
      label: "Phishing",
      text: "falske meldinger eller lenker som lurer deg til å klikke, logge inn eller gi tillatelser."
    },
    {
      label: "Sextortion",
      text: "noen truer med å dele bilder eller videoer for å få penger, flere bilder eller mer kontroll over deg."
    },
    {
      label: "Tillatelser",
      text: "ukjente apper og nettsider skal ikke få tilgang til bilder, kamera eller kontakter uten at du er helt sikker."
    }
  ];

  return (
    <section id="top" className="hero-ambient bg-white">
      <Container>
        <div className="relative py-10 sm:py-14">
          <div className="relative z-[1] max-w-3xl">
            <motion.h1
              initial={reduceMotion ? false : fadeUp.hidden}
              animate={reduceMotion ? undefined : fadeUp.visible}
              transition={{ duration: 0.6, ease: easeOut }}
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
            >
              Delbart: Ett klikk kan endre alt
            </motion.h1>
            <motion.div
              initial={reduceMotion ? false : { ...fadeUp.hidden, y: 14 }}
              animate={reduceMotion ? undefined : fadeUp.visible}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
              className="mt-4 text-base leading-relaxed text-slate-700"
            >
              <CollapsibleText lines={3} className="text-base leading-relaxed text-slate-700">
                Ett klikk på feil lenke, eller én deling uten samtykke, kan påvirke deg, andre og
                straffbarheten. Her får du konkrete råd om phishing, falske lenker og sextortion – og
                et kort scenario som viser hvordan det kan skje.{" "}
                <span className="font-semibold">Stopp. Tenk. Spør.</span>
              </CollapsibleText>
            </motion.div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-4 text-sm text-slate-600"
            >
              <a href="#experience" className="link-arrow font-semibold text-blue-700 hover:text-blue-800">
                Se hvordan ett klikk kan lure deg
                <span aria-hidden>→</span>
              </a>
            </motion.p>

            <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroCards.map((c) => (
                <StaggerItem
                  key={c.title}
                  className="h-full rounded-sm border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                  <CollapsibleText lines={3} className="mt-2 text-sm leading-relaxed text-slate-700">
                    {c.text}
                  </CollapsibleText>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <AnimatedCard
              delay={0.15}
              className="mt-8 rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700"
            >
              <div className="font-semibold text-slate-900">Kort forklart</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <span className="font-semibold">{kortForklart[0]!.label}:</span> {kortForklart[0]!.text}
                </li>
              </ul>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                  Vis mer
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {kortForklart.slice(1).map((i) => (
                    <li key={i.label}>
                      <span className="font-semibold">{i.label}:</span> {i.text}
                    </li>
                  ))}
                </ul>
              </details>
            </AnimatedCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

