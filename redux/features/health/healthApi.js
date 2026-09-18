import { apiSlice } from "@/redux/api/apiSlice";

export const healthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => "api/health/",
    }),
  }),
});

export const { useGetHealthQuery } = healthApi;
