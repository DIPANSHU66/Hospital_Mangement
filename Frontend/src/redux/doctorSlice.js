import { createSlice } from "@reduxjs/toolkit";

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    alldoctors: [],
  },

  reducers: {
    setAllDoctors: (state, action) => {
      state.alldoctors = action.payload;
    },
  },
});
export const { setAllDoctors } = doctorSlice.actions;
export default doctorSlice.reducer;

