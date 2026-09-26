import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import AuthModal from "../components/authModel";
import HeroSection from "../components/HeroSection";
import LandingNavbar from "../components/LandingNavbar";
import PlatformSection from "../components/PlatformSection";
import HowItWorks from "../components/HowItWorks";
import LandingCTA from "../components/LandingCTA";
import Onboarding from "./Onboarding";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <main className='min-h-screen bg-[#fbfaf8] text-[#17233f]'>
      <LandingNavbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsLoginOpen={setIsLoginOpen}
        setIsSignupOpen={setIsSignupOpen}
        setIsOnboardingOpen={setIsOnboardingOpen}
      />

      <HeroSection />
      <PlatformSection />
      <HowItWorks />
      <LandingCTA setIsSignupOpen={setIsSignupOpen} />

      {isSignupOpen && (
        <AuthModal>
          <Signup
            onClose={() => setIsSignupOpen(false)}
            onSignupSuccess={() => {
              setIsSignupOpen(false);
              setIsOnboardingOpen(true);
            }}
          />
        </AuthModal>
      )}

      {isLoginOpen && (
        <AuthModal>
          <Login
            onClose={() => setIsLoginOpen(false)}
            onSwitchToSignup={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
          />
        </AuthModal>
      )}

      {/* Onboarding */}
      {isOnboardingOpen && (
        <AuthModal>
          <Onboarding onComplete={() => setIsOnboardingOpen(false)} />
        </AuthModal>
      )}
    </main>
  );
}

export default LandingPage;
