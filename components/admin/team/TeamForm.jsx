"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  useCreateTeamMemberMutation,
  useGetAdminTeamMemberQuery,
  useUpdateTeamMemberMutation,
} from "@/redux/features/cms/teamApi";
import {
  ADMIN_INPUT,
  fieldErrors,
  formErrorMessage,
  toFormData,
  validateAdminRecord,
  validateOptionalUrl,
  withMediaSource,
} from "../form";
import MediaField from "../media/MediaField";

const EMPTY_PORTFOLIO = { title: "", description: "", url: "", year: "" };
const EMPTY_DETAIL = { label: "", value: "" };

const SOCIAL_FIELDS = [
  ["website", "Website"],
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["x_url", "X / Twitter"],
  ["youtube", "YouTube"],
  ["behance", "Behance"],
  ["dribbble", "Dribbble"],
];

const EMPTY = {
  name: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  website: "",
  linkedin: "",
  github: "",
  facebook: "",
  instagram: "",
  x_url: "",
  youtube: "",
  behance: "",
  dribbble: "",
  experience: 0,
  projects: 0,
  expertise: [""],
  portfolio: [{ ...EMPTY_PORTFOLIO }],
  details: [{ ...EMPTY_DETAIL }],
  department_name: "",
  department_description: "",
  department_roles: [""],
  department_productions: [""],
  sort_order: 0,
  is_active: true,
};

const NUMBER_FIELDS = new Set(["sort_order", "experience", "projects"]);

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

