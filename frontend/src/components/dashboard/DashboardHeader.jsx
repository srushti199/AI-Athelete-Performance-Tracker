import { Bell, ChevronDown } from "lucide-react";

export default function DashboardHeader({ name = "" }) {
  const displayName = name.trim() || "Athlete";

  return (
    <header className='flex min-h-[76px] items-center justify-between border-b border-blue-100 bg-white px-5 sm:px-8'>
      <div>
        <h1 className='text-xl font-bold text-slate-900 sm:text-2xl'>Hello, {displayName}</h1>
      </div>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          aria-label='Notifications'
          className='rounded-full p-2 text-slate-600 hover:bg-blue-50'
        >
          <Bell size={20} />
        </button>

        <button type='button' className='flex items-center gap-2 rounded-xl p-2 hover:bg-slate-50'>
          <span className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800'>
            {displayName.charAt(0).toUpperCase()}
          </span>
          <span className='hidden text-sm font-medium text-slate-800 sm:block'>{displayName}</span>
          <ChevronDown size={16} className='text-slate-500' />
        </button>
      </div>
    </header>
  );
}
