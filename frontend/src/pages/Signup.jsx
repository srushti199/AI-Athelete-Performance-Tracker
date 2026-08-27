import { useState } from "react";
import { X } from "lucide-react";
import Button from "../components/Button";
import InputField from "../components/inputField";
import { validateSignup } from "../utils/validations";
import axios from "axios";

function Signup({ onClose }) {
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
      try {
        await axios.post("http://127.0.0.1:4000/api/auth/signup", formData);

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
    <div className='relative w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fbfaf8] shadow-2xl shadow-[#17233f]/25'>
      <button
        type='button'
        onClick={onClose}
        className='absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#17233f]'
        aria-label='Close signup form'
      >
        <X size={20} />
      </button>

      <div className='grid md:grid-cols-2'>
        <section className='flex min-h-[560px] flex-col justify-between bg-[#17233f] p-8 text-white sm:p-10'>
          <h2 className='text-xl font-bold tracking-tight'>Athlix</h2>

          <div>
            <p className='text-xs font-bold tracking-[0.16em] text-[#8eace2]'>TRAIN WITH PURPOSE</p>

            <h3 className='mt-5 text-4xl font-bold leading-tight tracking-tight'>
              Your next best
              <br />
              session starts here.
            </h3>

            <p className='mt-6 max-w-sm text-sm leading-6 text-[#c5d2e8]'>
              Create your athlete profile and receive personalized training, nutrition, recovery,
              and performance guidance.
            </p>

            <p className='mt-8 text-xs font-semibold text-[#8eace2]'>
              BUILT FOR PROGRESS, ONE SESSION AT A TIME
            </p>
          </div>
        </section>

        <section className='bg-[#fbfaf8] p-8 sm:p-10'>
          <h2 className='text-3xl font-bold tracking-tight text-[#17233f]'>Create your account</h2>

          <p className='mt-2 text-sm text-slate-500'>
            Start building your personalized athlete plan.
          </p>

          <Button
            type='button'
            className='mt-7 border border-slate-300 bg-white text-[#17233f] hover:border-[#31579f]'
          >
            Continue with Google
          </Button>

          <div className='mt-5 flex items-center gap-3'>
            <div className='h-px flex-1 bg-slate-200' />

            <span className='text-[10px] font-bold tracking-wide text-slate-400'>
              OR CONTINUE WITH EMAIL
            </span>

            <div className='h-px flex-1 bg-slate-200' />
          </div>

          <form onSubmit={handleSubmit} className='mt-5'>
            <div className='flex gap-3'>
              <div className='flex-1'>
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

              <div className='flex-1'>
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

            <div className='mt-4'>
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

            <div className='mt-4'>
              <InputField
                label='Password'
                name='password'
                id='password'
                autoComplete='new-password'
                value={formData.password}
                type='password'
                placeholder='Create a secure password'
                onChange={handleChange}
                error={errors.password}
              />

              <p className='mt-2 text-xs leading-5 text-slate-500'>
                Use at least 8 characters, including a number and symbol.
              </p>
            </div>

            <Button type='submit' className='mt-6 bg-[#31579f] text-white hover:bg-[#26477f]'>
              Create account
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Signup;
