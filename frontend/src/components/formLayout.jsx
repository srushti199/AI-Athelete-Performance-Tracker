const FormLayout = ({ title, subtitle, children }) => {
  return (
    <div className='w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.10)]'>
      <section className='px-8 py-9 sm:px-9'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-[26px] font-bold tracking-tight text-[#17233f]'>{title}</h1>

          {subtitle && <p className='mt-2 text-sm leading-6 text-slate-500'>{subtitle}</p>}
        </div>

        {children}
      </section>
    </div>
  );
};

export default FormLayout;
