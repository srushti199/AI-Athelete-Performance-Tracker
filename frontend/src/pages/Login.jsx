import { useState } from "react";
import { X } from "lucide-react";
import Button from "../components/Button";
import InputField from "../components/inputField";
import { validateLogin } from "../utils/validations";
import axios from "axios";

function Login({ onClose, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const onChange = (e) => {
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

    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post("http://127.0.0.1:4000/api/auth/login", formData);

        console.log("User logged in");
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
    <div className='relative w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fbfaf8] shadow-2xl shadow-[#17233f]/25'>
      <button
        type='button'
        onClick={onClose}
        className='absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#17233f]'
        aria-label='Close login form'
      >
        <X size={20} />
      </button>

      <div className='grid md:grid-cols-2'>
        <section className='flex min-h-[560px] flex-col justify-between bg-[#17233f] p-8 text-white sm:p-10'>
          <h2 className='text-xl font-bold tracking-tight'>Athlix</h2>

          <div>
            <p className='text-xs font-bold tracking-[0.16em] text-[#8eace2]'>WELCOME BACK</p>

            <h3 className='mt-5 text-4xl font-bold leading-tight tracking-tight'>
              Ready for your
              <br />
              next best session?
            </h3>

            <p className='mt-6 max-w-sm text-sm leading-6 text-[#c5d2e8]'>
              Continue tracking your training, recovery, nutrition, and goals with personalized
              AI-powered guidance.
            </p>

            <div className='mt-8 rounded-2xl border border-white/10 bg-white/5 p-4'>
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-[#9bb8eb]' />
                <span className='text-[10px] font-bold tracking-[0.14em] text-[#8eace2]'>
                  ATHLIX INSIGHT
                </span>
              </div>

              <p className='mt-3 text-sm leading-6 text-[#dce7fa]'>
                Small, consistent actions create meaningful performance gains.
              </p>
            </div>
          </div>
        </section>

        <section className='bg-[#fbfaf8] p-8 sm:p-10'>
          <h2 className='text-3xl font-bold tracking-tight text-[#17233f]'>Welcome back</h2>

          <p className='mt-2 text-sm text-slate-500'>Sign in to continue your athlete journey.</p>

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
            <div>
              <InputField
                label='Email'
                name='email'
                value={formData.email}
                type='email'
                placeholder='email@example.com'
                onChange={onChange}
                id='email'
                autoComplete='email'
                error={errors.email}
              />
            </div>

            <div className='mt-4'>
              <InputField
                label='Password'
                name='password'
                value={formData.password}
                type='password'
                placeholder='Enter your password'
                onChange={onChange}
                id='password'
                autoComplete='current-password'
                error={errors.password}
              />
            </div>

            <Button
              type='submit'
              className='mt-6 w-full bg-[#31579f] text-white hover:bg-[#26477f]'
            >
              Sign in
            </Button>

            <p className='mt-4 text-center text-sm text-slate-600'>
              Don&apos;t have an account?{" "}
              <button
                type='button'
                onClick={onSwitchToSignup}
                className='font-semibold text-[#31579f] hover:underline'
              >
                Sign up for free
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
