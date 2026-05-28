import Container from "./Container";
import logoPolice from "../assets/logo-police.webp";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUp } from "../lib/motion";

export default function Header() {
  const reduceMotion = useReducedMotion();

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
              Experience
            </a>
            <a
              href="#cases"
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Cases
            </a>
            <a
              href="#risks"
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Threats
            </a>
            <a
              href="#campaign"
              className="rounded-sm px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              About
            </a>

            <a
              href="#report"
              className="ml-2 inline-flex items-center rounded-sm bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-rose-700/30 hover:bg-rose-700"
            >
              Report scam
            </a>
          </nav>
        </div>
      </Container>
    </motion.header>
  );
}
