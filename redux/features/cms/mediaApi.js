import { apiSlice } from "@/redux/api/apiSlice";

const mediaListTag = { type: "Media", id: "LIST" };

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMedia: builder.query({
      query: () => "api/admin/media/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Media", id })), mediaListTag]
          : [mediaListTag],
    }),
    createMedia: builder.mutation({
      query: (body) => ({
        url: "api/admin/media/",
        method: "POST",
        body,
      }),
      invalidatesTags: [mediaListTag],
    }),
    updateMedia: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/media/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Media", id },
        mediaListTag,
      ],
    }),
    deleteMedia: builder.mutation({
      query: (id) => ({
        url: `api/admin/media/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [mediaListTag],
    }),
  }),
});

export const {
  useGetAdminMediaQuery,
  useCreateMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
