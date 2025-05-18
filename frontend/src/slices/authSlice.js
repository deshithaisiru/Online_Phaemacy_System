import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      // Ensure we're storing the complete user info
      if (action.payload) {
        const currentInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const updatedInfo = { ...currentInfo, ...action.payload };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      }
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
