import { apiSlice } from "@/redux/api/apiSlice";

const departmentListTag = { type: "Department", id: "LIST" };

export const departmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedDepartments: builder.query({
      query: () => "api/departments/",
      providesTags: [departmentListTag],
    }),
    getAdminDepartments: builder.query({
      query: () => "api/admin/departments/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Department", id })), departmentListTag]
          : [departmentListTag],
    }),
    getAdminDepartment: builder.query({
      query: (id) => `api/admin/departments/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Department", id }],
    }),
    createDepartment: builder.mutation({
      query: (body) => ({
        url: "api/admin/departments/",
        method: "POST",
        body,
      }),
      invalidatesTags: [departmentListTag, "Dashboard"],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/departments/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Department", id },
        departmentListTag,
        "Dashboard",
      ],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `api/admin/departments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [departmentListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedDepartmentsQuery,
  useGetAdminDepartmentsQuery,
  useGetAdminDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
