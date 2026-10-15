import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Mail,
  Mountain,
  Pencil,
  Settings2,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import { getProfile, updateProfile } from "../api/profileApi";

const emptyProfile = {
  fullName: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  height: "",
  weight: "",
  fitnessLevel: "",
  primaryGoal: "",
  sport: "",
  competitionLevel: "",
  equipment: "",
  workoutType: "",
  difficulty: "",
  targetArea: "",
  sessionDuration: "",
  category: "",
  workoutDescription: "",
  goals: [],
  injuries: [],
};

const choices = {
  gender: ["Female", "Male", "Other", "Prefer not to say"],
  fitnessLevel: ["Beginner", "Intermediate", "Advanced"],
  primaryGoal: [
    "Muscle gain",
    "Strength",
    "Weight loss",
    "Improve endurance",
    "Improve flexibility",
    "General fitness",
    "Sports performance",
  ],
  sport: [
    "General Fitness",
    "Cricket",
    "Football",
    "Basketball",
    "Badminton",
    "Running",
    "Swimming",
    "Athletics",
    "Other",
  ],
  competitionLevel: ["Recreational", "Amateur", "Competitive", "Professional"],
  equipment: [
    "Body weight",
    "Dumbbells",
    "Barbell",
    "Resistance bands",
    "Kettlebell",
    "Cable machine",
    "Full gym",
    "Other",
  ],
  workoutType: ["Strength", "Cardio", "Flexibility", "Mobility", "Plyometrics", "Sports-specific"],
  difficulty: ["Beginner", "Intermediate", "Advanced"],
  targetArea: [
    "Full body",
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
    "Glutes",
    "Cardiovascular endurance",
  ],
  category: [
    "Strength",
    "Cardio",
    "Stretching",
    "Plyometrics",
    "Powerlifting",
    "Strongman",
    "Olympic weightlifting",
    "Other",
  ],
  sessionDuration: ["15 minutes", "30 minutes", "45 minutes", "60 minutes", "90 minutes"],
};

const fields = [
  ["fullName", "Full name", "text"],
  ["email", "Email address", "email"],
  ["gender", "Gender"],
  ["dateOfBirth", "Date of birth", "date"],
  ["height", "Height (cm)", "number"],
  ["weight", "Weight (kg)", "number"],
  ["sport", "Sport"],
  ["fitnessLevel", "Activity / fitness level"],
  ["competitionLevel", "Competition level"],
  ["equipment", "Equipment available"],
  ["primaryGoal", "Workout goal / target"],
  ["targetArea", "Target body part"],
  ["workoutType", "Workout type"],
  ["difficulty", "Difficulty"],
  ["category", "Exercise category"],
  ["sessionDuration", "Session duration"],
];

