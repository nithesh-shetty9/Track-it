import { createSlice } from "@reduxjs/toolkit";

const readTheme = () => {
  try {
    return localStorage.getItem("trackit-theme") || "system";
  } catch {
    return "system";
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState: { theme: readTheme(), taskId: null, overlay: null, toasts: [] },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    openTask: (state, action) => {
      state.taskId = action.payload;
    },
    closeTask: (state) => {
      state.taskId = null;
    },
    openOverlay: (state, action) => {
      state.overlay = typeof action.payload === "string" ? { name: action.payload } : action.payload;
    },
    closeOverlay: (state) => {
      state.overlay = null;
    },
    pushToast: (state, action) => {
      state.toasts.push(action.payload);
    },
    dropToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { setTheme, openTask, closeTask, openOverlay, closeOverlay, pushToast, dropToast } = uiSlice.actions;

export const toast = (message, kind = "success") => (dispatch) => {
  const id = Date.now() + Math.random();
  dispatch(pushToast({ id, message, kind }));
  setTimeout(() => dispatch(dropToast(id)), 3500);
};

export default uiSlice.reducer;
