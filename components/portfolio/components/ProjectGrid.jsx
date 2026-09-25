"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CardWatermark } from "@/components/illustrations";

export default function ProjectGrid({ projects, onOpen, isDisabled }) {
  const gridVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    hidden: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isDisabled ? "grid-hidden" : "grid-visible"}
        initial={isDisabled ? "hidden" : "visible"}
        animate={isDisabled ? "hidden" : "visible"}
        variants={gridVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={(e) => onOpen(p, e.currentTarget)}
            className="card card-hover group overflow-hidden p-0 text-left"
            aria-label={`Open details for ${p.title}`}
          >
            <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
              <Image
                src={p.image || "/images/web.png"}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent" />
            </div>

            <div className="relative overflow-hidden p-5">
              <CardWatermark topic={p} tone="navy" size="md" />
              <h3 className="relative text-lg font-bold text-ink-900">{p.title}</h3>
              <p className="relative mt-1 text-sm leading-relaxed text-ink-500">{p.subtitle}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-ink-400">
                  {p.features?.length} features
                </span>
                <span className="inline-flex rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-primary-deep transition-colors group-hover:bg-accent-dark">
                  View Project
                </span>
              </div>
            </div>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
