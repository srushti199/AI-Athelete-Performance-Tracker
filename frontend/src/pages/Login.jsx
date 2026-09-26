import { X } from "lucide-react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { validateLogin } from "../utils/validateLogin";
import useForm from "../hooks/useForm";
import { loginUser } from "../api/authApi";

function Login({ onClose, onSwitchToSignup }) {
  const { formData, errors, handleChange, setErrors } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await loginUser(formData);
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
    <div className='relative w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fbfaf8] shadow-2xl shadow-[#17233f]/25'>
      <button
        type='button'
        onClick={onClose}
        className='absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#17233f]'
        aria-label='Close login form'
      >
        <X size={20} />
      </button>

      <div className='grid md:grid-cols'>
        <section className='bg-[#fbfaf8] p-8 sm:p-10'>
          <h2 className='text-3xl font-bold tracking-tight text-[#17233f]'>Welcome back</h2>

          <p className='mt-2 text-sm text-slate-500'>Sign in to continue your athlete journey.</p>

          <form onSubmit={handleSubmit} className='mt-5'>
            <div>
              <InputField
                label='Email'
                name='email'
                value={formData.email}
                type='email'
                placeholder='email@example.com'
                onChange={handleChange}
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
                onChange={handleChange}
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
