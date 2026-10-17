import api from "./axios";

export const getProgressAnalytics = async () => {
  const response = await api.get("/progress");
  return response.data;
};
