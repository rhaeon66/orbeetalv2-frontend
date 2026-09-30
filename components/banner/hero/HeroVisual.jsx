"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { carouselVisual, carouselVisualReduce, EASE } from "@/components/ui/motion";
import { HeroScene } from "./HeroScenes";

export default function HeroVisual({ theme, direction, compact, slideKey }) {
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
        <HeroScene theme={theme} />
      </motion.div>
    </AnimatePresence>
  );
}
