import { apiSlice } from './apiSlice';

export const inventoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/items/create',
        method: 'POST',
        body: data,
      }),
    }),
    getProducts: builder.query({
      query: () => ({
        url: '/items/IgetAll',
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    updateProduct: builder.mutation({
      query: ({ itemId, data }) => ({
        url: `/items/Update/${itemId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (itemId) => ({
        url: `/items/delete/${itemId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = inventoryApiSlice;
