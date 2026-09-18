"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useDeleteServiceMutation,
  useGetAdminServicesQuery,
  useUpdateServiceMutation,
} from "@/redux/features/cms/servicesApi";
import ConfirmDialog from "../ConfirmDialog";
import StatusBadge from "../StatusBadge";
import AdminTable from "../AdminTable";

export default function ServiceList() {
  const { data: services = [], error, isLoading, refetch } = useGetAdminServicesQuery();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();
  const [pendingDelete, setPendingDelete] = useState(null);

  async function toggleActive(service) {
    await updateService({
      id: service.id,
      body: { is_active: !service.is_active },
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteService(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch {
      /* keep dialog open */
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Public services page. Inactive services stay hidden from visitors.
        </p>
        <Link href="/admin/services/new" className="btn btn-teal btn-sm rounded-lg">
          <Plus size={16} aria-hidden />
          Add service
        </Link>
      </div>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading services…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load services.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-semibold text-ink-900">No services yet</p>
          <p className="mt-1 text-sm text-ink-500">Add the first service to get started.</p>
        </div>
      )}

      {services.length > 0 && (
        <AdminTable>
            <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="hidden px-4 py-3 sm:table-cell">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                        {service.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={service.image_url}
                            alt=""
                            className="h-full w-full object-contain p-1"
                          />
                        ) : null}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink-900">{service.name}</span>
                        <span className="block max-w-md truncate text-xs text-ink-500">
                          {service.description}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 tabular-nums text-ink-600 sm:table-cell">{service.sort_order}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleActive(service)}>
                      <StatusBadge active={service.is_active} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary"
                      >
                        <Pencil size={13} aria-hidden />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(service)}
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
        title="Delete this service?"
        message={
          pendingDelete
            ? `${pendingDelete.name} will be removed from the services page. This cannot be undone.`
            : ""
        }
        pending={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
