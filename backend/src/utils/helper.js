export const calculateBMI = (weight, height) => {
  const heightInMeter = height / 100;
  return parseFloat(((weight / heightInMeter) * heightInMeter).toFixed(2));
};

export const calculateBMR = (weight, height, gender, age) => {
  if (gender.toLowerCase() === "male") {
    return parseFloat((66 + 13.7 * weight + 5 * height - 6.8 * age).toFixed(2));
  } else {
    return parseFloat((655 + 9.6 * weight + 1.8 * height - 4.7 * age).toFixed(2));
  }
};

export const calculateTDEE = (bmr, fitnessLevel) => {
  const factors = {
    Beginner: 1.2,
    Intermediate: 1.375,
    Advanced: 1.55,
    Professional: 1.725,
  };
  const factor = factors[fitnessLevel] || 1.375;
  return parseFloat((bmr * factor).toFixed(2));
};
