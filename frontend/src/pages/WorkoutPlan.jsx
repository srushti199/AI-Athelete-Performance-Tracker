import { useEffect, useState } from "react";
import {
  Dumbbell,
  CalendarDays,
  ClipboardList,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import { getWorkoutPlans, updateExerciseCompletion } from "../api/workoutPlanApi";

export default function WorkoutPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPlans, setExpandedPlans] = useState({});
  const [updatingExercises, setUpdatingExercises] = useState({});
  const [completionError, setCompletionError] = useState("");

  async function loadWorkoutPlans() {
    setLoading(true);
    setError("");

    try {
      const response = await getWorkoutPlans();

      const result =
        response?.data?.workoutPlans ??
        response?.data?.plans ??
        response?.workoutPlans ??
        response?.plans ??
        response?.data;

      const savedPlans = Array.isArray(result) ? result : [];
      setPlans(savedPlans);

      if (savedPlans.length > 0) {
        setExpandedPlans((previous) => ({
          ...previous,
          [savedPlans[0].id]: true,
        }));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your workout plans. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchPlans() {
      try {
        const response = await getWorkoutPlans();

        const result =
          response?.data?.workoutPlans ??
          response?.data?.plans ??
          response?.workoutPlans ??
          response?.plans ??
          response?.data;

        const savedPlans = Array.isArray(result) ? result : [];

        if (isMounted) {
          setPlans(savedPlans);

          if (savedPlans.length > 0) {
            setExpandedPlans((previous) => ({
              ...previous,
              [savedPlans[0].id]: true,
            }));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load your workout plans. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  function togglePlan(planId) {
    setExpandedPlans((previous) => ({
      ...previous,
      [planId]: !previous[planId],
    }));
  }

  async function handleCompletionToggle(planId, exercise) {
    if (!exercise.id || updatingExercises[exercise.id]) return;

    const nextCompleted = !exercise.completed;

    setUpdatingExercises((previous) => ({
      ...previous,
      [exercise.id]: true,
    }));
    setCompletionError("");

    try {
      const response = await updateExerciseCompletion(planId, exercise.id, nextCompleted);

      const updatedExercise = response?.data?.exercise ?? response?.exercise;

      if (!updatedExercise) {
        throw new Error("The server did not return the updated exercise.");
      }

      setPlans((previousPlans) =>
        previousPlans.map((plan) =>
          plan.id !== planId
            ? plan
            : {
                ...plan,
                exercises: (plan.exercises || []).map((item) =>
                  item.id === exercise.id ? { ...item, ...updatedExercise } : item,
                ),
              },
        ),
      );
    } catch (err) {
      setCompletionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update exercise completion. Please try again.",
      );
    } finally {
      setUpdatingExercises((previous) => ({
        ...previous,
        [exercise.id]: false,
      }));
    }
  }

  const totalExercises = plans.reduce((total, plan) => total + (plan.exercises?.length || 0), 0);

  const completedExercises = plans.reduce(
    (total, plan) => total + (plan.exercises || []).filter((exercise) => exercise.completed).length,
    0,
  );

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <section>
          <p className='text-sm font-medium text-blue-600'>Training / Workout Plan</p>

          <div className='mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <h1 className='text-2xl font-bold text-[#17233f] sm:text-3xl'>My Workout Plans</h1>
              <p className='mt-2 text-sm leading-6 text-slate-500'>
                View your saved exercises and keep track of your training.
              </p>
            </div>

            <button
              type='button'
              onClick={loadWorkoutPlans}
              disabled={loading}
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-[#244C91] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60'
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        <section className='grid gap-4 sm:grid-cols-3'>
          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-500'>Saved plans</p>
                <p className='mt-2 text-3xl font-bold text-[#17233f]'>{plans.length}</p>
              </div>
              <div className='rounded-xl bg-blue-50 p-3 text-blue-700'>
                <ClipboardList size={23} />
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-500'>Total exercises</p>
                <p className='mt-2 text-3xl font-bold text-[#17233f]'>{totalExercises}</p>
              </div>
              <div className='rounded-xl bg-blue-50 p-3 text-blue-700'>
                <Dumbbell size={23} />
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-500'>Completed exercises</p>
                <p className='mt-2 text-3xl font-bold text-[#17233f]'>{completedExercises}</p>
              </div>
              <div className='rounded-xl bg-emerald-50 p-3 text-emerald-700'>
                <CheckCircle2 size={23} />
              </div>
            </div>
          </div>
        </section>

        {completionError && (
          <div
            role='alert'
            className='flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'
          >
            <AlertCircle size={19} className='mt-0.5 shrink-0' />
            <p>{completionError}</p>
            <button
              type='button'
              onClick={() => setCompletionError("")}
              className='ml-auto font-semibold'
              aria-label='Dismiss error'
            >
              ×
            </button>
          </div>
        )}

        {loading && (
          <div className='flex min-h-64 flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white p-8 text-center'>
            <LoaderCircle size={34} className='animate-spin text-[#244C91]' />
            <p className='mt-4 font-semibold text-[#17233f]'>Loading your workout plans...</p>
            <p className='mt-1 text-sm text-slate-500'>Fetching your saved exercises.</p>
          </div>
        )}

        {!loading && error && (
          <div className='rounded-2xl border border-red-200 bg-red-50 p-5'>
            <div className='flex items-start gap-3'>
              <AlertCircle size={21} className='shrink-0 text-red-600' />
              <div className='min-w-0 flex-1'>
                <h2 className='font-semibold text-red-800'>Unable to load workout plans</h2>
                <p className='mt-1 text-sm text-red-700'>{error}</p>
                <button
                  type='button'
                  onClick={loadWorkoutPlans}
                  className='mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700'
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className='flex min-h-80 flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white px-6 py-12 text-center shadow-sm'>
            <div className='rounded-full bg-blue-50 p-5 text-[#244C91]'>
              <Dumbbell size={36} />
            </div>
            <h2 className='mt-5 text-xl font-bold text-[#17233f]'>No workout plans yet</h2>
            <p className='mt-2 max-w-md text-sm leading-6 text-slate-500'>
              Visit Workout Recommendations, select the exercises you want, and save them as a
              workout plan. Your saved plans will appear here.
            </p>
            <a
              href='/recommendations'
              className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#244C91] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800'
            >
              <Dumbbell size={18} />
              Explore recommendations
            </a>
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <section className='space-y-4'>
            <div>
              <h2 className='text-xl font-bold text-[#17233f]'>Your saved plans</h2>
              <p className='mt-1 text-sm text-slate-500'>
                Open a plan to see its exercises and training details.
              </p>
            </div>

            {plans.map((plan, index) => {
              const exercises = plan.exercises || [];
              const completed = exercises.filter((exercise) => exercise.completed).length;
              const isExpanded = Boolean(expandedPlans[plan.id]);

              return (
                <article
                  key={plan.id || index}
                  className='overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm'
                >
                  <button
                    type='button'
                    onClick={() => togglePlan(plan.id)}
                    className='flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-blue-50/50 sm:p-6'
                  >
                    <div className='flex min-w-0 items-start gap-4'>
                      <div className='shrink-0 rounded-xl bg-blue-50 p-3 text-[#244C91]'>
                        <ClipboardList size={23} />
                      </div>
                      <div className='min-w-0'>
                        <h3 className='break-words font-bold text-[#17233f]'>
                          {plan.name || `Workout Plan ${index + 1}`}
                        </h3>

                        {plan.description && (
                          <p className='mt-1 text-sm leading-5 text-slate-500'>
                            {plan.description}
                          </p>
                        )}

                        <div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500'>
                          <span className='inline-flex items-center gap-1.5'>
                            <Dumbbell size={14} />
                            {exercises.length} exercises
                          </span>
                          <span className='inline-flex items-center gap-1.5'>
                            <CalendarDays size={14} />
                            {plan.createdAt
                              ? new Date(plan.createdAt).toLocaleDateString()
                              : "Date unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='shrink-0 text-[#244C91]'>
                      {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className='border-t border-blue-50 p-4 sm:p-6'>
                      <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
                        <h4 className='font-semibold text-[#17233f]'>Exercises in this plan</h4>
                        <span className='rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#244C91]'>
                          {completed} of {exercises.length} completed
                        </span>
                      </div>

                      {exercises.length === 0 ? (
                        <p className='rounded-xl bg-slate-50 p-4 text-sm text-slate-500'>
                          This plan does not contain any exercises yet.
                        </p>
                      ) : (
                        <div className='space-y-3'>
                          {exercises.map((exercise, exerciseIndex) => {
                            const isUpdating = Boolean(updatingExercises[exercise.id]);

                            return (
                              <div
                                key={exercise.id || exerciseIndex}
                                className='flex flex-col gap-3 rounded-xl border border-slate-100 bg-[#F8FAFE] p-4 sm:flex-row sm:items-center sm:justify-between'
                              >
                                <div className='flex min-w-0 items-start gap-3'>
                                  <div
                                    className={`mt-0.5 rounded-lg p-2 ${
                                      exercise.completed
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-white text-[#244C91]"
                                    }`}
                                  >
                                    {exercise.completed ? (
                                      <CheckCircle2 size={19} />
                                    ) : (
                                      <Dumbbell size={19} />
                                    )}
                                  </div>

                                  <div className='min-w-0'>
                                    <h5 className='break-words font-semibold text-[#17233f]'>
                                      {exercise.exerciseName ||
                                        exercise.name ||
                                        `Exercise ${exerciseIndex + 1}`}
                                    </h5>

                                    <div className='mt-2 flex flex-wrap gap-2'>
                                      {exercise.bodyPart && (
                                        <span className='rounded-full bg-white px-2.5 py-1 text-xs capitalize text-slate-600'>
                                          {exercise.bodyPart}
                                        </span>
                                      )}
                                      {exercise.equipment && (
                                        <span className='rounded-full bg-white px-2.5 py-1 text-xs capitalize text-slate-600'>
                                          {exercise.equipment}
                                        </span>
                                      )}
                                      {exercise.difficulty && (
                                        <span className='rounded-full bg-white px-2.5 py-1 text-xs text-slate-600'>
                                          {exercise.difficulty}
                                        </span>
                                      )}
                                    </div>

                                    <p className='mt-2 text-sm text-slate-600'>
                                      {exercise.sets ?? 3} sets
                                      {" · "}
                                      {exercise.reps || "10-12"} reps
                                      {" · "}
                                      {exercise.restSeconds ?? 60}s rest
                                    </p>
                                  </div>
                                </div>

                                <div className='flex shrink-0 flex-col items-start gap-2 sm:items-end'>
                                  <span
                                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                                      exercise.completed
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-50 text-amber-700"
                                    }`}
                                  >
                                    {exercise.completed ? "Completed" : "Not completed"}
                                  </span>

                                  <button
                                    type='button'
                                    onClick={() => handleCompletionToggle(plan.id, exercise)}
                                    disabled={isUpdating || !exercise.id}
                                    className={`inline-flex min-w-44 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                      exercise.completed
                                        ? "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                                        : "bg-[#244C91] text-white hover:bg-blue-800"
                                    }`}
                                  >
                                    {isUpdating ? (
                                      <>
                                        <LoaderCircle size={16} className='animate-spin' />
                                        Saving...
                                      </>
                                    ) : exercise.completed ? (
                                      <>
                                        <CheckCircle2 size={16} />
                                        Mark as Incomplete
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 size={16} />
                                        Mark as Completed
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}

        <div className='rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5'>
          <h3 className='font-bold text-[#193663]'>Stay consistent with your training</h3>
          <p className='mt-1 text-sm leading-6 text-slate-600'>
            Mark each exercise as completed after your workout. Your progress is saved to your
            account and remains available when you return.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
