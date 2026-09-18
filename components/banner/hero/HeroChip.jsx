"use client";

import { motion, useReducedMotion } from "framer-motion";
import { chipIn, stagger } from "@/components/ui/motion";

export function HeroChip({ children, className = "", iconColor }) {
  return (
    <motion.span variants={chipIn} className={`hero-chip ${className}`}>
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: iconColor || "var(--brand-accent)" }}
        aria-hidden
      />
      {children}
    </motion.span>
  );
}

export function ChipLayer({ chips = [], color, positions = [] }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      initial={reduce ? false : "hidden"}
      animate="visible"
      variants={reduce ? undefined : stagger(0.08, 0.08)}
    >
      {chips.map((label, index) => (
        <HeroChip
          key={label}
          iconColor={color}
          className={`absolute ${positions[index] || "top-3 right-3"}`}
        >
          {label}
        </HeroChip>
      ))}
    </motion.div>
  );
}
