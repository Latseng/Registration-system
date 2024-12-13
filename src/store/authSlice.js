import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.CSRF_token = action.payload.CSRF_token;
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.CSRF_token = "";
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
