"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, fadeLeft, fadeRight, scaleIn, EASE, viewportOnce } from "./motion";

const VARIANTS = {
  up: fadeUp,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
  },
};

export default function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  duration,
  amount = 0.2,
  className = "",
  once = true,
  ...rest
}) {
  const MotionTag = motion[as] ?? motion.div;
  const reduceMotion = useReducedMotion();
  const variants = VARIANTS[direction] ?? fadeUp;

  if (reduceMotion) {
    const Tag = as === "div" ? "div" : as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay, duration, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export { viewportOnce };
