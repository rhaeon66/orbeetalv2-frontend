"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useCreateClientMutation,
  useGetAdminClientQuery,
  useUpdateClientMutation,
} from "@/redux/features/cms/clientsApi";
import {
  ADMIN_INPUT,
  fieldErrors,
  formErrorMessage,
  toFormData,
  validateAdminRecord,
  withMediaSource,
} from "../form";
import MediaField from "../media/MediaField";

const EMPTY = {
  name: "",
  url: "",
  sort_order: 0,
  is_active: true,
};

export default function ClientForm({ clientId }) {
  const router = useRouter();
  const isEdit = Boolean(clientId);
  const { data, isLoading, error } = useGetAdminClientQuery(clientId, {
    skip: !isEdit,
  });
  const [createClient, createState] = useCreateClientMutation();
  const [updateClient, updateState] = useUpdateClientMutation();
  const pending = createState.isLoading || updateState.isLoading;
  const saveError = createState.error || updateState.error;

  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});
  const [logo, setLogo] = useState(null);
  const [logoFromMedia, setLogoFromMedia] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!data) return;
    setValues({
      name: data.name || "",
      url: data.url || "",
      sort_order: data.sort_order ?? 0,
      is_active: Boolean(data.is_active),
    });
    setPreview(data.logo_url || "");
    setLogo(null);
    setLogoFromMedia(null);
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
      required: { name: "Enter a client name." },
      urls: ["url"],
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    const body = toFormData(withMediaSource({ ...values }, "logo", logo, logoFromMedia), ["logo"]);
    try {
      if (isEdit) {
        await updateClient({ id: clientId, body }).unwrap();
      } else {
        await createClient(body).unwrap();
      }
      router.push("/admin/clients");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading client…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This client could not be loaded.</p>
        <Link href="/admin/clients" className="btn btn-ghost btn-sm mt-4">
          Back to clients
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Name</span>
          <input name="name" value={values.name} onChange={handleChange} className={ADMIN_INPUT} required />
          {errors.name && <p className="mt-1 text-xs font-semibold text-red-700">{errors.name}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Website URL</span>
          <input
            name="url"
            type="url"
            value={values.url}
            onChange={handleChange}
            className={ADMIN_INPUT}
            placeholder="https://"
          />
          {errors.url && <p className="mt-1 text-xs font-semibold text-red-700">{errors.url}</p>}
        </label>
        <MediaField
          label="Logo"
          preview={preview}
          previewClassName="h-20 w-20 rounded-xl object-contain"
          error={errors.logo || errors.logo_from_media}
          onFile={(file) => {
            setLogo(file);
            setLogoFromMedia(null);
            setPreview(URL.createObjectURL(file));
          }}
          onLibrary={(item) => {
            setLogo(null);
            setLogoFromMedia(item.id);
            setPreview(item.url);
          }}
        />
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
          Active on homepage
        </label>
      </div>

      {saveError && Object.keys(errors).length === 0 && (
        <p className="alert-error">
          {formErrorMessage(saveError)}
        </p>
      )}

      <div className="admin-form-actions flex flex-wrap gap-3">
        <button type="submit" className="btn btn-teal rounded-lg" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create client"}
        </button>
        <Link href="/admin/clients" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
