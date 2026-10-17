import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Dumbbell,
  Flame,
  Target,
  Clock,
  Sparkles,
  Utensils,
  UserRound,
  ChartNoAxesColumn,
  Zap,
  Lightbulb,
} from "lucide-react";

import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import { getDashboardData } from "../api/dashboardApi";

const quickActions = [
  {
    title: "View Workout Plans",
    description: "Explore training plans",
    icon: Dumbbell,
    href: "/workout-plan",
  },
  {
    title: "Browse Exercises",
    description: "Discover exercises",
    icon: Sparkles,
    href: "/recommendations",
  },
  {
    title: "Update Profile",
    description: "Edit your fitness goals",
    icon: UserRound,
    href: "/profile",
  },
];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data again without reloading the entire website.
  const fetchDashboard = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const result = await getDashboardData();
      setDashboard(result.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data. Please try again.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Initial data fetch.
  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        const result = await getDashboardData();

        if (!ignore) {
          setDashboard(result.data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message || "Unable to load dashboard data. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const athlete = dashboard?.athlete;
  const stats = dashboard?.stats;

  const athleteName = athlete
    ? [athlete.firstName, athlete.lastName].filter(Boolean).join(" ")
    : "";

  const profileCompleted = athlete?.profileExists ?? false;
  const recommendations = [];

  const workoutCount = stats?.totalWorkouts ?? 0;
  const completedCount = stats?.completedExercises ?? 0;
  const completionRate = stats?.completionRate ?? 0;

  return (
    <DashboardLayout name={athleteName}>
      <div className='space-y-6'>
        {error && (
          <div
            role='alert'
            className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'
          >
            <span>{error}</span>
            <button
              type='button'
              onClick={() => fetchDashboard(true)}
              disabled={loading}
              className='font-semibold underline disabled:opacity-50'
            >
              {loading ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        {loading && (
          <p className='text-sm text-slate-500' role='status'>
            Loading your dashboard...
          </p>
        )}

        <section className='mb-2'>
          <p className='text-sm leading-6 text-slate-500'>
            {athleteName
              ? `Welcome back, ${athleteName}! Let's build your fitness journey.`
              : "Let's build your fitness journey. Get a plan tailored to your goals and training preferences."}
          </p>
        </section>

        <section className='grid gap-5 xl:grid-cols-[1.7fr_0.9fr]'>
          <div className='relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#EAF2FF] to-[#F5F8FF] p-6 sm:p-8'>
            <div className='relative z-10 max-w-lg'>
              <span className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700'>
                <Sparkles size={14} />
                AI POWERED ATHLETE PERFORMANCE
              </span>

              <h2 className='mt-4 text-2xl font-bold leading-tight text-[#193663] sm:text-3xl'>
                {profileCompleted ? "Ready to train smarter?" : "Tell us about your goals"}
              </h2>

              <p className='mt-3 max-w-md text-sm leading-6 text-slate-600'>
                {profileCompleted
                  ? "Discover workout recommendations personalized to your training preferences."
                  : "Complete your profile to get personalized workout recommendations."}
              </p>

              <Link
                to={profileCompleted ? "/recommendations" : "/profile"}
                className='mt-5 inline-flex items-center gap-3 rounded-full bg-[#244C91] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800'
              >
                {profileCompleted ? "Get workout recommendations" : "Complete Profile"}
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className='pointer-events-none absolute -bottom-10 -right-5 flex h-40 w-40 items-center justify-center rounded-full bg-blue-100/70 sm:right-8 sm:h-48 sm:w-48'>
              <Dumbbell size={82} strokeWidth={1.2} className='rotate-[-20deg] text-blue-400' />
            </div>
          </div>

          <div className='rounded-2xl border border-blue-100 bg-white p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-blue-50 p-2 text-blue-700'>
                <CalendarDays size={20} />
              </div>
              <h2 className='font-semibold text-slate-900'>Today's focus</h2>
            </div>

            <h3 className='mt-6 font-semibold text-slate-800'>
              {workoutCount > 0
                ? `${workoutCount} workout plan${workoutCount === 1 ? "" : "s"} available`
                : "No workout plan yet"}
            </h3>

            <p className='mt-2 text-sm leading-6 text-slate-500'>
              {workoutCount > 0
                ? `${completedCount} exercises completed so far. Keep building your consistency!`
                : "Set your preferences to discover suitable exercises and build your first workout."}
            </p>

            <Link
              to={workoutCount > 0 ? "/workout-plan" : "/recommendations"}
              className='mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100'
            >
              {workoutCount > 0 ? "View workout plans" : "Explore workouts"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatCard
            icon={Dumbbell}
            label='Workout plans'
            value={loading ? "—" : String(workoutCount)}
            helper='Your saved workout plans'
          />

          <StatCard
            icon={Flame}
            label='Exercises completed'
            value={loading ? "—" : String(completedCount)}
            helper={`${stats?.pendingExercises ?? 0} exercises remaining`}
          />

          <StatCard
            icon={Target}
            label='Completion rate'
            value={loading ? "—" : `${completionRate}%`}
            helper='Based on saved exercises'
          />

          <StatCard
            icon={Clock}
            label='Profile status'
            value={loading ? "—" : profileCompleted ? "Completed" : "Not set"}
            helper={
              profileCompleted ? "Your athlete profile exists" : "Complete your athlete profile"
            }
          />
        </section>

        <section className='grid gap-5 xl:grid-cols-2'>
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Sparkles className='text-blue-600' size={22} />
                <h2 className='font-bold text-slate-900'>Workout Recommendations</h2>
              </div>

              <Link
                to='/recommendations'
                className='text-xs font-semibold text-blue-700 hover:underline'
              >
                View all <ArrowRight className='ml-1 inline' size={14} />
              </Link>
            </div>

            {recommendations.length > 0 ? (
              <div className='mt-5 space-y-3'>
                {recommendations.slice(0, 3).map((exercise) => (
                  <RecommendationCard key={exercise.name} exercise={exercise} />
                ))}
              </div>
            ) : (
              <div className='mt-5 flex min-h-52 flex-col items-center justify-center rounded-xl bg-[#F8FAFE] px-5 py-8 text-center'>
                <div className='rounded-full bg-blue-100 p-4 text-blue-700'>
                  <Dumbbell size={28} />
                </div>

                <h3 className='mt-4 font-semibold text-slate-900'>
                  Your training journey starts here
                </h3>

                <p className='mt-2 max-w-sm text-sm leading-6 text-slate-500'>
                  Tell us your equipment, fitness level, target muscle, and workout preferences to
                  get AI-powered exercise recommendations.
                </p>

                <Link
                  to='/recommendations'
                  className='mt-4 inline-flex items-center gap-2 rounded-full bg-[#244C91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
                >
                  Get recommendations <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <Zap className='text-blue-600' size={22} />
              <h2 className='font-bold text-slate-900'>Quick Actions</h2>
            </div>

            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
              {quickActions.map(({ title, description, icon: Icon, href }) => (
                <Link
                  key={title}
                  to={href}
                  className='flex min-h-24 items-center gap-3 rounded-xl border border-blue-100 p-4 transition hover:border-blue-300 hover:bg-blue-50/50'
                >
                  <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700'>
                    <Icon size={21} />
                  </span>

                  <span>
                    <span className='block text-sm font-semibold text-slate-800'>{title}</span>
                    <span className='mt-1 block text-xs leading-5 text-slate-500'>
                      {description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className='grid gap-5 xl:grid-cols-2'>
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <ChartNoAxesColumn className='text-blue-600' size={22} />
              <div>
                <h2 className='font-bold text-slate-900'>Your Progress</h2>
                <p className='mt-1 text-xs text-slate-500'>Your saved exercise completion rate.</p>
              </div>
            </div>

            <div className='mt-6'>
              <div className='mb-2 flex justify-between text-sm'>
                <span className='text-slate-600'>Exercises completed</span>
                <span className='font-semibold text-[#244C91]'>
                  {loading ? "—" : `${completionRate}%`}
                </span>
              </div>

              <div
                className='h-3 overflow-hidden rounded-full bg-blue-50'
                role='progressbar'
                aria-label='Exercise completion rate'
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionRate}
              >
                <div
                  className='h-full rounded-full bg-[#244C91] transition-all duration-500'
                  style={{
                    width: `${Math.min(100, Math.max(0, completionRate))}%`,
                  }}
                />
              </div>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-3'>
              <div className='rounded-xl bg-[#F8FAFE] p-4'>
                <p className='text-xs text-slate-500'>Completed</p>
                <p className='mt-1 text-xl font-bold text-[#193663]'>
                  {loading ? "—" : completedCount}
                </p>
              </div>

              <div className='rounded-xl bg-[#F8FAFE] p-4'>
                <p className='text-xs text-slate-500'>Pending</p>
                <p className='mt-1 text-xl font-bold text-[#193663]'>
                  {loading ? "—" : (stats?.pendingExercises ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <Lightbulb className='text-blue-600' size={22} />
              <h2 className='font-bold text-slate-900'>Fitness Tip</h2>
            </div>

            <div className='mt-5 rounded-xl bg-gradient-to-r from-blue-50 to-[#F5F8FF] p-6'>
              <p className='text-lg font-semibold leading-8 text-[#244C91]'>
                "Consistency beats perfection. Small steps lead to lasting progress."
              </p>
              <p className='mt-3 text-sm text-slate-500'>
                Start at your own level and build healthy habits over time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
