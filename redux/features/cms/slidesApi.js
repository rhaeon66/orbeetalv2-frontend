import { apiSlice } from "@/redux/api/apiSlice";

const slideListTag = { type: "Slide", id: "LIST" };

export const slidesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedSlides: builder.query({
      query: () => "api/slides/",
      providesTags: [slideListTag],
    }),
    getAdminSlides: builder.query({
      query: () => "api/admin/slides/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Slide", id })), slideListTag]
          : [slideListTag],
    }),
    getAdminSlide: builder.query({
      query: (id) => `api/admin/slides/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Slide", id }],
    }),
    createSlide: builder.mutation({
      query: (body) => ({
        url: "api/admin/slides/",
        method: "POST",
        body,
      }),
      invalidatesTags: [slideListTag, "Dashboard"],
    }),
    updateSlide: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/slides/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Slide", id },
        slideListTag,
        "Dashboard",
      ],
    }),
    deleteSlide: builder.mutation({
      query: (id) => ({
        url: `api/admin/slides/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [slideListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedSlidesQuery,
  useGetAdminSlidesQuery,
  useGetAdminSlideQuery,
  useCreateSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
} = slidesApi;
