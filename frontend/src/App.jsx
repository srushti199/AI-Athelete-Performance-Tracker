import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/landingPage";
import Onboarding from "./pages/Onboarding";
import OnboardingStep1 from "./pages/OnboardingStep1";
import OnboardingStep2 from "./pages/OnboardingStep2";
import OnboardingStep3 from "./pages/OnboardingStep3";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/onboarding' element={<Onboarding />} />
          <Route path='/o1' element={<OnboardingStep1 />} />
          <Route path='/o2' element={<OnboardingStep2 />} />
          <Route path='/o3' element={<OnboardingStep3 />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
