import Container from "./Container";
import SectionTitle from "./SectionTitle";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Phone, ShieldAlert, Trash2, UserRoundCheck } from "lucide-react";

const steps = [
  {
    icon: Trash2,
    title: "1. Stopp spredning",
    text: "Be alle som har mottatt innhold om å slette. Ikke del videre, ikke lagre kopier «til senere»."
  },
  {
    icon: FileText,
    title: "2. Sikre bevis",
    text: "Skjermbilder, URL, brukernavn, dato og tid. Lag en kort tidslinje med det du husker."
  },
  {
    icon: UserRoundCheck,
    title: "3. Snakk med noen du stoler på",
    text: "Du trenger støtte før du tar neste steg. Mange skoler og kommuner har rutiner for digital vold og deling."
  },
  {
    icon: ShieldAlert,
    title: "4. Vurder å melde fra til politiet",
    text: "På 02800 får du vite hva som er mulig, uten at du må anmelde med én gang."
  }
];

export default function HelpSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="help" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <SectionTitle
              eyebrow="Hjelp og neste steg"
              title="Hva gjør du hvis du er lurt, utpresset eller har delt noe du angrer på?"
              description="Følg stegene under i rekkefølge. Du har ikke gjort noe galt ved å be om hjelp. Ved akutt fare: ring 112."
            />

            <div className="w-full max-w-xl rounded-sm border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">Kontakt</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <a
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 hover:bg-slate-100"
                  href="tel:112"
                >
                  <Phone className="h-4 w-4 text-blue-700" />
                  Nød: 112
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 hover:bg-slate-100"
                  href="tel:02800"
                >
                  <Phone className="h-4 w-4 text-blue-700" />
                  Politiet: 02800
                </a>
              </div>

              <div className="mt-4 text-sm leading-relaxed text-slate-700">
                <span className="font-semibold">02800</span> – veiledning, anmeldelse og spørsmål om
                nettkriminalitet. <span className="font-semibold">112</span> – når du er i fare eller
                noen truer deg fysisk. Vil du ikke ringe: vis denne siden til en lærer, helsesykepleier,
                forelder eller annen voksen du stoler på.
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                className="rounded-sm border border-slate-200 bg-white p-5"
              >
                <s.icon className="h-5 w-5 text-blue-700" />
                <div className="mt-3 text-sm font-semibold text-slate-900">{s.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{s.text}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Hvis noen prøver sextortion</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Ikke betal. Ikke send flere bilder.</li>
                <li>Ta skjermbilder og lagre bevis (brukernavn, lenker, tidspunkt).</li>
                <li>Blokker kontoen og rapporter i appen.</li>
                <li>Snakk med en trygg voksen eller kontakt politiet på 02800.</li>
                <li>
                  Politiet ser ofte at betaling ikke stopper truslene – kontakt heller 02800 tidlig.
                </li>
              </ul>
            </div>

            <div className="rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Slik beskytter du deg</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Bruk 2FA på e‑post og sosiale medier.</li>
                <li>Oppdater telefon og apper.</li>
                <li>Vær skeptisk til lenker fra meldinger.</li>
                <li>Gi færrest mulig tillatelser.</li>
                <li>Slå av «ukjente kan sende meldinger» der det er mulig.</li>
                <li>Rapporter og blokker kontoer som presser deg.</li>
                <li>
                  Snakk med venner om å ikke dele andres bilder – det er også ditt ansvar.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
