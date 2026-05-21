import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut, fadeUp, viewportOnce } from "../../lib/motion";

export default function AnimatedCard({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : fadeUp.hidden}
      whileInView={reduceMotion ? undefined : fadeUp.visible}
      viewport={viewportOnce}
      transition={{ duration: 0.5, delay, ease: easeOut }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -3,
              boxShadow: "0 12px 28px -8px rgb(15 23 42 / 0.08)",
              transition: { duration: 0.22 }
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
