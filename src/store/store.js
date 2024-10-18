import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./appointmentSlice";

const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
  }
})

export default store