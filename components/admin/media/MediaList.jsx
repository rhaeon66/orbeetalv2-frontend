"use client";

import { useRef, useState } from "react";
import { Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import {
  useCreateMediaMutation,
  useDeleteMediaMutation,
  useGetAdminMediaQuery,
  useUpdateMediaMutation,
} from "@/redux/features/cms/mediaApi";
import ConfirmDialog from "../ConfirmDialog";
import { IMAGE_ACCEPT, fieldErrors, formErrorMessage, validateImageFile } from "../form";
import AdminTable from "../AdminTable";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

export default function MediaList() {
  const { data: items = [], error, isLoading, refetch } = useGetAdminMediaQuery();
  const [createMedia, createState] = useCreateMediaMutation();
  const [updateMedia, updateState] = useUpdateMediaMutation();
  const [deleteMedia, deleteState] = useDeleteMediaMutation();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [replaceId, setReplaceId] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const uploadRef = useRef(null);
  const replaceRef = useRef(null);

  async function handleUpload(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    const invalid = files.map(validateImageFile).find(Boolean);
    if (invalid) {
      setErrorMessage(invalid);
      return;
    }
    setErrorMessage("");
    setMessage("");
    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        body.append("name", file.name.replace(/\.[^.]+$/, ""));
        await createMedia(body).unwrap();
      }
      setMessage(files.length === 1 ? "Image uploaded." : `${files.length} images uploaded.`);
    } catch (err) {
      const mapped = fieldErrors(err);
      setErrorMessage(mapped.file || formErrorMessage(err));
    }
  }

  async function handleReplace(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    const id = replaceId;
    setReplaceId(null);
    if (!file || !id) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      setErrorMessage(invalid);
      return;
    }
    setErrorMessage("");
    setMessage("");
    const body = new FormData();
    body.append("file", file);
    try {
      await updateMedia({ id, body }).unwrap();
      setMessage("Image replaced.");
    } catch (err) {
      const mapped = fieldErrors(err);
      setErrorMessage(mapped.file || formErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setErrorMessage("");
    try {
      await deleteMedia(pendingDelete.id).unwrap();
      setPendingDelete(null);
      setMessage("Unused image deleted.");
    } catch (err) {
      setErrorMessage(formErrorMessage(err));
      setPendingDelete(null);
    }
  }

  const pending = createState.isLoading || updateState.isLoading;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Uploaded website images. Replace files in place, or delete images that are not used
          by content.
        </p>
        <button
          type="button"
          className="btn btn-teal btn-sm rounded-lg"
          onClick={() => uploadRef.current?.click()}
          disabled={pending}
        >
          {createState.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload size={16} aria-hidden />
          )}
          Upload images
        </button>
        <input
          ref={uploadRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          className="sr-only"
          onChange={handleUpload}
        />
        <input
          ref={replaceRef}
          type="file"
          accept={IMAGE_ACCEPT}
          className="sr-only"
          onChange={handleReplace}
        />
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-primary/20 bg-primary-light px-3 py-2 text-sm font-semibold text-primary">
          {message}
        </p>
      )}
      {errorMessage && (
        <p className="mb-4 alert-error">
          {errorMessage}
        </p>
      )}

      {isLoading && (
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading media…
        </p>
      )}

      {error && (
        <div className="card p-6">
          <p className="font-semibold text-ink-900">Could not load media.</p>
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-semibold text-ink-900">No images yet</p>
          <p className="mt-1 text-sm text-ink-500">
            Upload JPG, PNG, WEBP, or GIF files to reuse them when editing content.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <AdminTable>
            <thead className="border-b border-line bg-surface-muted text-xs font-bold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 sm:table-cell">Uploaded</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                        {item.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt="" className="h-full w-full object-contain p-1" />
                        ) : null}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink-900">{item.name}</span>
                        <span className="block text-xs text-ink-500">
                          {item.original_name || "Uploaded image"}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {item.in_use ? (
                      <span className="inline-flex rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
                        In use
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold text-ink-500">
                        Unused
                      </span>
                    )}
                    {item.in_use && item.used_by?.length ? (
                      <span className="mt-1 block max-w-xs text-xs text-ink-400">
                        {item.used_by.join(", ")}
                      </span>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">{formatDate(item.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplaceId(item.id);
                          replaceRef.current?.click();
                        }}
                        disabled={updateState.isLoading}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:border-primary/30 hover:text-primary"
                      >
                        <RefreshCw size={13} aria-hidden />
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(item)}
                        disabled={item.in_use}
                        title={
                          item.in_use
                            ? "This image is used by content and cannot be deleted."
                            : "Delete unused image"
                        }
                        className="action-danger disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={13} aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this image?"
        message={
          pendingDelete
            ? `${pendingDelete.name} will be removed from the media library. This cannot be undone.`
            : ""
        }
        pending={deleteState.isLoading}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
