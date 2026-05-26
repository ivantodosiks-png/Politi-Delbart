import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut, fadeUp, viewportOnce } from "../lib/motion";

export default function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="max-w-2xl">
      <motion.div
        initial={reduceMotion ? false : fadeUp.hidden}
        whileInView={reduceMotion ? undefined : fadeUp.visible}
        viewport={viewportOnce}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">{eyebrow}</p>
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.08, ease: easeOut }}
          className="mt-2 block h-0.5 w-12 origin-left rounded-full bg-blue-700/30"
        />
      </motion.div>
      <motion.h2
        initial={reduceMotion ? false : { ...fadeUp.hidden, y: 12 }}
        whileInView={reduceMotion ? undefined : fadeUp.visible}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.06, ease: easeOut }}
        className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.div
          initial={reduceMotion ? false : { ...fadeUp.hidden, y: 10 }}
          whileInView={reduceMotion ? undefined : fadeUp.visible}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.12, ease: easeOut }}
          className="mt-3 text-sm leading-relaxed text-slate-700"
        >
          {description}
        </motion.div>
      ) : null}
    </div>
  );
}
