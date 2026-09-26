import { ArrowRight, Check } from "lucide-react";

function HowItWorks() {
  return (
    <section id='how-it-works' className='bg-[#f8f7f5]'>
      <div className='mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center'>
        {/* Left side */}
        <div>
          <p className='text-xs font-bold tracking-[0.16em] text-[#31579f]'>HOW IT WORKS</p>

          <h2 className='mt-4 max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl'>
            Less guesswork.
            <span className='block text-[#31579f]'>More progress.</span>
          </h2>

          <p className='mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg'>
            Athlix turns your information into practical guidance, helping you train consistently
            and make better decisions every day.
          </p>

          <a
            href='#start'
            className='mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-[#31579f] hover:border-[#31579f]'
          >
            Start your athlete profile
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Right side */}
        <div className='space-y-4'>
          <article className='flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:items-center'>
            <span className='text-2xl font-bold text-slate-300'>01</span>

            <div className='flex-1'>
              <h3 className='text-xl font-bold tracking-tight'>Build your athlete profile</h3>

              <p className='mt-2 text-sm leading-6 text-slate-600'>
                Add your sport, goals, body details, and injury history.
              </p>
            </div>

            <Check className='shrink-0 text-[#31579f]' size={20} />
          </article>

          <article className='flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:items-center'>
            <span className='text-2xl font-bold text-slate-300'>02</span>

            <div className='flex-1'>
              <h3 className='text-xl font-bold tracking-tight'>Get your AI plan</h3>

              <p className='mt-2 text-sm leading-6 text-slate-600'>
                Receive training, diet, and recovery recommendations tailored to you.
              </p>
            </div>

            <Check className='shrink-0 text-[#31579f]' size={20} />
          </article>

          <article className='flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:items-center'>
            <span className='text-2xl font-bold text-slate-300'>03</span>

            <div className='flex-1'>
              <h3 className='text-xl font-bold tracking-tight'>Track and improve</h3>

              <p className='mt-2 text-sm leading-6 text-slate-600'>
                Monitor progress, understand insights, and adjust your next move.
              </p>
            </div>

            <Check className='shrink-0 text-[#31579f]' size={20} />
          </article>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
