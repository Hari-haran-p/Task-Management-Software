import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage, defaulting to `false` if not set
const initialState = false;

const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    setRefresh: (state , action) => {
        return action.payload;
    },
  },
});

export const { setRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
