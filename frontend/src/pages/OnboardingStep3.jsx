import { AlertCircle } from "lucide-react";
import { useState } from "react";

import InputField from "../components/InputField";
import Button from "../components/Button";
import { submitInjuries } from "../api/profileApi";
import { INJURY_OPTIONS } from "../constants/onBoarding";
import FormLayout from "../components/formLayout";

function OnboardingStep3({ onBack, onComplete }) {
  const [injury, setInjury] = useState({
    injuryName: "",
    bodyRegion: "",
    severity: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const onChange = (e) => {
    const { name, value } = e.target;

    setInjury({
      ...injury,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Submit Step 3
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!injury.injuryName) {
      newErrors.injuryName = "Enter injury name";
    }

    if (!injury.bodyRegion) {
      newErrors.bodyRegion = "Enter body region";
    }

    if (!injury.severity) {
      newErrors.severity = "Select severity";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      await submitInjuries({
        injury,
      });

      console.log("Onboarding completed");

      onComplete();
    } catch (error) {
      console.error("Step 3 failed:", error);

      if (error.response) {
        console.log("Backend error:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title='Injury history' subtitle='Add any previous or current injury'>
      <form onSubmit={handleSubmit} className='mt-6'>
        {/* Injury Name */}
        <InputField
          label='Injury'
          name='injuryName'
          type='text'
          onChange={onChange}
          value={injury.injuryName}
          placeholder='e.g. ACL tear'
          id='injuryName'
          error={errors.injuryName}
          icon={<AlertCircle />}
        />

        {/* Body Region */}
        <div className='mt-4'>
          <InputField
            label='Body Region'
            name='bodyRegion'
            type='text'
            onChange={onChange}
            value={injury.bodyRegion}
            placeholder='e.g. Knee'
            id='bodyRegion'
            error={errors.bodyRegion}
          />
        </div>

        {/* Severity */}
        <div className='mt-4'>
          <InputField
            label='Severity'
            name='severity'
            type='select'
            onChange={onChange}
            value={injury.severity}
            placeholder='Select severity'
            id='severity'
            error={errors.severity}
            options={INJURY_OPTIONS}
          />
        </div>

        {/* Buttons */}
        <div className='flex gap-4 mt-6'>
          <Button
            type='button'
            onClick={onBack}
            className='w-1/3 bg-slate-200 text-slate-700 hover:bg-slate-300 flex justify-center items-center'
          >
            Back
          </Button>

          <Button
            type='submit'
            disabled={loading}
            className='w-2/3 bg-[#31579f] text-white hover:bg-[#26477f] flex justify-center items-center'
          >
            {loading ? "Completing..." : "Complete"}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}

export default OnboardingStep3;
