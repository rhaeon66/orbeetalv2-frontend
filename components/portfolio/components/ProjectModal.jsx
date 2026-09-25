"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import { CardWatermark } from "@/components/illustrations";

export default function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);
  const visitRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (project) {
      document.addEventListener("keydown", onKey);
      setTimeout(
        () => (project?.link ? visitRef.current?.focus() : closeRef.current?.focus()),
        80
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  const related = project?.supervisor || project?.partner || project?.organization;
  const relatedLabel = project?.supervisor
    ? "Supervisor"
    : project?.partner
      ? "Partner"
      : "Organization";

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-sage/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.22 } }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.22 } }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <div className="relative flex max-h-[92vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-t-[1.25rem] border border-line bg-cream shadow-[var(--shadow-lg)] sm:rounded-[1.25rem]">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="icon-btn absolute right-4 top-4 z-10 h-10 w-10"
                aria-label="Close project details"
              >
                <X size={18} />
              </button>

              <div className="grid overflow-y-auto md:grid-cols-2">
                <div className="card-watermark-stage space-y-5 p-6 sm:p-8">
                  <CardWatermark topic={project} tone="navy" size="lg" />
                  <div className="flex items-start gap-4 pr-10">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-muted">
                      <Image
                        src={project.logo || "/logo-small.jpeg"}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 id="project-modal-title" className="text-xl font-extrabold text-ink-900 md:text-2xl">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-ink-500">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      Features
                    </p>
                    <ul className="mt-3 space-y-2">
                      {project.features?.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-ink-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {related && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-400">
                        {relatedLabel}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface-muted">
                          <Image
                            src={related.image || "/logo-small.jpeg"}
                            alt={related.name || relatedLabel}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-ink-800">{related.name}</p>
                          {related.role && (
                            <p className="text-xs text-ink-400">{related.role}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.link && (
                    <a
                      ref={visitRef}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      aria-label={`Open ${project.title} website in new tab`}
                    >
                      Open site
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-center bg-surface-muted p-5 sm:p-8">
                  <div className="relative h-56 w-full overflow-hidden rounded-[1.25rem] border border-line bg-cream md:h-72 lg:h-80">
                    <Image
                      src={project.image || "/images/web.png"}
                      alt={`${project.title} mockup`}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
