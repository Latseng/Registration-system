import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    loginState: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const {loginState, logoutState} = authSlice.actions
export default authSlice.reducer;