import { X } from "lucide-react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { validateSignup } from "../utils/validateSignup";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";

function Signup({ onClose, onSignupSuccess }) {
  const navigate = useNavigate();
  const { formData, errors, handleChange, setErrors } = useForm({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateSignup(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await signupUser(formData);

        console.log("Account created!", formData);
        onSignupSuccess();
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
    <div className='relative w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fbfaf8] shadow-2xl shadow-[#17233f]/25'>
      <button
        type='button'
        onClick={onClose}
        className='absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#17233f]'
        aria-label='Close signup form'
      >
        <X size={20} />
      </button>

      <div className='grid md:grid-cols'>
        <section className='bg-[#fbfaf8] p-8 sm:p-10'>
          <h2 className='text-3xl font-bold tracking-tight text-[#17233f]'>Create your account</h2>

          <p className='mt-2 text-sm text-slate-500'>
            Start building your personalized athlete plan.
          </p>

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
