const nameRegex = /^[A-Za-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

const validateSignup = (formData) => {
  const newErrors = {};

  if (!formData.firstName) {
    newErrors.firstName = "First name is required";
  } else if (!nameRegex.test(formData.firstName)) {
    newErrors.firstName = "First name can contain only letters";
  }

  if (!formData.lastName) {
    newErrors.lastName = "Last name is required";
  } else if (!nameRegex.test(formData.lastName)) {
    newErrors.lastName = "Last name can contain only letters";
  }

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (!passwordRegex.test(formData.password)) {
    newErrors.password = "Password must be at least 8 characters with a number and symbol";
  }

  return newErrors;
};

const validateLogin = (formData) => {
  const newErrors = {};

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter valid email";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (!passwordRegex.test(formData.password)) {
    newErrors.password = "Password must be at least 8 characters with a number and symbol";
  }

  return newErrors;
};
export { validateSignup, validateLogin };
