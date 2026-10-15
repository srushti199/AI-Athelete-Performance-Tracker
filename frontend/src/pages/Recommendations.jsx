import { useState } from "react";
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

const initialPreferences = {
  equipment: "body weight",
  bodyPart: "upper legs",
  target: "Build muscle",
  difficulty: "Beginner",
  category: "strength",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export default function Recommendations() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPreferences((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const result = await getRecommendations(preferences);
      setRecommendations(result.recommendations || []);
    } catch (err) {
      setRecommendations([]);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Unable to fetch exercises. Please check that your backend and ML service are running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Page heading */}
        <section>
          <p className='text-sm font-medium text-blue-600'>Training / Recommendations</p>

          <div className='mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-2xl font-bold text-[#17233f] sm:text-3xl'>
                Workout Recommendations
              </h2>
              <p className='mt-2 text-sm leading-6 text-slate-500'>
                Discover exercises personalized to your fitness goals and training preferences.
              </p>
            </div>

            <span className='inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700'>
              <Sparkles size={17} />
              AI powered
            </span>
          </div>
        </section>

        {/* Intro banner */}
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
              Choose your equipment, target muscle group, and fitness level to find suitable
              exercises from your recommendation engine.
            </p>
          </div>

          <div className='pointer-events-none absolute -bottom-8 right-5 flex h-32 w-32 items-center justify-center rounded-full bg-blue-100/80 text-blue-400 sm:right-12 sm:h-40 sm:w-40'>
            <Dumbbell size={65} strokeWidth={1.4} />
          </div>
        </section>

        {/* Preferences and results */}
        <section className='grid items-start gap-5 xl:grid-cols-[310px_minmax(0,1fr)]'>
          {/* Preferences */}
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-xl bg-blue-50 p-3 text-blue-700'>
                <SlidersHorizontal size={21} />
              </div>

              <div>
                <h3 className='font-bold text-[#17233f]'>Workout preferences</h3>
                <p className='mt-1 text-xs text-slate-500'>Customize your results</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-slate-700'>Fitness goal</label>
                <select
                  name='target'
                  value={preferences.target}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value='Build muscle'>Build muscle</option>
                  <option value='Strength'>Improve strength</option>
                  <option value='Cardio'>Improve cardio</option>
                  <option value='Weight loss'>Weight loss</option>
                  <option value='Flexibility'>Improve flexibility</option>
                </select>
              </div>

              <div>
                <label className='text-sm font-medium text-slate-700'>Target body part</label>
                <select
                  name='bodyPart'
                  value={preferences.bodyPart}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value='upper legs'>Upper legs</option>
                  <option value='lower legs'>Lower legs</option>
                  <option value='chest'>Chest</option>
                  <option value='back'>Back</option>
                  <option value='shoulders'>Shoulders</option>
                  <option value='upper arms'>Upper arms</option>
                  <option value='waist'>Waist / core</option>
                  <option value='cardio'>Cardio</option>
                  <option value='full body'>Full body</option>
                </select>
              </div>

              <div>
                <label className='text-sm font-medium text-slate-700'>Equipment</label>
                <select
                  name='equipment'
                  value={preferences.equipment}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value='body weight'>Body weight</option>
                  <option value='dumbbell'>Dumbbells</option>
                  <option value='barbell'>Barbell</option>
                  <option value='cable'>Cable machine</option>
                  <option value='kettlebells'>Kettlebells</option>
                  <option value='resistance band'>Resistance bands</option>
                  <option value='machine'>Gym machines</option>
                </select>
              </div>

              <div>
                <label className='text-sm font-medium text-slate-700'>Difficulty</label>
                <select
                  name='difficulty'
                  value={preferences.difficulty}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value='Beginner'>Beginner</option>
                  <option value='Intermediate'>Intermediate</option>
                  <option value='Expert'>Advanced</option>
                </select>
              </div>

              <div>
                <label className='text-sm font-medium text-slate-700'>Workout category</label>
                <select
                  name='category'
                  value={preferences.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value='strength'>Strength</option>
                  <option value='stretching'>Stretching</option>
                  <option value='cardio'>Cardio</option>
                  <option value='plyometrics'>Plyometrics</option>
                  <option value='powerlifting'>Powerlifting</option>
                  <option value='strongman'>Strongman</option>
                  <option value='olympic weightlifting'>Olympic weightlifting</option>
                </select>
              </div>

              <button
                type='submit'
                disabled={loading}
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
                    Get Recommendations
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
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

            {!searched && (
              <div className='flex min-h-72 flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white px-6 py-12 text-center shadow-sm'>
                <div className='rounded-full bg-blue-50 p-4 text-blue-700'>
                  <Dumbbell size={32} />
                </div>
                <h3 className='mt-4 font-bold text-[#17233f]'>Your next workout starts here</h3>
                <p className='mt-2 max-w-sm text-sm leading-6 text-slate-500'>
                  Set your training preferences and let AthliX find exercises for your next workout.
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
                      {[exercise.bodyPart, exercise.equipment, exercise.category]
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
                  Try changing your preferences and searching again.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
