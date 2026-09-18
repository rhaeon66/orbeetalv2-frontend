"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useCreateFaqMutation,
  useGetAdminFaqQuery,
  useUpdateFaqMutation,
} from "@/redux/features/cms/faqsApi";
import {
  ADMIN_INPUT,
  fieldErrors,
  formErrorMessage,
  toFormData,
  validateAdminRecord,
} from "../form";

const EMPTY = {
  name: "",
  answer: "",
  sort_order: 0,
  is_active: true,
};

export default function FaqForm({ faqId }) {
  const router = useRouter();
  const isEdit = Boolean(faqId);
  const { data, isLoading, error } = useGetAdminFaqQuery(faqId, {
    skip: !isEdit,
  });
  const [createFaq, createState] = useCreateFaqMutation();
  const [updateFaq, updateState] = useUpdateFaqMutation();
  const pending = createState.isLoading || updateState.isLoading;
  const saveError = createState.error || updateState.error;

  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (!data) return;
    setValues({
      name: data.name || "",
      answer: data.answer || "",
      sort_order: data.sort_order ?? 0,
      is_active: Boolean(data.is_active),
    });
  }, [data]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "sort_order" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validateAdminRecord(values, {
      required: { name: "Enter a question." },
      publishRequired: { answer: "Enter an answer before publishing." },
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    const body = toFormData(values);
    try {
      if (isEdit) {
        await updateFaq({ id: faqId, body }).unwrap();
      } else {
        await createFaq(body).unwrap();
      }
      router.push("/admin/faqs");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading FAQ…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This FAQ could not be loaded.</p>
        <Link href="/admin/faqs" className="btn btn-ghost btn-sm mt-4">
          Back to FAQs
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Question</span>
          <input name="name" value={values.name} onChange={handleChange} className={ADMIN_INPUT} required />
          {errors.name && <p className="mt-1 text-xs font-semibold text-red-700">{errors.name}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Answer</span>
          <textarea
            name="answer"
            value={values.answer}
            onChange={handleChange}
            rows={6}
            className={ADMIN_INPUT}
          />
          {errors.answer && <p className="mt-1 text-xs font-semibold text-red-700">{errors.answer}</p>}
        </label>
      </div>

      <div className="card flex flex-wrap items-center gap-6 p-6">
        <label className="block w-32">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Display order</span>
          <input
            type="number"
            min="0"
            name="sort_order"
            value={values.sort_order}
            onChange={handleChange}
            className={ADMIN_INPUT}
          />
        </label>
        <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink-700">
          <input
            type="checkbox"
            name="is_active"
            checked={values.is_active}
            onChange={handleChange}
          />
          Active on FAQ page
        </label>
      </div>

      {saveError && Object.keys(errors).length === 0 && (
        <p className="alert-error">
          {formErrorMessage(saveError)}
        </p>
      )}

      <div className="admin-form-actions flex flex-wrap gap-3">
        <button type="submit" className="btn btn-teal rounded-lg" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create FAQ"}
        </button>
        <Link href="/admin/faqs" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
