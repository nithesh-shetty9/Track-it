import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/user.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});