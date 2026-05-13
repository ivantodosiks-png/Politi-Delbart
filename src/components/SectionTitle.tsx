import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.5 }}
        className="text-xs font-semibold uppercase tracking-wider text-sky-300"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-sm leading-relaxed text-slate-300"
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}

