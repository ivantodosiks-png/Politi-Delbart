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

          <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video w-full bg-slate-100">
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

          <div className="mt-4 rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <CollapsibleText lines={3} className="leading-relaxed" moreLabel="Vis mer" lessLabel="Skjul">
              <p>
                Ønsker du å holde foredrag for barn og unge om deling av seksualiserte bilder? Undervisningsopplegget
                «Delbart?» er tilrettelagt slik at lærere, helsesykepleiere, miljøarbeidere, utekontakter og andre
                voksne som jobber med barn og unge kan holde foredrag.
              </p>
              <p className="mt-3">
                <span className="font-semibold">Laget av:</span> WergelandApenes/Atyp/Ferdi
              </p>
            </CollapsibleText>
          </div>
        </div>
      </Container>
    </section>
  );
}

