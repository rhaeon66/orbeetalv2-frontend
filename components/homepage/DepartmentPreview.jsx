"use client";

import { Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetPublishedDepartmentsQuery } from "@/redux/features/cms/departmentsApi";
import SectionShell from "@/components/layouts/SectionShell";
import DepartmentGrid, { DepartmentStage } from "@/components/about/DepartmentGrid";

export default function DepartmentPreview({ surface = "bg-sage" }) {
  const { data: departments = [], isLoading, isError, refetch } =
    useGetPublishedDepartmentsQuery();

  return (
    <section className={`section ${surface}`}>
      <DepartmentStage>
        <SectionShell>
          <SectionHeading
            eyebrow="Our Structure"
            title={
              <>
                Our <span className="text-gradient">Departments</span>
              </>
            }
            subtitle="Specialized teams working in unison across every dimension of your project."
          />

          {isLoading && (
            <p className="section-stack flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
              Loading departments…
            </p>
          )}

          {isError && (
            <div className="card section-stack mx-auto max-w-lg p-6 text-center">
              <p className="font-semibold text-ink-900">Could not load departments.</p>
              <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

          {departments.length > 0 && (
            <DepartmentGrid
              departments={departments}
              hrefFor={() => "/departments"}
              ctaHref="/contact"
            />
          )}
        </SectionShell>
      </DepartmentStage>
    </section>
  );
}
