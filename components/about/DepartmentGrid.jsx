"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import DepartmentCard from "./DepartmentCard";
import { splitDepartments } from "./departmentVisuals";

export default function DepartmentGrid({
  departments,
  onSelect,
  hrefFor,
  ctaHref = "/contact",
  ctaLabel = "Work With Our Team",
  showFoot = true,
}) {
  const { grid, featured } = splitDepartments(departments);

  return (
    <div className="relative z-[1] mx-auto max-w-6xl">
      <div className="dept-grid section-stack">
        {grid.length > 0 && (
          <div className="dept-grid__row">
            {grid.map(({ dept, index }) => (
              <DepartmentCard
                key={dept.id}
                dept={dept}
                index={index}
                onClick={onSelect ? () => onSelect(dept) : undefined}
                href={hrefFor ? hrefFor(dept) : undefined}
              />
            ))}
          </div>
        )}
        {featured ? (
          <DepartmentCard
            dept={featured.dept}
            index={featured.index}
            featured
            onClick={onSelect ? () => onSelect(featured.dept) : undefined}
            href={hrefFor ? hrefFor(featured.dept) : undefined}
          />
        ) : null}
      </div>

      <div className="relative z-[1] mt-10 flex justify-center">
        <Link href={ctaHref} className="btn btn-primary">
          {ctaLabel}
          <ArrowRight size={16} className="btn-icon" />
        </Link>
      </div>

      {showFoot ? (
        <p className="dept-foot">People · Ideas · Solutions · Together</p>
      ) : null}
    </div>
  );
}

