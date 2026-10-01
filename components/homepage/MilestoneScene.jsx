"use client";

import { useEffect, useRef, useState } from "react";

export default function MilestoneScene({ className = "" }) {
  const ref = useRef(null);
  const [markup, setMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/images/about/milestones.svg")
      .then((response) => {
        if (!response.ok) throw new Error("milestones");
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
    if (!root || !markup) return undefined;
    const svg = root.querySelector("svg");
    if (!svg) return undefined;

    const play = () => {
      if (!svg.classList.contains("animated")) svg.classList.add("animated");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      play();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        play();
        observer.disconnect();
      },
      { threshold: 0.25 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [markup]);

  if (!markup) {
    return (
      <img
        src="/images/about/milestones.svg"
        alt="A path of milestones leading up a mountain"
        width={500}
        height={500}
        draggable={false}
        className={`milestone-scene h-auto w-full ${className}`}
      />
    );
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label="A path of milestones leading up a mountain"
      className={`milestone-scene aspect-square w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
