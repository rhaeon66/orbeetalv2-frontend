"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useGetPublishedTestimonialsQuery } from "@/redux/features/cms/testimonialsApi";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

function QuoteExcerpt({ text, onMore }) {
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

  return (
    <div>
      <div className="relative">
        <p
          ref={fullRef}
          className="pointer-events-none invisible absolute inset-x-0 top-0 pr-6 text-base leading-relaxed"
          aria-hidden
        >
          {text}
        </p>
        <p ref={clampRef} className="relative line-clamp-4 pr-6 text-base leading-relaxed">
          {text}
        </p>
      </div>
      {overflows ? (
        <button
          type="button"
          onClick={onMore}
          className="relative mt-2 text-sm font-bold text-accent"
        >
          See more
        </button>
      ) : null}
    </div>
  );
}

function QuoteDialog({ quote, onClose }) {
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
        aria-label="Close testimonial"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-dialog-title"
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
        <p className="pr-8 text-base leading-relaxed text-ink-700">{quote.quote}</p>
        <div className="mt-6 flex items-center gap-3">
          <div className="showcase-media showcase-media--avatar showcase-media--inline">
            {quote.avatar ? (
              <Image
                src={quote.avatar}
                alt=""
                fill
                sizes="52px"
                className="rounded-full object-cover object-top"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <h3 id="testimonial-dialog-title" className="font-semibold leading-tight text-ink-900">
              {quote.name}
            </h3>
            {quote.role ? <p className="text-sm text-ink-500">{quote.role}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSlider({ surface = "bg-cream" }) {
  const { data: testimonials = [], isLoading, isError, refetch } =
    useGetPublishedTestimonialsQuery();
  const [openQuote, setOpenQuote] = useState(null);

  return (
    <section className={`section showcase-section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="From our Customers"
          title={
            <>
              What Clients Say About{" "}
              <span className="text-gradient">Working With Us</span>
            </>
          }
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading testimonials…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load testimonials.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && testimonials.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            Client stories will appear here once they are published.
          </p>
        )}

        {testimonials.length > 0 && (
          <ShowcaseCarousel
            className="section-stack"
            items={testimonials}
            getKey={(item) => item.id}
            label="client testimonials"
            size="wide"
            renderItem={(quote) => (
              <article className="showcase-carousel-card relative h-full min-h-[var(--showcase-card-height)] px-6 pb-6 pt-5 sm:px-8 sm:pb-7">
                <CardWatermark topic="client collaboration" tone="cyan" size="sm" />
                <span className="absolute right-6 top-4 select-none font-serif text-6xl leading-none text-primary/20">
                  ”
                </span>
                <QuoteExcerpt text={quote.quote} onMore={() => setOpenQuote(quote)} />
                <div className="mt-auto flex items-center gap-3 pt-5">
                  <div className="showcase-media showcase-media--avatar showcase-media--inline">
                    {quote.avatar ? (
                      <Image
                        src={quote.avatar}
                        alt={quote.name}
                        fill
                        sizes="52px"
                        className="rounded-full object-cover object-top"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-tight">{quote.name}</h3>
                    <p className="text-sm">{quote.role}</p>
                  </div>
                </div>
              </article>
            )}
          />
        )}

        {openQuote ? (
          <QuoteDialog quote={openQuote} onClose={() => setOpenQuote(null)} />
        ) : null}
      </SectionShell>
    </section>
  );
}
