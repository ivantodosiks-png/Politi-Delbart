import Container from "./Container";

export default function Hero() {
  return (
    <section id="top" className="bg-white">
      <Container>
        <div className="py-10 sm:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Delbart: Ett klikk kan endre alt
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Ett klikk på feil lenke, eller én deling uten samtykke, kan påvirke deg, andre og
              straffbarheten. Her får du konkrete råd om phishing, falske lenker og sextortion – og
              et kort scenario som viser hvordan det kan skje. <span className="font-semibold">Stopp. Tenk. Spør.</span>
            </p>

            <p className="mt-4 text-sm text-slate-600">
              <a href="#experience" className="font-semibold text-blue-700 hover:underline">
                Se hvordan ett klikk kan lure deg →
              </a>
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Stopp spredning med én gang</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Ikke videresend, ikke lagre «for sikkerhet» og ikke kommenter i grupper. Be personen
                  som delte om å slette, og be mottakere om det samme.
                </div>
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Dokumenter det som skjedde</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Ta skjermbilder av meldinger, lenker, profiler og tidspunkt. Ikke endre eller slett
                  noe før du har snakket med en voksen eller politiet.
                </div>
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Du trenger ikke å klare det alene</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Akutt fare eller trusler om vold: <span className="font-semibold">112</span>. Råd,
                  veiledning og anmeldelse: <span className="font-semibold">02800</span> (døgnåpent).
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Kort forklart</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <span className="font-semibold">Phishing:</span> falske meldinger eller lenker som
                  lurer deg til å klikke, logge inn eller gi tillatelser.
                </li>
                <li>
                  <span className="font-semibold">Sextortion:</span> noen truer med å dele bilder eller
                  videoer for å få penger, flere bilder eller mer kontroll over deg.
                </li>
                <li>
                  <span className="font-semibold">Tillatelser:</span> ukjente apper og nettsider skal
                  ikke få tilgang til bilder, kamera eller kontakter uten at du er helt sikker.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
