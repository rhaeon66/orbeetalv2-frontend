import { apiSlice } from "@/redux/api/apiSlice";

const homepageTag = { type: "Homepage", id: "CONTENT" };

export const siteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSite: builder.query({
      query: () => "api/site/",
      providesTags: [homepageTag],
    }),
  }),
});

export const { useGetSiteQuery } = siteApi;
