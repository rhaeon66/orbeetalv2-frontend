import { apiSlice } from "@/redux/api/apiSlice";

const clientListTag = { type: "Client", id: "LIST" };

export const clientsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedClients: builder.query({
      query: () => "api/clients/",
      providesTags: [clientListTag],
    }),
    getAdminClients: builder.query({
      query: () => "api/admin/clients/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Client", id })), clientListTag]
          : [clientListTag],
    }),
    getAdminClient: builder.query({
      query: (id) => `api/admin/clients/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Client", id }],
    }),
    createClient: builder.mutation({
      query: (body) => ({
        url: "api/admin/clients/",
        method: "POST",
        body,
      }),
      invalidatesTags: [clientListTag, "Dashboard"],
    }),
    updateClient: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/clients/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Client", id },
        clientListTag,
        "Dashboard",
      ],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `api/admin/clients/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [clientListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedClientsQuery,
  useGetAdminClientsQuery,
  useGetAdminClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
