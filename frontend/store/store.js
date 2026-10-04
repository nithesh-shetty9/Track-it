import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/user.js";
import uiReducer from "./features/ui.js";
import workspaceReducer from "./features/workspace.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    workspace: workspaceReducer,
  },
});
