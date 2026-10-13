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

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";

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
    title: "Track Nutrition",
    description: "Build better habits",
    icon: Utensils,
    href: "/nutrition",
  },
  {
    title: "Update Profile",
    description: "Edit your fitness goals",
    icon: UserRound,
    href: "/profile",
  },
];

export default function Dashboard() {
  // Replace with the logged-in athlete's actual profile later.
  const athleteName = "";
  const profileCompleted = false;

  // Connect this array to the recommendation API later.
  const recommendations = [];

  return (
    <DashboardLayout name={athleteName}>
      <div className='space-y-6'>
        {/* Welcome section */}
        <section className='mb-2'>
          <p className='text-sm leading-6 text-slate-500'>
            Let's build your fitness journey. Get a plan tailored to your goals and training
            preferences.
          </p>
        </section>

        {/* Hero and today's focus */}
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

              <a
                href={profileCompleted ? "/recommendations" : "/profile"}
                className='mt-5 inline-flex items-center gap-3 rounded-full bg-[#244C91] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800'
              >
                {profileCompleted ? "Get workout recommendations" : "Complete Profile"}
                <ArrowRight size={17} />
              </a>
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

            <h3 className='mt-6 font-semibold text-slate-800'>No workout plan yet</h3>
            <p className='mt-2 text-sm leading-6 text-slate-500'>
              Set your preferences to discover suitable exercises and build your first workout.
            </p>

            <a
              href='/recommendations'
              className='mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100'
            >
              Explore workouts <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* Summary cards */}
        <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatCard
            icon={Dumbbell}
            label='Workouts completed'
            value='0'
            helper='Start your first workout'
          />
          <StatCard
            icon={Flame}
            label='Nutrition plan'
            value='Not set'
            helper='Set your nutrition preferences'
          />
          <StatCard
            icon={Target}
            label='Fitness goals'
            value='Not set'
            helper='Choose your training goal'
          />
          <StatCard
            icon={Clock}
            label='Active streak'
            value='0 days'
            helper='Your journey starts today'
          />
        </section>

        {/* Recommendations and quick actions */}
        <section className='grid gap-5 xl:grid-cols-2'>
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Sparkles className='text-blue-600' size={22} />
                <h2 className='font-bold text-slate-900'>Workout Recommendations</h2>
              </div>

              <a
                href='/recommendations'
                className='text-xs font-semibold text-blue-700 hover:underline'
              >
                View all <ArrowRight className='ml-1 inline' size={14} />
              </a>
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

                <a
                  href='/recommendations'
                  className='mt-4 inline-flex items-center gap-2 rounded-full bg-[#244C91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
                >
                  Get recommendations <ArrowRight size={16} />
                </a>
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
                <a
                  key={title}
                  href={href}
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
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Progress and fitness tip */}
        <section className='grid gap-5 xl:grid-cols-2'>
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex items-center gap-3'>
              <ChartNoAxesColumn className='text-blue-600' size={22} />
              <div>
                <h2 className='font-bold text-slate-900'>Your Progress</h2>
                <p className='mt-1 text-xs text-slate-500'>
                  Complete workouts to start tracking your progress.
                </p>
              </div>
            </div>

            <div className='mt-6 flex h-24 items-end justify-around border-b border-blue-100 px-2'>
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div key={day} className='flex h-full flex-col justify-end'>
                  <div className='h-2 w-2 rounded-full bg-blue-200' />
                  <span className='mt-3 mb-2 text-xs text-slate-400'>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day]}
                  </span>
                </div>
              ))}
            </div>

            <p className='mt-4 text-center text-xs text-slate-500'>
              Your activity will appear here once you begin training.
            </p>
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
