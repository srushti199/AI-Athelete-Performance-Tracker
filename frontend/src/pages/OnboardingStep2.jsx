import { Trophy, Dumbbell, Target } from "lucide-react";
import { useState } from "react";

import useForm from "../hooks/useForm";
import { validateOnboarding2 } from "../utils/validateOnboarding";

import InputField from "../components/InputField";
import FormLayout from "../components/formLayout";
import Button from "../components/Button";

import { updateOnboardingStep2 } from "../api/profileApi";

import { ACTIVITY_LEVEL_OPTIONS, COMPETITION_LEVEL_OPTIONS } from "../constants/onBoarding";

function OnboardingStep2({ onNext, onBack }) {
  const [loading, setLoading] = useState(false);

  const { formData, errors, handleChange, setErrors } = useForm({
    sport: "",
    activityLevel: "",
    competitionLevel: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateOnboarding2(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      await updateOnboardingStep2(formData);

      console.log("Step 2 completed");
      onNext();
    } catch (error) {
      console.error("Step 2 failed:", error);

      if (error.response) {
        console.log("Backend error:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title='Athletic profile' subtitle='Tell us about your sport and training'>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Sport */}
        <InputField
          label='Sport'
          name='sport'
          type='text'
          onChange={handleChange}
          value={formData.sport}
          placeholder='Select your sport'
          id='sport'
          error={errors.sport}
          icon={<Trophy />}
        />

        {/* Activity Level */}
        <InputField
          label='Activity Level'
          name='activityLevel'
          type='select'
          onChange={handleChange}
          value={formData.activityLevel}
          placeholder='Select activity level'
          id='activityLevel'
          error={errors.activityLevel}
          icon={<Dumbbell />}
          options={ACTIVITY_LEVEL_OPTIONS}
        />

        {/* Competition Level */}
        <InputField
          label='Competition Level'
          name='competitionLevel'
          type='select'
          onChange={handleChange}
          value={formData.competitionLevel}
          placeholder='Select competition level'
          id='competitionLevel'
          error={errors.competitionLevel}
          icon={<Target />}
          options={COMPETITION_LEVEL_OPTIONS}
        />

        {/* Buttons */}
        <div className='flex gap-4 pt-3'>
          <Button
            type='button'
            onClick={onBack}
            className='flex w-1/3 items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200'
          >
            Back
          </Button>

          <Button
            type='submit'
            disabled={loading}
            className='flex w-2/3 items-center justify-center bg-[#31579f] text-white hover:bg-[#26477f] disabled:cursor-not-allowed disabled:opacity-70'
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}

export default OnboardingStep2;
