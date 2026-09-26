const AuthModal = ({ children }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#17233f]/30 p-4 backdrop-blur-sm'>
      {children}
    </div>
  );
};

export default AuthModal;
