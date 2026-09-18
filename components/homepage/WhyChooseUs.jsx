"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { EASE, fadeRight, scaleIn, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";

function FeatureRow({ service }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={fadeRight}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.22, ease: EASE }}
      className="card group flex items-start gap-3.5 p-4 transition-colors duration-200 hover:border-cyan/50"
    >
      <span className="icon-well transition-colors duration-200 group-hover:bg-accent-light">
        {service.icon ? (
          <Image
            src={service.icon}
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 object-contain"
          />
        ) : null}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[0.95rem] font-semibold text-ink-900">{service.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{service.description}</p>
      </div>
      <ArrowRight
        size={16}
        className="mt-1 shrink-0 text-ink-400 transition-transform duration-200 group-hover:translate-x-[3px] group-hover:text-cyan-ink"
        aria-hidden
      />
    </motion.div>
  );
}

export default function WhyChooseUs({ surface = "bg-sage" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const why = data?.why;
  const reduce = useReducedMotion();

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow={why?.eyebrow || "Why Choose Us"}
          title={
            <>
              {why?.title || "We Are Here to Grow Your"}{" "}
              <span className="text-gradient">
                {why?.highlight || "Business Exponentially"}
              </span>
            </>
          }
          subtitle={
            why?.subtitle ||
            "A single partner for strategy, design, engineering and growth — committed to outcomes that move your business forward."
          }
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
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

        {why && (
          <div className="section-stack grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={scaleIn}
            >
              <div className="media-frame relative aspect-[4/3] w-full">
                {why.image ? (
                  <Image
                    src={why.image}
                    alt="Orbeetal team at work"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-pale" />
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3"
              initial={reduce ? false : "hidden"}
              whileInView="visible"
              viewport={viewportOnce}
              variants={stagger(0.04, 0.08)}
            >
              {(why.items || []).map((service) => (
                <FeatureRow key={service.title} service={service} />
              ))}
            </motion.div>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
