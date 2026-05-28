import Container from "./Container";
import logoFooter from "../assets/logo-footer.png";
import FadeIn from "./motion/FadeIn";
import { useI18n } from "../i18n/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <FadeIn as="footer" className="border-t border-slate-200 bg-white">
      <Container>
        <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logoFooter} alt="Politiet" className="h-10 w-auto" loading="lazy" />
            <div className="text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Politiet</div>
              <div>{t("footer.tagline")}</div>
            </div>
          </div>

          <div className="text-sm text-slate-700">
            <a className="transition-colors hover:text-blue-700 hover:underline" href="#help">
              {t("footer.help_link")}
            </a>
          </div>
        </div>

        <div className="pb-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Politiet · Delbart · {t("footer.disclaimer")}
        </div>
      </Container>
    </FadeIn>
  );
}

