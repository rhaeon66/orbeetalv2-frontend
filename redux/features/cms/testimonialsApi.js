import { apiSlice } from "@/redux/api/apiSlice";

const testimonialListTag = { type: "Testimonial", id: "LIST" };

export const testimonialsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedTestimonials: builder.query({
      query: () => "api/testimonials/",
      providesTags: [testimonialListTag],
    }),
    getAdminTestimonials: builder.query({
      query: () => "api/admin/testimonials/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Testimonial", id })),
              testimonialListTag,
            ]
          : [testimonialListTag],
    }),
    getAdminTestimonial: builder.query({
      query: (id) => `api/admin/testimonials/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Testimonial", id }],
    }),
    createTestimonial: builder.mutation({
      query: (body) => ({
        url: "api/admin/testimonials/",
        method: "POST",
        body,
      }),
      invalidatesTags: [testimonialListTag, "Dashboard"],
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/testimonials/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Testimonial", id },
        testimonialListTag,
        "Dashboard",
      ],
    }),
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `api/admin/testimonials/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [testimonialListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedTestimonialsQuery,
  useGetAdminTestimonialsQuery,
  useGetAdminTestimonialQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
