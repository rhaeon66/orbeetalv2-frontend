"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
  useUpdateProductMutation,
} from "@/redux/features/cms/productsApi";
import ConfirmDialog from "../ConfirmDialog";
import StatusBadge from "../StatusBadge";
import AdminTable from "../AdminTable";

export default function ProductList() {
  const { data: products = [], error, isLoading, refetch } = useGetAdminProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [pendingDelete, setPendingDelete] = useState(null);

  async function toggleActive(item) {
    await updateProduct({
      id: item.id,
      body: { is_active: !item.is_active },
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteProduct(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch {
      /* keep dialog open */
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Homepage product showcase. Inactive products stay hidden from visitors.
        </p>
        <Link href="/admin/products/new" className="btn btn-teal btn-sm rounded-lg">
          <Plus size={16} aria-hidden />
          Add product
        </Link>
      </div>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading products…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load products.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-semibold text-ink-900">No products yet</p>
          <p className="mt-1 text-sm text-ink-500">Add the first homepage product to get started.</p>
        </div>
      )}

      {products.length > 0 && (
        <AdminTable>
            <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="hidden px-4 py-3 sm:table-cell">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt=""
                            className="h-full w-full object-contain p-1"
                          />
                        ) : null}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink-900">{item.name}</span>
                        <span className="block max-w-md truncate text-xs text-ink-500">
                          {item.description}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 tabular-nums text-ink-600 sm:table-cell">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleActive(item)}>
                      <StatusBadge active={item.is_active} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/products/${item.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary"
                      >
                        <Pencil size={13} aria-hidden />
                        Edit
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
        title="Delete this product?"
        message={
          pendingDelete
            ? `${pendingDelete.name} will be removed from the homepage. This cannot be undone.`
            : ""
        }
        pending={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
