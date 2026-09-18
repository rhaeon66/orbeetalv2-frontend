import { apiSlice } from "@/redux/api/apiSlice";

const inquiryListTag = { type: "Inquiry", id: "LIST" };

export const inquiriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminInquiries: builder.query({
      query: () => "api/admin/inquiries/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Inquiry", id })), inquiryListTag]
          : [inquiryListTag],
    }),
    getAdminInquiry: builder.query({
      query: (id) => `api/admin/inquiries/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Inquiry", id }],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `api/admin/inquiries/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [inquiryListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetAdminInquiriesQuery,
  useGetAdminInquiryQuery,
  useDeleteInquiryMutation,
} = inquiriesApi;
