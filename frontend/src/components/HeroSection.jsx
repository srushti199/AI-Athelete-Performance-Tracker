import { ArrowRight, Play, Sparkles } from "lucide-react";

function HeroSection() {
  return (
    <section
      id='home'
      className='mx-auto grid max-w-6xl gap-14 px-5 py-16 lg:grid-cols-2 lg:items-center lg:py-24'
    >
      {/* Left side */}
      <div>
        <div className='inline-flex items-center gap-2 rounded-full border border-[#c9d8f7] bg-[#f2f6ff] px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-[#31579f]'>
          <Sparkles size={14} />
          AI POWERED ATHLETE PERFORMANCE
        </div>

        <h1 className='mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl'>
          Train smarter.
          <span className='block text-[#31579f]'>Perform stronger.</span>
        </h1>

        <p className='mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg'>
          Athlix brings your workouts, nutrition, recovery, goals, and performance data into one
          personalized AI-powered platform.
        </p>

        <div className='mt-8 flex flex-wrap items-center gap-4'>
          <a
            href='#start'
            className='inline-flex items-center gap-2 rounded-full bg-[#31579f] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 hover:bg-[#26477f]'
          >
            Explore the platform
            <ArrowRight size={17} />
          </a>

          <a
            href='#demo'
            className='inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#31579f]'
          >
            <span className='grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white'>
              <Play size={15} fill='currentColor' />
            </span>
            See Athlix in action
          </a>
        </div>
      </div>

      {/* Right side */}
      <div className='rounded-[2rem] border border-[#d7e2f5] bg-[#eaf1ff] p-3 shadow-2xl shadow-blue-900/10'>
        <div className='rounded-[1.5rem] bg-[#cbd9f1] p-5 sm:p-7'>
          <div className='flex items-center justify-between text-xs font-bold tracking-wider text-[#31579f]'>
            <span>TODAY'S FOCUS</span>

            <span className='rounded-full bg-white px-3 py-1.5 normal-case tracking-normal'>
              Ready to train
            </span>
          </div>

          <div className='mt-7 rounded-3xl bg-white p-6 shadow-sm'>
            <p className='text-sm font-medium text-slate-500'>Readiness score</p>

            <div className='mt-2 flex items-end gap-1'>
              <span className='text-5xl font-bold'>84</span>
              <span className='mb-2 text-lg font-semibold text-slate-400'>/100</span>
            </div>

            <div className='mt-7 h-2 overflow-hidden rounded-full bg-slate-200'>
              <div className='h-full w-[84%] rounded-full bg-[#31579f]' />
            </div>

            <div className='mt-2 flex justify-between text-xs font-medium text-slate-500'>
              <span>Recovery</span>
              <span className='text-[#31579f]'>Ready to train</span>
            </div>

            <div className='mt-7 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl bg-slate-50 p-4'>
                <p className='text-xs text-slate-500'>Weekly workouts</p>
                <p className='mt-2 text-xl font-bold'>4 of 5</p>
              </div>

              <div className='rounded-2xl bg-slate-50 p-4'>
                <p className='text-xs text-slate-500'>Goal progress</p>
                <p className='mt-2 text-xl font-bold'>76%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
