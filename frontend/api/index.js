import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8001",
  withCredentials: true,
});

const data = (response) => response.data;

export const errorMessage = (error) => error.response?.data?.message || error.message || "Something went wrong";

const api = {
  me: () => http.get("/user/me").then(data),
  login: (body) => http.post("/user/login", body).then(data),
  signup: (body) => http.post("/user/signup", body).then(data),
  logout: () => http.post("/user/logout").then(data),
  updateProfile: (body) => http.patch("/user/me", body).then(data),
  changePassword: (body) => http.patch("/user/password", body).then(data),
  dashboard: (params) => http.get("/dashboard/summary", { params }).then(data),
  search: (q) => http.get("/search", { params: { q } }).then(data),
  notifications: () => http.get("/notifications").then(data),
  markRead: (id) => http.patch("/notifications/read", { id }).then(data),
  projects: {
    list: (archived = false) => http.get("/projects", { params: { archived } }).then(data),
    get: (id) => http.get(`/projects/${id}`).then(data),
    create: (body) => http.post("/projects", body).then(data),
    update: (id, body) => http.patch(`/projects/${id}`, body).then(data),
    archive: (id) => http.delete(`/projects/${id}`).then(data),
    join: (code) => http.post("/projects/join", { code }).then(data),
    joinCode: (id) => http.get(`/projects/${id}/join-code`).then(data),
    members: (id) => http.get(`/projects/${id}/members`).then(data),
    updateMember: (id, memberId, body) => http.patch(`/projects/${id}/members/${memberId}`, body).then(data),
    removeMember: (id, memberId) => http.delete(`/projects/${id}/members/${memberId}`).then(data),
  },
  tasks: {
    list: (params) => http.get("/tasks", { params }).then(data),
    get: (id) => http.get(`/tasks/${id}`).then(data),
    create: (body) => http.post("/tasks", body).then(data),
    update: (id, body) => http.patch(`/tasks/${id}`, body).then(data),
    remove: (id) => http.delete(`/tasks/${id}`).then(data),
    addProgressNote: (id, content) => http.post(`/tasks/${id}/progress-notes`, { content }).then(data),
  },
  chat: {
    list: (id, params) => http.get(`/projects/${id}/chat`, { params }).then(data),
    send: (id, content) => http.post(`/projects/${id}/chat`, { content }).then(data),
    markRead: (id) => http.patch(`/projects/${id}/chat/read`).then(data),
    streamUrl: (id) => `${import.meta.env.VITE_API_URL || "http://localhost:8001"}/projects/${id}/chat/stream`,
  },
};

export default api;
