import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "./Container";
import logoPolice from "../assets/logo-police.webp";
import { easeOut, fadeUp } from "../lib/motion";
import { LANGS, useI18n } from "../i18n/i18n";

function Flag({ lang }: { lang: "no" | "en" | "uk" }) {
  // Inline SVG flags so we don't depend on emoji font support.
  if (lang === "no") {
    return (
      <svg
        viewBox="0 0 22 16"
        className="h-4 w-[22px] overflow-hidden rounded-[2px] ring-1 ring-black/10"
        aria-hidden
      >
        <rect width="22" height="16" fill="#BA0C2F" />
        <rect x="0" y="6" width="22" height="4" fill="#FFFFFF" />
        <rect x="6" y="0" width="4" height="16" fill="#FFFFFF" />
        <rect x="0" y="7" width="22" height="2" fill="#00205B" />
        <rect x="7" y="0" width="2" height="16" fill="#00205B" />
      </svg>
    );
  }

  if (lang === "uk") {
    return (
      <svg
        viewBox="0 0 22 16"
        className="h-4 w-[22px] overflow-hidden rounded-[2px] ring-1 ring-black/10"
        aria-hidden
      >
        <rect width="22" height="8" y="0" fill="#0057B7" />
        <rect width="22" height="8" y="8" fill="#FFD700" />
      </svg>
    );
  }

  // en (GB)
  return (
    <svg
      viewBox="0 0 22 16"
      className="h-4 w-[22px] overflow-hidden rounded-[2px] ring-1 ring-black/10"
      aria-hidden
    >
      <rect width="22" height="16" fill="#012169" />
      <path d="M0 0 L22 16 M22 0 L0 16" stroke="#FFFFFF" strokeWidth="3.5" />
      <path d="M0 0 L22 16 M22 0 L0 16" stroke="#C8102E" strokeWidth="2" />
      <rect x="9" y="0" width="4" height="16" fill="#FFFFFF" />
      <rect x="0" y="6" width="22" height="4" fill="#FFFFFF" />
      <rect x="10" y="0" width="2" height="16" fill="#C8102E" />
      <rect x="0" y="7" width="22" height="2" fill="#C8102E" />
    </svg>
  );
}

export default function Header() {
  const reduceMotion = useReducedMotion();
  const { lang, setLang, t } = useI18n();
  const current = LANGS.find((l) => l.lang === lang) ?? LANGS[0]!;

  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const menuId = useId();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = detailsRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setLangMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <motion.header
      initial={reduceMotion ? false : { ...fadeUp.hidden, y: -12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm"
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <motion.a
            href="#top"
            className="flex items-center rounded-sm bg-white px-2 py-1 shadow-sm ring-1 ring-slate-200"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src={logoPolice} alt="Politiet" className="h-12 w-auto sm:h-14" loading="eager" />
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

            <details
              ref={detailsRef}
              className="relative ml-2"
              open={langMenuOpen}
              onToggle={(e) => setLangMenuOpen((e.target as HTMLDetailsElement).open)}
            >
              <summary className="list-none" aria-controls={menuId}>
                <span className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                  <Flag lang={current.lang} />
                  <span>{current.label}</span>
                  <span className="text-slate-400" aria-hidden>
                    ▾
                  </span>
                </span>
              </summary>
              <div
                id={menuId}
                className="absolute right-0 mt-2 w-44 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-lg"
              >
                {LANGS.map((l) => (
                  <button
                    key={l.lang}
                    type="button"
                    onClick={() => {
                      setLang(l.lang);
                      setLangMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      l.lang === lang ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"
                    }`}
                  >
                    <Flag lang={l.lang} />
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
