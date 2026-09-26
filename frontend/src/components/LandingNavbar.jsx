import { Activity, ArrowRight, Menu, X } from "lucide-react";

function LandingNavbar({
  isMenuOpen,
  setIsMenuOpen,
  setIsLoginOpen,
  setIsSignupOpen,
  setIsOnboardingOpen,
}) {
  return (
    <header className='border-b border-slate-200/80 bg-[#fbfaf8]'>
      <nav className='mx-auto flex h-20 max-w-6xl items-center justify-between px-5'>
        {/* Logo */}
        <a href='#home' className='flex items-center gap-2.5'>
          <span className='grid h-10 w-10 place-items-center rounded-xl bg-[#e4edff] text-[#31579f]'>
            <Activity size={21} strokeWidth={2.5} />
          </span>

          <span className='text-xl font-bold tracking-tight'>Athlix</span>
        </a>

        {/* Desktop Navigation */}
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

        {/* Desktop Actions */}
        <div className='hidden items-center gap-10 md:flex'>
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
            Start training
          </button>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Navigation */}
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
              href='/login'
              onClick={() => setIsMenuOpen(false)}
              className='mt-2 w-fit rounded-full bg-[#17233f] px-5 py-3 text-white'
            >
              Log in
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
  );
}

export default LandingNavbar;
