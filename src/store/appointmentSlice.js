import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newAppointment: null,
  isNewDataCreated: false
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setNewAppointment: (state, action) => {
      state.isNewDataCreated = true;
      state.newAppointment = action.payload;
    },
    resetNewAppointment: (state) => {
      state.isNewDataCreated = false;
      state.newAppointment = null;
    },
  },
});

export const { setNewAppointment, resetNewAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
