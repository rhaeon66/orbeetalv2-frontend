import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionTransition from "@/components/ui/SectionTransition";
import SectionShell from "@/components/layouts/SectionShell";

export default function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  crumb,
  surface = "bg-sage",
  waveFill = "var(--pale)",
}) {
  return (
    <section className={`${surface} relative overflow-hidden text-ink-900`}>
      <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-30" />

      <SectionShell className="relative pb-16 pt-32 text-center sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-3xl">
          {eyebrow && (
            <span className="eyebrow eyebrow-light mb-4">{eyebrow}</span>
          )}

          <h1 className="text-[clamp(2rem,1.4rem+3vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight text-ink-900">
            {title} {highlight && <span className="hero-gradient-text">{highlight}</span>}
          </h1>

          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
              {subtitle}
            </p>
          )}

          <nav className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-500">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <ChevronRight size={15} className="text-ink-400" aria-hidden />
            <span className="text-accent">{crumb || title}</span>
          </nav>
        </div>
      </SectionShell>

      <SectionTransition fill={waveFill} />
    </section>
  );
}
