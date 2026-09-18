"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  categoryLabel,
  useDeleteProjectMutation,
  useGetAdminProjectsQuery,
  useUpdateProjectMutation,
} from "@/redux/features/cms/projectsApi";
import ConfirmDialog from "../ConfirmDialog";
import StatusBadge from "../StatusBadge";
import DownloadPortfolioButton from "../DownloadPortfolioButton";
import AdminTable from "../AdminTable";

export default function ProjectList() {
  const { data: projects = [], error, isLoading, refetch } = useGetAdminProjectsQuery();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: deleting }] = useDeleteProjectMutation();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [filter, setFilter] = useState("all");

  const visible =
    filter === "all" ? projects : projects.filter((item) => item.category === filter);

  async function toggleActive(project) {
    await updateProject({
      id: project.id,
      body: { is_active: !project.is_active },
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteProject(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch {
      /* keep dialog open */
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Portfolio projects across own products, partnerships, and client work.
        </p>
        <div className="flex flex-wrap gap-2">
          <DownloadPortfolioButton variant="ghost" />
          <Link href="/admin/projects/new" className="btn btn-teal btn-sm rounded-lg">
            <Plus size={16} aria-hidden />
            Add project
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["all", "All"],
          ["own", "Own Products"],
          ["partnership", "Partnerships"],
          ["client", "Client Projects"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              filter === value
                ? "bg-primary text-white"
                : "bg-cream text-ink-600 ring-1 ring-line"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading projects…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load projects.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && visible.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-semibold text-ink-900">No projects in this view</p>
          <p className="mt-1 text-sm text-ink-500">Add a project or choose another category.</p>
        </div>
      )}

      {visible.length > 0 && (
        <AdminTable>
            <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Category</th>
                <th className="hidden px-4 py-3 sm:table-cell">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr key={project.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                        {project.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink-900">{project.name}</span>
                        <span className="block max-w-xs truncate text-xs text-ink-500">
                          {project.description}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{categoryLabel(project.category)}</td>
                  <td className="hidden px-4 py-3 tabular-nums text-ink-600 sm:table-cell">{project.sort_order}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleActive(project)}>
                      <StatusBadge active={project.is_active} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary"
                      >
                        <Pencil size={13} aria-hidden />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(project)}
                        className="action-danger"
                      >
                        <Trash2 size={13} aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this project?"
        message={
          pendingDelete
            ? `${pendingDelete.name} will be removed from the portfolio. This cannot be undone.`
            : ""
        }
        pending={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
