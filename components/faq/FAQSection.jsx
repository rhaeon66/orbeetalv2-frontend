"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetPublishedFaqsQuery } from "@/redux/features/cms/faqsApi";
import SectionShell from "@/components/layouts/SectionShell";

export default function FAQSection({ surface = "bg-sage" }) {
  const { data: faqs = [], isLoading, isError, refetch } = useGetPublishedFaqsQuery();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Frequently Asked <span className="text-gradient">Questions</span>
            </>
          }
          subtitle="Find quick answers to the most common questions about our services and processes. Can't find what you're looking for? Contact us anytime."
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading FAQs…
          </p>
        )}

        {isError && (
          <div className="card mx-auto section-stack max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load FAQs.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && faqs.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            FAQs will appear here once they are published.
          </p>
        )}

        {faqs.length > 0 && (
          <div className="section-stack mx-auto max-w-4xl space-y-4">
            {faqs.map((faq, index) => {
              const open = openIndex === index;
              const panelId = `faq-panel-${faq.id}`;
              const buttonId = `faq-button-${faq.id}`;
              return (
                <div
                  key={faq.id}
                  className={`card overflow-hidden transition-colors duration-300 ${
                    open ? "border-primary/30" : ""
                  }`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between px-5 py-5 text-left transition-colors hover:bg-surface-muted sm:px-6"
                  >
                    <span className="pr-4 text-base font-bold text-ink-900 sm:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!open}
                    className={`px-5 text-base leading-relaxed text-ink-500 sm:px-6 ${
                      open ? "pb-5" : ""
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionShell>
    </section>
  );
}
