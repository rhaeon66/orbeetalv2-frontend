import { apiSlice } from "@/redux/api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "api/admin/dashboard/",
      providesTags: ["Dashboard"],
    }),
    downloadPortfolio: builder.mutation({
      query: () => ({
        url: "api/admin/portfolio/",
        method: "GET",
        headers: { Accept: "application/pdf, application/json" },
        cache: "no-store",
        responseHandler: async (response) => {
          const type = response.headers.get("content-type") || "";
          if (type.includes("application/pdf") || type.includes("octet-stream")) {
            return response.blob();
          }
          try {
            return await response.json();
          } catch {
            return { detail: "Could not generate the portfolio." };
          }
        },
      }),
    }),
  }),
});

export const { useGetDashboardQuery, useDownloadPortfolioMutation } = dashboardApi;
