export function toFormData(values, fileKeys = []) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (fileKeys.includes(key)) {
      if (value instanceof File) data.append(key, value);
      continue;
    }
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      data.append(key, JSON.stringify(value));
      continue;
    }
    if (typeof value === "boolean") {
      data.append(key, value ? "true" : "false");
      continue;
    }
    data.append(key, String(value));
  }
  return data;
}

export function fieldErrors(error) {
  const raw = error?.data;
  if (!raw || typeof raw !== "object") return {};
  const mapped = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key === "detail" || key === "non_field_errors") continue;
    mapped[key] = Array.isArray(value) ? value[0] : String(value);
  }
  return mapped;
}

export function formErrorMessage(error) {
  if (!error) return "Could not save. Please try again.";
  if (error.status === "FETCH_ERROR") {
    return "Could not reach the API. Confirm the backend is running.";
  }
  if (typeof error.data?.detail === "string") return error.data.detail;
  if (Array.isArray(error.data?.non_field_errors)) {
    return error.data.non_field_errors[0];
  }
  return "Please fix the highlighted fields and try again.";
}

export const ADMIN_INPUT = "form-field form-field-sm";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;
const HREF_RE = /^(\/[^\s]*|https?:\/\/[^\s]+|#)$/i;

export function validateImageFile(file) {
  if (!file) return "";
  const namedOk = /\.(jpe?g|png|webp|gif)$/i.test(file.name || "");
  if (file.type && !IMAGE_TYPES.has(file.type) && !namedOk) {
    return "Use a JPG, PNG, WEBP, or GIF image.";
  }
  if (!file.type && !namedOk) {
    return "Use a JPG, PNG, WEBP, or GIF image.";
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return "";
}

export function validateHref(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (HREF_RE.test(trimmed)) return "";
  return "Enter a valid URL or site path.";
}

export function validateOptionalUrl(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (URL_RE.test(trimmed)) return "";
  return "Enter a valid URL starting with http:// or https://.";
}

export function validateOptionalEmail(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (EMAIL_RE.test(trimmed)) return "";
  return "Enter a valid email address.";
}

export function validateSortOrder(value) {
  if (value === "" || value === null || value === undefined) {
    return "Display order must be 0 or greater.";
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    return "Display order must be 0 or greater.";
  }
  return "";
}

export function validateAdminRecord(values, rules = {}) {
  const errors = {};
  for (const [field, message] of Object.entries(rules.required || {})) {
    if (!String(values[field] ?? "").trim()) errors[field] = message;
  }
  if (values.is_active) {
    for (const [field, message] of Object.entries(rules.publishRequired || {})) {
      if (!String(values[field] ?? "").trim()) errors[field] = message;
    }
  }
  for (const field of rules.hrefs || []) {
    const message = validateHref(values[field]);
    if (message) errors[field] = message;
  }
  for (const field of rules.urls || []) {
    const message = validateOptionalUrl(values[field]);
    if (message) errors[field] = message;
  }
  for (const field of rules.emails || []) {
    const message = validateOptionalEmail(values[field]);
    if (message) errors[field] = message;
  }
  for (const [field, allowed] of Object.entries(rules.choices || {})) {
    if (!allowed.includes(values[field])) {
      errors[field] = `Choose a valid ${field.replace(/_/g, " ")}.`;
    }
  }
  if (rules.sortOrder !== false) {
    const message = validateSortOrder(values.sort_order);
    if (message) errors.sort_order = message;
  }
  return errors;
}

export function withMediaSource(values, fileKey, file, mediaId) {
  const next = { ...values };
  if (file) {
    next[fileKey] = file;
  } else if (mediaId) {
    next[`${fileKey}_from_media`] = mediaId;
  }
  return next;
}
