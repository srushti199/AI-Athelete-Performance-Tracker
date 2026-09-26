import { ArrowRight } from "lucide-react";

function LandingCTA({ setIsSignupOpen }) {
  return (
    <section id='start' className='bg-[#17233f]'>
      <div className='mx-auto max-w-6xl px-5 py-20'>
        {/* CTA */}
        <div className='flex flex-col gap-8 border-b border-white/15 pb-16 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-xs font-bold tracking-[0.16em] text-[#8eace2]'>
              YOUR GOALS. YOUR PROGRESS.
            </p>

            <h2 className='mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl'>
              Build the habits behind your best performance.
            </h2>
          </div>

          <button
            type='button'
            onClick={() => setIsSignupOpen(true)}
            className='inline-flex w-fit items-center gap-2 rounded-full bg-[#9bb8eb] px-6 py-3.5 text-sm font-bold text-[#17233f] transition hover:bg-white'
          >
            Start your journey
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Footer */}
        <footer className='flex flex-col gap-8 py-8 text-sm text-[#aab9d2] md:flex-row md:items-center md:justify-between'>
          <a href='#home' className='text-xl font-bold text-white'>
            Athlix
          </a>

          <div className='flex flex-wrap gap-x-6 gap-y-3'>
            <a href='#platform' className='hover:text-white'>
              Platform
            </a>

            <a href='#how-it-works' className='hover:text-white'>
              How it works
            </a>

            <a href='#demo' className='hover:text-white'>
              Demo
            </a>
          </div>

          <p>© 2026 Athlix. All rights reserved.</p>
        </footer>
      </div>
    </section>
  );
}

export default LandingCTA;
