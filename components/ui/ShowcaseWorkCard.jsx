"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { CardWatermark } from "@/components/illustrations";

function ClampedDescription({ text, onMore }) {
  const clampRef = useRef(null);
  const fullRef = useRef(null);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const clamp = clampRef.current;
    const full = fullRef.current;
    if (!clamp || !full) return undefined;
    const measure = () => setOverflows(full.scrollHeight > clamp.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(clamp);
    return () => observer.disconnect();
  }, [text]);

  if (!text) return null;

  return (
    <div className="relative mt-2">
      <p
        ref={fullRef}
        className="pointer-events-none invisible absolute inset-x-0 top-0 text-sm leading-relaxed"
        aria-hidden
      >
        {text}
      </p>
      <p ref={clampRef} className="relative line-clamp-2 min-h-[3.25em] text-sm leading-relaxed">
        {text}
      </p>
      {overflows ? (
        <button type="button" onClick={onMore} className="mt-2 text-sm font-bold text-accent">
          See more
        </button>
      ) : null}
    </div>
  );
}

export function WorkDialog({ title, description, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-sage/80 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-dialog-title"
        className="card relative z-[1] max-h-[min(80vh,40rem)] w-full max-w-lg overflow-y-auto p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="icon-btn absolute right-4 top-4 h-10 w-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h3 id="work-dialog-title" className="pr-10 text-lg font-bold text-ink-900">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-700">{description}</p>
      </div>
    </div>
  );
}

export default function ShowcaseWorkCard({
  image,
  title,
  description,
  tags = [],
  href,
  external = false,
  linkLabel,
  onMore,
  topic = title,
}) {
  return (
    <article className="showcase-carousel-card h-full min-h-[var(--showcase-card-height)]">
      <div className="showcase-media showcase-media--cover shrink-0">{image}</div>
      <div className="relative flex flex-1 flex-col overflow-hidden px-5 pb-5">
        <CardWatermark topic={topic} tone="cyan" size="md" />
        <h3 className="relative line-clamp-2 text-lg font-bold">{title}</h3>
        <ClampedDescription text={description} onMore={onMore} />
        <div className="relative mt-auto pt-3">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                  style={{ borderColor: "var(--showcase-border)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent"
          >
            {linkLabel}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
