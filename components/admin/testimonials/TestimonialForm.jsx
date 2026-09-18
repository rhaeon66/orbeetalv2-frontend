"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  useCreateTestimonialMutation,
  useGetAdminTestimonialQuery,
  useUpdateTestimonialMutation,
} from "@/redux/features/cms/testimonialsApi";
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
  role: "",
  quote: "",
  sort_order: 0,
  is_active: true,
};

export default function TestimonialForm({ testimonialId }) {
  const router = useRouter();
  const isEdit = Boolean(testimonialId);
  const { data, isLoading, error } = useGetAdminTestimonialQuery(testimonialId, {
    skip: !isEdit,
  });
  const [createTestimonial, createState] = useCreateTestimonialMutation();
  const [updateTestimonial, updateState] = useUpdateTestimonialMutation();
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
      role: data.role || "",
      quote: data.quote || "",
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
      required: { name: "Enter a client or person name." },
      publishRequired: { quote: "Enter a testimonial before publishing." },
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    const body = toFormData(
      withMediaSource({ ...values }, "image", imageFile, imageFromMedia),
      ["image"]
    );
    try {
      if (isEdit) {
        await updateTestimonial({ id: testimonialId, body }).unwrap();
      } else {
        await createTestimonial(body).unwrap();
      }
      router.push("/admin/testimonials");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading testimonial…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This testimonial could not be loaded.</p>
        <Link href="/admin/testimonials" className="btn btn-ghost btn-sm mt-4">
          Back to testimonials
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Client / person name</span>
          <input name="name" value={values.name} onChange={handleChange} className={ADMIN_INPUT} required />
          {errors.name && <p className="mt-1 text-xs font-semibold text-red-700">{errors.name}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Role or organization</span>
          <input name="role" value={values.role} onChange={handleChange} className={ADMIN_INPUT} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Testimonial</span>
          <textarea
            name="quote"
            value={values.quote}
            onChange={handleChange}
            rows={6}
            className={ADMIN_INPUT}
          />
          {errors.quote && <p className="mt-1 text-xs font-semibold text-red-700">{errors.quote}</p>}
        </label>
      </div>

      <div className="card p-6">
        <MediaField
          label="Profile image"
          preview={preview}
          previewClassName="h-24 w-24 rounded-full object-cover"
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
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create testimonial"}
        </button>
        <Link href="/admin/testimonials" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
