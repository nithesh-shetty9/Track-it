import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index.js";

export const bootstrap = createAsyncThunk("auth/bootstrap", async () => {
  try {
    return (await api.me()).user;
  } catch {
    return null;
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, ready: false },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.ready = true;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrap.fulfilled, (state, action) => {
      state.user = action.payload;
      state.ready = true;
    });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
