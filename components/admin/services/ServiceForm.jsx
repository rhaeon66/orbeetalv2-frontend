"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  useCreateServiceMutation,
  useGetAdminServiceQuery,
  useUpdateServiceMutation,
} from "@/redux/features/cms/servicesApi";
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
  description: "",
  content: [""],
  sort_order: 0,
  is_active: true,
};

export default function ServiceForm({ serviceId }) {
  const router = useRouter();
  const isEdit = Boolean(serviceId);
  const { data, isLoading, error } = useGetAdminServiceQuery(serviceId, {
    skip: !isEdit,
  });
  const [createService, createState] = useCreateServiceMutation();
  const [updateService, updateState] = useUpdateServiceMutation();
  const pending = createState.isLoading || updateState.isLoading;
  const saveError = createState.error || updateState.error;

  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFromMedia, setImageFromMedia] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!data) return;
    setValues({
      name: data.name || "",
      description: data.description || "",
      content: data.content?.length ? data.content : [""],
      sort_order: data.sort_order ?? 0,
      is_active: Boolean(data.is_active),
    });
    setPreview(data.image_url || "");
    setImageFile(null);
    setImageFromMedia(null);
  }, [data]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "sort_order" ? Number(value) : value,
    }));
  }

  function handleContent(index, value) {
    setValues((prev) => {
      const content = [...prev.content];
      content[index] = value;
      return { ...prev, content };
    });
  }

  function addContent() {
    setValues((prev) => ({ ...prev, content: [...prev.content, ""] }));
  }

  function removeContent(index) {
    setValues((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validateAdminRecord(values, {
      required: { name: "Enter a service title." },
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    const body = toFormData(
      withMediaSource(
        {
          ...values,
          content: values.content.map((item) => item.trim()).filter(Boolean),
        },
        "image",
        imageFile,
        imageFromMedia
      ),
      ["image"]
    );
    try {
      if (isEdit) {
        await updateService({ id: serviceId, body }).unwrap();
      } else {
        await createService(body).unwrap();
      }
      router.push("/admin/services");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading service…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This service could not be loaded.</p>
        <Link href="/admin/services" className="btn btn-ghost btn-sm mt-4">
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Title</span>
          <input name="name" value={values.name} onChange={handleChange} className={ADMIN_INPUT} required />
          {errors.name && <p className="mt-1 text-xs font-semibold text-red-700">{errors.name}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Description</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={4}
            className={ADMIN_INPUT}
          />
        </label>
      </div>

      <div className="card space-y-3 p-6">
        <p className="text-sm font-bold text-ink-900">Service content</p>
        {values.content.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item}
              onChange={(event) => handleContent(index, event.target.value)}
              className={ADMIN_INPUT}
              placeholder={`Point ${index + 1}`}
            />
            {values.content.length > 1 && (
              <button
                type="button"
                onClick={() => removeContent(index)}
                className="rounded-lg border border-line px-2 text-ink-500 hover:text-red-700"
                aria-label="Remove content point"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addContent} className="btn btn-ghost btn-sm">
          <Plus size={14} aria-hidden />
          Add point
        </button>
        {errors.content && <p className="text-xs font-semibold text-red-700">{errors.content}</p>}
      </div>

      <div className="card p-6">
        <MediaField
          label="Image"
          preview={preview}
          error={errors.image || errors.image_from_media}
          onFile={(file) => {
            setImageFile(file);
            setImageFromMedia(null);
            setPreview(URL.createObjectURL(file));
          }}
          onLibrary={(item) => {
            setImageFile(null);
            setImageFromMedia(item.id);
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
          Active on services page
        </label>
      </div>

      {saveError && Object.keys(errors).length === 0 && (
        <p className="alert-error">
          {formErrorMessage(saveError)}
        </p>
      )}

      <div className="admin-form-actions flex flex-wrap gap-3">
        <button type="submit" className="btn btn-teal rounded-lg" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create service"}
        </button>
        <Link href="/admin/services" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
