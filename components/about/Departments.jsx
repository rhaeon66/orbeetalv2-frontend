"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import DepartmentCard from "./DepartmentCard";
import ActiveDepartment from "./ActiveDepartment";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetPublishedDepartmentsQuery } from "@/redux/features/cms/departmentsApi";
import SectionShell from "@/components/layouts/SectionShell";

export default function DepartmentSection({ showHeading = true, surface = "bg-pale" }) {
  const { data: departments = [], isLoading, isError, refetch } =
    useGetPublishedDepartmentsQuery();
  const [activeDepartment, setActiveDepartment] = useState(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeDepartment && !departments.some((dept) => dept.id === activeDepartment.id)) {
      setActiveDepartment(null);
    }
  }, [departments, activeDepartment]);

  useEffect(() => {
    if (activeDepartment && activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeDepartment]);

  return (
    <section className={`section ${surface}`}>
      <SectionShell>
        {showHeading ? (
          <SectionHeading
            eyebrow="About Orbeetal"
            title={
              <>
                Our <span className="text-gradient">Departments</span>
              </>
            }
            subtitle="Committed to excellence in every endeavor."
          />
        ) : null}

        {isLoading && (
          <p className="mt-14 flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            Loading departments…
          </p>
        )}

        {isError && (
          <div className="card mx-auto mt-14 max-w-lg p-8 text-center">
            <p className="font-semibold text-ink-900">Could not load departments.</p>
            <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && departments.length === 0 && (
          <p className="mt-14 text-center text-sm font-semibold text-ink-500">
            Departments will appear here once they are published.
          </p>
        )}

        {departments.length > 0 && (
          <div className={`${showHeading ? "mt-14" : ""} grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                dept={dept}
                onClick={() => setActiveDepartment(dept)}
              />
            ))}
          </div>
        )}

        <div ref={activeRef} className="scroll-mt-28">
          <AnimatePresence>
            {activeDepartment && (
              <ActiveDepartment
                department={activeDepartment}
                onClose={() => setActiveDepartment(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </SectionShell>
    </section>
  );
}
