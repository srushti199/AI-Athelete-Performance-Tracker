import { useState } from "react";
import { useNavigate } from "react-router-dom";

import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";

function Onboarding() {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  return (
    <>
      {step === 1 && <OnboardingStep1 onNext={() => setStep(2)} />}

      {step === 2 && <OnboardingStep2 onNext={() => setStep(3)} onBack={() => setStep(1)} />}

      {step === 3 && (
        <OnboardingStep3 onBack={() => setStep(2)} onComplete={() => navigate("/dashboard")} />
      )}
    </>
  );
}

export default Onboarding;
