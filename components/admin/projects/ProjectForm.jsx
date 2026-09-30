"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  PROJECT_CATEGORIES,
  useCreateProjectMutation,
  useGetAdminProjectQuery,
  useUpdateProjectMutation,
} from "@/redux/features/cms/projectsApi";
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
  category: "client",
  status: "finished",
  project_type: "",
  url: "",
  features: [""],
  stack: [""],
  related_name: "",
  related_role: "",
  sort_order: 0,
  is_active: true,
};

const PROJECT_STATUSES = [
  { value: "finished", label: "Finished — on the website" },
  { value: "running", label: "Running — admin only" },
  { value: "upcoming", label: "Upcoming — admin only" },
];

export default function ProjectForm({ projectId }) {
  const router = useRouter();
  const isEdit = Boolean(projectId);
  const { data, isLoading, error } = useGetAdminProjectQuery(projectId, {
    skip: !isEdit,
  });
  const [createProject, createState] = useCreateProjectMutation();
  const [updateProject, updateState] = useUpdateProjectMutation();
  const pending = createState.isLoading || updateState.isLoading;
  const saveError = createState.error || updateState.error;

  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});
  const [files, setFiles] = useState({ image: null, logo: null, related_image: null });
  const [mediaIds, setMediaIds] = useState({ image: null, logo: null, related_image: null });
  const [previews, setPreviews] = useState({ image: "", logo: "", related_image: "" });

  useEffect(() => {
    if (!data) return;
    setValues({
      name: data.name || "",
      description: data.description || "",
      category: data.category || "client",
      status: data.status || "finished",
      project_type: data.project_type || "",
      url: data.url || "",
      features: data.features?.length ? data.features : [""],
      stack: data.stack?.length ? data.stack : [""],
      related_name: data.related_name || "",
      related_role: data.related_role || "",
      sort_order: data.sort_order ?? 0,
      is_active: Boolean(data.is_active),
    });
    setPreviews({
      image: data.image_url || "",
      logo: data.logo_url || "",
      related_image: data.related_image_url || "",
    });
    setFiles({ image: null, logo: null, related_image: null });
    setMediaIds({ image: null, logo: null, related_image: null });
  }, [data]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "sort_order" ? Number(value) : value,
    }));
  }

  function handleList(field, index, value) {
    setValues((prev) => {
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  }

  function handleFeature(index, value) {
    handleList("features", index, value);
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
      required: { name: "Enter a project title." },
      urls: ["url"],
      choices: {
        category: ["own", "partnership", "client"],
        status: ["finished", "running", "upcoming"],
      },
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    let payload = {
      ...values,
      features: values.features.map((item) => item.trim()).filter(Boolean),
      stack: values.stack.map((item) => item.trim()).filter(Boolean),
    };
    for (const key of ["image", "logo", "related_image"]) {
      payload = withMediaSource(payload, key, files[key], mediaIds[key]);
    }
    const body = toFormData(payload, ["image", "logo", "related_image"]);
    try {
      if (isEdit) {
        await updateProject({ id: projectId, body }).unwrap();
      } else {
        await createProject(body).unwrap();
      }
      router.push("/admin/projects");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading project…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This project could not be loaded.</p>
        <Link href="/admin/projects" className="btn btn-ghost btn-sm mt-4">
          Back to projects
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
          <input
            name="description"
            value={values.description}
            onChange={handleChange}
            className={ADMIN_INPUT}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Category</span>
            <select name="category" value={values.category} onChange={handleChange} className={ADMIN_INPUT}>
              {PROJECT_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Project type</span>
            <input
              name="project_type"
              value={values.project_type}
              onChange={handleChange}
              className={ADMIN_INPUT}
              placeholder="E-Commerce"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Stage</span>
            <select name="status" value={values.status} onChange={handleChange} className={ADMIN_INPUT}>
              {PROJECT_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-ink-500">
              Running and upcoming stay in the admin. Finished projects can appear on the website.
            </span>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Project URL</span>
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

      <div className="card space-y-3 p-6">
        <p className="text-sm font-bold text-ink-900">Stack or tools</p>
        {values.stack.map((tool, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={tool}
              onChange={(event) => handleList("stack", index, event.target.value)}
              className={ADMIN_INPUT}
              placeholder={`Tool ${index + 1}`}
            />
            {values.stack.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setValues((prev) => ({
                    ...prev,
                    stack: prev.stack.filter((_, itemIndex) => itemIndex !== index),
                  }))
                }
                className="rounded-lg border border-line px-2 text-ink-500 hover:text-red-700"
                aria-label="Remove tool"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setValues((prev) => ({ ...prev, stack: [...prev.stack, ""] }))}
          className="btn btn-ghost btn-sm"
        >
          <Plus size={14} aria-hidden />
          Add tool
        </button>
      </div>

      <div className="card grid gap-6 p-6 sm:grid-cols-3">
        {[
          ["image", "Project image"],
          ["logo", "Logo"],
          ["related_image", "Attribution photo"],
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

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">
            Attribution name
          </span>
          <input
            name="related_name"
            value={values.related_name}
            onChange={handleChange}
            className={ADMIN_INPUT}
            placeholder="Supervisor, partner, or organization"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Attribution role</span>
          <input
            name="related_role"
            value={values.related_role}
            onChange={handleChange}
            className={ADMIN_INPUT}
          />
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
          Show on the website when finished
        </label>
      </div>

      {saveError && Object.keys(errors).length === 0 && (
        <p className="alert-error">
          {formErrorMessage(saveError)}
        </p>
      )}

      <div className="admin-form-actions flex flex-wrap gap-3">
        <button type="submit" className="btn btn-teal rounded-lg" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        <Link href="/admin/projects" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
