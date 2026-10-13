export default function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700'>
          {Icon && <Icon size={22} />}
        </div>
        <p className='text-sm text-slate-600'>{label}</p>
      </div>

      <p className='mt-3 text-xl font-bold text-slate-900'>{value}</p>
      <p className='mt-2 text-xs leading-5 text-slate-500'>{helper}</p>
    </div>
  );
}
