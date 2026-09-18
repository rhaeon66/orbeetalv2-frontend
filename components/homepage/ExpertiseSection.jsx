"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { slugify } from "@/lib/slug";
import { expertiseVisual } from "./expertiseVisuals";

function serviceHref(service) {
  return `/services#service-tab-${slugify(service?.title)}`;
}

function ExpertiseCard({ service, index }) {
  const Icon = expertiseVisual(service);
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={serviceHref(service)}
      className="dept-card dept-card--service"
      aria-label={`${service.title} — learn more`}
    >
      <Icon className="dept-card__mark" strokeWidth={1.15} />
      <div className="flex items-center gap-3">
        <span className="dept-icon dept-icon--cyan">
          <Icon size={20} strokeWidth={2.1} />
        </span>
        <span className="text-[0.8rem] font-semibold tracking-[0.12em] text-ink-400">
          {number}
        </span>
      </div>
      <h3 className="mt-5 text-[1.12rem] font-extrabold text-ink-900">{service.title}</h3>
      {service.description ? (
        <p className="mt-1.5 max-w-[17rem] pr-2 text-[0.9rem] leading-relaxed text-ink-500">
          {service.description}
        </p>
      ) : null}
      <div className="dept-card__foot">
        <span className="dept-more">
          Learn more
          <ArrowRight size={14} strokeWidth={2.4} />
        </span>
        <span className="dept-arrow">
          <ArrowRight size={16} strokeWidth={2.2} />
        </span>
      </div>
    </Link>
  );
}

export default function ExpertiseSection({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const expertise = data?.expertise;
  const services = expertise?.items || [];
  const reduce = useReducedMotion();

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow={expertise?.eyebrow || "Services"}
          title={
            <>
              {expertise?.title || "Our"}{" "}
              <span className="text-gradient">{expertise?.highlight || "Expertise"}</span>
            </>
          }
          subtitle={
            expertise?.subtitle ||
            "A full spectrum of digital capabilities — combined under one roof to take your product from idea to impact."
          }
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
            Loading…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load this section.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {services.length > 0 && (
          <motion.div
            className="dept-grid__row section-stack mx-auto max-w-6xl"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0, 0.08)}
          >
            {services.map((service, index) => (
              <motion.div key={service.title || index} className="h-full" variants={fadeUp}>
                <ExpertiseCard service={service} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </SectionShell>
    </section>
  );
}
