"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ShowcaseCarousel from "@/components/ui/ShowcaseCarousel";
import { useGetPublishedProjectsQuery } from "@/redux/features/cms/projectsApi";
import SectionShell from "@/components/layouts/SectionShell";

export default function PortfolioPreview({ surface = "bg-cream" }) {
  const { data: projects = [], isLoading, isError, refetch } =
    useGetPublishedProjectsQuery();
  const featured = projects.slice(0, 6);

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
              const href = project.link || "/portfolio";
              const tags = (project.features || []).slice(0, 3);
              return (
                <article className="showcase-carousel-card">
                  <div className="showcase-media showcase-media--cover">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 80vw, 24rem"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col px-5 pb-5">
                    <h3 className="text-lg font-bold">{title}</h3>
                    {summary ? (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed">
                        {summary}
                      </p>
                    ) : null}
                    {tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                            style={{ borderColor: "var(--showcase-border)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={href}
                      target={project.link ? "_blank" : undefined}
                      rel={project.link ? "noreferrer" : undefined}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent"
                    >
                      {project.link ? "Open project" : "View portfolio"}
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </article>
              );
            }}
          />
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/portfolio" className="btn btn-primary">
            See Our Work
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
