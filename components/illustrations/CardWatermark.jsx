"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/ui/motion";
import { MOTIFS } from "./motifs";
import { resolveMotifName } from "./resolveIllustration";

const HOST = ".card, .dept-card, .method-card, .showcase-carousel-card, .card-watermark-stage";

export default function CardWatermark({
  topic,
  motif,
  tone = "navy",
  size = "md",
  placement = "corner",
  className = "",
}) {
  const Art = MOTIFS[motif] || MOTIFS[resolveMotifName(topic)] || MOTIFS.orbit;
  const wrapRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = wrapRef.current?.closest(HOST);
    if (!node) return undefined;

    const on = () => setHovered(true);
    const off = (event) => {
      if (event?.type === "focusout" && node.contains(event.relatedTarget)) return;
      setHovered(false);
    };

    node.addEventListener("pointerenter", on);
    node.addEventListener("pointerleave", off);
    node.addEventListener("focusin", on);
    node.addEventListener("focusout", off);
    return () => {
      node.removeEventListener("pointerenter", on);
      node.removeEventListener("pointerleave", off);
      node.removeEventListener("focusin", on);
      node.removeEventListener("focusout", off);
    };
  }, []);

  const rest = {
    opacity: tone === "cyan" ? 0.08 : 0.07,
    scale: 1,
    x: 0,
    y: 0,
  };
  const hover = {
    opacity: 0.1,
    scale: 1.045,
    x: 5,
    y: -3,
  };

  return (
    <motion.span
      ref={wrapRef}
      aria-hidden
      className={`card-watermark card-watermark--${tone} card-watermark--${size} card-watermark--${placement} ${className}`.trim()}
      initial={false}
      animate={reduce || !hovered ? rest : hover}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <Art />
    </motion.span>
  );
}
