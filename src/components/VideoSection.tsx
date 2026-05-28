import Container from "./Container";
import SectionTitle from "./SectionTitle";
import CollapsibleText from "./CollapsibleText";
import { useI18n } from "../i18n/i18n";

export default function VideoSection() {
  const { t } = useI18n();
  return (
    <section className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <SectionTitle
            eyebrow={t("video.eyebrow")}
            title={t("video.title")}
            description={
              <CollapsibleText lines={2} className="text-sm leading-relaxed text-slate-700">
                {t("video.desc")}
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
            <CollapsibleText
              lines={3}
              className="leading-relaxed"
              moreLabel={t("common.more")}
              lessLabel={t("common.less")}
            >
              <p>
                {t("video.box_p1")}
              </p>
              <p className="mt-3">
                <span className="font-semibold">{t("video.made_by")}:</span> WergelandApenes/Atyp/Ferdi
              </p>
            </CollapsibleText>
          </div>
        </div>
      </Container>
    </section>
  );
}

