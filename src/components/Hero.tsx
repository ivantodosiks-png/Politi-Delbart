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
              Å dele intime bilder uten samtykke kan få store konsekvenser for den som rammes.
              Videresending kan være straffbart. Stopp før du trykker.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-sm border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">Stopp spredning</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  Ikke del videre. Be om at innhold fjernes hvis du kan.
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
                  Ved akutt fare ring 112. For råd og veiledning ring 02800.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

