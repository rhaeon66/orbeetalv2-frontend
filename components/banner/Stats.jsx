"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { User, CheckCircle2, BarChart3, Loader2 } from "lucide-react";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

const STAT_THEMES = [
  { WellIcon: User, well: "icon-well-solid", suffix: "text-cyan" },
  { WellIcon: CheckCircle2, well: "icon-well-cyan", suffix: "text-cyan" },
  { WellIcon: BarChart3, well: "icon-well-accent", suffix: "text-accent" },
];

function StatNumber({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    const unsub = rounded.on("change", (latest) => setDisplay(latest));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(motionVal, value, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, value, reduce, motionVal]);

  return (
    <span ref={ref} className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-[2.65rem]">
      {display}
    </span>
  );
}

export default function Stats({ surface = "bg-pale" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const stats = data?.stats || [];
  const reduce = useReducedMotion();

  if (isLoading) {
    return (
      <section className={`section ${surface}`}>
        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading statistics…
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={`section ${surface}`}>
        <SectionShell>
          <div className="card mx-auto max-w-lg p-6 text-center">
            <p className="font-semibold text-ink-900">Could not load statistics.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </SectionShell>
      </section>
    );
  }

  if (!stats.length) return null;

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <motion.div
          className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3 sm:gap-5"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0, 0.1)}
        >
          {stats.map(({ suffix, label, description, value }, i) => {
            const theme = STAT_THEMES[i % STAT_THEMES.length];
            const WellIcon = theme.WellIcon;
            return (
              <motion.div
                key={`${label}-${i}`}
                variants={fadeUp}
                className="card relative flex h-full min-h-[11.5rem] flex-col overflow-hidden p-5 sm:p-6"
              >
                <CardWatermark
                  topic={`${label} ${description || ""}`}
                  tone={i === 1 ? "cyan" : "navy"}
                  size="md"
                  placement="right"
                />
                <div className="relative z-[1] flex h-full min-h-0 flex-col pr-12 sm:pr-14">
                  <span className={`icon-well ${theme.well}`}>
                    <WellIcon size={20} strokeWidth={2.2} />
                  </span>
                  <p className="mt-4 flex items-baseline gap-0.5">
                    <StatNumber value={value ?? 0} />
                    <span className={`text-3xl font-extrabold sm:text-4xl ${theme.suffix}`}>
                      {suffix}
                    </span>
                  </p>
                  <p className="mt-2 text-base font-semibold text-ink-800">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </SectionShell>
    </section>
  );
}
