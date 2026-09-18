"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 5500;

function wrapIndex(value, count) {
  if (count <= 0) return 0;
  return ((value % count) + count) % count;
}

function getResumeTarget(section, steps = 2) {
  if (!section) return null;
  let node = section;
  let last = null;
  for (let i = 0; i < steps; i += 1) {
    node = node.nextElementSibling;
    if (!node) return last;
    last = node;
  }
  return last;
}

export function useShowcaseCarousel({
  count,
  reduceMotion = false,
  interval = AUTOPLAY_MS,
  resumeSteps = 2,
}) {
  const rootRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const resumeArmedRef = useRef(false);

  const next = useCallback(
    (manual = false) => {
      if (count < 2) return;
      setIndex((current) => current + 1);
      if (manual) setManualPaused(true);
    },
    [count]
  );

  const prev = useCallback(
    (manual = false) => {
      if (count < 2) return;
      setIndex((current) => current - 1);
      if (manual) setManualPaused(true);
    },
    [count]
  );

  const goBy = useCallback(
    (offset, manual = false) => {
      if (count < 2 || !offset) return;
      setIndex((current) => current + offset);
      if (manual) setManualPaused(true);
    },
    [count]
  );

  const goTo = useCallback(
    (target, manual = false) => {
      if (count < 2) return;
      setIndex((current) => {
        const from = wrapIndex(current, count);
        const to = wrapIndex(target, count);
        return current + (to - from);
      });
      if (manual) setManualPaused(true);
    },
    [count]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const section = root.closest("section") || root;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.28),
      { threshold: [0, 0.28, 0.5] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!manualPaused) {
      resumeArmedRef.current = false;
      return undefined;
    }
    const root = rootRef.current;
    const section = root?.closest("section") || root;
    const target = getResumeTarget(section, resumeSteps);
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          resumeArmedRef.current = true;
          return;
        }
        if (resumeArmedRef.current) {
          setManualPaused(false);
          resumeArmedRef.current = false;
        }
      },
      { threshold: 0.28 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [manualPaused, resumeSteps]);

  const canAutoplay =
    visible &&
    !hoverPaused &&
    !manualPaused &&
    !reduceMotion &&
    count > 1;

  useEffect(() => {
    if (!canAutoplay) return undefined;
    const timer = window.setInterval(() => next(false), interval);
    return () => window.clearInterval(timer);
  }, [canAutoplay, interval, next]);

  const onPointerEnter = useCallback(() => setHoverPaused(true), []);
  const onPointerLeave = useCallback(() => setHoverPaused(false), []);

  return {
    rootRef,
    index,
    active: wrapIndex(index, count),
    next,
    prev,
    goBy,
    goTo,
    hoverPaused,
    manualPaused,
    visible,
    canAutoplay,
    onPointerEnter,
    onPointerLeave,
  };
}

export { wrapIndex };
