import { Calendar, ChevronDown } from "lucide-react";

import InputField from "../components/InputField";
import Button from "../components/Button";
import { validateOnboarding1 } from "../utils/validateOnboarding";
import useForm from "../hooks/useForm";
import { createProfile } from "../api/profileApi";
import FormLayout from "../components/formLayout";

function OnboardingStep1({ onNext }) {
  const { formData, errors, handleChange, setErrors } = useForm({
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateOnboarding1(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await createProfile(formData);
        console.log("Onboarding step1 completed");
        onNext();
      } catch (error) {
        console.error("Onboarding failed:", error);

        if (error.response) {
          console.log("Backend error:", error.response.data);
        } else {
          console.log("Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <FormLayout title='Basic information'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Age + Gender */}
        <div className='space-y-5'>
          <InputField
            label='Age'
            name='age'
            type='number'
            onChange={handleChange}
            value={formData.age}
            placeholder='Enter your age'
            id='age'
            autoComplete='age'
            error={errors.age}
            icon={<Calendar />}
          />

          <InputField
            label='Gender'
            name='gender'
            type='select'
            onChange={handleChange}
            value={formData.gender}
            placeholder='Select Gender'
            id='gender'
            autoComplete='gender'
            error={errors.gender}
            icon={<ChevronDown />}
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
              { value: "OTHER", label: "Other" },
            ]}
          />
        </div>

        {/* Height + Weight */}
        <div className='grid grid-cols-2 gap-4'>
          <InputField
            label='Height (cm)'
            name='height'
            type='number'
            onChange={handleChange}
            value={formData.height}
            placeholder='e.g 170'
            id='height'
            error={errors.height}
            autoComplete='height'
          />

          <InputField
            label='Weight (kg)'
            name='weight'
            type='number'
            onChange={handleChange}
            value={formData.weight}
            placeholder='e.g 65'
            id='weight'
            error={errors.weight}
            autoComplete='weight'
          />
        </div>

        {/* Continue */}
        <Button
          type='submit'
          className='w-full bg-[#31579f] flex items-center justify-center text-white hover:bg-[#26477f]'
        >
          Continue
        </Button>
      </form>
    </FormLayout>
  );
}

export default OnboardingStep1;
