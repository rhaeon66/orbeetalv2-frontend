"use client";

import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { useGetDashboardQuery } from "@/redux/features/admin/dashboardApi";
import { DASHBOARD_FEATURED, DASHBOARD_METRICS } from "@/components/admin/nav";
import DownloadPortfolioButton from "@/components/admin/DownloadPortfolioButton";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminDashboardPage() {
  const { data, error, isLoading, refetch } = useGetDashboardQuery();
  const featuredHrefs = new Set(DASHBOARD_FEATURED.map((item) => item.href));
  const otherMetrics = DASHBOARD_METRICS.filter((item) => !featuredHrefs.has(item.href));
  const recent = data?.recent_projects || [];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink-500">
        Overview of published website content. Counts include only active records.
      </p>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading dashboard…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load dashboard counts.</p>
          <p className="mt-1 text-sm text-ink-500">
            {error.status === "FETCH_ERROR"
              ? "The API is unreachable."
              : "Try again in a moment."}
          </p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {data && (
        <>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {DASHBOARD_FEATURED.map((item) => {
              const count = data[item.countKey] ?? 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="card block p-5 hover:border-primary/30"
                  >
                    <span className="block text-sm font-semibold text-ink-500">
                      {item.label}
                    </span>
                    <span className="mt-2 block text-4xl font-extrabold tabular-nums tracking-tight text-ink-900">
                      {count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
            {otherMetrics.map((item) => {
              const Icon = item.icon;
              const count = data[item.countKey] ?? 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="card flex items-center gap-3 p-4 hover:border-primary/30"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <Icon size={18} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-ink-500">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-2xl font-extrabold tabular-nums tracking-tight text-ink-900">
                        {count}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-extrabold tracking-tight text-ink-900">
                Recent projects
              </h2>
              <Link href="/admin/projects" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="font-semibold text-ink-900">No projects yet</p>
                <Link href="/admin/projects/new" className="btn btn-teal btn-sm mt-4 rounded-lg">
                  Add project
                </Link>
              </div>
            ) : (
              <AdminTable>
                <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((project) => (
                    <tr key={project.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">
                        <span className="relative block h-12 w-16 overflow-hidden rounded-lg bg-surface-muted">
                          {project.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={project.image_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="font-semibold text-ink-900 hover:text-primary"
                        >
                          {project.name}
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">
                        {project.category}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge active={project.is_active} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/admin/projects/new" className="btn btn-teal btn-sm rounded-lg">
              <Plus size={16} aria-hidden />
              Add project
            </Link>
            <DownloadPortfolioButton />
          </div>
        </>
      )}
    </div>
  );
}
