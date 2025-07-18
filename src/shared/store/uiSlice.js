import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showLoading(state) {
      state.isLoading = true;
    },
    hideLoading(state) {
      state.isLoading = false;
    },
  },
});

export const { showLoading, hideLoading } = uiSlice.actions;
export default uiSlice.reducer;
