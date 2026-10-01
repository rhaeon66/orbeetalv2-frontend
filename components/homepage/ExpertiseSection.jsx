"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { slugify } from "@/lib/slug";
import { expertiseVisual } from "./expertiseVisuals";
import { CardWatermark } from "@/components/illustrations";

function serviceHref(service) {
  return `/services#service-tab-${slugify(service?.title)}`;
}

function ExpertiseCard({ service, index }) {
  const Icon = expertiseVisual(service);
  const number = String(index + 1).padStart(2, "0");
  const text = service.description || "";
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const pointerType = useRef("mouse");

  useEffect(() => {
    if (!open) {
      setCount(0);
      return;
    }
    if (reduce || !text) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, 16);
    return () => window.clearInterval(id);
  }, [open, reduce, text]);

  const shown = text.slice(0, count);
  const typing = open && count < text.length;

  return (
    <Link
      href={serviceHref(service)}
      className={`dept-card dept-card--service${open ? " is-open" : ""}`}
      aria-label={service.title}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(event) => {
        if (pointerType.current !== "mouse" && !open) {
          event.preventDefault();
          setOpen(true);
        }
      }}
    >
      <CardWatermark topic={service} tone={index % 2 === 0 ? "cyan" : "navy"} size="md" />
      <div className="relative flex items-center gap-3">
        <span className="dept-icon dept-icon--cyan shrink-0">
          <Icon size={20} strokeWidth={2.1} />
        </span>
        <h3 className="min-w-0 flex-1 text-[1.12rem] font-extrabold leading-tight text-ink-900">
          {service.title}
        </h3>
        <span className="shrink-0 text-[0.8rem] font-semibold tracking-[0.12em] text-ink-400">
          {number}
        </span>
      </div>
      {text ? <p className="sr-only">{text}</p> : null}
      {open && text ? (
        <p className="relative mt-1.5 max-w-[17rem] pr-2 text-[0.9rem] leading-relaxed text-ink-500" aria-hidden>
          {shown}
          {typing ? (
            <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-cyan-ink align-middle" />
          ) : null}
        </p>
      ) : null}
    </Link>
  );
}

export default function ExpertiseSection({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const expertise = data?.expertise;
  const services = expertise?.items || [];
  const reduce = useReducedMotion();

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow={expertise?.eyebrow || "Services"}
          title={
            <>
              {expertise?.title || "Our"}{" "}
              <span className="text-gradient">{expertise?.highlight || "Expertise"}</span>
            </>
          }
          subtitle={
            expertise?.subtitle ||
            "A full spectrum of digital capabilities — combined under one roof to take your product from idea to impact."
          }
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
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

        {services.length > 0 && (
          <motion.div
            className="dept-grid__row section-stack mx-auto max-w-6xl"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0, 0.08)}
          >
            {services.map((service, index) => (
              <motion.div key={service.title || index} className="h-full" variants={fadeUp}>
                <ExpertiseCard service={service} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </SectionShell>
    </section>
  );
}
