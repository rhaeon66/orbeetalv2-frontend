import { apiSlice } from "@/redux/api/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: () => "api/admin/users/",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAdminUsersQuery } = usersApi;
