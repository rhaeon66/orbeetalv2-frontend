export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const stagger = (delayChildren = 0.08, staggerChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren },
  },
});

export const viewportOnce = { once: true, amount: 0.2 };

export const copyItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const chipIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
};

export const carouselCopy = (compact = false) => {
  const offset = compact ? 12 : 35;
  return {
    enter: (direction) => ({
      opacity: 0,
      x: direction > 0 ? offset : -offset,
      y: 16,
    }),
    center: { opacity: 1, x: 0, y: 0 },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -offset : offset,
    }),
  };
};

export const carouselCopyReduce = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const carouselVisual = (compact = false) => {
  const offset = compact ? 12 : 25;
  return {
    enter: (direction) => ({
      opacity: 0,
      scale: 0.96,
      x: direction > 0 ? offset : -offset,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.55, ease: EASE, delay: 0.08 },
    },
    exit: (direction) => ({
      opacity: 0,
      scale: 0.98,
      x: direction > 0 ? -offset * 0.7 : offset * 0.7,
    }),
  };
};

export const carouselVisualReduce = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0 },
};
