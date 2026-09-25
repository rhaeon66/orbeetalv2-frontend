"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useAnimationFrame, useMotionValue } from "framer-motion";

const SLIDE_MS = 4800;
const SPEED = 1 / SLIDE_MS;
const RESUME_MS = 4000;
const SNAP_MS = 0.6;
const EASE = [0.22, 1, 0.36, 1];

function wrapIndex(value, count) {
  if (count <= 0) return 0;
  return ((value % count) + count) % count;
}

function shortestDelta(from, to, count) {
  if (count < 2) return 0;
  let diff = wrapIndex(to, count) - wrapIndex(from, count);
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return diff;
}

export function useShowcaseCarousel({ count, reduceMotion = false }) {
  const rootRef = useRef(null);
  const progress = useMotionValue(0);
  const [base, setBase] = useState(0);
  const [active, setActive] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  const baseRef = useRef(0);
  const activeRef = useRef(0);
  const countRef = useRef(count);
  const resumeRef = useRef(null);
  const snapRef = useRef(null);
  const canAutoplayRef = useRef(false);

  countRef.current = count;

  const syncDerived = useCallback((value) => {
    const total = countRef.current;
    const floor = Math.floor(value);
    const rounded = Math.round(value);
    if (floor !== baseRef.current) {
      baseRef.current = floor;
      setBase(floor);
    }
    const wrapped = wrapIndex(rounded, total);
    if (wrapped !== activeRef.current) {
      activeRef.current = wrapped;
      setActive(wrapped);
    }
  }, []);

  const pauseThenResume = useCallback(() => {
    canAutoplayRef.current = false;
    setManualPaused(true);
    window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setManualPaused(false), RESUME_MS);
  }, []);

  const snapTo = useCallback(
    (target, manual = false) => {
      if (countRef.current < 2) return;
      snapRef.current?.stop();
      const duration = reduceMotion ? 0.2 : SNAP_MS;
      snapRef.current = animate(progress, target, {
        duration,
        ease: EASE,
        onUpdate: syncDerived,
        onComplete: () => syncDerived(target),
      });
      if (manual) pauseThenResume();
    },
    [pauseThenResume, progress, reduceMotion, syncDerived]
  );

  const next = useCallback(
    (manual = false) => {
      snapTo(Math.round(progress.get()) + 1, manual);
    },
    [progress, snapTo]
  );

  const prev = useCallback(
    (manual = false) => {
      snapTo(Math.round(progress.get()) - 1, manual);
    },
    [progress, snapTo]
  );

  const goBy = useCallback(
    (offset, manual = false) => {
      if (!offset) return;
      snapTo(Math.round(progress.get()) + offset, manual);
    },
    [progress, snapTo]
  );

  const goTo = useCallback(
    (target, manual = false) => {
      const total = countRef.current;
      if (total < 2) return;
      const current = Math.round(progress.get());
      snapTo(current + shortestDelta(current, target, total), manual);
    },
    [progress, snapTo]
  );

  useEffect(() => {
    progress.set(0);
    baseRef.current = 0;
    activeRef.current = 0;
    setBase(0);
    setActive(0);
  }, [count, progress]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const section = root.closest("section") || root;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2, 0.5] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(resumeRef.current);
    snapRef.current?.stop();
  }, []);

  const canAutoplay =
    visible &&
    !hoverPaused &&
    !manualPaused &&
    !pageHidden &&
    !reduceMotion &&
    count > 1;

  canAutoplayRef.current = canAutoplay;

  useAnimationFrame((_, delta) => {
    if (!canAutoplayRef.current) return;
    const nextValue = progress.get() + delta * SPEED;
    progress.set(nextValue);
    syncDerived(nextValue);
  });

  const onPointerEnter = useCallback(() => {
    canAutoplayRef.current = false;
    setHoverPaused(true);
  }, []);
  const onPointerLeave = useCallback(() => setHoverPaused(false), []);

  return {
    rootRef,
    progress,
    base,
    active,
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
