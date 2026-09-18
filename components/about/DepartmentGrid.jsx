"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import DepartmentCard from "./DepartmentCard";
import { splitDepartments } from "./departmentVisuals";

function StageArt() {
  return (
    <div className="dept-stage__art" aria-hidden>
      <span className="dept-stage__blob" style={{ width: "22rem", height: "22rem", left: "-7rem", top: "-8rem" }} />
      <span className="dept-stage__blob" style={{ width: "16rem", height: "16rem", right: "-4rem", bottom: "18%" }} />
      <span className="dept-stage__blob" style={{ width: "10rem", height: "10rem", left: "28%", bottom: "-3rem", opacity: 0.7 }} />
      <span className="dept-stage__ring" style={{ width: "13rem", height: "13rem", right: "18%", top: "5.5rem" }} />
      <span className="dept-stage__ring" style={{ width: "8rem", height: "8rem", left: "6%", top: "42%" }} />
      <span className="dept-stage__dots dot-grid" />
    </div>
  );
}

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

export function DepartmentStage({ children }) {
  return (
    <div className="dept-stage">
      <StageArt />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
