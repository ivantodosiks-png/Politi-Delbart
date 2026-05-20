import Container from "./Container";

export default function Hero() {
  return (
    <section id="top" className="bg-white">
      <Container>
        <div className="py-10 sm:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Delbart: Én klikk kan endre alt
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              Å dele intime bilder uten samtykke kan få store konsekvenser. Samtidig brukes phishing
              og falske lenker for å skape panikk, få tilgang til bilder og drive utpressing
              (sextortion). Stopp før du trykker.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Stopp spredning</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Ikke del videre. Ikke «lagre for sikkerhets skyld». Be om at innhold fjernes hvis
                  du kan.
                </div>
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Ta vare på bevis</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Skjermbilder, lenker, brukernavn og tidspunkt kan være viktig.
                </div>
              </div>
              <div className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Søk hjelp</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Ved akutt fare: ring 112. For råd og veiledning: ring 02800.
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Kort forklart</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <span className="font-semibold">Phishing</span> er falske meldinger/lenker som prøver å lure deg.
                </li>
                <li>
                  <span className="font-semibold">Sextortion</span> er når noen bruker skam/frykt for å presse deg
                  for penger eller flere bilder.
                </li>
                <li>Gi aldri tilgang til bilder/kamera uten å være helt sikker på hvem som ber om det.</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

