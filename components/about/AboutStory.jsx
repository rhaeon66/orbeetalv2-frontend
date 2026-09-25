import SectionHeading from "@/components/ui/SectionHeading";
import BasisBadge from "@/components/layouts/BasisBadge";
import { ABOUT_POINTS, ABOUT_STORY, MISSION, VISION } from "@/lib/site";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

export default function AboutStory({ surface = "bg-pale" }) {
  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">About Orbeetal</span>
          <h2 className="section-title mt-4">
            One of the Fastest Ways to{" "}
            <span className="text-gradient">Business Growth</span>
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-500">
            {ABOUT_STORY.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <BasisBadge className="mt-8" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {ABOUT_POINTS.map((item) => (
              <li key={item.title} className="card p-4">
                <CardWatermark topic={item} tone="navy" size="sm" />
                <p className="relative font-semibold text-ink-900">{item.title}</p>
                <p className="relative mt-1 text-sm leading-relaxed text-ink-500">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="card p-6">
              <CardWatermark topic="mission planning" tone="cyan" size="md" />
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-ink">
                Our Mission
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-500">{MISSION}</p>
            </div>
            <div className="card p-6">
              <CardWatermark topic="vision growth" tone="navy" size="md" />
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-ink">
                Our Vision
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-500">{VISION}</p>
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
