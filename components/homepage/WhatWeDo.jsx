"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { resolveMethodSteps } from "./methodSteps";
import { CardWatermark } from "@/components/illustrations";

export default function WhatWeDo({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const methodology = data?.methodology;
  const steps = resolveMethodSteps(methodology?.steps);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section className={`section method-section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow={methodology?.eyebrow || "How We Work"}
          title={
            <>
              {methodology?.title || "Our"}{" "}
              <span className="text-gradient">
                {methodology?.highlight || "IT Methodology"}
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
          <div className="method-scroller section-stack">
            <motion.ol
              className="method-track"
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={stagger(0.08, 0.08)}
              onMouseLeave={() => setActive(0)}
            >
              {steps.map((step, index) => {
                const Icon = step.Icon;
                const number = String(index + 1).padStart(2, "0");
                const isActive = active === index;
                return (
                  <motion.li
                    key={`${step.title}-${index}`}
                    variants={fadeUp}
                    className={`method-step${isActive ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                  >
                    <span className="method-num">{number}</span>
                    <Link
                      href="/contact"
                      className="method-card"
                      aria-label={`${step.title} — learn more`}
                    >
                      <CardWatermark topic={step} tone={index % 2 === 0 ? "cyan" : "navy"} size="sm" />
                      <span className="dept-icon dept-icon--cyan">
                        <Icon size={18} strokeWidth={2.15} />
                      </span>
                      <h3 className="method-card__title">{step.title}</h3>
                      <span className="method-card__rule" aria-hidden />
                      <ul className="method-card__list">
                        {step.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <span className="method-card__more">
                        Learn more
                        <ArrowRight size={14} strokeWidth={2.4} />
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ol>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
