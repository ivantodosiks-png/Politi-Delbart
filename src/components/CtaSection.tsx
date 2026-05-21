import Container from "./Container";
import FadeIn from "./motion/FadeIn";
import { motion, useReducedMotion } from "framer-motion";

export default function CtaSection({ onStartExperience }: { onStartExperience: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-12 sm:py-14">
          <FadeIn className="max-w-2xl rounded-sm border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-slate-700">
              Klar til å teste reaksjonen din? Start øvelsen – det tar omtrent tre minutter, og ingen
              ekte data samles inn.
            </p>
            <motion.button
              type="button"
              onClick={onStartExperience}
              whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="btn-pulse-ring mt-5 inline-flex rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Start øvelsen
            </motion.button>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
