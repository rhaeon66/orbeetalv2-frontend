"use client";

import { useState } from "react";
import { Images, Upload } from "lucide-react";
import { IMAGE_ACCEPT, validateImageFile } from "../form";
import MediaPicker from "./MediaPicker";

export default function MediaField({
  label,
  preview,
  error,
  onFile,
  onLibrary,
  previewClassName = "max-h-52 w-full max-w-full rounded-xl object-contain",
  emptyLabel = "No image yet.",
}) {
  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const message = validateImageFile(file);
    if (message) {
      setLocalError(message);
      return;
    }
    setLocalError("");
    onFile(file);
  }

  return (
    <div className="space-y-3">
      {label ? <p className="text-sm font-bold text-ink-900">{label}</p> : null}
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className={previewClassName} />
      ) : (
        <p className="text-sm text-ink-400">{emptyLabel}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary">
          <Upload size={13} aria-hidden />
          Upload file
          <input type="file" accept={IMAGE_ACCEPT} className="sr-only" onChange={handleFile} />
        </label>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary"
        >
          <Images size={13} aria-hidden />
          Choose from library
        </button>
      </div>
      <p className="text-xs text-ink-400">JPG, PNG, WEBP, or GIF. 5MB maximum.</p>
      {error || localError ? (
        <p className="text-xs font-semibold text-red-700">{error || localError}</p>
      ) : null}
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => onLibrary(item)}
      />
    </div>
  );
}
