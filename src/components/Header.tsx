import Container from "./Container";
import logoPolice from "../assets/logo-police.webp";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUp } from "../lib/motion";

export default function Header({ onStartExperience }: { onStartExperience: () => void }) {
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
            className="flex items-center"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={logoPolice}
              alt="Politiet"
              className="h-14 w-auto sm:h-16"
              loading="eager"
            />
          </motion.a>

          <motion.button
            type="button"
            onClick={onStartExperience}
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="btn-pulse-ring rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Prøv scenarioet
          </motion.button>
        </div>
      </Container>
    </motion.header>
  );
}
