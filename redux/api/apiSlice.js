import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = (process.env.SERVER || "http://localhost:8000").replace(
  /\/+$/,
  ""
);

let csrfToken = "";

export function setCsrfToken(token) {
  csrfToken = token || "";
}

export function getCsrfToken() {
  return csrfToken;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE}/`,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }
    return headers;
  },
});

function requestMethod(args) {
  return (typeof args === "string" ? "GET" : args.method || "GET").toUpperCase();
}

function isUnsafe(method) {
  return !["GET", "HEAD", "OPTIONS"].includes(method);
}

function isCsrfFailure(error) {
  const detail = error?.data?.detail;
  return error?.status === 403 && typeof detail === "string" && detail.startsWith("CSRF Failed");
}

async function primeCsrf(api, extraOptions) {
  const csrf = await rawBaseQuery({ url: "api/auth/csrf/" }, api, extraOptions);
  if (csrf.data?.csrfToken) setCsrfToken(csrf.data.csrfToken);
  return csrf;
}

async function baseQuery(args, api, extraOptions) {
  const method = requestMethod(args);
  if (isUnsafe(method) && !csrfToken) {
    const primed = await primeCsrf(api, extraOptions);
    if (!csrfToken) return primed;
  }

  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.data?.csrfToken) setCsrfToken(result.data.csrfToken);

  // login() rotates the cookie. A token cached before that no longer matches.
  if (isUnsafe(method) && !extraOptions?.csrfRetried && isCsrfFailure(result.error)) {
    setCsrfToken("");
    const primed = await primeCsrf(api, extraOptions);
    if (!csrfToken) return primed;
    result = await rawBaseQuery(args, api, { ...extraOptions, csrfRetried: true });
    if (result.data?.csrfToken) setCsrfToken(result.data.csrfToken);
  }

  return result;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Auth",
    "Dashboard",
    "Slide",
    "Project",
    "Service",
    "Team",
    "Testimonial",
    "FAQ",
    "Product",
    "Department",
    "Client",
    "Homepage",
    "Media",
    "Inquiry",
    "User",
  ],
  endpoints: () => ({}),
});
