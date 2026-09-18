"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { carouselVisual, carouselVisualReduce, EASE } from "@/components/ui/motion";
import { HeroScene } from "./HeroScenes";

export default function HeroVisual({
  theme,
  image,
  alt,
  direction,
  compact,
  slideKey,
}) {
  const reduce = useReducedMotion();
  const variants = reduce ? carouselVisualReduce : carouselVisual(compact);

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={slideKey}
        custom={direction}
        variants={variants}
        initial={reduce ? false : "enter"}
        animate="center"
        exit={reduce ? undefined : "exit"}
        transition={{ duration: reduce ? 0.3 : 0.55, ease: EASE }}
      >
        <div className="relative rounded-[1.5rem] border border-line bg-cream/80 p-3 shadow-[var(--shadow-sm)] sm:p-4">
          <HeroScene theme={theme} image={image} alt={alt} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
