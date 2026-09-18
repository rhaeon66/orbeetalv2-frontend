"use client";

import { useState, useRef, useEffect } from "react";

import ProjectModal from "../components/ProjectModal";
import ProjectGrid from "../components/ProjectGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell from "@/components/layouts/SectionShell";

export default function ProjectsSection({ projects = [], surface = "bg-sage" }) {
  const [active, setActive] = useState(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!active && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [active]);

  if (!projects.length) return null;

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
      <SectionHeading
        align="left"
        className="mb-8"
        eyebrow="Client work"
        title="Our Projects"
        subtitle="A look at platforms we have designed, engineered, and shipped for clients."
      />

      <ProjectGrid
        projects={projects}
        onOpen={(proj, el) => {
          lastFocusedRef.current = el;
          setActive(proj);
        }}
        isDisabled={!!active}
      />
      <ProjectModal project={active} onClose={() => setActive(null)} />
      </SectionShell>
    </section>
  );
}
