"use client";

import ContactLeft from "./ContactLeft";
import ContactRight from "./ContactRight";
import Reveal from "@/components/ui/Reveal";
import SectionShell from "@/components/layouts/SectionShell";

export default function ContactSection({ surface = "bg-sage" }) {
  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="left">
            <ContactLeft />
          </Reveal>
          <Reveal direction="right">
            <ContactRight />
          </Reveal>
        </div>
      </SectionShell>
    </section>
  );
}
