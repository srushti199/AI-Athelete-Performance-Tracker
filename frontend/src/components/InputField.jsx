function InputField({
  label,
  name,
  value,
  type,
  placeholder,
  onChange,
  error,
  id,
  autoComplete,
  icon,
  options = [],
}) {
  return (
    <div className='flex flex-col'>
      <label className='text-sm text-gray-900 font-medium' htmlFor={id}>
        {label}
      </label>

      <div className='relative mt-2'>
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            id={id}
            className='w-full h-12 border border-slate-300 rounded-xl px-4 pr-12 text-sm text-gray-700 outline-none focus:border-blue-500 appearance-none'
          >
            <option value='' disabled>
              {placeholder}
            </option>

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            name={name}
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            id={id}
            autoComplete={autoComplete}
            className='w-full h-12 border border-slate-300 rounded-xl px-4 pr-12 text-sm text-gray-700 placeholder:text-slate-400 outline-none focus:border-blue-500'
          />
        )}

        {icon && (
          <div className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none'>
            {icon}
          </div>
        )}
      </div>

      {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
    </div>
  );
}

export default InputField;
