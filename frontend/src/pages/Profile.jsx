import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Mail,
  Mountain,
  Pencil,
  Plus,
  Settings2,
  Target,
  Trophy,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import { getProfile, updateProfile, deleteInjury, addInjury } from "../api/profileApi";

const emptyProfile = {
  fullName: "",
  email: "",
  gender: "",
  height: "",
  weight: "",
  fitnessLevel: "",
  sport: "",
  competitionLevel: "",
  goals: [],
  equipment: [],
  workoutTypes: [],
  targetAreas: [],
  difficulty: "",
  sessionDuration: "",
  workoutDescription: "",
  injuries: [],
};

const choices = {
  gender: ["Female", "Male", "Other", "Prefer not to say"],
  fitnessLevel: ["Beginner", "Intermediate", "Advanced"],
  goals: [
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
  competitionLevel: [
    "Recreational",
    "Amateur",
    "Competitive",
    "Professional",
    "District",
    "State",
    "National",
    "International",
  ],
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
  workoutTypes: ["Strength", "Cardio", "Flexibility", "Mobility", "Plyometrics", "Sports-specific"],
  targetAreas: [
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
  difficulty: ["Beginner", "Intermediate", "Advanced"],
  sessionDuration: [15, 30, 45, 60, 90],
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

function Section({ icon: Icon, title, subtitle, children, action }) {
  return (
    <section className='min-w-0 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-5 flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-start gap-3'>
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700'>
            <Icon size={20} />
          </span>
          <div className='min-w-0'>
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

function Field({ label, name, value, onChange, options, type = "text" }) {
  return (
    <label className='block min-w-0'>
      <span className='text-sm font-medium text-slate-700'>{label}</span>
      {options ? (
        <select name={name} value={value ?? ""} onChange={onChange} className={inputClass}>
          <option value=''>Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          min={type === "number" ? "0" : undefined}
          step={type === "number" ? "any" : undefined}
          value={value ?? ""}
          onChange={onChange}
          className={inputClass}
        />
      )}
    </label>
  );
}

function MultiSelect({ label, name, options, selected = [], onChange }) {
  const toggle = (option) => {
    const updated = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    onChange(name, updated);
  };

  return (
    <fieldset className='min-w-0'>
      <legend className='text-sm font-medium text-slate-700'>{label}</legend>
      <div className='mt-2 flex flex-wrap gap-2'>
        {options.map((option) => {
          const checked = selected.includes(option);

          return (
            <label
              key={option}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                checked
                  ? "border-blue-300 bg-blue-50 font-medium text-[#244C91]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type='checkbox'
                checked={checked}
                onChange={() => toggle(option)}
                className='accent-[#244C91]'
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
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
    height: athlete.heightCm ?? "",
    weight: athlete.weightKg ?? "",
    fitnessLevel: athlete.activityLevel || "",
    sport: athlete.sport || "",
    competitionLevel: athlete.competitionLevel || "",
    goals,
    equipment: Array.isArray(preference.equipment)
      ? preference.equipment.map((item) => item.equipment).filter(Boolean)
      : [],
    workoutTypes: Array.isArray(preference.workoutTypes)
      ? preference.workoutTypes.map((item) => item.workoutType).filter(Boolean)
      : [],
    targetAreas: Array.isArray(preference.targetAreas)
      ? preference.targetAreas.map((item) => item.targetArea).filter(Boolean)
      : [],
    difficulty: preference.difficulty || "",
    sessionDuration: preference.sessionDuration ?? "",
    workoutDescription: preference.workoutDescription || "",
    injuries: Array.isArray(athlete.injuries) ? athlete.injuries : [],
  };
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingInjuryId, setDeletingInjuryId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);

  const [showInjuryForm, setShowInjuryForm] = useState(false);
  const [savingInjury, setSavingInjury] = useState(false);
  const [injuryDraft, setInjuryDraft] = useState({
    injuryName: "",
    bodyRegion: "",
    severity: "MODERATE",
    recoveryStatus: "OPEN",
  });

  const loadProfile = async () => {
    const response = await getProfile();
    const saved = profileFromResponse(response);
    setProfile(saved);
    setDraft(saved);
    return saved;
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await getProfile();
        if (!active) return;

        const saved = profileFromResponse(response);
        setProfile(saved);
        setDraft(saved);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load your profile. Check that the backend is running.",
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

  const updateField = (event) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
  };

  const updateMultiSelect = (name, value) => {
    setDraft((previous) => ({ ...previous, [name]: value }));
  };

  const startEditing = () => {
    setDraft({ ...profile });
    setError("");
    setMessage("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft({ ...profile });
    setError("");
    setEditing(false);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      fullName: draft.fullName.trim(),
      gender: draft.gender,
      height: draft.height,
      weight: draft.weight,
      fitnessLevel: draft.fitnessLevel,
      sport: draft.sport,
      competitionLevel: draft.competitionLevel,
      equipment: draft.equipment,
      workoutType: draft.workoutTypes,
      targetArea: draft.targetAreas,
      difficulty: draft.difficulty,
      sessionDuration: draft.sessionDuration,
      workoutDescription: draft.workoutDescription,
    };

    try {
      await updateProfile(payload);
      await loadProfile();
      setEditing(false);
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = async (event) => {
    event.preventDefault();

    if (!selectedGoal) {
      setError("Please select a fitness goal.");
      return;
    }

    if (profile.goals.includes(selectedGoal)) {
      setError("This goal has already been added.");
      return;
    }

    setSavingGoal(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({
        goals: [...profile.goals, selectedGoal],
      });

      await loadProfile();
      setSelectedGoal("");
      setShowGoalForm(false);
      setMessage("Fitness goal added successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add the fitness goal. Please try again.");
    } finally {
      setSavingGoal(false);
    }
  };

  const removeGoal = async (goalToRemove) => {
    const updatedGoals = profile.goals.filter((goal) => goal !== goalToRemove);

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({ goals: updatedGoals });
      await loadProfile();
      setMessage("Goal removed successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove this goal.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddInjury = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!injuryDraft.injuryName.trim()) {
      setError("Please enter the injury name.");
      return;
    }

    setSavingInjury(true);

    try {
      await addInjury({
        ...injuryDraft,
        injuryName: injuryDraft.injuryName.trim(),
        bodyRegion: injuryDraft.bodyRegion.trim(),
      });

      await loadProfile();

      setInjuryDraft({
        injuryName: "",
        bodyRegion: "",
        severity: "MODERATE",
        recoveryStatus: "OPEN",
      });

      setShowInjuryForm(false);
      setMessage("Injury added successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add the injury. Please try again.");
    } finally {
      setSavingInjury(false);
    }
  };

  const removeInjury = async (injury) => {
    if (!injury?.id) {
      setError("This injury record has no ID and cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete the injury record "${injury.injuryName}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingInjuryId(injury.id);
    setError("");
    setMessage("");

    try {
      await deleteInjury(injury.id);
      await loadProfile();
      setMessage("Injury record deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this injury record.");
    } finally {
      setDeletingInjuryId(null);
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

  const completionFields = [
    profile.fullName,
    profile.email,
    profile.gender,
    profile.height,
    profile.weight,
    profile.fitnessLevel,
    profile.sport,
    profile.competitionLevel,
    profile.goals.length,
    profile.equipment.length,
    profile.targetAreas.length,
    profile.workoutTypes.length,
    profile.difficulty,
    profile.sessionDuration,
  ];

  const completion = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  );

  const personalFields = [
    ["Full name", profile.fullName],
    ["Email", profile.email],
    ["Gender", profile.gender],
    ["Height", profile.height ? `${profile.height} cm` : ""],
    ["Weight", profile.weight ? `${profile.weight} kg` : ""],
    ["Activity level", profile.fitnessLevel],
    ["Sport", profile.sport],
    ["Competition level", profile.competitionLevel],
  ];

  const preferenceFields = [
    ["Difficulty", profile.difficulty],
    ["Session duration", profile.sessionDuration ? `${profile.sessionDuration} minutes` : ""],
  ];

  return (
    <DashboardLayout name={profile.fullName}>
      <div className='mx-auto w-full max-w-7xl space-y-5 pb-8'>
        <header className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-blue-700'>
              AthliX / Athlete space
            </p>
            <h1 className='mt-2 text-2xl font-bold tracking-tight text-[#193663] sm:text-3xl'>
              My Profile
            </h1>
            <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500'>
              Manage your athlete details and workout preferences.
            </p>
          </div>

          {!editing && (
            <button
              onClick={startEditing}
              className='inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#244C91] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800'
            >
              <Pencil size={16} /> Edit profile
            </button>
          )}
        </header>

        {message && (
          <p
            role='status'
            className='rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800'
          >
            {message}
          </p>
        )}

        {error && (
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
                <Mail size={15} /> {profile.email || "Email not added"}
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
                Update your personal details and workout preferences.
              </p>
            </div>

            <div>
              <h3 className='mb-3 text-sm font-bold text-[#193663]'>
                Personal and athletic details
              </h3>
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                <Field
                  label='Full name'
                  name='fullName'
                  value={draft.fullName}
                  onChange={updateField}
                />
                <label className='block min-w-0'>
                  <span className='text-sm font-medium text-slate-700'>Email address</span>
                  <input
                    value={draft.email}
                    readOnly
                    className={`${inputClass} bg-slate-50 text-slate-500`}
                  />
                </label>
                <Field
                  label='Gender'
                  name='gender'
                  value={draft.gender}
                  onChange={updateField}
                  options={choices.gender}
                />
                <Field
                  label='Height (cm)'
                  name='height'
                  value={draft.height}
                  onChange={updateField}
                  type='number'
                />
                <Field
                  label='Weight (kg)'
                  name='weight'
                  value={draft.weight}
                  onChange={updateField}
                  type='number'
                />
                <Field
                  label='Sport'
                  name='sport'
                  value={draft.sport}
                  onChange={updateField}
                  options={choices.sport}
                />
                <Field
                  label='Activity / fitness level'
                  name='fitnessLevel'
                  value={draft.fitnessLevel}
                  onChange={updateField}
                  options={choices.fitnessLevel}
                />
                <Field
                  label='Competition level'
                  name='competitionLevel'
                  value={draft.competitionLevel}
                  onChange={updateField}
                  options={choices.competitionLevel}
                />
              </div>
            </div>

            <div className='space-y-5 border-t border-slate-100 pt-5'>
              <h3 className='text-sm font-bold text-[#193663]'>
                Workout recommendation preferences
              </h3>

              <MultiSelect
                label='Equipment available'
                name='equipment'
                options={choices.equipment}
                selected={draft.equipment}
                onChange={updateMultiSelect}
              />

              <MultiSelect
                label='Workout types'
                name='workoutTypes'
                options={choices.workoutTypes}
                selected={draft.workoutTypes}
                onChange={updateMultiSelect}
              />

              <MultiSelect
                label='Target body areas'
                name='targetAreas'
                options={choices.targetAreas}
                selected={draft.targetAreas}
                onChange={updateMultiSelect}
              />

              <div className='grid gap-4 sm:grid-cols-2'>
                <Field
                  label='Difficulty'
                  name='difficulty'
                  value={draft.difficulty}
                  onChange={updateField}
                  options={choices.difficulty}
                />
                <Field
                  label='Session duration (minutes)'
                  name='sessionDuration'
                  value={draft.sessionDuration}
                  onChange={updateField}
                  options={choices.sessionDuration.map(String)}
                />
              </div>

              <label className='block'>
                <span className='text-sm font-medium text-slate-700'>
                  Additional preferences (optional)
                </span>
                <textarea
                  name='workoutDescription'
                  rows={3}
                  value={draft.workoutDescription}
                  onChange={updateField}
                  placeholder='For example: focus on stamina, avoid jumping exercises...'
                  className={inputClass}
                />
              </label>
            </div>

            <div className='flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={cancelEditing}
                disabled={saving}
                className='rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={saving}
                className='rounded-xl bg-[#244C91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60'
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}

        {/* Top row: personal details and workout preferences */}
        <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:gap-5'>
          <Section
            icon={UserRound}
            title='Personal & Athletic Details'
            subtitle='Core information attached to your athlete profile.'
            action={
              <button
                type='button'
                onClick={startEditing}
                className='text-xs font-semibold text-blue-700 hover:underline'
              >
                Edit
              </button>
            }
          >
            <div className='grid gap-x-6 sm:grid-cols-2'>
              {personalFields.map(([label, value]) => (
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
            subtitle='Settings that guide personalized workout recommendations.'
            action={
              <button
                type='button'
                onClick={startEditing}
                className='text-xs font-semibold text-blue-700 hover:underline'
              >
                Edit
              </button>
            }
          >
            <div className='space-y-4'>
              {[
                ["Equipment", profile.equipment],
                ["Workout types", profile.workoutTypes],
                ["Target areas", profile.targetAreas],
              ].map(([label, values]) => (
                <div key={label}>
                  <p className='text-xs font-medium text-slate-500'>{label}</p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {values.length ? (
                      values.map((value) => (
                        <span
                          key={value}
                          className='rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-[#244C91]'
                        >
                          {value}
                        </span>
                      ))
                    ) : (
                      <span className='text-sm text-slate-500'>Not set</span>
                    )}
                  </div>
                </div>
              ))}

              <div className='grid gap-3 sm:grid-cols-2'>
                {preferenceFields.map(([label, value]) => (
                  <div key={label} className='rounded-xl bg-[#F1F6FD] p-3.5'>
                    <p className='text-xs font-medium text-slate-500'>{label}</p>
                    <p className='mt-1 break-words text-sm font-semibold text-[#193663]'>
                      {value || "Not set"}
                    </p>
                  </div>
                ))}
              </div>

              {profile.workoutDescription && (
                <p className='rounded-xl border border-blue-100 p-3.5 text-sm text-slate-700'>
                  {profile.workoutDescription}
                </p>
              )}

              <a
                href='/recommendations'
                className='inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline'
              >
                Explore recommendations <ArrowRight size={16} />
              </a>
            </div>
          </Section>
        </div>

        {/* Bottom row: goals and injuries */}
        <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:gap-5'>
          <Section
            icon={Target}
            title='Fitness Goals'
            subtitle='Add or remove goals without changing other preferences.'
            action={
              <button
                type='button'
                onClick={() => {
                  setShowGoalForm((previous) => !previous);
                  setError("");
                  setMessage("");
                }}
                className='inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#244C91] px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800'
              >
                {showGoalForm ? <X size={15} /> : <Plus size={15} />}
                {showGoalForm ? "Cancel" : "Add Goal"}
              </button>
            }
          >
            {showGoalForm && (
              <form
                onSubmit={handleAddGoal}
                className='mb-4 space-y-4 rounded-xl border border-blue-100 bg-[#F8FAFE] p-4'
              >
                <h3 className='text-sm font-bold text-[#193663]'>Add fitness goal</h3>

                <label className='block'>
                  <span className='text-sm font-medium text-slate-700'>Select goal *</span>
                  <select
                    value={selectedGoal}
                    onChange={(event) => setSelectedGoal(event.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value=''>Select a fitness goal</option>
                    {choices.goals
                      .filter((goal) => !profile.goals.includes(goal))
                      .map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                  </select>
                </label>

                <button
                  type='submit'
                  disabled={savingGoal}
                  className='w-full rounded-xl bg-[#244C91] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60'
                >
                  {savingGoal ? "Saving goal..." : "Save Goal"}
                </button>
              </form>
            )}

            {profile.goals.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {profile.goals.map((goal) => (
                  <span
                    key={goal}
                    className='inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-[#244C91]'
                  >
                    <CheckCircle2 size={15} />
                    {goal}
                    <button
                      type='button'
                      title={`Remove ${goal}`}
                      disabled={saving}
                      onClick={() => removeGoal(goal)}
                      className='rounded-full p-0.5 hover:bg-blue-100 disabled:opacity-50'
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className='rounded-xl bg-[#F8FAFE] p-4 text-sm text-slate-500'>
                No goals saved yet. Select Add Goal to add your first goal.
              </p>
            )}
          </Section>

          <Section
            icon={HeartPulse}
            title='Injury History'
            subtitle='Record injuries to help personalize your workout preferences.'
            action={
              <button
                type='button'
                onClick={() => setShowInjuryForm((previous) => !previous)}
                className='inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#244C91] px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800'
              >
                {showInjuryForm ? <X size={15} /> : <Plus size={15} />}
                {showInjuryForm ? "Cancel" : "Add Injury"}
              </button>
            }
          >
            {showInjuryForm && (
              <form
                onSubmit={handleAddInjury}
                className='mb-5 space-y-4 rounded-xl border border-blue-100 bg-[#F8FAFE] p-4'
              >
                <h3 className='font-semibold text-[#193663]'>Add injury details</h3>

                <label className='block'>
                  <span className='text-sm font-medium text-slate-700'>Injury name *</span>
                  <input
                    required
                    value={injuryDraft.injuryName}
                    onChange={(event) =>
                      setInjuryDraft((previous) => ({
                        ...previous,
                        injuryName: event.target.value,
                      }))
                    }
                    placeholder='e.g. Knee injury'
                    className={inputClass}
                  />
                </label>

                <label className='block'>
                  <span className='text-sm font-medium text-slate-700'>Body region</span>
                  <select
                    value={injuryDraft.bodyRegion}
                    onChange={(event) =>
                      setInjuryDraft((previous) => ({
                        ...previous,
                        bodyRegion: event.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value=''>Select body region</option>
                    {[
                      "Head",
                      "Neck",
                      "Shoulder",
                      "Arm",
                      "Elbow",
                      "Wrist",
                      "Back",
                      "Chest",
                      "Hip",
                      "Knee",
                      "Leg",
                      "Ankle",
                      "Foot",
                      "Other",
                    ].map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </label>

                <label className='block'>
                  <span className='text-sm font-medium text-slate-700'>Severity</span>
                  <select
                    value={injuryDraft.severity}
                    onChange={(event) =>
                      setInjuryDraft((previous) => ({
                        ...previous,
                        severity: event.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value='MILD'>Mild</option>
                    <option value='MODERATE'>Moderate</option>
                    <option value='SEVERE'>Severe</option>
                  </select>
                </label>

                <label className='block'>
                  <span className='text-sm font-medium text-slate-700'>Recovery status</span>
                  <select
                    value={injuryDraft.recoveryStatus}
                    onChange={(event) =>
                      setInjuryDraft((previous) => ({
                        ...previous,
                        recoveryStatus: event.target.value,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value='OPEN'>Ongoing</option>
                    <option value='RECOVERING'>Recovering</option>
                    <option value='RECOVERED'>Recovered</option>
                  </select>
                </label>

                <button
                  type='submit'
                  disabled={savingInjury}
                  className='w-full rounded-xl bg-[#244C91] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60'
                >
                  {savingInjury ? "Adding injury..." : "Save injury"}
                </button>
              </form>
            )}

            {profile.injuries.length > 0 ? (
              <div className='space-y-3'>
                {profile.injuries.map((injury, index) => (
                  <div
                    key={injury.id || `${injury.injuryName}-${index}`}
                    className='flex items-start justify-between gap-3 rounded-xl bg-[#F8FAFE] p-4'
                  >
                    <div className='min-w-0'>
                      <p className='font-semibold text-[#193663]'>
                        {injury.injuryName || "Injury record"}
                      </p>
                      <p className='mt-1 text-sm text-slate-600'>
                        {injury.bodyRegion || "Region not specified"}
                        {injury.severity ? ` · ${injury.severity}` : ""}
                      </p>
                      <p className='mt-1 text-xs text-slate-500'>
                        Status: {injury.recoveryStatus || "OPEN"}
                      </p>
                    </div>

                    <button
                      type='button'
                      onClick={() => removeInjury(injury)}
                      disabled={deletingInjuryId === injury.id}
                      title='Delete injury'
                      className='rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50'
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className='rounded-xl bg-[#F8FAFE] p-4 text-sm text-slate-500'>
                No injury records yet. Select Add Injury to record one.
              </p>
            )}

            <p className='mt-3 text-xs leading-5 text-slate-500'>
              Injury records help inform workout preferences; they are not a substitute for
              professional medical advice.
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
