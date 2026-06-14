import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
  },
});
export const { SetUser } = authSlice.actions;
export default authSlice.reducer;
