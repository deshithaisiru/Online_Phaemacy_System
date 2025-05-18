import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: []
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    }
  },
});

export const { setProducts, addProduct } = inventorySlice.actions;
export default inventorySlice.reducer;
