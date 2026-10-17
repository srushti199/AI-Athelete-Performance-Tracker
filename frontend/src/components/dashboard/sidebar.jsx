import {
  Activity,
  Home,
  Dumbbell,
  Sparkles,
  ChartNoAxesColumn,
  UserRound,
  Mountain,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../api/authApi";

const navigation = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Workout Plan", icon: Dumbbell, path: "/workout-plan" },
  { label: "Recommendations", icon: Sparkles, path: "/recommendations" },
  { label: "Progress", icon: ChartNoAxesColumn, path: "/progress" },
  { label: "Profile", icon: UserRound, path: "/profile" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setLogoutError("");

      await logoutUser();

      // Navigate through React Router without a full-page reload.
      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(error.response?.data?.message || "Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className='flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#17233f] px-5 py-6'>
      <NavLink to='/dashboard' className='mb-10 flex items-center gap-3 px-2'>
        <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white'>
          <Activity size={22} />
        </span>

        <span className='text-xl font-bold tracking-tight text-white'>AthliX</span>
      </NavLink>

      <nav className='space-y-2'>
        {navigation.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm transition ${
                isActive
                  ? "bg-white font-semibold text-[#17233f] shadow-sm"
                  : "text-white hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={21} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className='mt-auto rounded-2xl border border-white/20 bg-white/10 p-4'>
        <Mountain className='mb-3 text-white' size={24} />

        <p className='text-sm font-medium leading-6 text-white'>
          Small steps
          <br />
          build big results.
        </p>

        <div className='mt-4 h-1 w-10 rounded-full bg-white' />
      </div>

      {logoutError && (
        <p role='alert' className='mt-3 text-sm text-red-300'>
          {logoutError}
        </p>
      )}

      <button
        type='button'
        onClick={handleLogout}
        disabled={loggingOut}
        className='mt-4 flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-white transition hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60'
      >
        <LogOut size={21} />
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </aside>
  );
}
