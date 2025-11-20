import { createSlice } from "@reduxjs/toolkit";

// Lấy từ localStorage (nếu có)
const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");
const savedRoles = localStorage.getItem("roles");

const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  roles: savedRoles ? JSON.parse(savedRoles) : [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.roles = action.payload.roles || [];

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("roles", JSON.stringify(action.payload.roles || []));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.roles = [];

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
