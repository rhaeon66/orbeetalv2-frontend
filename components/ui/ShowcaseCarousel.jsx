"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE } from "@/components/ui/motion";
import { useShowcaseCarousel, wrapIndex } from "@/hooks/useShowcaseCarousel";

const OFFSETS = [-2, -1, 0, 1, 2];

function emphasis(offset) {
  const abs = Math.abs(offset);
  const scale = abs === 0 ? 1 : abs === 1 ? 0.94 : 0.88;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.72;
  return { scaleX: scale, scaleY: scale, opacity };
}

function depthClass(offset) {
  const abs = Math.abs(offset);
  if (abs === 0) return "is-center";
  if (abs === 1) return "is-adjacent";
  return "is-far";
}

function readGap(root) {
  const raw = getComputedStyle(root).getPropertyValue("--showcase-gap").trim();
  if (raw.endsWith("rem")) {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return parseFloat(raw) * rem;
  }
  return parseFloat(raw) || 16;
}

export default function ShowcaseCarousel({
  items = [],
  getKey,
  renderItem,
  label = "carousel",
  size = "default",
  className = "",
}) {
  const reduce = useReducedMotion();
  const count = items.length;
  const {
    rootRef,
    index,
    active,
    next,
    prev,
    goBy,
    goTo,
    onPointerEnter,
    onPointerLeave,
  } = useShowcaseCarousel({ count, reduceMotion: reduce });
  const [step, setStep] = useState(360);
  const [trackHeight, setTrackHeight] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => {
      const slides = [...root.querySelectorAll(".showcase-carousel-slide")];
      if (!slides.length) return;
      setStep(slides[0].offsetWidth + readGap(root));
      const viewport = root.querySelector(".showcase-carousel-viewport");
      const styles = viewport ? getComputedStyle(viewport) : null;
      const pad = styles
        ? parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
        : 0;
      const cards = slides
        .map((slide) => slide.querySelector(".showcase-carousel-card"))
        .filter(Boolean);
      const contentHeight = Math.max(
        0,
        ...cards.map((card) => card.offsetHeight),
        ...slides.map((slide) => slide.offsetHeight)
      );
      if (!contentHeight) return;
      const nextHeight = Math.round(contentHeight + pad);
      setTrackHeight((current) => (Math.abs(current - nextHeight) < 2 ? current : nextHeight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll(".showcase-carousel-slide").forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [count, rootRef, size, index]);

  const slots = useMemo(() => {
    if (!count) return [];
    const offsets = count < 2 ? [0] : OFFSETS;
    return offsets.map((offset) => {
      const logical = index + offset;
      const item = items[wrapIndex(logical, count)];
      return { offset, logical, item };
    });
  }, [count, index, items]);

  if (!count) return null;

  const duration = reduce ? 0.18 : 0.55;

  return (
    <div
      ref={rootRef}
      className={`showcase-carousel showcase-carousel--${size}${count < 2 ? " showcase-carousel--solo" : ""} ${className}`.trim()}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      onFocusCapture={onPointerEnter}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onPointerLeave();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next(true);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          prev(true);
        }
      }}
      tabIndex={count > 1 ? 0 : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {count > 1 && (
        <button
          type="button"
          className="showcase-carousel-arrow showcase-carousel-arrow--prev"
          aria-label={`Previous ${label}`}
          onClick={() => prev(true)}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <div
        className="showcase-carousel-viewport"
        style={trackHeight ? { minHeight: trackHeight } : undefined}
      >
        {slots.map(({ offset, logical, item }) => {
          const key = `${getKey(item)}-${logical}`;
          const { scaleX, scaleY, opacity } = emphasis(offset);
          const isCenter = offset === 0;
          return (
            <motion.div
              key={key}
              className={`showcase-carousel-slide ${depthClass(offset)}`}
              initial={false}
              animate={{
                x: offset * step,
                scaleX,
                scaleY,
                opacity,
                y: 0,
                zIndex: 10 - Math.abs(offset),
              }}
              whileHover={
                isCenter && !reduce
                  ? { scaleX: 1.015, scaleY: 1.015, y: -5 }
                  : undefined
              }
              transition={{ duration, ease: EASE }}
              aria-hidden={!isCenter}
            >
              <div
                className="h-auto"
                onClick={
                  !isCenter && count > 1
                    ? (event) => {
                        if (event.target.closest("a, button")) return;
                        goBy(offset, true);
                      }
                    : undefined
                }
              >
                {renderItem(item, { active: isCenter, offset })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {count > 1 && (
        <button
          type="button"
          className="showcase-carousel-arrow showcase-carousel-arrow--next"
          aria-label={`Next ${label}`}
          onClick={() => next(true)}
        >
          <ChevronRight size={22} />
        </button>
      )}

      {count > 1 && (
        <div className="showcase-carousel-progress" role="tablist" aria-label={`${label} slides`}>
          {items.map((item, itemIndex) => {
            const selected = itemIndex === active;
            return (
              <button
                key={getKey(item)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Go to ${label} ${itemIndex + 1}`}
                className={`showcase-carousel-mark${selected ? " is-active" : ""}`}
                onClick={() => goTo(itemIndex, true)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
