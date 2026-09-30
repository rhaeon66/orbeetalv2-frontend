"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ActiveDepartment from "./ActiveDepartment";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetPublishedDepartmentsQuery } from "@/redux/features/cms/departmentsApi";
import SectionShell from "@/components/layouts/SectionShell";
import { slugify } from "@/lib/slug";

const EASE = [0.22, 1, 0.36, 1];

export function departmentTabId(department) {
  return `department-tab-${slugify(department?.name || department?.id || "department")}`;
}

export default function DepartmentSection({ showHeading = true, surface = "bg-pale" }) {
  const { data: departments = [], isLoading, isError, refetch } =
    useGetPublishedDepartmentsQuery();
  const [activeId, setActiveId] = useState(null);
  const activeDepartment =
    departments.find((department) => department.id === activeId) || departments[0] || null;

  useEffect(() => {
    if (!departments.length) {
      setActiveId(null);
      return;
    }
    const hash = window.location.hash.replace(/^#/, "");
    const hashed = hash
      ? departments.find((department) => departmentTabId(department) === hash)
      : null;
    setActiveId((current) => {
      if (hashed) return hashed.id;
      if (departments.some((department) => department.id === current)) return current;
      return departments[0].id;
    });
  }, [departments]);

  return (
    <section className={`section ${surface}`}>
        <SectionShell>
          {showHeading ? (
            <SectionHeading
              eyebrow="Our Structure"
              title={
                <>
                  Our <span className="text-gradient">Departments</span>
                </>
              }
              subtitle="Specialized teams working in unison across every dimension of your project."
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

          {activeDepartment && (
            <>
              <div role="tablist" aria-label="Departments" className="service-tabs no-scrollbar">
                {departments.map((department) => {
                  const selected = activeDepartment.id === department.id;
                  return (
                    <button
                      key={department.id}
                      type="button"
                      role="tab"
                      id={departmentTabId(department)}
                      aria-controls="department-panel"
                      aria-selected={selected}
                      onClick={() => setActiveId(department.id)}
                      className="service-tab"
                    >
                      {department.name}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDepartment.id}
                  id="department-panel"
                  role="tabpanel"
                  aria-labelledby={departmentTabId(activeDepartment)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <ActiveDepartment department={activeDepartment} showClose={false} />
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </SectionShell>
    </section>
  );
}