export default function TeamForm({ memberId }) {
  const router = useRouter();
  const isEdit = Boolean(memberId);
  const { data, isLoading, error } = useGetAdminTeamMemberQuery(memberId, {
    skip: !isEdit,
  });
  const [createMember, createState] = useCreateTeamMemberMutation();
  const [updateMember, updateState] = useUpdateTeamMemberMutation();
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
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      bio: data.bio || "",
      website: data.website || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      facebook: data.facebook || "",
      instagram: data.instagram || "",
      x_url: data.x_url || "",
      youtube: data.youtube || "",
      behance: data.behance || "",
      dribbble: data.dribbble || "",
      experience: data.experience ?? 0,
      projects: data.projects ?? 0,
      expertise: data.expertise?.length ? data.expertise : [""],
      portfolio: data.portfolio?.length
        ? data.portfolio.map((item) => ({ ...EMPTY_PORTFOLIO, ...item }))
        : [{ ...EMPTY_PORTFOLIO }],
      details: data.details?.length
        ? data.details.map((item) => ({ ...EMPTY_DETAIL, ...item }))
        : [{ ...EMPTY_DETAIL }],
      department_name: data.department_name || "",
      department_description: data.department_description || "",
      department_roles: data.department_roles?.length ? data.department_roles : [""],
      department_productions: data.department_productions?.length
        ? data.department_productions
        : [""],
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
      [name]: type === "checkbox" ? checked : NUMBER_FIELDS.has(name) ? Number(value) : value,
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

  function updateObjectList(key, index, field, value) {
    setValues((prev) => {
      const next = prev[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      );
      return { ...prev, [key]: next };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validateAdminRecord(values, {
      required: { name: "Enter a member name." },
      emails: ["email"],
      urls: SOCIAL_FIELDS.map(([field]) => field),
    });
    for (const item of values.portfolio) {
      const message = validateOptionalUrl(item.url);
      if (message) {
        next.portfolio = `Portfolio link: ${message}`;
        break;
      }
    }
    for (const item of values.details) {
      const label = item.label.trim();
      const value = item.value.trim();
      if ((label && !value) || (!label && value)) {
        next.details = "Each extra detail needs both a label and a value.";
        break;
      }
    }
    setClientErrors(next);
    if (Object.keys(next).length) return;
    const body = toFormData(
      withMediaSource(
        {
          ...values,
          expertise: cleanList(values.expertise),
          portfolio: values.portfolio
            .map((item) => ({
              title: item.title.trim(),
              description: item.description.trim(),
              url: item.url.trim(),
              year: item.year.trim(),
            }))
            .filter((item) => item.title),
          details: values.details
            .map((item) => ({ label: item.label.trim(), value: item.value.trim() }))
            .filter((item) => item.label && item.value),
          department_roles: cleanList(values.department_roles),
          department_productions: cleanList(values.department_productions),
        },
        "image",
        imageFile,
        imageFromMedia
      ),
      ["image"]
    );
    try {
      if (isEdit) {
        await updateMember({ id: memberId, body }).unwrap();
      } else {
        await createMember(body).unwrap();
      }
      router.push("/admin/team");
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(saveError), ...clientErrors };

  if (isEdit && isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading member…
      </p>
    );
  }

  if (isEdit && error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">This team member could not be loaded.</p>
        <Link href="/admin/team" className="btn btn-ghost btn-sm mt-4">
          Back to team
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
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Designation</span>
            <input name="role" value={values.role} onChange={handleChange} className={ADMIN_INPUT} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Email</span>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              className={ADMIN_INPUT}
            />
            {errors.email && <p className="mt-1 text-xs font-semibold text-red-700">{errors.email}</p>}
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Phone</span>
            <input name="phone" value={values.phone} onChange={handleChange} className={ADMIN_INPUT} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">Location</span>
            <input
              name="location"
              value={values.location}
              onChange={handleChange}
              className={ADMIN_INPUT}
              placeholder="Dhaka, Bangladesh"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Profile information</span>
          <textarea
            name="bio"
            value={values.bio}
            onChange={handleChange}
            rows={4}
            className={ADMIN_INPUT}
          />
        </label>
      </div>

      <div className="card p-6">
        <MediaField
          label="Profile image"
          preview={preview}
          previewClassName="h-28 w-28 rounded-full object-cover"
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
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Years of experience</span>
          <input
            type="number"
            min="0"
            name="experience"
            value={values.experience}
            onChange={handleChange}
            className={ADMIN_INPUT}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Projects</span>
          <input
            type="number"
            min="0"
            name="projects"
            value={values.projects}
            onChange={handleChange}
            className={ADMIN_INPUT}
          />
        </label>
      </div>

      <ListEditor
        label="Expertise"
        items={values.expertise}
        error={errors.expertise}
        placeholder="Skill"
        onChange={(index, value) => updateList("expertise", index, value)}
        onAdd={() => addListItem("expertise")}
        onRemove={(index) => removeListItem("expertise", index)}
      />

      <div className="card space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-ink-900">Portfolio</p>
            <p className="mt-1 text-xs text-ink-500">
              Projects and work samples shown on this person&apos;s profile.
            </p>
          </div>
        </div>
        {values.portfolio.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-line p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">
                Item {index + 1}
              </p>
              {values.portfolio.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem("portfolio", index)}
                  className="rounded-lg border border-line px-2 py-1 text-ink-500 hover:text-red-700"
                  aria-label={`Remove portfolio item ${index + 1}`}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
              <input
                value={item.title}
                onChange={(event) => updateObjectList("portfolio", index, "title", event.target.value)}
                className={ADMIN_INPUT}
                placeholder="Project title"
              />
              <input
                value={item.year}
                onChange={(event) => updateObjectList("portfolio", index, "year", event.target.value)}
                className={ADMIN_INPUT}
                placeholder="Year"
              />
            </div>
            <input
              value={item.url}
              onChange={(event) => updateObjectList("portfolio", index, "url", event.target.value)}
              className={ADMIN_INPUT}
              placeholder="https://"
            />
            <textarea
              value={item.description}
              onChange={(event) =>
                updateObjectList("portfolio", index, "description", event.target.value)
              }
              rows={2}
              className={ADMIN_INPUT}
              placeholder="Short description"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setValues((prev) => ({
              ...prev,
              portfolio: [...prev.portfolio, { ...EMPTY_PORTFOLIO }],
            }))
          }
          className="btn btn-ghost btn-sm"
        >
          <Plus size={14} aria-hidden />
          Add portfolio item
        </button>
        {errors.portfolio && <p className="text-xs font-semibold text-red-700">{errors.portfolio}</p>}
      </div>

      <div className="card space-y-4 p-6">
        <div>
          <p className="text-sm font-bold text-ink-900">Additional details</p>
          <p className="mt-1 text-xs text-ink-500">
            Optional facts such as education, languages, certifications, or availability.
          </p>
        </div>
        {values.details.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item.label}
              onChange={(event) => updateObjectList("details", index, "label", event.target.value)}
              className={ADMIN_INPUT}
              placeholder="Label"
            />
            <input
              value={item.value}
              onChange={(event) => updateObjectList("details", index, "value", event.target.value)}
              className={ADMIN_INPUT}
              placeholder="Value"
            />
            {values.details.length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem("details", index)}
                className="rounded-lg border border-line px-2 text-ink-500 hover:text-red-700"
                aria-label={`Remove detail ${index + 1}`}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setValues((prev) => ({
              ...prev,
              details: [...prev.details, { ...EMPTY_DETAIL }],
            }))
          }
          className="btn btn-ghost btn-sm"
        >
          <Plus size={14} aria-hidden />
          Add detail
        </button>
        {errors.details && <p className="text-xs font-semibold text-red-700">{errors.details}</p>}
      </div>

      <div className="card space-y-4 p-6">
        <p className="text-sm font-bold text-ink-900">Department</p>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Department name</span>
          <input
            name="department_name"
            value={values.department_name}
            onChange={handleChange}
            className={ADMIN_INPUT}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">Department description</span>
          <textarea
            name="department_description"
            value={values.department_description}
            onChange={handleChange}
            rows={3}
            className={ADMIN_INPUT}
          />
        </label>
      </div>

      <ListEditor
        label="Department roles"
        items={values.department_roles}
        error={errors.department_roles}
        placeholder="Role"
        onChange={(index, value) => updateList("department_roles", index, value)}
        onAdd={() => addListItem("department_roles")}
        onRemove={(index) => removeListItem("department_roles", index)}
      />

      <div className="card space-y-4 p-6">
        <div>
          <p className="text-sm font-bold text-ink-900">Social links</p>
          <p className="mt-1 text-xs text-ink-500">Leave a field blank to hide that link on the profile.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_FIELDS.map(([field, label]) => (
            <label key={field} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</span>
              <input
                name={field}
                type="url"
                value={values[field]}
                onChange={handleChange}
                className={ADMIN_INPUT}
                placeholder="https://"
              />
              {errors[field] && (
                <p className="mt-1 text-xs font-semibold text-red-700">{errors[field]}</p>
              )}
            </label>
          ))}
        </div>
      </div>

      <ListEditor
        label="Department productions"
        items={values.department_productions}
        error={errors.department_productions}
        placeholder="Contribution"
        onChange={(index, value) => updateList("department_productions", index, value)}
        onAdd={() => addListItem("department_productions")}
        onRemove={(index) => removeListItem("department_productions", index)}
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
          Active on public pages
        </label>
      </div>

      {saveError && Object.keys(errors).length === 0 && (
        <p className="alert-error">
          {formErrorMessage(saveError)}
        </p>
      )}

      <div className="admin-form-actions flex flex-wrap gap-3">
        <button type="submit" className="btn btn-teal rounded-lg" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create member"}
        </button>
        <Link href="/admin/team" className="btn btn-ghost rounded-lg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
