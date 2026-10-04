import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/index.js";

export const loadProjects = createAsyncThunk("workspace/projects", async () => (await api.projects.list()).projects);
export const loadUnread = createAsyncThunk("workspace/unread", async () => (await api.notifications()).unread);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: { projects: [], projectsLoaded: false, unread: 0, version: 0 },
  reducers: {
    bump: (state) => {
      state.version += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.projectsLoaded = true;
      })
      .addCase(loadUnread.fulfilled, (state, action) => {
        state.unread = action.payload;
      });
  },
});

export const { bump } = workspaceSlice.actions;
export default workspaceSlice.reducer;
