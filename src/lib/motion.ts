export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut }
  }
};

export const viewportOnce = { once: true, margin: "-80px" as const };
