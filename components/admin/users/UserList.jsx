"use client";

import { Loader2 } from "lucide-react";
import { useGetAdminUsersQuery } from "@/redux/features/admin/usersApi";
import AdminTable from "../AdminTable";

function formatWhen(value) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function UserList() {
  const { data: users = [], error, isLoading, refetch } = useGetAdminUsersQuery();
  const djangoUsers = `${(process.env.SERVER || "http://localhost:8000").replace(/\/+$/, "")}/django-admin/auth/user/`;

  return (
    <div className="mx-auto max-w-6xl">
      <p className="mb-5 text-sm text-ink-500">
        Staff accounts that can sign in to this panel. Create or change passwords in
        Django admin.
      </p>

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading users…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load users.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {users.length > 0 && (
        <AdminTable>
          <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="hidden px-4 py-3 sm:table-cell">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="hidden px-4 py-3 md:table-cell">Last login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-900">{user.username}</td>
                <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">
                  {user.email || "—"}
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {user.is_superuser ? "Superuser" : "Staff"}
                </td>
                <td className="hidden px-4 py-3 text-ink-600 md:table-cell">
                  {formatWhen(user.last_login)}
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}

      <a
        href={djangoUsers}
        className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
      >
        Manage accounts in Django admin
      </a>
    </div>
  );
}
