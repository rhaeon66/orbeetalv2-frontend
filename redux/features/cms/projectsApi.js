import { apiSlice } from "@/redux/api/apiSlice";

const projectListTag = { type: "Project", id: "LIST" };

export const PROJECT_CATEGORIES = [
  { value: "own", label: "Own Products" },
  { value: "partnership", label: "Partnerships" },
  { value: "client", label: "Client Projects" },
];

export function categoryLabel(value) {
  return PROJECT_CATEGORIES.find((item) => item.value === value)?.label || value;
}

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedProjects: builder.query({
      query: () => "api/projects/",
      providesTags: [projectListTag],
    }),
    getAdminProjects: builder.query({
      query: () => "api/admin/projects/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Project", id })), projectListTag]
          : [projectListTag],
    }),
    getAdminProject: builder.query({
      query: (id) => `api/admin/projects/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation({
      query: (body) => ({
        url: "api/admin/projects/",
        method: "POST",
        body,
      }),
      invalidatesTags: [projectListTag, "Dashboard"],
    }),
    updateProject: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/projects/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        projectListTag,
        "Dashboard",
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `api/admin/projects/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [projectListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedProjectsQuery,
  useGetAdminProjectsQuery,
  useGetAdminProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
