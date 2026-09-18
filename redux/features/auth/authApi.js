import { apiSlice, setCsrfToken } from "@/redux/api/apiSlice";

async function withCsrf(baseQuery, request) {
  if (!request.headers?.["X-CSRFToken"]) {
    const csrf = await baseQuery({ url: "api/auth/csrf/" });
    if (csrf.error) return csrf;
    if (csrf.data?.csrfToken) setCsrfToken(csrf.data.csrfToken);
  }
  return baseQuery(request);
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    ensureCsrf: builder.query({
      query: () => "api/auth/csrf/",
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.csrfToken) setCsrfToken(data.csrfToken);
        } catch {
          /* login will retry */
        }
      },
    }),
    getMe: builder.query({
      query: () => "api/auth/me/",
      providesTags: ["Auth"],
    }),
    login: builder.mutation({
      async queryFn(credentials, _api, _extra, baseQuery) {
        return withCsrf(baseQuery, {
          url: "api/auth/login/",
          method: "POST",
          body: credentials,
        });
      },
      invalidatesTags: ["Auth", "Dashboard"],
    }),
    logout: builder.mutation({
      async queryFn(_arg, _api, _extra, baseQuery) {
        return withCsrf(baseQuery, {
          url: "api/auth/logout/",
          method: "POST",
        });
      },
      invalidatesTags: ["Auth", "Dashboard"],
    }),
  }),
});

export const {
  useEnsureCsrfQuery,
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
