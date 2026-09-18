"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useCreateSlideMutation,
  useGetAdminSlideQuery,
  useUpdateSlideMutation,
} from "@/redux/features/cms/slidesApi";
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
  headline: "",
  accent: "",
  description: "",
  primary_cta_label: "",
  primary_cta_href: "",
  secondary_cta_label: "",
  secondary_cta_href: "",
  sort_order: 0,
  is_active: true,
};

export default function SlideForm({ slideId }) {
  const router = useRouter();
  const isEdit = Boolean(slideId);
  const { data, isLoading, error } = useGetAdminSlideQuery(slideId, {
    skip: !isEdit,
  });
  const [createSlide, createState] = useCreateSlideMutation();
  const [updateSlide, updateState] = useUpdateSlideMutation();
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
      headline: data.headline || "",
      accent: data.accent || "",
      description: data.description || "",
      primary_cta_label: data.primary_cta_label || "",
      primary_cta_href: data.primary_cta_href || "",
      secondary_cta_label: data.secondary_cta_label || "",
      secondary_cta_href: data.secondary_cta_href || "",
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

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validateAdminRecord(values, {
      required: { name: "Enter a slide title." },
      publishRequired: { headline: "Enter a headline before publishing." },
      hrefs: ["primary_cta_href", "secondary_cta_href"],
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    const body = toFormData(
      withMediaSource({ ...values }, "image", imageFile, imageFromMedia),
      ["image"]
    );
    try {
      if (isEdit) {
        await updateSlide({ id: slideId, body }).unwrap();
      } else {
        await createSlide(body).unwrap();
      }
      router.push("/admin/slides");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading slide…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This slide could not be loaded.</p>
        <Link href="/admin/slides" className="btn btn-ghost btn-sm mt-4">
          Back to slides
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Title</span>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            className={ADMIN_INPUT}
            required
          />
          {errors.name && <p className="mt-1 text-xs font-semibold text-red-700">{errors.name}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Headline</span>
          <input name="headline" value={values.headline} onChange={handleChange} className={ADMIN_INPUT} />
          {errors.headline && <p className="mt-1 text-xs font-semibold text-red-700">{errors.headline}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Accent line</span>
          <input name="accent" value={values.accent} onChange={handleChange} className={ADMIN_INPUT} />
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

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Primary CTA label</span>
          <input name="primary_cta_label" value={values.primary_cta_label} onChange={handleChange} className={ADMIN_INPUT} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Primary CTA link</span>
          <input name="primary_cta_href" value={values.primary_cta_href} onChange={handleChange} className={ADMIN_INPUT} />
          {errors.primary_cta_href && (
            <p className="mt-1 text-xs font-semibold text-red-700">{errors.primary_cta_href}</p>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Secondary CTA label</span>
          <input name="secondary_cta_label" value={values.secondary_cta_label} onChange={handleChange} className={ADMIN_INPUT} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Secondary CTA link</span>
          <input name="secondary_cta_href" value={values.secondary_cta_href} onChange={handleChange} className={ADMIN_INPUT} />
          {errors.secondary_cta_href && (
            <p className="mt-1 text-xs font-semibold text-red-700">{errors.secondary_cta_href}</p>
          )}
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
          {errors.sort_order && (
            <p className="mt-1 text-xs font-semibold text-red-700">{errors.sort_order}</p>
          )}
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
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create slide"}
        </button>
        <Link href="/admin/slides" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
