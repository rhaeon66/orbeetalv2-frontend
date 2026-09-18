import { apiSlice } from "@/redux/api/apiSlice";

const homepageTag = { type: "Homepage", id: "CONTENT" };

export const homepageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedHomepage: builder.query({
      query: () => "api/homepage/",
      providesTags: [homepageTag],
    }),
    getAdminHomepage: builder.query({
      query: () => "api/admin/homepage/",
      providesTags: [homepageTag],
    }),
    updateHomepage: builder.mutation({
      query: (body) => ({
        url: "api/admin/homepage/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [homepageTag],
    }),
  }),
});

export const {
  useGetPublishedHomepageQuery,
  useGetAdminHomepageQuery,
  useUpdateHomepageMutation,
} = homepageApi;
