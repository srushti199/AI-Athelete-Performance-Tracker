// api/authApi.js

import api from "./axios";

export const loginUser = (data) => api.post("/auth/login", data);

export const signupUser = (data) => api.post("/auth/signup", data);

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
