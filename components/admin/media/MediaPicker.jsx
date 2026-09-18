"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import {
  useCreateMediaMutation,
  useGetAdminMediaQuery,
} from "@/redux/features/cms/mediaApi";
import { IMAGE_ACCEPT, fieldErrors, formErrorMessage, validateImageFile } from "../form";

export default function MediaPicker({ open, onClose, onSelect }) {
  const { data: items = [], error, isLoading, refetch } = useGetAdminMediaQuery(undefined, {
    skip: !open,
  });
  const [createMedia, createState] = useCreateMediaMutation();
  const inputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");

  if (!open) return null;

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      setUploadError(invalid);
      return;
    }
    setUploadError("");
    const body = new FormData();
    body.append("file", file);
    body.append("name", file.name.replace(/\.[^.]+$/, ""));
    try {
      const created = await createMedia(body).unwrap();
      onSelect(created);
      onClose();
    } catch (err) {
      const mapped = fieldErrors(err);
      setUploadError(mapped.file || formErrorMessage(err));
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-sage/70"
        aria-label="Close media library"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-picker-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-line bg-cream shadow-[var(--shadow-lg)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
          <h2 id="media-picker-title" className="text-lg font-extrabold text-ink-900">
            Select image
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              onChange={handleUpload}
            />
            <button
              type="button"
              className="btn btn-teal btn-sm rounded-lg"
              onClick={() => inputRef.current?.click()}
              disabled={createState.isLoading}
            >
              {createState.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Upload size={15} aria-hidden />
              )}
              Upload
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
        <div className="overflow-y-auto p-5">
          {uploadError && (
            <p className="mb-4 alert-error">
              {uploadError}
            </p>
          )}
          {isLoading && (
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
              <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
              Loading media…
            </p>
          )}
          {error && (
            <div>
              <p className="font-semibold text-ink-900">Could not load media.</p>
              <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}
          {!isLoading && !error && items.length === 0 && (
            <p className="text-sm text-ink-500">
              No images in the library yet. Upload one to use it here.
            </p>
          )}
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="overflow-hidden rounded-xl border border-line bg-surface-muted text-left hover:border-primary/40"
                >
                  <span className="block aspect-square bg-pale">
                    {item.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt="" className="h-full w-full object-contain p-2" />
                    ) : null}
                  </span>
                  <span className="block truncate px-2 py-1.5 text-xs font-semibold text-ink-700">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
