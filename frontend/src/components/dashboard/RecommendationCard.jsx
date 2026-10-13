import { ArrowUpRight, Dumbbell } from "lucide-react";

export default function RecommendationCard({ exercise }) {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-3 transition hover:border-blue-300'>
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700'>
        <Dumbbell size={22} />
      </div>

      <div className='min-w-0 flex-1'>
        <h3 className='truncate text-sm font-semibold capitalize text-slate-900'>
          {exercise.name}
        </h3>

        <p className='mt-1 text-xs capitalize text-slate-500'>
          {exercise.equipment} · {exercise.difficulty}
        </p>

        <span className='mt-2 inline-block rounded-full bg-blue-50 px-2 py-1 text-xs capitalize text-blue-700'>
          {exercise.category}
        </span>
      </div>

      <ArrowUpRight size={18} className='shrink-0 text-slate-400' />
    </div>
  );
}
