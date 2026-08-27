function FeatureCard({ icon: Icon, title, description }) {
  return (
    <article className='rounded-3xl border border-slate-200 bg-[#f8f7f5] p-6 transition hover:-translate-y-1 hover:shadow-lg'>
      <span className='grid h-11 w-11 place-items-center rounded-xl bg-[#e4edff] text-[#31579f]'>
        <Icon size={22} />
      </span>

      <h3 className='mt-6 text-xl font-bold tracking-tight'>{title}</h3>

      <p className='mt-3 text-sm leading-6 text-slate-600'>{description}</p>
    </article>
  );
}

export default FeatureCard;
