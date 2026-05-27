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
            className="flex items-center"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src={logoPolice} alt="Politiet" className="h-14 w-auto sm:h-16" loading="eager" />
          </motion.a>
        </div>
      </Container>
    </motion.header>
  );
}
