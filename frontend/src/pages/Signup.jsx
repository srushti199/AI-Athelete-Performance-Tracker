import { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/inputField";
import { validateSignup } from "../utils/validations";
import axios from "axios";

function Signup() {
  // const navigate = useNavigate();
  //useState hook
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateSignup(formData);

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      let response = "";
      try {
        response = await axios.post("http://127.0.0.1:4000/api/auth/signup", formData);
        console.log("Account created!", formData);
      } catch (error) {
        console.error("Signup failed:", error);
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
      {/* Main Signup Card */}
      <div className='w-full max-w-4xl bg-white rounded-lg overflow-hidden flex'>
        {/* Left Section */}
        <div className='w-1/2 bg-[#081a33] text-white flex flex-col p-9 justify-between '>
          <h2 className='text-2xl font-bold tracking-wide'>AtheliX</h2>

          {/* main */}
          <div className='mb-2'>
            <h3 className='text-3xl font-bold leading-tight'>
              Join the next <br />
              generation of elite athletes.
            </h3>
            <p className='text-sm text-gray-300 mt-6'>
              Get personalized AI-driven insights to push your limits and reach your peak
              performance.
            </p>
            <p className='text-xs text-gray-300 mt-6'>Trusted by 10,000+ athletes</p>
          </div>
        </div>

        {/* Right Section */}
        <div className='w-1/2 bg-white p-9'>
          <h2 className='text-2xl font-bold text-gray-900'>Create an account</h2>
          <p className='text-xs text-gray-400 mt-1'>Start your 14 day trial today</p>

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
            <div className='flex gap-2 mt-3'>
              {/* First name */}
              <div>
                <InputField
                  label='First Name'
                  name='firstName'
                  id='firstName'
                  autoComplete='given-name'
                  value={formData.firstName}
                  placeholder='John'
                  onChange={handleChange}
                  error={errors.firstName}
                />
              </div>

              {/* Last name */}
              <div>
                <InputField
                  label='Last Name'
                  name='lastName'
                  id='lastName'
                  autoComplete='family-name'
                  value={formData.lastName}
                  placeholder='Doe'
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>
            </div>

            {/* Email */}
            <div className='mt-3'>
              <InputField
                label='Email'
                name='email'
                id='email'
                autoComplete='email'
                value={formData.email}
                type='email'
                placeholder='email@example.com'
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Password */}
            <div className='mt-3'>
              <InputField
                label='Password'
                name='password'
                id='password'
                autoComplete='new-password'
                value={formData.password}
                type='password'
                placeholder='Enter your password'
                onChange={handleChange}
                error={errors.password}
              />

              <p className='text-xs text-gray-400 mt-2'>
                Must be at least 8 characters with a number and symbol
              </p>
            </div>

            {/* create account button */}
            <Button type='submit' className='bg-blue-500 text-white'>
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
