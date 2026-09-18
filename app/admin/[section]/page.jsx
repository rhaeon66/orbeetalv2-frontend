"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ADMIN_SECTIONS } from "@/components/admin/nav";
import { useGetDashboardQuery } from "@/redux/features/admin/dashboardApi";

export default function AdminSectionPage() {
  const params = useParams();
  const slug = typeof params.section === "string" ? params.section : "";
  const item = ADMIN_SECTIONS[slug];

  if (!item) {
    notFound();
  }

  const { data } = useGetDashboardQuery();
  const count = item.countKey && data ? data[item.countKey] : null;
  const Icon = item.icon;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Icon size={22} aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink-900">
          {item.label}
        </h2>
        {count != null && (
          <p className="mt-2 text-sm font-semibold text-ink-500">
            {count} active {count === 1 ? "record" : "records"} in the database
          </p>
        )}
        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          Content management for this section comes next. The dashboard already
          reflects current site counts; list, create, edit, and delete tools will
          land in a following phase.
        </p>
        <Link href="/admin" className="btn btn-ghost btn-sm mt-6">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
