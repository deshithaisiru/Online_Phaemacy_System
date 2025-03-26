import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

// Update the baseUrl to point to your server
const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:5001',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});