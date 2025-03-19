import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: Cookies.get("user_access_token") ? true : false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser_for_otp: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem("userEmail", action.payload.email);
      sessionStorage.setItem("userId", action.payload.userId);
    },
    clearUser_after_otp: (state) => {
      state.user = null;
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userId");
    },
    successLogin: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      Cookies.set("user_access_token", action.payload, {
        expires: 3,
      });
    },
    successLogout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      Cookies.remove("user_access_token");
    },
  },
});

export const {
  setUser_for_otp,
  clearUser_after_otp,
  successLogin,
  successLogout,
} = authSlice.actions;
export default authSlice.reducer;
