import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  role: "", //登入權限
  CSRF_token: "",
  expiresAt: null, // 過期時間
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
      state.expiresIn = action.payload.expiresIn;
      state.expiresAt = Date.now() + state.expiresIn * 1000; // expiresIn 為秒數
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = "";
      state.CSRF_token = "";
    },
    //更新使用者資料
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLogin, setLogout, updateUser } = authSlice.actions;
export default authSlice.reducer;
