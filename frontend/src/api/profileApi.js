import api from "./axios";

export const createProfile = (formData) => {
  return api.post("/profile", formData);
};

export const updateOnboardingStep2 = (formData) => {
  return api.patch("/profile/onboardingStep2", formData);
};

export const submitInjuries = (data) => {
  return api.patch("/profile/onboardingStep3", data);
};

export const getProfile = () => {
  return api.get("/profile");
};

export const updateProfile = (formData) => {
  return api.patch("/profile", formData);
};

export const deleteInjury = (injuryId) => {
  return api.delete(`/profile/injuries/${injuryId}`);
};

export const addInjury = (data) => {
  return api.post("/profile/injuries", data);
};
