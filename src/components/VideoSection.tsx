import Container from "./Container";
import SectionTitle from "./SectionTitle";
import CollapsibleText from "./CollapsibleText";

export default function VideoSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow="Video"
            title="Se et kort eksempel"
            description={
              <CollapsibleText lines={2} className="text-sm leading-relaxed text-slate-700">
                Vil du se en video om temaet? Trykk for å åpne avspilleren. Tekst på siden er holdt kort – du kan
                også utvide for å lese mer.
              </CollapsibleText>
            }
          />

          <div className="mt-6 rounded-sm border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-blue-700 hover:text-blue-800">
                Se video
              </summary>
              <div className="mt-4 overflow-hidden rounded-sm border border-slate-200 bg-white">
                <div className="aspect-video w-full">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/Hj-8cERwRTw"
                    title="YouTube video player"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </details>

            <details className="mt-4">
              <summary className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-800">
                Les mer
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-slate-700">
                <p>
                  Hvis noe føles stressende, uvanlig eller «for godt til å være sant», stopp og sjekk før du klikker.
                  Snakk med en voksen du stoler på, og ikke gi apper/nettsider tilgang til bilder eller kamera uten
                  god grunn.
                </p>
              </div>
            </details>
          </div>
        </div>
      </Container>
    </section>
  );
}

