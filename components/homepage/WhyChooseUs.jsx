"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { EASE, fadeRight, scaleIn, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

function WhyCompanyArt() {
  const ref = useRef(null);
  const [markup, setMarkup] = useState("");
  const [play, setPlay] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/images/why-company.svg")
      .then((response) => {
        if (!response.ok) throw new Error("why-company");
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setMarkup(text);
      })
      .catch(() => {
        if (!cancelled) setMarkup("");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || !markup || play) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlay(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlay(true);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [markup, play]);

  const html = play ? markup.replace("<svg ", '<svg class="animated" ') : markup;

  if (!markup) {
    return (
      <img
        src="/images/why-company.svg"
        alt="Orbeetal team at work"
        width={550}
        height={550}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain"
      />
    );
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Orbeetal team at work"
      className="absolute inset-0 [&_svg]:h-full [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function FeatureRow({ service, index, started }) {
  const reduce = useReducedMotion();
  const timerRef = useRef(null);
  const text = service.description || "";
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return undefined;
    if (reduce || !text) {
      setCount(text.length);
      return undefined;
    }
    const delay = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => {
        setCount((current) => {
          if (current >= text.length) {
            window.clearInterval(timerRef.current);
            return current;
          }
          return current + 1;
        });
      }, 16);
    }, index * 140);
    return () => {
      window.clearTimeout(delay);
      window.clearInterval(timerRef.current);
    };
  }, [started, reduce, text, index]);

  const shown = text.slice(0, count);
  const typing = started && count > 0 && count < text.length;

  return (
    <motion.div
      variants={fadeRight}
      transition={{ duration: 0.22, ease: EASE }}
      className="card group flex items-start gap-3.5 p-4 transition-colors duration-200 hover:border-cyan/50 hover:bg-accent-light/50"
    >
      <CardWatermark topic={service} tone="cyan" size="sm" />
      <span className="icon-well transition-colors duration-200 group-hover:bg-accent-light">
        {service.icon ? (
          <Image
            src={service.icon}
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 object-contain"
          />
        ) : null}
      </span>
      <div className="relative min-w-0 flex-1">
        <h3 className="text-[0.95rem] font-semibold text-ink-900 group-hover:font-bold">{service.title}</h3>
        {text ? <p className="sr-only">{text}</p> : null}
        {count > 0 ? (
          <p className="mt-1 min-h-[1.25rem] text-sm leading-relaxed text-ink-500 group-hover:font-bold" aria-hidden>
            {shown}
            {typing ? (
              <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-cyan-ink align-middle" />
            ) : null}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs({ surface = "bg-sage" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const why = data?.why;
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [why]);

  return (
    <section ref={sectionRef} className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow={why?.eyebrow || "Why Choose Us"}
          title={
            <>
              {why?.title || "We Are Here to Grow Your"}{" "}
              <span className="text-gradient">
                {why?.highlight || "Business Exponentially"}
              </span>
            </>
          }
          subtitle={
            why?.subtitle ||
            "A single partner for strategy, design, engineering and growth — committed to outcomes that move your business forward."
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

        {why && (
          <div className="section-stack grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={scaleIn}
            >
              <div className="media-frame relative aspect-square w-full">
                <WhyCompanyArt />
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3"
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={stagger(0.04, 0.08)}
            >
              {(why.items || []).map((service, index) => (
                <FeatureRow key={service.title} service={service} index={index} started={started} />
              ))}
            </motion.div>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
