import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/landingPage";

import Onboarding from "./pages/Onboarding";
import OnboardingStep1 from "./pages/OnboardingStep1";
import OnboardingStep2 from "./pages/OnboardingStep2";
import OnboardingStep3 from "./pages/OnboardingStep3";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";
import WorkoutPlan from "./pages/WorkoutPlan";
import Progress from "./pages/Progress";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages: accessible without login */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/onboarding' element={<Onboarding />} />
        <Route path='/o1' element={<OnboardingStep1 />} />
        <Route path='/o2' element={<OnboardingStep2 />} />
        <Route path='/o3' element={<OnboardingStep3 />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/recommendations' element={<Recommendations />} />
        <Route path='/workout-plan' element={<WorkoutPlan />} />
        <Route path='/progress' element={<Progress />} />\
      </Routes>
    </BrowserRouter>
  );
}

export default App;
