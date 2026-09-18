"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  useGetAdminHomepageQuery,
  useUpdateHomepageMutation,
} from "@/redux/features/cms/homepageApi";
import {
  ADMIN_INPUT,
  fieldErrors,
  formErrorMessage,
  toFormData,
  validateAdminRecord,
  withMediaSource,
} from "../form";
import MediaField from "../media/MediaField";

const TABS = [
  ["stats", "Statistics"],
  ["about", "About"],
  ["why", "Why Choose Us"],
  ["method", "Methodology"],
  ["expertise", "Expertise"],
];

const EMPTY = {
  stats: [{ value: 0, suffix: "+", label: "", description: "", featured: false }],
  about_eyebrow: "",
  about_title: "",
  about_highlight: "",
  about_body: "",
  about_cta_label: "",
  about_cta_href: "",
  about_badge_value: "",
  about_badge_label: "",
  about_highlights: [{ label: "", text: "" }],
  why_eyebrow: "",
  why_title: "",
  why_highlight: "",
  why_subtitle: "",
  why_items: [{ title: "", description: "", icon: "" }],
  method_eyebrow: "",
  method_title: "",
  method_highlight: "",
  method_subtitle: "",
  method_steps: [{ title: "", desc: "" }],
  expertise_eyebrow: "",
  expertise_title: "",
  expertise_highlight: "",
  expertise_subtitle: "",
  expertise_items: [{ title: "", description: "", icon: "" }],
};

function withFallback(list, blank) {
  return list?.length ? list : [blank];
}

function homepageValues(data) {
  return {
    stats: withFallback(data.stats, EMPTY.stats[0]),
    about_eyebrow: data.about_eyebrow || "",
    about_title: data.about_title || "",
    about_highlight: data.about_highlight || "",
    about_body: data.about_body || "",
    about_cta_label: data.about_cta_label || "",
    about_cta_href: data.about_cta_href || "",
    about_badge_value: data.about_badge_value || "",
    about_badge_label: data.about_badge_label || "",
    about_highlights: withFallback(data.about_highlights, EMPTY.about_highlights[0]),
    why_eyebrow: data.why_eyebrow || "",
    why_title: data.why_title || "",
    why_highlight: data.why_highlight || "",
    why_subtitle: data.why_subtitle || "",
    why_items: withFallback(data.why_items, EMPTY.why_items[0]),
    method_eyebrow: data.method_eyebrow || "",
    method_title: data.method_title || "",
    method_highlight: data.method_highlight || "",
    method_subtitle: data.method_subtitle || "",
    method_steps: withFallback(data.method_steps, EMPTY.method_steps[0]),
    expertise_eyebrow: data.expertise_eyebrow || "",
    expertise_title: data.expertise_title || "",
    expertise_highlight: data.expertise_highlight || "",
    expertise_subtitle: data.expertise_subtitle || "",
    expertise_items: withFallback(data.expertise_items, EMPTY.expertise_items[0]),
  };
}

