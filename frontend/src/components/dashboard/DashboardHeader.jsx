import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, ChevronDown, LogOut } from "lucide-react";
import { logoutUser } from "../../api/authApi";

export default function DashboardHeader({ name = "" }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const displayName = name.trim() || "Athlete";

  useEffect(() => {
    const closeDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className='sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8'>
      <div>
        <h1 className='text-xl font-bold text-[#17233f]'>Welcome back, {displayName}!</h1>
        <p className='mt-1 text-xs text-slate-500'>Keep moving towards your goals.</p>
      </div>

      <div className='relative' ref={dropdownRef}>
        <button
          type='button'
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className='flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 transition hover:border-[#31579f] hover:bg-slate-50'
        >
          <span className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-[#31579f]'>
            {displayName.charAt(0).toUpperCase()}
          </span>

          <span className='hidden max-w-28 truncate text-sm font-medium text-[#17233f] sm:block'>
            {displayName}
          </span>

          <ChevronDown
            size={16}
            className={`text-slate-500 transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className='absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg'>
            <button
              type='button'
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className='flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#31579f]'
            >
              <UserRound size={17} />
              My Profile
            </button>

            <div className='border-t border-slate-100' />

            <button
              type='button'
              onClick={handleLogout}
              disabled={loading}
              className='flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60'
            >
              <LogOut size={17} />
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
