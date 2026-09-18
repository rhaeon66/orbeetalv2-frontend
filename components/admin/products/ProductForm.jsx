"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  useCreateProductMutation,
  useGetAdminProductQuery,
  useUpdateProductMutation,
} from "@/redux/features/cms/productsApi";
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
  url: "",
  features: [""],
  sort_order: 0,
  is_active: true,
};

export default function ProductForm({ productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const { data, isLoading, error } = useGetAdminProductQuery(productId, {
    skip: !isEdit,
  });
  const [createProduct, createState] = useCreateProductMutation();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const pending = createState.isLoading || updateState.isLoading;
  const saveError = createState.error || updateState.error;

  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});
  const [files, setFiles] = useState({ image: null, screen_image: null });
  const [mediaIds, setMediaIds] = useState({ image: null, screen_image: null });
  const [previews, setPreviews] = useState({ image: "", screen_image: "" });

  useEffect(() => {
    if (!data) return;
    setValues({
      name: data.name || "",
      description: data.description || "",
      url: data.url || "",
      features: data.features?.length ? data.features : [""],
      sort_order: data.sort_order ?? 0,
      is_active: Boolean(data.is_active),
    });
    setPreviews({
      image: data.image_url || "",
      screen_image: data.screen_image_url || "",
    });
    setFiles({ image: null, screen_image: null });
    setMediaIds({ image: null, screen_image: null });
  }, [data]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "sort_order" ? Number(value) : value,
    }));
  }

  function handleFeature(index, value) {
    setValues((prev) => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  }

  function addFeature() {
    setValues((prev) => ({ ...prev, features: [...prev.features, ""] }));
  }

  function removeFeature(index) {
    setValues((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validateAdminRecord(values, {
      required: { name: "Enter a product title." },
      urls: ["url"],
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    let payload = {
      ...values,
      features: values.features.map((item) => item.trim()).filter(Boolean),
    };
    for (const key of ["image", "screen_image"]) {
      payload = withMediaSource(payload, key, files[key], mediaIds[key]);
    }
    const body = toFormData(payload, ["image", "screen_image"]);
    try {
      if (isEdit) {
        await updateProduct({ id: productId, body }).unwrap();
      } else {
        await createProduct(body).unwrap();
      }
      router.push("/admin/products");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading product…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This product could not be loaded.</p>
        <Link href="/admin/products" className="btn btn-ghost btn-sm mt-4">
          Back to products
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
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Product URL</span>
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
      </div>

      <div className="card space-y-3 p-6">
        <p className="text-sm font-bold text-ink-900">Features</p>
        {values.features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={feature}
              onChange={(event) => handleFeature(index, event.target.value)}
              className={ADMIN_INPUT}
              placeholder={`Feature ${index + 1}`}
            />
            {values.features.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="rounded-lg border border-line px-2 text-ink-500 hover:text-red-700"
                aria-label="Remove feature"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addFeature} className="btn btn-ghost btn-sm">
          <Plus size={14} aria-hidden />
          Add feature
        </button>
        {errors.features && <p className="text-xs font-semibold text-red-700">{errors.features}</p>}
      </div>

      <div className="card grid gap-6 p-6 sm:grid-cols-2">
        {[
          ["image", "Product icon"],
          ["screen_image", "Showcase image"],
        ].map(([key, label]) => (
          <MediaField
            key={key}
            label={label}
            preview={previews[key]}
            previewClassName="h-24 w-full rounded-xl object-cover"
            error={errors[key] || errors[`${key}_from_media`]}
            onFile={(file) => {
              setFiles((prev) => ({ ...prev, [key]: file }));
              setMediaIds((prev) => ({ ...prev, [key]: null }));
              setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
            }}
            onLibrary={(item) => {
              setFiles((prev) => ({ ...prev, [key]: null }));
              setMediaIds((prev) => ({ ...prev, [key]: item.id }));
              setPreviews((prev) => ({ ...prev, [key]: item.url }));
            }}
          />
        ))}
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
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <Link href="/admin/products" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
