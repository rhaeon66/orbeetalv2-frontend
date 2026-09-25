import SectionHeading from "@/components/ui/SectionHeading";
import { COLLABORATION } from "@/lib/site";
import SectionShell from "@/components/layouts/SectionShell";
import { CardWatermark } from "@/components/illustrations";

export default function CollaborationSection({ surface = "bg-cream" }) {
  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="How We Operate"
          title={
            <>
              Built for <span className="text-gradient">Collaboration</span>
            </>
          }
          subtitle="Our departments aren't isolated units — they're an integrated organism built to deliver excellence at every layer."
        />
        <ul className="section-stack grid gap-4 md:grid-cols-3">
          {COLLABORATION.map((item) => (
            <li key={item.title} className="card p-6">
              <CardWatermark topic={item} tone="cyan" size="md" />
              <h3 className="relative text-lg font-bold text-ink-900">{item.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-ink-500">{item.text}</p>
            </li>
          ))}
        </ul>
      </SectionShell>
    </section>
  );
}
