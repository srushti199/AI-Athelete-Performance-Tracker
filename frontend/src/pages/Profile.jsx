import { useState } from "react";
import {
  Activity,
  Dumbbell,
  Sparkles,
  ChartNoAxesColumn,
  UserRound,
  Mountain,
  Pencil,
  CalendarDays,
  Mail,
  VenusAndMars,
  Ruler,
  Weight,
  Target,
  Trophy,
  Flame,
  Clock3,
  Star,
  CircleCheck,
  Settings,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

const initialProfile = {
  fullName: "Athlete",
  email: "athlete@example.com",
  gender: "Not added",
  dateOfBirth: "",
  height: "",
  weight: "",
  fitnessLevel: "Beginner",
  primaryGoal: "Build muscle",
  sport: "General Fitness",
  equipment: "Body weight",
  workoutType: "Strength",
  difficulty: "Beginner",
  targetArea: "Full body",
  sessionDuration: "30–45 min",
};

function SectionTitle({ icon: Icon, title, action }) {
  return (
    <div className='mb-4 flex items-center justify-between gap-3'>
      <div className='flex items-center gap-3'>
        <span className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700'>
          <Icon size={20} />
        </span>
        <h2 className='font-bold text-[#193663]'>{title}</h2>
      </div>

      {action}
    </div>
  );
}

function EditButton({ onClick, label = "Edit" }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50'
    >
      <Pencil size={13} />
      {label}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value, onAdd }) {
  return (
    <div className='grid grid-cols-[30px_minmax(95px,0.8fr)_minmax(0,1fr)_auto] items-center gap-2 py-2'>
      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[#315D9E]'>
        <Icon size={16} />
      </span>

      <span className='text-xs text-slate-500 sm:text-sm'>{label}</span>

      <span className='break-words text-xs font-medium text-slate-700 sm:text-sm'>
        {value || "Not added"}
      </span>

      {onAdd && (
        <button
          type='button'
          onClick={onAdd}
          className='rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-700 hover:bg-blue-50'
        >
          Add
        </button>
      )}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, helper }) {
  return (
    <div className='rounded-xl bg-[#F1F6FD] p-3 sm:p-4'>
      <Icon size={22} className='mb-2 text-blue-700' />
      <p className='text-xs text-slate-500'>{label}</p>
      <p className='mt-1 text-xl font-bold text-[#193663]'>{value}</p>
      <p className='mt-1 text-[11px] text-slate-500'>{helper}</p>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialProfile);

  const updateDraft = (field, value) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  };

  const startEditing = () => {
    setDraft(profile);
    setEditing(true);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(draft);
    setEditing(false);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setEditing(false);
  };

  const goals = ["Improve endurance", "Increase strength"];

  return (
    <DashboardLayout name={profile.fullName}>
      <div className='space-y-5'>
        {/* Page heading */}
        <section>
          <h1 className='text-2xl font-bold text-[#193663]'>Profile</h1>
          <p className='mt-1 text-sm text-slate-500'>
            Manage your information, track your journey, and stay on top of your goals.
          </p>
        </section>

        {/* Profile banner */}
        <section className='relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#E7F0FF] via-[#F2F7FF] to-[#DCEBFF] p-6 sm:p-7'>
          <div className='relative z-10 flex flex-wrap items-center gap-5'>
            <div className='relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white bg-blue-100 text-5xl font-semibold text-[#193663]'>
              {profile.fullName.charAt(0).toUpperCase() || "A"}
              <button
                type='button'
                onClick={startEditing}
                aria-label='Edit profile'
                className='absolute bottom-0 right-0 rounded-full bg-[#193663] p-2 text-white hover:bg-blue-800'
              >
                <Pencil size={13} />
              </button>
            </div>

            <div className='min-w-0'>
              <h2 className='text-2xl font-bold text-[#193663]'>{profile.fullName || "Athlete"}</h2>
              <p className='mt-1 break-all text-sm text-blue-700'>{profile.email}</p>

              <div className='mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 sm:text-sm'>
                <span className='inline-flex items-center gap-2'>
                  <UserRound size={16} />
                  {profile.gender}
                </span>
                <span className='inline-flex items-center gap-2'>
                  <CalendarDays size={16} />
                  AthliX Athlete
                </span>
              </div>

              <button
                type='button'
                onClick={startEditing}
                className='mt-4 inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-white'
              >
                <Pencil size={15} /> Edit Profile
              </button>
            </div>

            <div className='ml-auto hidden max-w-xs pr-2 lg:block'>
              <p className='text-sm leading-6 text-blue-800'>
                “Discipline today builds the strength you'll thank yourself for tomorrow.”
              </p>
              <div className='mt-3 h-0.5 w-10 rounded-full bg-blue-400' />
            </div>

            <Mountain
              size={125}
              strokeWidth={0.8}
              className='pointer-events-none absolute -bottom-9 right-5 hidden text-blue-300/60 lg:block'
            />
          </div>
        </section>

        {/* Profile editor */}
        {editing && (
          <section className='rounded-2xl border border-blue-200 bg-white p-5 shadow-sm'>
            <h2 className='mb-4 text-lg font-bold text-[#193663]'>Edit personal information</h2>

            <form onSubmit={saveProfile} className='grid gap-4 sm:grid-cols-2'>
              {[
                ["fullName", "Full name", "text"],
                ["email", "Email address", "email"],
                ["gender", "Gender", "text"],
                ["dateOfBirth", "Date of birth", "date"],
                ["height", "Height (cm)", "number"],
                ["weight", "Weight (kg)", "number"],
                ["fitnessLevel", "Fitness level", "text"],
                ["primaryGoal", "Primary goal", "text"],
                ["sport", "Sport", "text"],
              ].map(([field, label, type]) => (
                <label key={field} className='block'>
                  <span className='mb-1.5 block text-sm font-medium text-slate-700'>{label}</span>
                  <input
                    type={type}
                    value={draft[field]}
                    onChange={(event) => updateDraft(field, event.target.value)}
                    className='w-full rounded-xl border border-blue-100 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                  />
                </label>
              ))}

              <div className='flex flex-wrap gap-3 sm:col-span-2'>
                <button
                  type='submit'
                  className='rounded-full bg-[#244C91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
                >
                  Save changes
                </button>
                <button
                  type='button'
                  onClick={cancelEditing}
                  className='rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50'
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Main columns */}
        <section className='grid items-start gap-5 xl:grid-cols-12'>
          {/* Personal information */}
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm xl:col-span-4'>
            <SectionTitle
              icon={UserRound}
              title='Personal Information'
              action={<EditButton onClick={startEditing} />}
            />

            <div className='divide-y divide-blue-50'>
              <InfoRow icon={UserRound} label='Full Name' value={profile.fullName} />
              <InfoRow icon={Mail} label='Email' value={profile.email} />
              <InfoRow icon={VenusAndMars} label='Gender' value={profile.gender} />
              <InfoRow
                icon={CalendarDays}
                label='Date of Birth'
                value={profile.dateOfBirth}
                onAdd={!profile.dateOfBirth ? startEditing : undefined}
              />
              <InfoRow
                icon={Ruler}
                label='Height'
                value={profile.height ? `${profile.height} cm` : ""}
                onAdd={!profile.height ? startEditing : undefined}
              />
              <InfoRow
                icon={Weight}
                label='Weight'
                value={profile.weight ? `${profile.weight} kg` : ""}
                onAdd={!profile.weight ? startEditing : undefined}
              />
              <InfoRow icon={Activity} label='Fitness Level' value={profile.fitnessLevel} />
              <InfoRow icon={Target} label='Primary Goal' value={profile.primaryGoal} />
              <InfoRow icon={Dumbbell} label='Sport' value={profile.sport} />
            </div>
          </div>

          {/* Goals and activity */}
          <div className='space-y-5 xl:col-span-4'>
            <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
              <SectionTitle
                icon={Target}
                title='Your Goals'
                action={<EditButton onClick={startEditing} />}
              />

              <div className='flex items-center gap-3 rounded-xl bg-[#F0F6FF] p-4'>
                <span className='flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700'>
                  <Trophy size={22} />
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs text-slate-500'>Primary Goal</p>
                  <p className='mt-1 font-semibold text-[#193663]'>{profile.primaryGoal}</p>
                </div>
                <span className='rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700'>
                  Goal
                </span>
              </div>

              <h3 className='mb-3 mt-5 text-sm font-semibold text-[#193663]'>
                Suggested goal areas
              </h3>

              <div className='space-y-3'>
                {goals.map((goal) => (
                  <div key={goal} className='flex items-center gap-3'>
                    <CircleCheck size={21} className='text-blue-500' />
                    <span className='text-sm text-slate-600'>{goal}</span>
                  </div>
                ))}
              </div>

              <p className='mt-4 text-xs leading-5 text-slate-400'>
                These are suggestions, not saved goals. Edit your profile to update your primary
                goal.
              </p>
            </div>

            <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
              <SectionTitle
                icon={ChartNoAxesColumn}
                title='Your Activity'
                action={
                  <a
                    href='/progress'
                    className='text-xs font-semibold text-blue-700 hover:underline'
                  >
                    View Progress
                  </a>
                }
              />

              <div className='flex min-h-40 flex-col items-center justify-center rounded-xl bg-[#F8FAFE] px-4 py-6 text-center'>
                <div className='rounded-full bg-blue-100 p-4 text-blue-700'>
                  <CalendarDays size={30} />
                </div>
                <h3 className='mt-3 font-semibold text-[#193663]'>No activity yet</h3>
                <p className='mt-1 text-xs leading-5 text-slate-500'>
                  Start your first workout to see your progress here.
                </p>
              </div>
            </div>
          </div>

          {/* Stats and recent activity */}
          <div className='space-y-5 xl:col-span-4'>
            <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
              <SectionTitle icon={ChartNoAxesColumn} title='Quick Stats' />

              <div className='grid grid-cols-2 gap-3'>
                <StatTile
                  icon={Dumbbell}
                  label='Workouts Completed'
                  value='0'
                  helper='Start your first workout'
                />
                <StatTile icon={Flame} label='Calories Burned' value='—' helper='No data yet' />
                <StatTile
                  icon={Clock3}
                  label='Active Streak'
                  value='0 days'
                  helper='Build your habit'
                />
                <StatTile
                  icon={Star}
                  label='Overall Progress'
                  value='—'
                  helper='Track your workouts'
                />
              </div>
            </div>

            <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
              <SectionTitle icon={Clock3} title='Recent Activity' />

              <div className='flex items-start gap-3 border-t border-blue-50 py-4'>
                <span className='rounded-full bg-blue-50 p-2 text-blue-700'>
                  <CircleCheck size={18} />
                </span>
                <div>
                  <p className='text-sm font-medium text-slate-700'>Profile page ready</p>
                  <p className='mt-1 text-xs text-slate-500'>
                    Your fitness details can be added here.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 border-t border-blue-50 py-4'>
                <span className='rounded-full bg-blue-50 p-2 text-blue-700'>
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className='text-sm font-medium text-slate-700'>Recommendations</p>
                  <p className='mt-1 text-xs text-slate-500'>
                    Personalize your workout preferences to get started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workout preferences */}
        <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
          <SectionTitle
            icon={Settings}
            title='Your Workout Preferences'
            action={<EditButton onClick={startEditing} />}
          />

          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
            {[
              { label: "Equipment", value: profile.equipment, icon: CalendarDays },
              { label: "Workout Type", value: profile.workoutType, icon: Dumbbell },
              { label: "Difficulty", value: profile.difficulty, icon: Settings },
              { label: "Target Area", value: profile.targetArea, icon: Target },
              { label: "Session Duration", value: profile.sessionDuration, icon: Clock3 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className='flex items-center gap-3 rounded-xl bg-[#F1F6FD] p-4'>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700'>
                  <Icon size={19} />
                </span>
                <div className='min-w-0'>
                  <p className='text-xs text-slate-500'>{label}</p>
                  <p className='mt-1 break-words text-sm font-medium text-[#315D9E]'>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Motivational tip */}
        <section className='flex items-start gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5'>
          <span className='rounded-full bg-white p-3 text-blue-700'>
            <Lightbulb size={22} />
          </span>
          <div>
            <h2 className='font-bold text-[#193663]'>Keep moving forward</h2>
            <p className='mt-1 text-sm leading-6 text-slate-600'>
              Progress takes time. Build consistency, follow your plan, and celebrate the small
              wins.
            </p>
            <a
              href='/recommendations'
              className='mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline'
            >
              Explore recommendations <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