function Section({ icon: Icon, title, subtitle, children, action }) {
  return (
    <section className='min-w-0 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-5 flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-start gap-3'>
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700'>
            <Icon size={20} />
          </span>
          <div>
            <h2 className='font-bold text-[#193663]'>{title}</h2>
            <p className='mt-1 text-sm leading-5 text-slate-500'>{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProfileInput({ field, label, value, onChange, type = "text", options }) {
  const className =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

  return (
    <label className='block min-w-0'>
      <span className='text-sm font-medium text-slate-700'>{label}</span>
      {options ? (
        <select
          name={field}
          value={value ?? ""}
          onChange={onChange}
          className={className}
          disabled={field === "email"}
        >
          <option value=''>Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={field}
          type={type}
          min={type === "number" ? "0" : undefined}
          step={type === "number" ? "any" : undefined}
          value={value ?? ""}
          onChange={onChange}
          readOnly={field === "email"}
          className={`${className} ${field === "email" ? "bg-slate-50 text-slate-500" : ""}`}
        />
      )}
    </label>
  );
}

function normalizeGender(value) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();
  if (normalized === "MALE") return "Male";
  if (normalized === "FEMALE") return "Female";
  if (normalized === "OTHER") return "Other";
  return value || "";
}

function profileFromResponse(response) {
  const data = response?.data?.data ?? response?.data ?? {};
  const user = data.user ?? {};
  const athlete = data.profile ?? data.athleteProfile ?? {};
  const preference = athlete.workoutPreference ?? {};
  const goals = Array.isArray(athlete.profileGoals)
    ? athlete.profileGoals.map((goal) => goal.goalKey).filter(Boolean)
    : [];

  return {
    ...emptyProfile,
    fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: user.email || "",
    gender: normalizeGender(athlete.gender),
    // dateOfBirth and category are not currently stored by the Prisma schema.
    dateOfBirth: athlete.dateOfBirth ? String(athlete.dateOfBirth).slice(0, 10) : "",
    height: athlete.heightCm ?? "",
    weight: athlete.weightKg ?? "",
    fitnessLevel: athlete.activityLevel || "",
    sport: athlete.sport || "",
    competitionLevel: athlete.competitionLevel || "",
    primaryGoal: goals[0] || "",
    goals,
    injuries: Array.isArray(athlete.injuries) ? athlete.injuries : [],
    equipment: preference.equipment?.[0]?.equipment || "",
    workoutType: preference.workoutTypes?.[0]?.workoutType || "",
    difficulty: preference.difficulty || "",
    targetArea: preference.targetAreas?.[0]?.targetArea || "",
    sessionDuration:
      preference.sessionDuration == null ? "" : `${preference.sessionDuration} minutes`,
    category: athlete.category || "",
    workoutDescription: preference.workoutDescription || "",
  };
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await getProfile();
        const actual = profileFromResponse(response);
        if (active) {
          setProfile(actual);
          setDraft(actual);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load your profile. Check that the backend is running and try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const startEditing = () => {
    setDraft({ ...profile });
    setError("");
    setSaveMessage("");
    setEditing(true);
  };

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
  };

  const cancelEditing = () => {
    setDraft({ ...profile });
    setError("");
    setSaveMessage("");
    setEditing(false);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaveMessage("");

    // dateOfBirth and category are excluded because the current backend schema
    // does not persist those fields. Email is read-only on this page.
    const durationMatch = String(draft.sessionDuration || "").match(/\d+/);
    const payload = {
      fullName: draft.fullName,
      gender: draft.gender,
      height: draft.height,
      weight: draft.weight,
      fitnessLevel: draft.fitnessLevel,
      sport: draft.sport,
      competitionLevel: draft.competitionLevel,
      goals: draft.primaryGoal ? [draft.primaryGoal] : [],
      equipment: draft.equipment ? [draft.equipment] : [],
      workoutType: draft.workoutType ? [draft.workoutType] : [],
      difficulty: draft.difficulty,
      targetArea: draft.targetArea ? [draft.targetArea] : [],
      sessionDuration: durationMatch ? Number(durationMatch[0]) : "",
      workoutDescription: draft.workoutDescription,
    };

    try {
      await updateProfile(payload);
      const response = await getProfile();
      const savedProfile = profileFromResponse(response);

      setProfile(savedProfile);
      setDraft(savedProfile);
      setEditing(false);
      setSaveMessage("Profile saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex min-h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600' />
            <p className='mt-4 text-sm text-slate-500'>Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !profile) {
    return (
      <DashboardLayout>
        <div className='rounded-2xl border border-red-100 bg-white p-6'>
          <h2 className='font-bold text-[#193663]'>Unable to load profile</h2>
          <p className='mt-2 text-sm text-slate-500'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 rounded-xl bg-[#244C91] px-4 py-2 text-sm font-semibold text-white'
          >
            Try again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  const completionKeys = [
    "fullName",
    "email",
    "gender",
    "height",
    "weight",
    "fitnessLevel",
    "sport",
    "competitionLevel",
    "primaryGoal",
    "equipment",
    "targetArea",
    "workoutType",
    "difficulty",
    "sessionDuration",
  ];
  const completion = Math.round(
    (completionKeys.filter((key) => profile[key]).length / completionKeys.length) * 100,
  );

  const displayFields = [
    ["Full name", profile.fullName],
    ["Email", profile.email],
    ["Gender", profile.gender],
    ["Date of birth", profile.dateOfBirth],
    ["Height", profile.height ? `${profile.height} cm` : ""],
    ["Weight", profile.weight ? `${profile.weight} kg` : ""],
    ["Activity level", profile.fitnessLevel],
    ["Sport", profile.sport],
    ["Competition level", profile.competitionLevel],
  ];

  const workoutFields = [
    ["Equipment", profile.equipment],
    ["Workout goal / target", profile.primaryGoal],
    ["Target body part", profile.targetArea],
    ["Workout type", profile.workoutType],
    ["Difficulty", profile.difficulty],
    ["Exercise category", profile.category],
    ["Session duration", profile.sessionDuration],
  ];

  return (
    <DashboardLayout name={profile.fullName}>
      <div className='mx-auto w-full max-w-7xl space-y-6 pb-8'>
        <header className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-blue-700'>
              AthliX / Athlete space
            </p>
            <h1 className='mt-2 text-2xl font-bold tracking-tight text-[#193663] sm:text-3xl'>
              My Profile
            </h1>
            <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500'>
              Manage your athlete details and workout preferences to personalize recommendations.
            </p>
          </div>
          {!editing && (
            <button
              onClick={startEditing}
              className='inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#244C91] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 sm:self-auto'
            >
              <Pencil size={16} /> Edit profile
            </button>
          )}
        </header>

        {saveMessage && (
          <p
            role='status'
            className='rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800'
          >
            {saveMessage}
          </p>
        )}
        {error && profile && (
          <p
            role='alert'
            className='rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'
          >
            {error}
          </p>
        )}

        <section className='relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#E7F0FF] via-[#F2F7FF] to-[#DCEBFF] p-5 sm:p-7'>
          <Mountain
            className='pointer-events-none absolute -bottom-8 right-4 hidden text-blue-300/60 sm:block'
            size={140}
            strokeWidth={0.8}
          />
          <div className='relative flex flex-col gap-5 sm:flex-row sm:items-center'>
            <div className='flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white bg-blue-100 text-3xl font-bold text-[#193663] shadow-sm'>
              {profile.fullName ? profile.fullName[0].toUpperCase() : <UserRound size={32} />}
            </div>
            <div className='min-w-0 flex-1'>
              <h2 className='break-words text-xl font-bold text-[#193663] sm:text-2xl'>
                {profile.fullName || "Athlete"}
              </h2>
              <p className='mt-1 flex items-center gap-2 break-all text-sm text-blue-800'>
                <Mail size={15} />
                {profile.email || "Email not added"}
              </p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {[profile.sport, profile.fitnessLevel, profile.competitionLevel]
                  .filter(Boolean)
                  .map((item) => (
                    <span
                      key={item}
                      className='rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-medium text-[#244C91]'
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>
            <div className='relative z-10 w-full rounded-xl border border-white/80 bg-white/75 p-4 sm:max-w-48'>
              <div className='flex items-center justify-between gap-2'>
                <span className='text-xs font-semibold text-slate-600'>Profile completion</span>
                <span className='text-sm font-bold text-[#193663]'>{completion}%</span>
              </div>
              <div className='mt-3 h-2 overflow-hidden rounded-full bg-blue-100'>
                <div
                  className='h-full rounded-full bg-[#244C91]'
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className='mt-2 text-xs text-slate-500'>Add your workout preferences.</p>
            </div>
          </div>
        </section>

        {editing && (
          <form
            onSubmit={saveProfile}
            className='space-y-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6'
          >
            <div>
              <h2 className='text-lg font-bold text-[#193663]'>Edit athlete profile</h2>
              <p className='mt-1 text-sm text-slate-500'>
                Choose your personal details and preferred workout filters.
              </p>
            </div>

            <div>
              <h3 className='mb-3 text-sm font-bold text-[#193663]'>
                Personal and athletic details
              </h3>
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {fields.slice(0, 9).map(([field, label, type]) => (
                  <ProfileInput
                    key={field}
                    field={field}
                    label={label}
                    type={type}
                    value={draft[field]}
                    onChange={updateDraft}
                    options={choices[field]}
                  />
                ))}
              </div>
            </div>

            <div className='border-t border-slate-100 pt-5'>
              <h3 className='text-sm font-bold text-[#193663]'>
                Workout recommendation preferences
              </h3>
              <p className='mb-4 mt-1 text-sm text-slate-500'>
                These preferences provide default values for personalized workout recommendations.
              </p>
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {fields.slice(9).map(([field, label, type]) => (
                  <ProfileInput
                    key={field}
                    field={field}
                    label={label}
                    type={type}
                    value={draft[field]}
                    onChange={updateDraft}
                    options={choices[field]}
                  />
                ))}
                <label className='block sm:col-span-2 xl:col-span-3'>
                  <span className='text-sm font-medium text-slate-700'>
                    Additional preferences (optional)
                  </span>
                  <textarea
                    name='workoutDescription'
                    rows={3}
                    value={draft.workoutDescription ?? ""}
                    onChange={updateDraft}
                    placeholder='For example: focus on stamina, avoid jumping exercises...'
                    className='mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50'
                  />
                </label>
              </div>
              <p className='mt-3 text-xs leading-5 text-slate-500'>
                Date of birth and exercise category are displayed for layout compatibility, but are
                not saved because they are not currently included in the backend profile schema.
                Email is read-only.
              </p>
            </div>

            <div className='flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={cancelEditing}
                disabled={saving}
                className='rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='rounded-xl bg-[#244C91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}

        <div className='grid items-start gap-5 xl:grid-cols-2'>
          <Section
            icon={UserRound}
            title='Personal & Athletic Details'
            subtitle='Core information attached to your athlete profile.'
            action={
              <button
                onClick={startEditing}
                className='text-xs font-semibold text-blue-700 hover:underline'
              >
                Edit
              </button>
            }
          >
            <div className='grid gap-x-6 sm:grid-cols-2'>
              {displayFields.map(([label, value]) => (
                <div key={label} className='min-w-0 border-b border-slate-100 py-3'>
                  <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>
                    {label}
                  </p>
                  <p className='mt-1 break-words text-sm font-semibold text-slate-800'>
                    {value || "Not added"}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            icon={Settings2}
            title='Workout Preferences'
            subtitle='Settings to guide personalized workout recommendations.'
            action={
              <button
                onClick={startEditing}
                className='text-xs font-semibold text-blue-700 hover:underline'
              >
                Edit
              </button>
            }
          >
            <div className='grid gap-3 sm:grid-cols-2'>
              {workoutFields.map(([label, value]) => (
                <div key={label} className='min-w-0 rounded-xl bg-[#F1F6FD] p-3.5'>
                  <p className='text-xs font-medium text-slate-500'>{label}</p>
                  <p className='mt-1 break-words text-sm font-semibold text-[#193663]'>
                    {value || "Not set"}
                  </p>
                </div>
              ))}
            </div>
            {profile.workoutDescription && (
              <p className='mt-3 rounded-xl border border-blue-100 p-3.5 text-sm text-slate-700'>
                {profile.workoutDescription}
              </p>
            )}
            <a
              href='/recommendations'
              className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline'
            >
              Explore recommendations <ArrowRight size={16} />
            </a>
          </Section>

          <Section
            icon={Target}
            title='Fitness Goals'
            subtitle='Goals returned by your saved profile.'
          >
            {profile.goals.length ? (
              <div className='flex flex-wrap gap-2'>
                {profile.goals.map((goal) => (
                  <span
                    key={goal}
                    className='inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-[#244C91]'
                  >
                    <CheckCircle2 size={15} />
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <div className='rounded-xl bg-[#F8FAFE] p-4'>
                <p className='text-sm font-medium text-slate-700'>
                  {profile.primaryGoal || "No saved goals returned"}
                </p>
                <p className='mt-1 text-xs leading-5 text-slate-500'>
                  Choose a workout goal in Edit profile to save it to your athlete profile.
                </p>
              </div>
            )}
          </Section>

          <Section
            icon={HeartPulse}
            title='Injury History'
            subtitle='Review injury information returned by your profile.'
          >
            {profile.injuries.length ? (
              <div className='space-y-3'>
                {profile.injuries.map((injury, index) => (
                  <div
                    key={injury.id || `${injury.injuryName}-${index}`}
                    className='rounded-xl bg-[#F8FAFE] p-4'
                  >
                    <p className='font-semibold text-[#193663]'>
                      {injury.injuryName || "Injury record"}
                    </p>
                    <p className='mt-1 text-sm text-slate-600'>
                      {injury.bodyRegion || "Body region not specified"}
                      {injury.severity ? ` · ${injury.severity}` : ""}
                    </p>
                    {injury.recoveryStatus && (
                      <p className='mt-1 text-xs text-slate-500'>
                        Recovery status: {injury.recoveryStatus}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='rounded-xl bg-[#F8FAFE] p-4 text-sm leading-6 text-slate-500'>
                No injury records were returned by your profile API.
              </p>
            )}
            <p className='mt-3 text-xs leading-5 text-slate-500'>
              Recommendations are not medical clearance. Seek qualified advice before exercising
              with an injury or ongoing pain.
            </p>
          </Section>
        </div>

        <section className='flex items-start gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5'>
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700'>
            <Trophy size={20} />
          </span>
          <div>
            <h2 className='font-bold text-[#193663]'>Build a profile that works for you</h2>
            <p className='mt-1 text-sm leading-6 text-slate-600'>
              Your saved athlete details and workout preferences can personalize recommendations.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
