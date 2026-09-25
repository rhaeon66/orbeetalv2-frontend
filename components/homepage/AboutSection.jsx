"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Rocket, Loader2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

const HIGHLIGHT_ICONS = [Sparkles, ShieldCheck, Rocket];

export default function AboutSection({ surface = "bg-cream" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const about = data?.about;
  const reduce = useReducedMotion();

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        {isLoading && (
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading about…
          </p>
        )}

        {isError && (
          <div className="card mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load about content.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {about && (
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal direction="left" className="relative">
              <div className="media-frame">
                {about.image ? (
                  <Image
                    src={about.image}
                    alt="The Orbeetal team collaborating"
                    width={640}
                    height={440}
                    className="h-auto w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[640/440] w-full bg-pale" />
                )}
              </div>

              {(about.badge_value || about.badge_label) && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute -bottom-5 left-5 hidden items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-[var(--shadow-md)] sm:flex"
                >
                  <span className="icon-well icon-well-solid">
                    <Rocket size={18} />
                  </span>
                  <div>
                    <p className="text-base font-extrabold text-ink-900">{about.badge_value}</p>
                    <p className="text-xs text-ink-500">{about.badge_label}</p>
                  </div>
                </motion.div>
              )}
            </Reveal>

            <Reveal direction="right">
              <span className="eyebrow">{about.eyebrow}</span>
              <h2 className="section-title mt-4">
                {about.title}{" "}
                {about.highlight ? (
                  <span className="text-gradient">{about.highlight}</span>
                ) : null}
              </h2>
              <p className="mt-4 max-w-lg text-[0.98rem] leading-[1.75] text-ink-500 sm:text-[1.02rem]">
                {about.body}
              </p>

              <motion.ul
                className="mt-8 grid gap-3 sm:grid-cols-3"
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={viewportOnce}
                variants={stagger(0.05, 0.1)}
              >
                {(about.highlights || []).map(({ label, text }, index) => {
                  const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length];
                  return (
                    <motion.li
                      key={`${label}-${index}`}
                      variants={fadeUp}
                      className="card p-3.5"
                    >
                      <CardWatermark topic={`${label} ${text || ""}`} tone="cyan" size="sm" />
                      <span className="icon-well h-9 w-9">
                        <Icon size={16} />
                      </span>
                      <p className="relative mt-2.5 text-sm font-semibold text-ink-900">{label}</p>
                      {text ? (
                        <p className="relative mt-1 text-xs leading-relaxed text-ink-500">{text}</p>
                      ) : null}
                    </motion.li>
                  );
                })}
              </motion.ul>

              {about.cta_label ? (
                <Link href={about.cta_href || "/contact"} className="btn btn-primary mt-8">
                  {about.cta_label}
                  <ArrowRight size={18} className="btn-icon" />
                </Link>
              ) : null}
            </Reveal>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
