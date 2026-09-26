export const validateOnboarding1 = (formData) => {
  const newErrors = {};
  if (!formData.age) {
    newErrors.age = "Age is required";
  }
  if (!formData.gender) {
    newErrors.gender = "Gender is required";
  }
  if (!formData.height) {
    newErrors.height = "Height is required";
  }
  if (!formData.weight) {
    newErrors.weight = "Weight is required";
  }

  return newErrors;
};

export const validateOnboarding2 = (formData) => {
  const newErrors = {};

  if (!formData.sport) {
    newErrors.sport = "Please select your sport";
  }

  if (!formData.activityLevel) {
    newErrors.activityLevel = "Please select your activity level";
  }

  if (!formData.competitionLevel) {
    newErrors.competitionLevel = "Please select your competition level";
  }

  return newErrors;
};
