"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useGetPublishedTestimonialsQuery } from "@/redux/features/cms/testimonialsApi";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import SectionShell from "@/components/layouts/SectionShell";

export default function TestimonialsSlider({ surface = "bg-cream" }) {
  const { data: testimonials = [], isLoading, isError, refetch } =
    useGetPublishedTestimonialsQuery();

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
              <article className="showcase-carousel-card relative px-6 pb-6 pt-5 sm:px-8 sm:pb-7">
                <span className="absolute right-6 top-4 select-none font-serif text-6xl leading-none text-primary/20">
                  ”
                </span>
                <p className="relative pr-6 text-base leading-relaxed">
                  {quote.quote}
                </p>
                <div className="mt-5 flex items-center gap-3">
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
      </SectionShell>
    </section>
  );
}
