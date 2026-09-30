"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Rocket, Loader2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";
import MilestoneScene from "@/components/homepage/MilestoneScene";

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
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,28rem)_minmax(14rem,18rem)] lg:gap-6 xl:gap-10">
            <Reveal direction="left">
              <span className="eyebrow">{about.eyebrow}</span>
              <h2 className="section-title mt-4 max-w-xl">
                {about.title}{" "}
                {about.highlight ? (
                  <span className="text-gradient">{about.highlight}</span>
                ) : null}
              </h2>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.75] text-ink-500 sm:text-[1.02rem]">
                {about.body}
              </p>

              {about.cta_label ? (
                <Link href={about.cta_href || "/contact"} className="btn btn-primary mt-8">
                  {about.cta_label}
                  <ArrowRight size={18} className="btn-icon" />
                </Link>
              ) : null}
            </Reveal>

            <Reveal className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
              <MilestoneScene className="mx-auto h-auto w-full" />
            </Reveal>

            <motion.ul
              className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
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
          </div>
        )}
      </SectionShell>
    </section>
  );
}
