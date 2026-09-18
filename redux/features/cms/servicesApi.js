import { apiSlice } from "@/redux/api/apiSlice";

const serviceListTag = { type: "Service", id: "LIST" };

export const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedServices: builder.query({
      query: () => "api/services/",
      providesTags: [serviceListTag],
    }),
    getAdminServices: builder.query({
      query: () => "api/admin/services/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Service", id })), serviceListTag]
          : [serviceListTag],
    }),
    getAdminService: builder.query({
      query: (id) => `api/admin/services/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation({
      query: (body) => ({
        url: "api/admin/services/",
        method: "POST",
        body,
      }),
      invalidatesTags: [serviceListTag, "Dashboard"],
    }),
    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/services/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        serviceListTag,
        "Dashboard",
      ],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `api/admin/services/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [serviceListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedServicesQuery,
  useGetAdminServicesQuery,
  useGetAdminServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
