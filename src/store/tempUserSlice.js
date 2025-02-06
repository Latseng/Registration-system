import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idNumber: "",
  birthDate: "",
};

const tempUserSlice = createSlice({
  name: "tempUser",
  initialState,
  reducers: {
    setTempUserData: (state, action) => {
      state.idNumber = action.payload.idNumber;
      state.birthDate = action.payload.birthDate;
    },
  },
});

export const { setTempUserData } = tempUserSlice.actions;
export default tempUserSlice.reducer;