"use client";

import { Loader2 } from "lucide-react";
import OwnProductsSection from "./sections/OwnProductsSection";
import PartnershipsSection from "./sections/PartnershipsSection";
import ProjectsSection from "./sections/ProjectLists";
import { useGetPublishedProjectsQuery } from "@/redux/features/cms/projectsApi";
import { pageSurface } from "@/lib/surfaces";
import SectionShell from "@/components/layouts/SectionShell";

export default function PortfolioCatalog() {
  const { data: projects = [], isLoading, isError, refetch } =
    useGetPublishedProjectsQuery();

  if (isLoading) {
    return (
      <section className={`section ${pageSurface(1)}`}>
        <SectionShell>
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading portfolio…
          </p>
        </SectionShell>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={`section ${pageSurface(1)}`}>
        <SectionShell>
          <div className="card mx-auto max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load portfolio projects.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </SectionShell>
      </section>
    );
  }

  const own = projects.filter((item) => item.category === "own");
  const partnerships = projects.filter((item) => item.category === "partnership");
  const clients = projects.filter((item) => item.category === "client");

  if (!projects.length) {
    return (
      <section className={`section ${pageSurface(1)}`}>
        <SectionShell>
          <p className="text-center text-sm font-semibold text-ink-500">
            Portfolio projects will appear here once they are published.
          </p>
        </SectionShell>
      </section>
    );
  }

  const bands = [];
  if (own.length) {
    bands.push(
      <OwnProductsSection
        key="own"
        projects={own}
        surface={pageSurface(bands.length + 1)}
      />
    );
  }
  if (partnerships.length) {
    bands.push(
      <PartnershipsSection
        key="partnership"
        projects={partnerships}
        surface={pageSurface(bands.length + 1)}
      />
    );
  }
  if (clients.length) {
    bands.push(
      <ProjectsSection
        key="client"
        projects={clients}
        surface={pageSurface(bands.length + 1)}
      />
    );
  }

  return <>{bands}</>;
}
