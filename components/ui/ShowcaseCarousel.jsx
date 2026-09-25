"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShowcaseCarousel, wrapIndex } from "@/hooks/useShowcaseCarousel";

const OFFSETS = [-2, -1, 0, 1, 2];

function depthClass(distance) {
  if (distance < 0.5) return "is-center";
  if (distance < 1.5) return "is-adjacent";
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

function ShowcaseSlide({
  logical,
  item,
  progress,
  step,
  count,
  reduce,
  renderItem,
  onSelect,
}) {
  const stepRef = useRef(step);
  stepRef.current = step;
  const x = useTransform(progress, (value) => (logical - value) * stepRef.current);
  const scale = useTransform(progress, (value) => {
    const abs = Math.abs(logical - value);
    if (abs <= 1) return 1 - abs * 0.06;
    return 0.94 - Math.min(abs - 1, 1) * 0.06;
  });
  const opacity = useTransform(progress, (value) => {
    const abs = Math.abs(logical - value);
    if (abs <= 1) return 1 - abs * 0.18;
    return 0.82 - Math.min(abs - 1, 1) * 0.1;
  });
  const zIndex = useTransform(progress, (value) => 10 - Math.abs(logical - value));
  const [band, setBand] = useState(() => depthClass(Math.abs(logical - progress.get())));
  const isCenter = band === "is-center";

  useEffect(() => {
    const sync = (value) => setBand(depthClass(Math.abs(logical - value)));
    sync(progress.get());
    return progress.on("change", sync);
  }, [logical, progress]);

  return (
    <motion.div
      className={`showcase-carousel-slide ${band}`}
      style={{ x, scaleX: scale, scaleY: scale, opacity, zIndex }}
      aria-hidden={!isCenter}
    >
      <motion.div
        className="h-auto"
        whileHover={isCenter && !reduce ? { y: -5 } : undefined}
        transition={{ duration: 0.28 }}
        onClick={
          !isCenter && count > 1
            ? (event) => {
                if (event.target.closest("a, button")) return;
                onSelect(logical);
              }
            : undefined
        }
      >
        {renderItem(item, { active: isCenter })}
      </motion.div>
    </motion.div>
  );
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
    progress,
    base,
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
  }, [count, rootRef, size, base]);

  const slots = useMemo(() => {
    if (!count) return [];
    const offsets = count < 2 ? [0] : OFFSETS;
    return offsets.map((offset) => {
      const logical = base + offset;
      const item = items[wrapIndex(logical, count)];
      return { offset, logical, item, key: `${getKey(item)}-${logical}` };
    });
  }, [base, count, getKey, items]);

  if (!count) return null;

  return (
    <div
      ref={rootRef}
      className={`showcase-carousel showcase-carousel--${size}${count < 2 ? " showcase-carousel--solo" : ""} ${className}`.trim()}
      onFocusCapture={(event) => {
        if (event.target.closest(".showcase-carousel-slide")) onPointerEnter();
      }}
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
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {slots.map(({ logical, item, key }) => (
          <ShowcaseSlide
            key={key}
            logical={logical}
            item={item}
            progress={progress}
            step={step}
            count={count}
            reduce={reduce}
            renderItem={renderItem}
            onSelect={(logical) => {
              const delta = logical - Math.round(progress.get());
              if (delta) goBy(delta, true);
            }}
          />
        ))}
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
