import { apiSlice } from "@/redux/api/apiSlice";

const productListTag = { type: "Product", id: "LIST" };

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedProducts: builder.query({
      query: () => "api/products/",
      providesTags: [productListTag],
    }),
    getAdminProducts: builder.query({
      query: () => "api/admin/products/",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Product", id })), productListTag]
          : [productListTag],
    }),
    getAdminProduct: builder.query({
      query: (id) => `api/admin/products/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: "api/admin/products/",
        method: "POST",
        body,
      }),
      invalidatesTags: [productListTag, "Dashboard"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `api/admin/products/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        productListTag,
        "Dashboard",
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `api/admin/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [productListTag, "Dashboard"],
    }),
  }),
});

export const {
  useGetPublishedProductsQuery,
  useGetAdminProductsQuery,
  useGetAdminProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
