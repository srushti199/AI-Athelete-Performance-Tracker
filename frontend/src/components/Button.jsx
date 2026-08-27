function Button({ type, children, handleClick, className = "" }) {
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`w-full rounded-md py-2 mt-6 text-sm font-medium outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
