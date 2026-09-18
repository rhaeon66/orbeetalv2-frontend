"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useDeleteInquiryMutation,
  useGetAdminInquiryQuery,
} from "@/redux/features/admin/inquiriesApi";
import ConfirmDialog from "../ConfirmDialog";

function formatWhen(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function InquiryDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { data, error, isLoading, refetch } = useGetAdminInquiryQuery(id, { skip: !id });
  const [deleteInquiry, { isLoading: deleting }] = useDeleteInquiryMutation();
  const [confirming, setConfirming] = useState(false);

  async function confirmDelete() {
    try {
      await deleteInquiry(id).unwrap();
      router.replace("/admin/inquiries");
    } catch {
      /* keep dialog open */
    }
  }

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading inquiry…
      </p>
    );
  }

  if (error || !data) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">Could not load this inquiry.</p>
        <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card space-y-4 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          {formatWhen(data.created_at)}
        </p>
        <div>
          <p className="text-lg font-extrabold text-ink-900">{data.name}</p>
          <a href={`mailto:${data.email}`} className="text-sm font-semibold text-primary hover:underline">
            {data.email}
          </a>
        </div>
        <p className="text-sm font-semibold text-ink-700">Service: {data.service}</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-600">{data.message}</p>
      </div>
      <div className="admin-form-actions flex flex-wrap gap-3">
        <Link href="/admin/inquiries" className="btn btn-ghost rounded-lg">
          Back to inquiries
        </Link>
        <button
          type="button"
          className="btn btn-danger rounded-lg"
          onClick={() => setConfirming(true)}
        >
          Delete
        </button>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Delete this inquiry?"
        message={`${data.name}'s message will be removed. This cannot be undone.`}
        pending={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
