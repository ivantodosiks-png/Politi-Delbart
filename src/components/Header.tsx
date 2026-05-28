import Container from "./Container";
import logoPolice from "../assets/logo-police.webp";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUp } from "../lib/motion";
import { LANGS, useI18n } from "../i18n/i18n";

export default function Header() {
  const reduceMotion = useReducedMotion();
  const { lang, setLang, t } = useI18n();
  const current = LANGS.find((l) => l.lang === lang) ?? LANGS[0]!;

  return (
    <motion.header
      initial={reduceMotion ? false : { ...fadeUp.hidden, y: -12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm"
    >
      <Container>
        <div className="flex h-24 items-center justify-between gap-6">
          <motion.a
            href="#top"
            className="flex items-center rounded-sm bg-white px-2 py-1 shadow-sm ring-1 ring-slate-200"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src={logoPolice} alt="Politiet" className="h-14 w-auto sm:h-16" loading="eager" />
          </motion.a>

          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#experience"
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {t("nav.experience")}
            </a>
            <a
              href="#cases"
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {t("nav.cases")}
            </a>
            <a
              href="#risks"
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {t("nav.threats")}
            </a>
            <a
              href="#campaign"
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {t("nav.about")}
            </a>

            <a
              href="#report"
              className="ml-2 inline-flex items-center rounded-sm bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-rose-700/30 hover:bg-rose-700"
            >
              {t("nav.report")}
            </a>

            <details className="relative ml-2">
              <summary className="list-none">
                <span className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                  <span aria-hidden>{current.flag}</span>
                  <span className="hidden lg:inline">{current.label}</span>
                  <span className="text-slate-400" aria-hidden>
                    ▾
                  </span>
                </span>
              </summary>
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-lg">
                {LANGS.map((l) => (
                  <button
                    key={l.lang}
                    type="button"
                    onClick={() => setLang(l.lang)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      l.lang === lang ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"
                    }`}
                  >
                    <span aria-hidden>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </details>
          </nav>
        </div>
      </Container>
    </motion.header>
  );
}
