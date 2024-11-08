import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./appointmentSlice";
import authReducer from "./authSlice"

const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    auth: authReducer,
  },
});

export default store