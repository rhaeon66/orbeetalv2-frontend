"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetPublishedServicesQuery } from "@/redux/features/cms/servicesApi";
import SectionShell from "@/components/layouts/SectionShell";
import { slugify } from "@/lib/slug";
import { CardWatermark } from "@/components/illustrations";
import { HeroScene } from "@/components/banner/hero/HeroScenes";

const EASE = [0.22, 1, 0.36, 1];

const SERVICE_SCENES = {
  "software development": "web",
  "ai solutions": "ai",
  "digital marketing": "growth",
  "product design": "mobile",
  "web development": "web",
  "cyber security": "cyber",
  cybersecurity: "cyber",
};

function serviceScene(service) {
  return SERVICE_SCENES[(service?.name || "").trim().toLowerCase()] || null;
}

function serviceTabId(service) {
  return `service-tab-${slugify(service?.name || service?.id || "service")}`;
}

export default function ServicesSection({ surface = "bg-pale" }) {
  const { data: services = [], isLoading, isError, refetch } =
    useGetPublishedServicesQuery();
  const [activeId, setActiveId] = useState(null);
  const activeService =
    services.find((service) => service.id === activeId) || services[0] || null;

  useEffect(() => {
    if (!services.length) {
      setActiveId(null);
      return;
    }
    const hash = window.location.hash.replace(/^#/, "");
    const hashed = hash
      ? services.find((service) => serviceTabId(service) === hash)
      : null;
    setActiveId((current) => {
      if (hashed) return hashed.id;
      if (services.some((service) => service.id === current)) return current;
      return services[0].id;
    });
  }, [services]);

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="What We Offer"
          title={
            <>
              We create digital products &amp; experiences for{" "}
              <span className="text-gradient">your business</span>
            </>
          }
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading services…
          </p>
        )}

        {isError && (
          <div className="card mx-auto section-stack max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load services.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && services.length === 0 && (
          <p className="section-stack text-center text-sm font-semibold text-ink-500">
            Services will appear here once they are published.
          </p>
        )}

        {activeService && (
          <>
            <div role="tablist" aria-label="Services" className="service-tabs no-scrollbar">
              {services.map((service) => {
                const selected = activeService.id === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    id={serviceTabId(service)}
                    aria-controls="service-panel"
                    aria-selected={selected}
                    onClick={() => setActiveId(service.id)}
                    className="service-tab"
                  >
                    {service.name}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                id="service-panel"
                role="tabpanel"
                aria-labelledby={serviceTabId(activeService)}
                className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14"
              >
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
                    Service
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold text-ink-900 sm:text-3xl">
                    {activeService.name}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
                    {activeService.description}
                  </p>

                  <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(activeService.content || []).map((point) => (
                      <li key={point} className="card flex items-start gap-3 p-4">
                        <CardWatermark topic={activeService} tone="cyan" size="sm" />
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        <p className="relative text-[15px] leading-relaxed text-ink-700">{point}</p>
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="btn btn-primary mt-8">
                    Get a Quote
                    <ArrowRight size={16} className="btn-icon" />
                  </Link>
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
                  {serviceScene(activeService) ? (
                    <HeroScene
                      theme={{ id: serviceScene(activeService) }}
                      className="relative h-full w-full"
                    />
                  ) : activeService.image ? (
                    <Image
                      src={activeService.image}
                      alt={activeService.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 32rem"
                      className="object-contain"
                      unoptimized={String(activeService.image).endsWith(".svg")}
                      priority
                    />
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </SectionShell>
    </section>
  );
}
