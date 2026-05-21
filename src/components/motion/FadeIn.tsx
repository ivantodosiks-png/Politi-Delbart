import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut, fadeUp, viewportOnce } from "../../lib/motion";

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  as: Tag = "div"
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "p" | "header" | "footer";
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[Tag];

  return (
    <Component
      initial={reduceMotion ? false : fadeUp.hidden}
      whileInView={reduceMotion ? undefined : fadeUp.visible}
      viewport={viewportOnce}
      transition={{ duration: 0.55, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </Component>
  );
}
