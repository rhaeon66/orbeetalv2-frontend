"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { resolveMethodSteps } from "./methodSteps";
import { CardWatermark } from "@/components/illustrations";

function MethodStep({ step, index, reduce }) {
  const Icon = step.Icon;
  const number = String(index + 1).padStart(2, "0");
  const points = step.points || [];
  const total = points.reduce((sum, point) => sum + point.length, 0);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const pointerType = useRef("mouse");

  useEffect(() => {
    if (!open) {
      setCount(0);
      return;
    }
    if (reduce || !total) {
      setCount(total);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= total) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, 16);
    return () => window.clearInterval(id);
  }, [open, reduce, total]);

  let remaining = count;
  const shown = points.map((point) => {
    if (remaining <= 0) return "";
    const slice = point.slice(0, remaining);
    remaining -= point.length;
    return slice;
  });
  const typingIndex = shown.findIndex((slice, itemIndex) => slice && slice.length < points[itemIndex].length);

  return (
    <motion.li
      variants={fadeUp}
      className={`method-step${open ? " is-active" : ""}`}
    >
      <span className="method-num">{number}</span>
      <div
        className="method-card"
        onPointerDown={(event) => {
          pointerType.current = event.pointerType;
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setOpen(false);
        }}
      >
        <CardWatermark topic={step} tone={index % 2 === 0 ? "cyan" : "navy"} size="sm" />
        <div className="method-card__head">
          <span className="dept-icon dept-icon--cyan">
            <Icon size={18} strokeWidth={2.15} />
          </span>
          <div className="min-w-0">
            <h3
              className="method-card__title cursor-pointer outline-none"
              tabIndex={0}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onClick={() => {
                if (pointerType.current !== "mouse") setOpen((value) => !value);
              }}
            >
              {step.title}
            </h3>
            <span className="method-card__rule" aria-hidden />
          </div>
        </div>
        <ul className="sr-only">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {open && shown.some(Boolean) ? (
          <ul className="method-card__list" aria-hidden>
            {shown.map((slice, itemIndex) =>
              slice ? (
                <li key={points[itemIndex]}>
                  {slice}
                  {itemIndex === typingIndex ? (
                    <span className="ml-0.5 inline-block h-[0.9em] w-px translate-y-[1px] animate-pulse bg-cyan-ink" />
                  ) : null}
                </li>
              ) : null
            )}
          </ul>
        ) : null}
      </div>
    </motion.li>
  );
}

export default function WhatWeDo({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const methodology = data?.methodology;
  const steps = resolveMethodSteps(methodology?.steps);
  const reduce = useReducedMotion();

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
            >
              {steps.map((step, index) => (
                <MethodStep
                  key={`${step.title}-${index}`}
                  step={step}
                  index={index}
                  reduce={reduce}
                />
              ))}
            </motion.ol>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
