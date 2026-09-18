"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useDeleteTeamMemberMutation,
  useGetAdminTeamQuery,
  useUpdateTeamMemberMutation,
} from "@/redux/features/cms/teamApi";
import ConfirmDialog from "../ConfirmDialog";
import StatusBadge from "../StatusBadge";
import AdminTable from "../AdminTable";

export default function TeamList() {
  const { data: members = [], error, isLoading, refetch } = useGetAdminTeamQuery();
  const [updateMember] = useUpdateTeamMemberMutation();
  const [deleteMember, { isLoading: deleting }] = useDeleteTeamMemberMutation();
  const [pendingDelete, setPendingDelete] = useState(null);

  async function toggleActive(member) {
    await updateMember({
      id: member.id,
      body: { is_active: !member.is_active },
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteMember(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch {
      /* keep dialog open */
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Team profiles used on the homepage and about page. Inactive members stay hidden.
        </p>
        <Link href="/admin/team/new" className="btn btn-teal btn-sm rounded-lg">
          <Plus size={16} aria-hidden />
          Add member
        </Link>
      </div>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading team…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load team members.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && members.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-semibold text-ink-900">No team members yet</p>
          <p className="mt-1 text-sm text-ink-500">Add the first profile to get started.</p>
        </div>
      )}

      {members.length > 0 && (
        <AdminTable>
            <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="hidden px-4 py-3 sm:table-cell">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                        {member.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink-900">{member.name}</span>
                        <span className="block text-xs text-ink-500">
                          {member.role}
                          {member.email ? ` · ${member.email}` : ""}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 tabular-nums text-ink-600 sm:table-cell">{member.sort_order}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleActive(member)}>
                      <StatusBadge active={member.is_active} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/team/${member.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary"
                      >
                        <Pencil size={13} aria-hidden />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(member)}
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
        title="Delete this team member?"
        message={
          pendingDelete
            ? `${pendingDelete.name} will be removed from the homepage and about page. This cannot be undone.`
            : ""
        }
        pending={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
