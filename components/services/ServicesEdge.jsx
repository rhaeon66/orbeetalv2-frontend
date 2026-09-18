import Link from "next/link";
import { Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { SERVICE_EDGE } from "@/lib/site";
import SectionShell from "@/components/layouts/SectionShell";

export default function ServicesEdge({ surface = "bg-cream" }) {
  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="Why Choose Us"
          title={
            <>
              Engineering your{" "}
              <span className="text-gradient">competitive edge</span>
            </>
          }
          subtitle="Every engagement starts with understanding your business goals. We deliver solutions that don't just look great — they perform, scale, and grow with you."
        />
        <ul className="section-stack mx-auto grid max-w-3xl gap-3">
          {SERVICE_EDGE.map((item) => (
            <li key={item} className="card flex items-start gap-3 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <Check size={14} strokeWidth={3} />
              </span>
              <p className="text-[15px] font-semibold text-ink-800">{item}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Initiate Project
          </Link>
          <Link href="/portfolio" className="btn btn-ghost">
            See Our Work
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
