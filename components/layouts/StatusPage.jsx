"use client";

import Header from "@/components/banner/Header";
import { ChevronRight } from "lucide-react";
import SectionTransition from "@/components/ui/SectionTransition";
import { pageSurface, pageSurfaceToken } from "@/lib/surfaces";
import SectionShell from "@/components/layouts/SectionShell";

export default function StatusPage({
  eyebrow,
  title,
  highlight,
  subtitle,
  crumb,
  children,
}) {
  return (
    <main>
      <Header />
      <section className={`${pageSurface(0)} relative overflow-hidden text-ink-900`}>
        <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-30" />

        <SectionShell className="relative pb-16 pt-32 text-center sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
          <div className="mx-auto max-w-3xl">
            {eyebrow && <span className="eyebrow eyebrow-light mb-4">{eyebrow}</span>}

            <h1 className="text-[clamp(2rem,1.4rem+3vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight text-ink-900">
              {title} {highlight && <span className="hero-gradient-text">{highlight}</span>}
            </h1>

            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
                {subtitle}
              </p>
            )}

            <p className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-500">
              Home <ChevronRight size={15} className="text-ink-400" aria-hidden />{" "}
              <span className="text-accent">{crumb || title}</span>
            </p>
          </div>
        </SectionShell>

        <SectionTransition fill={pageSurfaceToken(1)} />
      </section>

      {children && (
        <section className={`section ${pageSurface(1)}`}>
          <SectionShell className="flex flex-wrap items-center justify-center gap-3">
            {children}
          </SectionShell>
        </section>
      )}
    </main>
  );
}
