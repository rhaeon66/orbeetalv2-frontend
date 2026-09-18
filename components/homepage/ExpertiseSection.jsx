"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";

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
              <span className="hero-gradient-text">{expertise?.highlight || "Expertise"}</span>
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
          <div className="section-stack mx-auto max-w-lg rounded-2xl border border-line bg-cream p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load this section.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {services.length > 0 && (
          <motion.div
            className="section-stack grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0, 0.08)}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={reduce ? undefined : { y: -4 }}
                className="card card-hover flex flex-col p-5 sm:p-6"
              >
                <span className="icon-well">
                  {service.icon ? (
                    <Image
                      src={service.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  ) : null}
                </span>

                <h3 className="mt-5 text-lg font-bold text-ink-900">{service.title}</h3>
                <span className="brand-divider mt-3" />

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-500">
                  {service.description}
                </p>

                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-light"
                >
                  Learn more
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </SectionShell>
    </section>
  );
}
