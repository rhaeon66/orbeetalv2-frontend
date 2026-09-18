"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { departmentVisual } from "./departmentVisuals";

function ProductImpactArt() {
  return (
    <div className="dept-impact" aria-hidden>
      <div className="dept-impact__stack">
        <span className="dept-impact__tile" style={{ left: "0.15rem", top: "0.15rem", transform: "rotate(-14deg)" }} />
        <span className="dept-impact__tile" style={{ left: "1.7rem", top: "0.85rem", transform: "rotate(10deg)" }} />
        <span
          className="dept-impact__tile"
          style={{ left: "0.85rem", top: "2.05rem", transform: "rotate(-4deg)", opacity: 0.95 }}
        />
      </div>
      <div className="dept-impact__copy">
        <span>Ideas</span>
        <span>Products</span>
        <span>Real Impact</span>
        <i className="dept-impact__rule" />
      </div>
    </div>
  );
}

export default function DepartmentCard({
  dept,
  index = 0,
  featured = false,
  onClick,
  href,
}) {
  const { Icon, tone } = departmentVisual(dept, index);
  const number = String(index + 1).padStart(2, "0");
  const className = `dept-card${featured ? " dept-card--featured" : ""}`;

  const body = (
    <>
      <Icon className="dept-card__mark" strokeWidth={1.15} />
      {featured ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
            <span className={`dept-icon dept-icon--${tone}`} style={{ height: "3.1rem", width: "3.1rem" }}>
              <Icon size={22} strokeWidth={2.1} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[0.8rem] font-semibold tracking-[0.12em] text-ink-400">
                  {number}
                </span>
                <h3 className="text-[1.35rem] font-extrabold leading-tight text-ink-900">
                  {dept.name}
                </h3>
              </div>
              {dept.description ? (
                <p className="mt-1 max-w-sm text-[0.9rem] leading-relaxed text-ink-500">
                  {dept.description}
                </p>
              ) : null}
            </div>
          </div>
          <span className="dept-arrow">
            <ArrowRight size={16} strokeWidth={2.2} />
          </span>
          <ProductImpactArt />
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className={`dept-icon dept-icon--${tone}`}>
              <Icon size={20} strokeWidth={2.1} />
            </span>
            <span className="text-[0.8rem] font-semibold tracking-[0.12em] text-ink-400">
              {number}
            </span>
          </div>
          <h3 className="mt-5 text-[1.12rem] font-extrabold text-ink-900">{dept.name}</h3>
          {dept.description ? (
            <p className="mt-1.5 max-w-[16.5rem] pr-10 text-[0.9rem] leading-relaxed text-ink-500">
              {dept.description}
            </p>
          ) : null}
          <span className="dept-arrow absolute bottom-5 right-5">
            <ArrowRight size={16} strokeWidth={2.2} />
          </span>
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={`${dept.name} department`}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-label={`${dept.name} department`}>
      {body}
    </button>
  );
}
