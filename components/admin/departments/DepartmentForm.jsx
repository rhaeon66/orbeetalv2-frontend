"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  useCreateDepartmentMutation,
  useGetAdminDepartmentQuery,
  useUpdateDepartmentMutation,
} from "@/redux/features/cms/departmentsApi";
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
  director_name: "",
  roles: [""],
  productions: [""],
  sort_order: 0,
  is_active: true,
};

function ListEditor({ label, items, error, onChange, onAdd, onRemove, placeholder }) {
  return (
    <div className="card space-y-3 p-6">
      <p className="text-sm font-bold text-ink-900">{label}</p>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            onChange={(event) => onChange(index, event.target.value)}
            className={ADMIN_INPUT}
            placeholder={`${placeholder} ${index + 1}`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-lg border border-line px-2 text-ink-500 hover:text-red-700"
              aria-label={`Remove ${label.toLowerCase()} item`}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={onAdd} className="btn btn-ghost btn-sm">
        <Plus size={14} aria-hidden />
        Add
      </button>
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}

export default function DepartmentForm({ departmentId }) {
  const router = useRouter();
  const isEdit = Boolean(departmentId);
  const { data, isLoading, error } = useGetAdminDepartmentQuery(departmentId, {
    skip: !isEdit,
  });
  const [createDepartment, createState] = useCreateDepartmentMutation();
  const [updateDepartment, updateState] = useUpdateDepartmentMutation();
  const pending = createState.isLoading || updateState.isLoading;
  const saveError = createState.error || updateState.error;

  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});
  const [files, setFiles] = useState({ icon: null, director_image: null });
  const [mediaIds, setMediaIds] = useState({ icon: null, director_image: null });
  const [previews, setPreviews] = useState({ icon: "", director_image: "" });

  useEffect(() => {
    if (!data) return;
    setValues({
      name: data.name || "",
      description: data.description || "",
      director_name: data.director_name || "",
      roles: data.roles?.length ? data.roles : [""],
      productions: data.productions?.length ? data.productions : [""],
      sort_order: data.sort_order ?? 0,
      is_active: Boolean(data.is_active),
    });
    setPreviews({
      icon: data.icon_url || "",
      director_image: data.director_image_url || "",
    });
    setFiles({ icon: null, director_image: null });
    setMediaIds({ icon: null, director_image: null });
  }, [data]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "sort_order" ? Number(value) : value,
    }));
  }

  function updateList(key, index, value) {
    setValues((prev) => {
      const next = [...prev[key]];
      next[index] = value;
      return { ...prev, [key]: next };
    });
  }

  function addListItem(key) {
    setValues((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  }

  function removeListItem(key, index) {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  }

  function cleanList(items) {
    return items.map((item) => item.trim()).filter(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validateAdminRecord(values, {
      required: { name: "Enter a department name." },
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    let payload = {
      ...values,
      roles: cleanList(values.roles),
      productions: cleanList(values.productions),
    };
    for (const key of ["icon", "director_image"]) {
      payload = withMediaSource(payload, key, files[key], mediaIds[key]);
    }
    const body = toFormData(payload, ["icon", "director_image"]);
    try {
      if (isEdit) {
        await updateDepartment({ id: departmentId, body }).unwrap();
      } else {
        await createDepartment(body).unwrap();
      }
      router.push("/admin/departments");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading department…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This department could not be loaded.</p>
        <Link href="/admin/departments" className="btn btn-ghost btn-sm mt-4">
          Back to departments
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
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Description</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={3}
            className={ADMIN_INPUT}
          />
        </label>
      </div>

      <div className="card grid gap-6 p-6 sm:grid-cols-2">
        <MediaField
          label="Icon"
          preview={previews.icon}
          previewClassName="h-20 w-20 rounded-xl object-contain"
          error={errors.icon || errors.icon_from_media}
          onFile={(file) => {
            setFiles((prev) => ({ ...prev, icon: file }));
            setMediaIds((prev) => ({ ...prev, icon: null }));
            setPreviews((prev) => ({ ...prev, icon: URL.createObjectURL(file) }));
          }}
          onLibrary={(item) => {
            setFiles((prev) => ({ ...prev, icon: null }));
            setMediaIds((prev) => ({ ...prev, icon: item.id }));
            setPreviews((prev) => ({ ...prev, icon: item.url }));
          }}
        />
        <MediaField
          label="Director photo"
          preview={previews.director_image}
          previewClassName="h-20 w-20 rounded-full object-cover"
          error={errors.director_image || errors.director_image_from_media}
          onFile={(file) => {
            setFiles((prev) => ({ ...prev, director_image: file }));
            setMediaIds((prev) => ({ ...prev, director_image: null }));
            setPreviews((prev) => ({ ...prev, director_image: URL.createObjectURL(file) }));
          }}
          onLibrary={(item) => {
            setFiles((prev) => ({ ...prev, director_image: null }));
            setMediaIds((prev) => ({ ...prev, director_image: item.id }));
            setPreviews((prev) => ({ ...prev, director_image: item.url }));
          }}
        />
      </div>

      <div className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Director name</span>
          <input
            name="director_name"
            value={values.director_name}
            onChange={handleChange}
            className={ADMIN_INPUT}
          />
        </label>
      </div>

      <ListEditor
        label="Department roles"
        items={values.roles}
        error={errors.roles}
        placeholder="Role"
        onChange={(index, value) => updateList("roles", index, value)}
        onAdd={() => addListItem("roles")}
        onRemove={(index) => removeListItem("roles", index)}
      />

      <ListEditor
        label="Key productions"
        items={values.productions}
        error={errors.productions}
        placeholder="Production"
        onChange={(index, value) => updateList("productions", index, value)}
        onAdd={() => addListItem("productions")}
        onRemove={(index) => removeListItem("productions", index)}
      />

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
          Active on about page
        </label>
      </div>

      {saveError && Object.keys(errors).length === 0 && (
        <p className="alert-error">
          {formErrorMessage(saveError)}
        </p>
      )}

      <div className="admin-form-actions flex flex-wrap gap-3">
        <button type="submit" className="btn btn-teal rounded-lg" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create department"}
        </button>
        <Link href="/admin/departments" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
