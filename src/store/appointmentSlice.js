import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newAppointment: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setNewAppointment: (state, action) => {
      state.newAppointment = action.payload;
    },
    resetNewAppointment: (state) => {
      state.newAppointment = null;
    },
  },
});

export const { setNewAppointment, resetNewAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
