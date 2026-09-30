"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import ShowcaseWorkCard, { WorkDialog } from "@/components/ui/ShowcaseWorkCard";
import { useGetPublishedProjectsQuery } from "@/redux/features/cms/projectsApi";
import SectionShell from "@/components/layouts/SectionShell";

export default function PortfolioPreview({ surface = "bg-cream" }) {
  const { data: projects = [], isLoading, isError, refetch } =
    useGetPublishedProjectsQuery();
  const featured = projects.slice(0, 6);
  const [open, setOpen] = useState(null);

  return (
    <section className={`section showcase-section ${surface}`}>
      <SectionShell>
        <SectionHeading
          eyebrow="Our Portfolio"
          title={
            <>
              Projects we&apos;re <span className="text-gradient">proud of</span>
            </>
          }
          subtitle="A selection of work that defines our standards and ambition."
        />

        {isLoading && (
          <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading portfolio…
          </p>
        )}

        {isError && (
          <div className="card section-stack mx-auto max-w-lg p-6 text-center">
            <p className="font-semibold text-ink-900">Could not load projects.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {featured.length > 0 && (
          <ShowcaseCarousel
            className="section-stack"
            items={featured}
            getKey={(item) => item.id}
            label="featured projects"
            renderItem={(project) => {
              const title = project.title || project.name;
              const summary = project.subtitle || project.description;
              return (
                <ShowcaseWorkCard
                  title={title}
                  description={summary}
                  tags={(project.features || []).slice(0, 3)}
                  href={project.link || "/portfolio"}
                  external={Boolean(project.link)}
                  linkLabel={project.link ? "Open project" : "View portfolio"}
                  topic={project}
                  onMore={() => setOpen({ title, description: summary })}
                  image={
                    project.image ? (
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 80vw, 24rem"
                        className="object-cover"
                      />
                    ) : null
                  }
                />
              );
            }}
          />
        )}
        {open ? (
          <WorkDialog title={open.title} description={open.description} onClose={() => setOpen(null)} />
        ) : null}

        <div className="mt-8 flex justify-center">
          <Link href="/portfolio" className="btn btn-primary">
            See Our Work
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
