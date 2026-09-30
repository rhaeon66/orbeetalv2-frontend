"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { User, CheckCircle2, BarChart3, Package, Loader2 } from "lucide-react";
import { useGetPublishedHomepageQuery } from "@/redux/features/cms/homepageApi";
import { fadeUp, stagger, viewportOnce } from "@/components/ui/motion";
import SectionShell from "@/components/layouts/SectionShell";

const STAT_ICONS = [User, CheckCircle2, BarChart3, Package];

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

  return <span ref={ref}>{display}</span>;
}

export default function Stats({ surface = "bg-pale" }) {
  const { data, isLoading, isError, refetch } = useGetPublishedHomepageQuery();
  const stats = data?.stats || [];
  const reduce = useReducedMotion();

  if (isLoading) {
    return (
      <section className={`section stats-band ${surface}`}>
        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading statistics…
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={`section stats-band ${surface}`}>
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
    <section className={`section stats-band ${surface}`}>
      <SectionShell>
        <motion.ol
          className="stats-track"
          style={{ "--stats-count": stats.length }}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0, 0.08)}
        >
          {stats.map(({ suffix, label, description, value }, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <motion.li key={`${label}-${i}`} variants={fadeUp} className="stats-item">
                <span className="stats-node">
                  <Icon size={22} strokeWidth={1.75} aria-hidden />
                </span>
                <p className="stats-figure">
                  <StatNumber value={value ?? 0} />
                  {suffix ? <span>{suffix}</span> : null}
                </p>
                <p className="stats-label">{label}</p>
                {description ? <p className="stats-copy">{description}</p> : null}
              </motion.li>
            );
          })}
        </motion.ol>
      </SectionShell>
    </section>
  );
}