export default function HomepageForm() {
  const { data, isLoading, error, refetch } = useGetAdminHomepageQuery();
  const [updateHomepage, updateState] = useUpdateHomepageMutation();
  const [tab, setTab] = useState("stats");
  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState({});
  const [files, setFiles] = useState({ about_image: null, why_image: null });
  const [mediaIds, setMediaIds] = useState({ about_image: null, why_image: null });
  const [previews, setPreviews] = useState({ about_image: "", why_image: "" });

  useEffect(() => {
    if (!data) return;
    setValues(homepageValues(data));
    setPreviews({
      about_image: data.about_image_url || "",
      why_image: data.why_image_url || "",
    });
    setFiles({ about_image: null, why_image: null });
    setMediaIds({ about_image: null, why_image: null });
  }, [data]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function updateList(key, index, field, value) {
    setValues((prev) => {
      const next = [...prev[key]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, [key]: next };
    });
  }

  function addListItem(key, blank) {
    setValues((prev) => ({ ...prev, [key]: [...prev[key], blank] }));
  }

  function removeListItem(key, index) {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validateAdminRecord(values, {
      hrefs: ["about_cta_href"],
      sortOrder: false,
    });
    setClientErrors(next);
    if (Object.keys(next).length) return;
    let payload = {
      ...values,
      stats: values.stats.map((item) => ({
        ...item,
        value: Number(item.value) || 0,
        featured: Boolean(item.featured),
      })),
    };
    for (const key of ["about_image", "why_image"]) {
      payload = withMediaSource(payload, key, files[key], mediaIds[key]);
    }
    const body = toFormData(payload, ["about_image", "why_image"]);
    try {
      await updateHomepage(body).unwrap();
    } catch {
      /* field errors */
    }
  }

  const errors = { ...fieldErrors(updateState.error), ...clientErrors };

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Loading homepage content…
      </p>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <p className="font-semibold text-ink-900">Could not load homepage content.</p>
        <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      <p className="text-sm text-ink-500">
        Edit existing homepage copy without changing the page layout. Slides, products,
        testimonials, team, and clients have their own sections.
      </p>

      <div className="flex flex-wrap gap-2">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              tab === id
                ? "border-primary/30 bg-primary text-white"
                : "border-line bg-cream text-ink-600 hover:border-primary/30 hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="card space-y-4 p-6">
          <p className="text-sm font-bold text-ink-900">Hero statistics</p>
          {values.stats.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">Label</span>
                <input
                  value={item.label}
                  onChange={(event) => updateList("stats", index, "label", event.target.value)}
                  className={ADMIN_INPUT}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">Description</span>
                <input
                  value={item.description}
                  onChange={(event) =>
                    updateList("stats", index, "description", event.target.value)
                  }
                  className={ADMIN_INPUT}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">Value</span>
                <input
                  type="number"
                  min="0"
                  value={item.value}
                  onChange={(event) => updateList("stats", index, "value", event.target.value)}
                  className={ADMIN_INPUT}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">Suffix</span>
                <input
                  value={item.suffix}
                  onChange={(event) => updateList("stats", index, "suffix", event.target.value)}
                  className={ADMIN_INPUT}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
                <input
                  type="checkbox"
                  checked={Boolean(item.featured)}
                  onChange={(event) =>
                    updateList("stats", index, "featured", event.target.checked)
                  }
                />
                Featured (hero badge)
              </label>
              {values.stats.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem("stats", index)}
                  className="justify-self-start text-sm font-semibold text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("stats", { ...EMPTY.stats[0] })}
            className="btn btn-ghost btn-sm"
          >
            <Plus size={14} aria-hidden />
            Add statistic
          </button>
        </div>
      )}

      {tab === "about" && (
        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Eyebrow</span>
              <input name="about_eyebrow" value={values.about_eyebrow} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Title</span>
              <input name="about_title" value={values.about_title} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Highlighted title</span>
              <input name="about_highlight" value={values.about_highlight} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Body</span>
              <textarea name="about_body" value={values.about_body} onChange={handleChange} rows={6} className={ADMIN_INPUT} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">CTA label</span>
                <input name="about_cta_label" value={values.about_cta_label} onChange={handleChange} className={ADMIN_INPUT} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">CTA link</span>
                <input name="about_cta_href" value={values.about_cta_href} onChange={handleChange} className={ADMIN_INPUT} />
                {errors.about_cta_href && (
                  <p className="mt-1 text-xs font-semibold text-red-700">{errors.about_cta_href}</p>
                )}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">Badge value</span>
                <input name="about_badge_value" value={values.about_badge_value} onChange={handleChange} className={ADMIN_INPUT} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">Badge label</span>
                <input name="about_badge_label" value={values.about_badge_label} onChange={handleChange} className={ADMIN_INPUT} />
              </label>
            </div>
            <MediaField
              label="About image"
              preview={previews.about_image}
              previewClassName="h-32 w-full rounded-xl object-cover"
              error={errors.about_image || errors.about_image_from_media}
              onFile={(file) => {
                setFiles((prev) => ({ ...prev, about_image: file }));
                setMediaIds((prev) => ({ ...prev, about_image: null }));
                setPreviews((prev) => ({ ...prev, about_image: URL.createObjectURL(file) }));
              }}
              onLibrary={(item) => {
                setFiles((prev) => ({ ...prev, about_image: null }));
                setMediaIds((prev) => ({ ...prev, about_image: item.id }));
                setPreviews((prev) => ({ ...prev, about_image: item.url }));
              }}
            />
          </div>
          <div className="card space-y-3 p-6">
            <p className="text-sm font-bold text-ink-900">Highlights</p>
            {values.about_highlights.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item.label}
                  onChange={(event) =>
                    updateList("about_highlights", index, "label", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  placeholder="Label"
                />
                <input
                  value={item.text}
                  onChange={(event) =>
                    updateList("about_highlights", index, "text", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  placeholder="Text"
                />
                {values.about_highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem("about_highlights", index)}
                    className="rounded-lg border border-line px-2 text-ink-500 hover:text-red-700"
                    aria-label="Remove highlight"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("about_highlights", { label: "", text: "" })}
              className="btn btn-ghost btn-sm"
            >
              <Plus size={14} aria-hidden />
              Add highlight
            </button>
          </div>
        </div>
      )}

      {tab === "why" && (
        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Eyebrow</span>
              <input name="why_eyebrow" value={values.why_eyebrow} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Title</span>
              <input name="why_title" value={values.why_title} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Highlighted title</span>
              <input name="why_highlight" value={values.why_highlight} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Subtitle</span>
              <textarea name="why_subtitle" value={values.why_subtitle} onChange={handleChange} rows={3} className={ADMIN_INPUT} />
            </label>
            <MediaField
              label="Section image"
              preview={previews.why_image}
              previewClassName="h-32 w-full rounded-xl object-cover"
              error={errors.why_image || errors.why_image_from_media}
              onFile={(file) => {
                setFiles((prev) => ({ ...prev, why_image: file }));
                setMediaIds((prev) => ({ ...prev, why_image: null }));
                setPreviews((prev) => ({ ...prev, why_image: URL.createObjectURL(file) }));
              }}
              onLibrary={(item) => {
                setFiles((prev) => ({ ...prev, why_image: null }));
                setMediaIds((prev) => ({ ...prev, why_image: item.id }));
                setPreviews((prev) => ({ ...prev, why_image: item.url }));
              }}
            />
          </div>
          <div className="card space-y-4 p-6">
            <p className="text-sm font-bold text-ink-900">Reasons</p>
            {values.why_items.map((item, index) => (
              <div key={index} className="space-y-2 rounded-xl border border-line p-4">
                <input
                  value={item.title}
                  onChange={(event) => updateList("why_items", index, "title", event.target.value)}
                  className={ADMIN_INPUT}
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(event) =>
                    updateList("why_items", index, "description", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  rows={2}
                  placeholder="Description"
                />
                <input
                  value={item.icon}
                  onChange={(event) => updateList("why_items", index, "icon", event.target.value)}
                  className={ADMIN_INPUT}
                  placeholder="Icon path, e.g. /images/web-design.svg"
                />
                {values.why_items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem("why_items", index)}
                    className="text-sm font-semibold text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("why_items", { title: "", description: "", icon: "" })}
              className="btn btn-ghost btn-sm"
            >
              <Plus size={14} aria-hidden />
              Add reason
            </button>
          </div>
        </div>
      )}

      {tab === "method" && (
        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Eyebrow</span>
              <input name="method_eyebrow" value={values.method_eyebrow} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Title</span>
              <input name="method_title" value={values.method_title} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Highlighted title</span>
              <input name="method_highlight" value={values.method_highlight} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Subtitle</span>
              <textarea name="method_subtitle" value={values.method_subtitle} onChange={handleChange} rows={3} className={ADMIN_INPUT} />
            </label>
          </div>
          <div className="card space-y-4 p-6">
            <p className="text-sm font-bold text-ink-900">Steps</p>
            {values.method_steps.map((item, index) => (
              <div key={index} className="space-y-2 rounded-xl border border-line p-4">
                <input
                  value={item.title}
                  onChange={(event) =>
                    updateList("method_steps", index, "title", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  placeholder="Title"
                />
                <textarea
                  value={item.desc}
                  onChange={(event) =>
                    updateList("method_steps", index, "desc", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  rows={2}
                  placeholder="Description"
                />
                {values.method_steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem("method_steps", index)}
                    className="text-sm font-semibold text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("method_steps", { title: "", desc: "" })}
              className="btn btn-ghost btn-sm"
            >
              <Plus size={14} aria-hidden />
              Add step
            </button>
          </div>
        </div>
      )}

      {tab === "expertise" && (
        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Eyebrow</span>
              <input name="expertise_eyebrow" value={values.expertise_eyebrow} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Title</span>
              <input name="expertise_title" value={values.expertise_title} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Highlighted title</span>
              <input name="expertise_highlight" value={values.expertise_highlight} onChange={handleChange} className={ADMIN_INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-700">Subtitle</span>
              <textarea name="expertise_subtitle" value={values.expertise_subtitle} onChange={handleChange} rows={3} className={ADMIN_INPUT} />
            </label>
          </div>
          <div className="card space-y-4 p-6">
            <p className="text-sm font-bold text-ink-900">Expertise cards</p>
            {values.expertise_items.map((item, index) => (
              <div key={index} className="space-y-2 rounded-xl border border-line p-4">
                <input
                  value={item.title}
                  onChange={(event) =>
                    updateList("expertise_items", index, "title", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(event) =>
                    updateList("expertise_items", index, "description", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  rows={2}
                  placeholder="Description"
                />
                <input
                  value={item.icon}
                  onChange={(event) =>
                    updateList("expertise_items", index, "icon", event.target.value)
                  }
                  className={ADMIN_INPUT}
                  placeholder="Icon path, e.g. /images/ai.png"
                />
                {values.expertise_items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem("expertise_items", index)}
                    className="text-sm font-semibold text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addListItem("expertise_items", { title: "", description: "", icon: "" })
              }
              className="btn btn-ghost btn-sm"
            >
              <Plus size={14} aria-hidden />
              Add card
            </button>
          </div>
        </div>
      )}

      {updateState.error && Object.keys(errors).length === 0 && (
        <p className="alert-error">
          {formErrorMessage(updateState.error)}
        </p>
      )}
      {updateState.isSuccess && (
        <p className="rounded-xl border border-primary/20 bg-primary-light px-3 py-2 text-sm font-semibold text-primary">
          Homepage content saved.
        </p>
      )}

      <div className="admin-form-actions flex flex-wrap gap-3">
        <button type="submit" className="btn btn-teal rounded-lg" disabled={updateState.isLoading}>
          {updateState.isLoading ? "Saving…" : "Save homepage content"}
        </button>
        <button
          type="button"
          className="btn btn-ghost rounded-lg"
          onClick={() => {
            if (!data) return;
            setValues(homepageValues(data));
            setPreviews({
              about_image: data.about_image_url || "",
              why_image: data.why_image_url || "",
            });
            setFiles({ about_image: null, why_image: null });
            setMediaIds({ about_image: null, why_image: null });
          }}
          disabled={updateState.isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
