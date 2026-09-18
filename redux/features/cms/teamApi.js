import { apiSlice } from "@/redux/api/apiSlice";

const teamListTag = { type: "Team", id: "LIST" };

export const teamApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedTeam: builder.query({
      query: () => "api/team/",
      providesTags: [teamListTag],
    }),
    getAdminTeam: builder.query({
      query: () => "api/admin/team/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Team", id })), teamListTag]
          : [teamListTag],
    }),
    getAdminTeamMember: builder.query({
      query: (id) => `api/admin/team/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Team", id }],
    }),
    createTeamMember: builder.mutation({
      query: (body) => ({
        url: "api/admin/team/",
        method: "POST",
        body,
      }),
      invalidatesTags: [teamListTag, "Dashboard"],
    }),
    updateTeamMember: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/team/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Team", id },
        teamListTag,
        "Dashboard",
      ],
    }),
    deleteTeamMember: builder.mutation({
      query: (id) => ({
        url: `api/admin/team/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [teamListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedTeamQuery,
  useGetAdminTeamQuery,
  useGetAdminTeamMemberQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi;
