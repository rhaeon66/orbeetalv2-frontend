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

async function baseQuery(args, api, extraOptions) {
  const method = (
    typeof args === "string" ? "GET" : args.method || "GET"
  ).toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method) && !csrfToken) {
    const csrf = await rawBaseQuery(
      { url: "api/auth/csrf/" },
      api,
      extraOptions
    );
    if (csrf.data?.csrfToken) setCsrfToken(csrf.data.csrfToken);
  }
  return rawBaseQuery(args, api, extraOptions);
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
