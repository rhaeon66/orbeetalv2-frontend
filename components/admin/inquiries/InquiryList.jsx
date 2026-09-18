"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Loader2, Trash2 } from "lucide-react";
import {
  useDeleteInquiryMutation,
  useGetAdminInquiriesQuery,
} from "@/redux/features/admin/inquiriesApi";
import ConfirmDialog from "../ConfirmDialog";
import AdminTable from "../AdminTable";

function formatWhen(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function InquiryList() {
  const { data: items = [], error, isLoading, refetch } = useGetAdminInquiriesQuery();
  const [deleteInquiry, { isLoading: deleting }] = useDeleteInquiryMutation();
  const [pendingDelete, setPendingDelete] = useState(null);

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteInquiry(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch {
      /* keep dialog open */
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="mb-5 text-sm text-ink-500">
        Messages submitted from the public contact form.
      </p>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading inquiries…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load inquiries.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-semibold text-ink-900">No inquiries yet</p>
          <p className="mt-1 text-sm text-ink-500">
            New contact form submissions will appear here.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <AdminTable>
          <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">From</th>
              <th className="hidden px-4 py-3 sm:table-cell">Service</th>
              <th className="hidden px-4 py-3 md:table-cell">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <span className="block font-semibold text-ink-900">{item.name}</span>
                  <span className="block text-xs text-ink-500">{item.email}</span>
                </td>
                <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">{item.service}</td>
                <td className="hidden px-4 py-3 text-ink-600 md:table-cell">
                  {formatWhen(item.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/admin/inquiries/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary"
                    >
                      <Eye size={13} aria-hidden />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(item)}
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
        title="Delete this inquiry?"
        message={
          pendingDelete
            ? `${pendingDelete.name}'s message will be removed. This cannot be undone.`
            : ""
        }
        pending={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
