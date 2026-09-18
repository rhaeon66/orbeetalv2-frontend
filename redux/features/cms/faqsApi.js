import { apiSlice } from "@/redux/api/apiSlice";

const faqListTag = { type: "FAQ", id: "LIST" };

export const faqsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedFaqs: builder.query({
      query: () => "api/faqs/",
      providesTags: [faqListTag],
    }),
    getAdminFaqs: builder.query({
      query: () => "api/admin/faqs/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "FAQ", id })), faqListTag]
          : [faqListTag],
    }),
    getAdminFaq: builder.query({
      query: (id) => `api/admin/faqs/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "FAQ", id }],
    }),
    createFaq: builder.mutation({
      query: (body) => ({
        url: "api/admin/faqs/",
        method: "POST",
        body,
      }),
      invalidatesTags: [faqListTag, "Dashboard"],
    }),
    updateFaq: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/faqs/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "FAQ", id },
        faqListTag,
        "Dashboard",
      ],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `api/admin/faqs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [faqListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedFaqsQuery,
  useGetAdminFaqsQuery,
  useGetAdminFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqsApi;
