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
