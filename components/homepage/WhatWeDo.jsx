"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { EASE, fadeUp, stagger } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";

function pad(index) {
  return String(index + 1).padStart(2, "0");
}

export default function WhatWeDo({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const methodology = data?.methodology;
  const steps = methodology?.steps || [];
  const reduce = useReducedMotion();
  const lineRef = useRef(null);
  const inView = useInView(lineRef, { once: true, amount: 0.25 });
  const showLine = reduce || inView;

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow={methodology?.eyebrow || "How We Work"}
          title={
            <>
              {methodology?.title || "Our IT"}{" "}
              <span className="text-gradient">
                {methodology?.highlight || "Methodology"}
              </span>
            </>
          }
          subtitle={
            methodology?.subtitle ||
            "A proven, transparent process that takes your idea from concept to a polished, scalable product — on time and on budget."
          }
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load this section.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {steps.length > 0 && (
          <div ref={lineRef} className="section-stack">
            <div className="relative hidden lg:block">
              <div className="absolute left-[8%] right-[8%] top-5 h-px overflow-hidden bg-line">
                <motion.div
                  className="h-full origin-left bg-cyan"
                  initial={{ scaleX: reduce ? 1 : 0 }}
                  animate={{ scaleX: showLine ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
                />
              </div>

              <motion.ol
                className="relative grid grid-cols-4 gap-6"
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger(0.15, 0.16)}
              >
                {steps.map(({ title, desc }, index) => (
                  <motion.li
                    key={`${title}-${index}`}
                    variants={fadeUp}
                    className="flex flex-col items-center px-2 text-center"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-surface text-xs font-extrabold tracking-wide text-primary">
                      {pad(index)}
                    </span>
                    <h3 className="mt-5 text-base font-bold text-ink-900">{title}</h3>
                    <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-ink-500">
                      {desc}
                    </p>
                  </motion.li>
                ))}
              </motion.ol>
            </div>

            <div className="relative lg:hidden">
              <div className="absolute bottom-4 left-5 top-4 w-px overflow-hidden bg-line">
                <motion.div
                  className="h-full w-full origin-top bg-cyan"
                  initial={{ scaleY: reduce ? 1 : 0 }}
                  animate={{ scaleY: showLine ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
                />
              </div>
              <motion.ol
                className="relative flex flex-col gap-8"
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger(0.12, 0.14)}
              >
                {steps.map(({ title, desc }, index) => (
                  <motion.li
                    key={`${title}-${index}`}
                    variants={fadeUp}
                    className="flex gap-4"
                  >
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface text-xs font-extrabold tracking-wide text-primary">
                      {pad(index)}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-base font-bold text-ink-900">{title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
