import { apiSlice } from "@/redux/api/apiSlice";

export const technologiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTechnologies: builder.query({
      query: (search = "") => {
        const query = String(search || "").trim();
        return query
          ? `api/admin/technologies/?q=${encodeURIComponent(query)}`
          : "api/admin/technologies/";
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Technology", id })),
              { type: "Technology", id: "LIST" },
            ]
          : [{ type: "Technology", id: "LIST" }],
    }),
    createTechnology: builder.mutation({
      query: (body) => ({
        url: "api/admin/technologies/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Technology", id: "LIST" }],
    }),
  }),
});

export const { useGetTechnologiesQuery, useCreateTechnologyMutation } = technologiesApi;
