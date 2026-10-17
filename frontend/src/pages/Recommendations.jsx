import { useEffect, useState } from "react";
import {
  Dumbbell,
  Search,
  LoaderCircle,
  AlertCircle,
  Sparkles,
  Target,
  SlidersHorizontal,
} from "lucide-react";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import { getRecommendations } from "../services/recommendationService";
import { getProfile } from "../api/profileApi";

const BODY_PARTS = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];
const TARGETS = [
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "cardiovascular system",
  "delts",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "levator scapulae",
  "pectorals",
  "quads",
  "serratus anterior",
  "spine",
  "traps",
  "triceps",
  "upper back",
];
const EQUIPMENT = [
  "assisted",
  "assisted (towel)",
  "band",
  "barbell",
  "body weight",
  "body weight (with resistance band)",
  "bosu ball",
  "cable",
  "dumbbell",
  "ez barbell",
  "kettlebell",
  "leverage machine",
  "medicine ball",
  "olympic barbell",
  "rope",
  "sled machine",
  "smith machine",
  "stability ball",
  "trap bar",
  "weighted",
  "wheel roller",
];
const CATEGORIES = [
  "balance",
  "cardio",
  "mobility",
  "plyometrics",
  "rehabilitation",
  "strength",
  "stretching",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const DEFAULT_PREFERENCES = {
  equipment: ["body weight"],
  bodyParts: ["upper legs"],
  targets: ["quads"],
  difficulty: "Beginner",
  categories: ["strength"],
  description: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

function matchOption(value, options, aliases = {}) {
  const normalized = normalize(value);
  const mapped = aliases[normalized] || normalized;
  return options.find((option) => normalize(option) === mapped);
}

function uniqueMatches(values, options, aliases = {}) {
  const list = Array.isArray(values) ? values : values ? [values] : [];
  return [...new Set(list.map((value) => matchOption(value, options, aliases)).filter(Boolean))];
}

function toRecommendationPreferences(profile) {
  const workout = profile?.workoutPreference;
  const savedEquipment = (workout?.equipment || []).map((item) => item.equipment).filter(Boolean);
  const savedTypes = (workout?.workoutTypes || []).map((item) => item.workoutType).filter(Boolean);
  const savedAreas = (workout?.targetAreas || []).map((item) => item.targetArea).filter(Boolean);
  const goals = (profile?.profileGoals || []).map((item) => item.goalKey).filter(Boolean);

  const bodyPartAliases = {
    arms: "upper arms",
    legs: "upper legs",
    core: "waist",
    glutes: "upper legs",
    "full body": "upper legs",
    "cardiovascular endurance": "cardio",
  };
  const equipmentAliases = {
    bodyweight: "body weight",
    dumbbells: "dumbbell",
    "resistance band": "band",
    "resistance bands": "band",
    kettlebells: "kettlebell",
    "cable machine": "cable",
    machine: "leverage machine",
    "full gym": "leverage machine",
  };
  const categoryAliases = { flexibility: "stretching", "sports-specific": "strength" };
  const difficultyAliases = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const bodyParts = uniqueMatches(savedAreas, BODY_PARTS, bodyPartAliases);
  const targets = uniqueMatches(savedAreas, TARGETS);
  const defaultTargetByBodyPart = {
    back: "lats",
    cardio: "cardiovascular system",
    chest: "pectorals",
    "lower arms": "forearms",
    "lower legs": "calves",
    neck: "levator scapulae",
    shoulders: "delts",
    "upper arms": "biceps",
    "upper legs": "quads",
    waist: "abs",
  };

  // A saved target area may be a body-part label (e.g. shoulders) rather than a muscle.
  const finalTargets = targets.length
    ? targets
    : bodyParts.map((part) => defaultTargetByBodyPart[part]).filter(Boolean);

  const equipment = uniqueMatches(savedEquipment, EQUIPMENT, equipmentAliases);
  const categories = uniqueMatches(savedTypes, CATEGORIES, categoryAliases);
  const rawDifficulty = workout?.difficulty ?? profile?.activityLevel ?? "Intermediate";
  const difficulty = matchOption(rawDifficulty, DIFFICULTIES, difficultyAliases) || "Intermediate";

  return {
    equipment: equipment.length ? equipment : [...DEFAULT_PREFERENCES.equipment],
    bodyParts: bodyParts.length ? bodyParts : [...DEFAULT_PREFERENCES.bodyParts],
    targets: finalTargets.length ? finalTargets : [...DEFAULT_PREFERENCES.targets],
    difficulty,
    categories: categories.length ? categories : [...DEFAULT_PREFERENCES.categories],
    description: [
      goals.length ? `Fitness goals: ${goals.join(", ")}` : "",
      workout?.workoutDescription || "",
    ]
      .filter(Boolean)
      .join(". "),
  };
}

function MultiSelect({ id, label, options, values, onChange, disabled }) {
  const toggle = (option) => {
    onChange(
      values.includes(option) ? values.filter((item) => item !== option) : [...values, option],
    );
  };

  return (
    <fieldset className='min-w-0'>
      <legend className='text-sm font-medium text-slate-700'>{label}</legend>
      <p className='mt-1 text-xs text-slate-500'>Select one or more options.</p>
      <div
        id={id}
        className='mt-2 grid max-h-44 grid-cols-1 gap-1 overflow-y-auto rounded-xl border border-blue-100 bg-white p-3 sm:grid-cols-2'
      >
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-sm capitalize text-slate-700 hover:bg-blue-50 ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <input
              type='checkbox'
              checked={values.includes(option)}
              onChange={() => toggle(option)}
              disabled={disabled}
              className='mt-0.5 accent-[#244C91]'
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {values.length === 0 && (
        <p className='mt-1 text-xs text-amber-700'>Select at least one option.</p>
      )}
    </fieldset>
  );
}

export default function Recommendations() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [profilePreferences, setProfilePreferences] = useState(null);
  const [mode, setMode] = useState("personalized");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function requestRecommendations(currentPreferences) {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const result = await getRecommendations(currentPreferences);
      setRecommendations(result?.recommendations || []);
    } catch (err) {
      setRecommendations([]);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Unable to fetch exercises. Check that your backend and ML service are running.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setProfileLoading(true);
      setError("");
      try {
        const response = await getProfile();
        if (!active) return;
        const profile = response.data?.data?.profile;
        if (!profile)
          throw new Error("Athlete profile not found. Please complete your profile first.");
        const saved = toRecommendationPreferences(profile);
        setProfilePreferences(saved);
        setPreferences(saved);
        await requestRecommendations(saved);
      } catch (err) {
        if (!active) return;
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load your saved profile. You can use Customize mode.",
        );
      } finally {
        if (active) setProfileLoading(false);
      }
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  function updatePreference(name, value) {
    setPreferences((previous) => ({ ...previous, [name]: value }));
  }

  function handleModeChange(nextMode) {
    setError("");
    setMode(nextMode);
    if (nextMode === "personalized") {
      if (!profilePreferences) {
        setRecommendations([]);
        setSearched(false);
        setError("Your saved profile could not be loaded. Please try again or use Customize mode.");
        return;
      }
      setPreferences(profilePreferences);
      requestRecommendations(profilePreferences);
    } else {
      setPreferences(profilePreferences || DEFAULT_PREFERENCES);
      setRecommendations([]);
      setSearched(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const current = mode === "personalized" ? profilePreferences : preferences;
    if (!current) {
      setError("Saved preferences are unavailable. Try Customize mode.");
      return;
    }
    if (
      !current.equipment?.length ||
      !current.bodyParts?.length ||
      !current.targets?.length ||
      !current.categories?.length
    ) {
      setError(
        "Select at least one option for equipment, body part, target muscle, and workout category.",
      );
      return;
    }
    await requestRecommendations(current);
  }

  const controlsDisabled = mode === "personalized" || profileLoading;

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <section>
          <p className='text-sm font-medium text-blue-600'>Training / Recommendations</p>
          <div className='mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-2xl font-bold text-[#17233f] sm:text-3xl'>
                Workout Recommendations
              </h2>
              <p className='mt-2 text-sm leading-6 text-slate-500'>
                Discover exercises personalized to your athlete profile and training preferences.
              </p>
            </div>
            <span className='inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700'>
              <Sparkles size={17} />
              AI powered
            </span>
          </div>
        </section>

        <section className='relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#EAF2FF] to-[#F5F8FF] p-6 sm:p-8'>
          <div className='relative z-10 max-w-xl'>
            <span className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700'>
              <Target size={14} />
              YOUR TRAINING JOURNEY
            </span>
            <h3 className='mt-4 text-xl font-bold text-[#193663] sm:text-2xl'>
              Train smarter. Perform better.
            </h3>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              Use your saved athlete profile or customize your workout preferences for this search.
            </p>
          </div>
          <div className='pointer-events-none absolute -bottom-8 right-5 flex h-32 w-32 items-center justify-center rounded-full bg-blue-100/80 text-blue-400 sm:right-12 sm:h-40 sm:w-40'>
            <Dumbbell size={65} strokeWidth={1.4} />
          </div>
        </section>

        <section className='grid items-start gap-5 xl:grid-cols-[350px_minmax(0,1fr)]'>
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-xl bg-blue-50 p-3 text-blue-700'>
                <SlidersHorizontal size={21} />
              </div>
              <div>
                <h3 className='font-bold text-[#17233f]'>Workout preferences</h3>
                <p className='mt-1 text-xs text-slate-500'>
                  Choose how to personalize your results
                </p>
              </div>
            </div>

            <div className='mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1.5'>
              <button
                type='button'
                onClick={() => handleModeChange("personalized")}
                disabled={profileLoading}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${mode === "personalized" ? "bg-[#244C91] text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}
              >
                My Profile
              </button>
              <button
                type='button'
                onClick={() => handleModeChange("manual")}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${mode === "manual" ? "bg-[#244C91] text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}
              >
                Customize
              </button>
            </div>

            <p className='mb-4 text-xs leading-5 text-slate-500'>
              {mode === "personalized"
                ? "Recommendations use your saved profile preferences."
                : "Select multiple options if needed. These changes apply to this search only and will not update your saved profile."}
            </p>
            {profileLoading && (
              <div className='mb-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-700'>
                <LoaderCircle size={17} className='animate-spin' />
                Loading your saved profile...
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <MultiSelect
                id='bodyParts'
                label='Target body parts'
                options={BODY_PARTS}
                values={preferences.bodyParts}
                onChange={(value) => updatePreference("bodyParts", value)}
                disabled={controlsDisabled}
              />
              <MultiSelect
                id='targets'
                label='Target muscles / systems'
                options={TARGETS}
                values={preferences.targets}
                onChange={(value) => updatePreference("targets", value)}
                disabled={controlsDisabled}
              />
              <MultiSelect
                id='equipment'
                label='Equipment'
                options={EQUIPMENT}
                values={preferences.equipment}
                onChange={(value) => updatePreference("equipment", value)}
                disabled={controlsDisabled}
              />
              <div>
                <label htmlFor='difficulty' className='text-sm font-medium text-slate-700'>
                  Difficulty
                </label>
                <select
                  id='difficulty'
                  value={preferences.difficulty}
                  onChange={(event) => updatePreference("difficulty", event.target.value)}
                  disabled={controlsDisabled}
                  className={inputClass}
                >
                  {DIFFICULTIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <MultiSelect
                id='categories'
                label='Workout categories'
                options={CATEGORIES}
                values={preferences.categories}
                onChange={(value) => updatePreference("categories", value)}
                disabled={controlsDisabled}
              />
              {mode === "manual" && (
                <div>
                  <label htmlFor='description' className='text-sm font-medium text-slate-700'>
                    Additional preferences (optional)
                  </label>
                  <textarea
                    id='description'
                    value={preferences.description || ""}
                    onChange={(event) => updatePreference("description", event.target.value)}
                    rows={3}
                    placeholder='For example: focus on stamina or avoid jumping exercises...'
                    className={inputClass}
                  />
                </div>
              )}
              <button
                type='submit'
                disabled={
                  loading || profileLoading || (mode === "personalized" && !profilePreferences)
                }
                className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#244C91] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className='animate-spin' />
                    Finding exercises...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    {mode === "personalized" ? "Refresh Recommendations" : "Get Recommendations"}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className='min-w-0'>
            <div className='mb-5 flex items-center justify-between gap-3'>
              <div>
                <h3 className='text-xl font-bold text-[#17233f]'>Recommended exercises</h3>
                <p className='mt-1 text-sm text-slate-500'>
                  {recommendations.length > 0
                    ? `${recommendations.length} exercises found`
                    : "Exercises matched to your preferences"}
                </p>
              </div>
              <div className='rounded-xl border border-blue-100 bg-white p-3 text-blue-700'>
                <Dumbbell size={22} />
              </div>
            </div>

            {error && (
              <div className='mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
                <AlertCircle size={20} className='shrink-0' />
                <p>{error}</p>
              </div>
            )}
            {!searched && !loading && !profileLoading && (
              <div className='flex min-h-72 flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white px-6 py-12 text-center shadow-sm'>
                <div className='rounded-full bg-blue-50 p-4 text-blue-700'>
                  <Dumbbell size={32} />
                </div>
                <h3 className='mt-4 font-bold text-[#17233f]'>Your next workout starts here</h3>
                <p className='mt-2 max-w-sm text-sm leading-6 text-slate-500'>
                  Use your profile or customize your preferences to find exercises for your next
                  workout.
                </p>
              </div>
            )}
            {loading && (
              <div className='flex min-h-72 flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white shadow-sm'>
                <LoaderCircle size={34} className='animate-spin text-blue-600' />
                <p className='mt-4 font-semibold text-[#17233f]'>Finding your exercises</p>
                <p className='mt-2 text-sm text-slate-500'>
                  Matching exercises to your preferences...
                </p>
              </div>
            )}

            {!loading && recommendations.length > 0 && (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {recommendations.map((exercise, index) => (
                  <article
                    key={`${exercise.name}-${index}`}
                    className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700'>
                        <Dumbbell size={22} />
                      </div>
                      <span className='rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700'>
                        {exercise.difficulty || "Not specified"}
                      </span>
                    </div>
                    <h4 className='mt-4 font-bold capitalize text-[#17233f]'>{exercise.name}</h4>
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {[exercise.bodyPart, exercise.target, exercise.equipment, exercise.category]
                        .filter(Boolean)
                        .map((tag) => (
                          <span
                            key={tag}
                            className='rounded-lg bg-[#F8FAFE] px-3 py-1.5 text-xs capitalize text-slate-600'
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    {exercise.fallback_used && (
                      <p className='mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800'>
                        No exact match found for your equipment and difficulty level. Showing
                        alternative exercises instead.
                      </p>
                    )}
                    {typeof exercise.final_score === "number" && (
                      <div className='mt-5'>
                        <div className='mb-2 flex justify-between text-xs'>
                          <span className='text-slate-500'>Model similarity</span>
                          <span className='font-semibold text-blue-700'>
                            {(exercise.final_score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className='h-1.5 overflow-hidden rounded-full bg-blue-50'>
                          <div
                            className='h-full rounded-full bg-blue-600'
                            style={{
                              width: `${Math.max(0, Math.min(100, exercise.final_score * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className='mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-medium text-blue-700'>
                      <Sparkles size={16} />
                      AI recommendation
                    </div>
                  </article>
                ))}
              </div>
            )}
            {!loading && searched && !error && recommendations.length === 0 && (
              <div className='rounded-2xl border border-blue-100 bg-white px-6 py-14 text-center shadow-sm'>
                <Search size={30} className='mx-auto text-slate-400' />
                <h3 className='mt-4 font-bold text-[#17233f]'>No exercises found</h3>
                <p className='mt-2 text-sm text-slate-500'>
                  Try different preferences or equipment.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
