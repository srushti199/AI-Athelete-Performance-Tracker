import { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/inputField";
import { validateLogin } from "../utils/validations";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setError] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://127.0.0.1:4000/api/auth/login", formData);
        console.log("user logged in");
      } catch (error) {
        console.error("Login failed:", error);
        if (error.response) {
          console.log("Backend error:", error.response.data);
        } else {
          console.log("Something went wrong. Please try again.");
        }
      }
    }
  };
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-2'>
      {/* Main login card*/}
      <div className='w-full max-w-4xl flex overflow-hidden bg-white rounded-lg'>
        {/* Left */}
        <div className='w-1/2 bg-[#081a33] text-white flex flex-col p-9 justify-between'>
          <h2 className='text-2xl font-bold'>AthlitX</h2>

          {/* Main content */}

          <div className='mb-1'>
            <div className='mb-3'>
              <h3 className='text-3xl font-bold leading-tight mb-3'>
                Welcome back, <br /> athlete.
              </h3>
              <p className='text-sm text-gray-300'>
                Login to access your personalized training matrix and AI recommendation
              </p>
            </div>

            {/* Live Insight Card */}
            <div className='mt-1 w-full max-w-sm border border-gray-600 bg-[#122641] rounded-lg p-4'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='w-2 h-2 bg-green-400 rounded-full'></span>
                <span className='text-[9px] font-semibold text-gray-300'> LIVE INSIGHT </span>
              </div>
              <p className='text-[10px] text-gray-300 italic leading-relaxed'>
                " Train smarter with personalized AI recommendations based on your performance."
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className='w-1/2 flex flex-col p-9 justify-between'>
          <h2 className='text-2xl font-bold text-gray-900'>Welcome back</h2>
          <p className='text-xs text-gray-400 mt-1'>Enter your credentials to access dashboard</p>

          <Button type='button' className='border border-gray-200 text-gray-900'>
            Continue with Google
          </Button>

          <div className='flex items-center gap-3 mt-4'>
            <div className='flex-1 h-px bg-gray-200'></div>

            <span className='text-[9px] font-medium text-gray-400'>OR CONTINUE WITH EMAIL</span>

            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit}>
            <div className='mt-6'>
              <InputField
                label='email'
                name='email'
                value={formData.email}
                type='email'
                placeholder='Email'
                onChange={onChange}
                id='email'
                autoComplete='email'
                error={errors.email}
              />
            </div>
            <div className='mt-6'>
              <InputField
                label='password'
                name='password'
                value={formData.password}
                type='password'
                placeholder='password'
                onChange={onChange}
                id='password'
                autoComplete='password'
                error={errors.password}
              />
            </div>

            <div className='flex flex-col justify-center items-center'>
              <Button type='submit' className='bg-blue-500 text-white'>
                Sign in
              </Button>
              <p className='text-xs text-gray-600 mt-2'>
                Don't have an account?{" "}
                <Link to='/signup' className='text-blue-500 font-medium hover:underline'>
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
