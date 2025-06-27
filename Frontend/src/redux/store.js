import { configureStore } from "@reduxjs/toolkit";
import doctorSlice from "./doctorSlice";
const store = configureStore({
  reducer: {
    doctor: doctorSlice,
  },
});

export default store;
