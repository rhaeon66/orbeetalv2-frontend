"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HERO } from "./heroPalette";

const PATHS = [
  "M -12 78 H 96 Q 118 78 118 100 V 168 H 280 Q 300 168 300 188 V 230",
  "M 652 46 H 468 Q 446 46 446 68 V 150 H 360 Q 340 150 340 170 V 230",
  "M 36 430 H 168 Q 190 430 190 408 V 292 H 300 Q 320 292 320 272 V 240",
];

const COMPACT_PATHS = PATHS.slice(0, 2);

const NODES = [
  [118, 168, false],
  [300, 230, true],
  [446, 150, false],
  [340, 230, true],
  [190, 292, false],
  [320, 240, true],
];

const TRAILS = [
  { points: [[-12, 78], [118, 78], [118, 168], [300, 168], [300, 230]], duration: 9 },
  { points: [[652, 46], [446, 46], [446, 150], [340, 150], [340, 230]], duration: 11 },
  { points: [[36, 430], [190, 430], [190, 292], [320, 292], [320, 240]], duration: 10 },
];

function Particle({ points, duration, delay }) {
  return (
    <motion.circle
      r="3.2"
      fill={HERO.cyan}
      initial={false}
      animate={{
        cx: points.map((point) => point[0]),
        cy: points.map((point) => point[1]),
        opacity: [0.2, 0.85, 0.85, 0.2],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function CircuitNetwork({ compact = false }) {
  const reduce = useReducedMotion();
  const paths = compact ? COMPACT_PATHS : PATHS;
  const nodes = compact ? NODES.slice(0, 4) : NODES;

  return (
    <motion.svg
      viewBox="0 0 640 460"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      aria-hidden
      animate={reduce ? undefined : { x: [0, 10, 0], y: [0, -8, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    >
      {paths.map((d, index) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={HERO.cyan}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={
            reduce
              ? { opacity: 0.12 }
              : { opacity: index % 2 === 0 ? [0.06, 0.16, 0.06] : [0.08, 0.14, 0.08] }
          }
          transition={{ duration: 5.5 + index, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {nodes.map(([cx, cy, active], index) => (
        <g key={`${cx}-${cy}`}>
          {active && !reduce && (
            <motion.circle
              cx={cx}
              cy={cy}
              r="8"
              fill={HERO.lime}
              animate={{ opacity: [0.08, 0.28, 0.08] }}
              transition={{ duration: 3.4, delay: index * 0.2, repeat: Infinity }}
            />
          )}
          <motion.circle
            cx={cx}
            cy={cy}
            r={active ? 3.4 : 2.4}
            fill={active ? HERO.lime : HERO.cyan}
            animate={reduce ? { opacity: active ? 0.85 : 0.35 } : { opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 3.2, delay: index * 0.25, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      ))}
      {!reduce &&
        !compact &&
        TRAILS.map((trail) => (
          <Particle key={trail.duration} {...trail} delay={trail.duration / 5} />
        ))}
    </motion.svg>
  );
}
