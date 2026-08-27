import {
  Activity,
  ArrowRight,
  Menu,
  Play,
  Sparkles,
  ChartNoAxesColumn,
  Target,
  HeartPulse,
  Check,
  X,
} from "lucide-react";

import { useState } from "react";
import FeatureCard from "../components/FeatureCard";
import Signup from "./Signup";
import Login from "./Login";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <main className='min-h-screen bg-[#fbfaf8] text-[#17233f]'>
      <header className='border-b border-slate-200/80 bg-[#fbfaf8]'>
        <nav className='mx-auto flex h-20 max-w-6xl items-center justify-between px-5'>
          <a href='#home' className='flex items-center gap-2.5'>
            <span className='grid h-10 w-10 place-items-center rounded-xl bg-[#e4edff] text-[#31579f]'>
              <Activity size={21} strokeWidth={2.5} />
            </span>
            <span className='text-xl font-bold tracking-tight'>Athlix</span>
          </a>

          <div className='hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex'>
            <a href='#platform' className='hover:text-[#31579f]'>
              Platform
            </a>
            <a href='#how-it-works' className='hover:text-[#31579f]'>
              How it works
            </a>
            <a href='#how-it-works' className='hover:text-[#31579f]'>
              For athletes
            </a>
          </div>

          <div className='hidden items-center gap-5 md:flex'>
            <a href='#demo' className='text-sm font-semibold text-slate-600 hover:text-[#31579f]'>
              Watch demo
            </a>
            <button
              type='button'
              onClick={() => setIsLoginOpen(true)}
              className='text-sm font-semibold text-slate-600 transition hover:text-[#31579f]'
            >
              Log in
            </button>
            <button
              type='button'
              onClick={() => setIsSignupOpen(true)}
              className='inline-flex items-center gap-2 rounded-full bg-[#17233f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#263657]'
            >
              Start training <ArrowRight size={16} />
            </button>
          </div>

          <button
            type='button'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='text-[#17233f] md:hidden'
            aria-label='Toggle navigation menu'
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </nav>
        {isMenuOpen && (
          <div className='border-t border-slate-200 bg-[#fbfaf8] px-5 py-5 md:hidden'>
            <div className='mx-auto flex max-w-6xl flex-col gap-4 text-sm font-semibold text-slate-700'>
              <a href='#platform' onClick={() => setIsMenuOpen(false)}>
                Platform
              </a>

              <a href='#how-it-works' onClick={() => setIsMenuOpen(false)}>
                How it works
              </a>

              <a href='#how-it-works' onClick={() => setIsMenuOpen(false)}>
                For athletes
              </a>

              <a
                href='/signup'
                onClick={() => setIsMenuOpen(false)}
                className='mt-2 w-fit rounded-full bg-[#17233f] px-5 py-3 text-white'
              >
                Start training
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero section */}
      {/*Left side*/}
      <section
        id='home'
        className='mx-auto grid max-w-6xl gap-14 px-5 py-16 lg:grid-cols-2 lg:items-center lg:py-24'
      >
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
              Explore the platform <ArrowRight size={17} />
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

        {/*Right section*/}
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

      {/*Platform*/}
      <section id='platform' className='border-t border-slate-200 bg-white'>
        <div className='mx-auto max-w-6xl px-5 py-20'>
          <div className='max-w-2xl'>
            <p className='text-xs font-bold tracking-[0.16em] text-[#31579f]'>
              ONE CONNECTED PLATFORM
            </p>

            <h2 className='mt-4 text-3xl font-bold tracking-tight sm:text-4xl'>
              Everything an athlete needs to improve.
            </h2>

            <p className='mt-4 text-base leading-7 text-slate-600'>
              Athlix connects training, nutrition, recovery, and goals, so you can focus on becoming
              a better athlete.
            </p>
          </div>

          <div className='mt-12 grid gap-5 md:grid-cols-3'>
            <FeatureCard
              icon={ChartNoAxesColumn}
              title='Personalized training'
              description='AI workout plans that adapt to your sport, goals, progress, and injury history.'
            />

            <FeatureCard
              icon={Target}
              title='Focused goals'
              description='Set performance goals, track progress, and stay motivated with clear milestones.'
            />

            <FeatureCard
              icon={HeartPulse}
              title='Smarter recovery'
              description='Track injuries and recovery so your training plan supports your body.'
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id='how-it-works' className='bg-[#f8f7f5]'>
        <div className='mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center'>
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
              Start your athlete profile <ArrowRight size={16} />
            </a>
          </div>

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
      <section id='start' className='bg-[#17233f]'>
        <div className='mx-auto max-w-6xl px-5 py-20'>
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
              Start your journey <ArrowRight size={17} />
            </button>
          </div>

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
      {isSignupOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#17233f]/30 p-4 backdrop-blur-sm'>
          <Signup onClose={() => setIsSignupOpen(false)} />
        </div>
      )}
      {isLoginOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#17233f]/30 p-4 backdrop-blur-sm'>
          <Login
            onClose={() => setIsLoginOpen(false)}
            onSwitchToSignup={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
          />
        </div>
      )}
    </main>
  );
}

export default LandingPage;
