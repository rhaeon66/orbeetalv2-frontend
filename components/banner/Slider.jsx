"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useGetPublishedSlidesQuery } from "@/redux/features/cms/slidesApi";
import {
  EASE,
  carouselCopy,
  carouselCopyReduce,
} from "@/components/ui/motion";
import { getHeroTheme } from "@/components/banner/hero/heroThemes";
import HeroVisual from "@/components/banner/hero/HeroVisual";
import TrustRow from "@/components/banner/hero/TrustRow";
import SectionShell from "@/components/layouts/SectionShell";

const SLIDE_DURATION = 5500;
const INTERACT_RESUME = 4000;

export default function BannerSlider({ surface = "bg-sage" }) {
  const reduceMotion = useReducedMotion();
  const { data: slides = [], isLoading, isError, refetch } =
    useGetPublishedSlidesQuery();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [interacted, setInteracted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [controlsHover, setControlsHover] = useState(false);
  const resumeRef = useRef(null);
  const sectionRef = useRef(null);
  const primed = useRef(false);
  const count = slides.length;
  const paused = interacted || pageHidden || offscreen || controlsHover;

  const markInteract = useCallback(() => {
    setInteracted(true);
    window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setInteracted(false), INTERACT_RESUME);
  }, []);

  const goTo = useCallback(
    (index, dir, fromUser = false) => {
      if (!count) return;
      setDirection(dir);
      setCurrent((index + count) % count);
      if (fromUser) markInteract();
    },
    [count, markInteract]
  );

  const nextSlide = useCallback(
    (fromUser = false) => goTo(current + 1, 1, fromUser),
    [current, goTo]
  );
  const prevSlide = useCallback(
    (fromUser = false) => goTo(current - 1, -1, fromUser),
    [current, goTo]
  );

  useEffect(() => {
    if (!count) return;
    if (!primed.current) {
      primed.current = true;
      setCurrent(0);
      return;
    }
    if (current >= count) setCurrent(0);
  }, [count, current]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || count < 2 || reduceMotion) return undefined;
    const timer = setInterval(() => nextSlide(false), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [paused, nextSlide, count, reduceMotion]);

  useEffect(() => () => window.clearTimeout(resumeRef.current), []);

  const slide = slides[current] || {
    tag: isLoading ? "Loading" : "Orbeetal",
    headline: isLoading
      ? "Loading slides"
      : isError
        ? "Could not load slides"
        : "Custom Software",
    accent: isLoading || isError ? "" : "Amazing IT Services",
    description: isLoading
      ? ""
      : isError
        ? "Retry to load the latest hero content."
        : "Check back soon for the latest work from our team.",
    primary_cta: isError ? null : { label: "Get a Quote", href: "/contact" },
    secondary_cta: isError
      ? null
      : { label: "View Portfolio", href: "/portfolio" },
    image: "",
  };

  const theme = getHeroTheme(slide.tag);
  const copyVariants = reduceMotion ? carouselCopyReduce : carouselCopy(compact);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide(true);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevSlide(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${surface}`}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Featured services"
    >
      <div className="hero-grid-quiet pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 h-72 w-72 rounded-full blur-3xl lg:h-96 lg:w-96"
        animate={{ backgroundColor: theme.glowA }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-0 h-56 w-56 rounded-full blur-3xl lg:h-72 lg:w-72"
        animate={{ backgroundColor: theme.glowB }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
      />

      <p className="sr-only" aria-live="polite">
        {count
          ? `Slide ${current + 1} of ${count}: ${slide.tag}`
          : slide.headline}
      </p>

      <SectionShell className="relative grid min-h-[36rem] items-center gap-8 pb-12 pt-24 sm:gap-10 sm:pb-14 sm:pt-28 lg:min-h-[40rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8 lg:pb-16 lg:pt-32">
        <div className="min-w-0">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={copyVariants}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={{ duration: reduceMotion ? 0.3 : 0.5, ease: EASE }}
            >
              <span
                className="eyebrow"
                style={{ background: theme.pillBg, borderColor: theme.pillBorder }}
              >
                {slide.tag}
              </span>

              <h1 className="mt-5 max-w-xl text-[1.85rem] font-extrabold leading-[1.12] tracking-tight text-ink-900 sm:text-[2.35rem] lg:text-[2.85rem]">
                {slide.headline}{" "}
                {slide.accent ? (
                  <span className="hero-accent-clip">{slide.accent}</span>
                ) : null}
              </h1>

              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-500 sm:text-[1.0625rem]">
                {slide.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {isError && (
                  <button type="button" className="btn btn-primary" onClick={() => refetch()}>
                    Retry
                  </button>
                )}
                {slide.primary_cta?.href && slide.primary_cta?.label && (
                  <Link href={slide.primary_cta.href} className="btn btn-primary">
                    {slide.primary_cta.label}
                    <ArrowRight size={16} className="btn-icon" />
                  </Link>
                )}
                {slide.secondary_cta?.href && slide.secondary_cta?.label && (
                  <Link href={slide.secondary_cta.href} className="btn btn-ghost">
                    {slide.secondary_cta.label}
                    <ArrowRight size={16} className="btn-icon" />
                  </Link>
                )}
              </div>

              <div className="mt-6">
                <TrustRow />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-xl lg:row-span-2 lg:mt-0 lg:max-w-none">
          <HeroVisual
            theme={theme}
            direction={direction}
            compact={compact}
            slideKey={current}
          />
        </div>

        {count > 1 && (
          <div
            className="flex items-center gap-3"
            onMouseEnter={() => setControlsHover(true)}
            onMouseLeave={() => setControlsHover(false)}
          >
            <button
              type="button"
              onClick={() => prevSlide(true)}
              aria-label="Previous slide"
              className="icon-btn"
            >
              <IconArrowLeft size={18} stroke={1.75} />
            </button>
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1.5">
              {slides.map((item, i) => (
                <button
                  key={item.id || i}
                  type="button"
                  onClick={() => goTo(i, i > current ? 1 : -1, true)}
                  aria-label={`Go to slide ${i + 1}: ${item.tag || item.headline}`}
                  aria-current={i === current ? "true" : undefined}
                  className="flex h-11 min-w-11 items-center justify-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? "w-7 bg-accent" : "w-2 bg-line hover:bg-ink-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => nextSlide(true)}
              aria-label="Next slide"
              className="icon-btn"
            >
              <IconArrowRight size={18} stroke={1.75} />
            </button>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
