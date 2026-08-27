function InputField({ label, name, value, type, placeholder, onChange, error, id, autoComplete }) {
  return (
    <div className='flex flex-col'>
      <label className='text-sm text-gray-900 font-medium' htmlFor={id}>
        {label}
      </label>
      <input
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        id={id}
        autoComplete={autoComplete}
        className='w-full border border-gray-200 rounded-md px-2 py-2 mt-2 text-sm text-gray-700'
      ></input>
      {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
    </div>
  );
}

export default InputField;
