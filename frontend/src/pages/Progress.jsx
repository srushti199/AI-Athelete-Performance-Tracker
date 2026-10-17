import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Dumbbell,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import { getProgressAnalytics } from "../api/progressApi";

const NAVY = "#193663";
const BLUE = "#244C91";
const LIGHT_BLUE = "#DCE6F5";

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-sm font-medium text-slate-500'>{label}</p>
          <p className='mt-3 text-3xl font-bold text-[#193663]'>{value}</p>
          <p className='mt-2 text-xs text-slate-500'>{helper}</p>
        </div>

        <div className='rounded-full bg-blue-50 p-3 text-blue-700'>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProgress() {
      try {
        const result = await getProgressAnalytics();

        if (!ignore) {
          setProgress(result.data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message || "Unable to load your progress. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      setError("");

      const result = await getProgressAnalytics();
      setProgress(result.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to refresh your progress. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }

  const summary = progress?.summary ?? {};
  const weeklyActivity = progress?.weeklyActivity ?? [];
  const completionBreakdown = progress?.completionBreakdown ?? [];
  const hasExercises = (summary.totalExercises ?? 0) > 0;

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Page heading */}
        <section className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <p className='text-sm text-slate-500'>
              Dashboard <span className='mx-2'>/</span>
              <span className='font-medium text-blue-700'>Progress</span>
            </p>

            <h1 className='mt-2 text-2xl font-bold text-[#193663] sm:text-3xl'>Your Progress</h1>

            <p className='mt-2 text-sm leading-6 text-slate-500'>
              Track your workout consistency and monitor your achievements.
            </p>
          </div>

          <button
            type='button'
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className='inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#244C91] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60 sm:self-auto'
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {error && (
          <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
            <p>{error}</p>
            <button type='button' onClick={handleRefresh} className='mt-2 font-semibold underline'>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className='flex min-h-64 items-center justify-center rounded-2xl border border-blue-100 bg-white'>
            <div className='text-center'>
              <RefreshCw size={28} className='mx-auto animate-spin text-blue-700' />
              <p className='mt-3 text-sm text-slate-500'>Loading your analytics...</p>
            </div>
          </div>
        ) : progress ? (
          <>
            {/* Summary cards */}
            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <StatCard
                icon={Dumbbell}
                label='Workout Plans'
                value={summary.totalWorkouts ?? 0}
                helper='Saved workout plans'
              />

              <StatCard
                icon={CheckCircle2}
                label='Exercises Completed'
                value={summary.completedExercises ?? 0}
                helper='Completed exercises'
              />

              <StatCard
                icon={CircleDashed}
                label='Pending Exercises'
                value={summary.pendingExercises ?? 0}
                helper='Exercises remaining'
              />

              <StatCard
                icon={TrendingUp}
                label='Completion Rate'
                value={`${summary.completionRate ?? 0}%`}
                helper='Overall completion'
              />
            </section>

            {/* Charts */}
            <section className='grid gap-5 xl:grid-cols-3'>
              {/* Weekly bar chart */}
              <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-blue-50 p-2.5 text-blue-700'>
                    <CalendarDays size={21} />
                  </div>

                  <div>
                    <h2 className='font-bold text-slate-900'>Weekly Activity</h2>
                    <p className='mt-1 text-sm text-slate-500'>
                      Completed exercises over the last seven days
                    </p>
                  </div>
                </div>

                <div className='mt-6 h-[280px] w-full'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={weeklyActivity}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#E7EDF5' />

                      <XAxis
                        dataKey='day'
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{ fill: "#F1F6FD" }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #DBEAFE",
                        }}
                        formatter={(value) => [value, "Exercises completed"]}
                      />

                      <Bar
                        dataKey='completed'
                        name='Completed exercises'
                        fill={BLUE}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={44}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Doughnut chart */}
              <div className='rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6'>
                <h2 className='font-bold text-slate-900'>Exercise Breakdown</h2>
                <p className='mt-1 text-sm text-slate-500'>Completed versus pending</p>

                {hasExercises ? (
                  <>
                    <div className='relative mt-4 h-[250px]'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                          <Pie
                            data={completionBreakdown}
                            dataKey='value'
                            nameKey='name'
                            cx='50%'
                            cy='48%'
                            innerRadius={62}
                            outerRadius={88}
                            paddingAngle={3}
                            stroke='none'
                          >
                            {completionBreakdown.map((entry, index) => (
                              <Cell key={entry.name} fill={index === 0 ? BLUE : LIGHT_BLUE} />
                            ))}
                          </Pie>

                          <Tooltip formatter={(value, name) => [value, name]} />

                          <Legend
                            verticalAlign='bottom'
                            iconType='circle'
                            wrapperStyle={{ fontSize: 12 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6'>
                        <span className='text-3xl font-bold text-[#193663]'>
                          {summary.completionRate ?? 0}%
                        </span>
                        <span className='text-xs text-slate-500'>Completed</span>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div className='rounded-xl bg-blue-50 p-3'>
                        <p className='text-xs text-slate-500'>Completed</p>
                        <p className='mt-1 text-xl font-bold text-[#244C91]'>
                          {summary.completedExercises ?? 0}
                        </p>
                      </div>

                      <div className='rounded-xl bg-[#F8FAFE] p-3'>
                        <p className='text-xs text-slate-500'>Pending</p>
                        <p className='mt-1 text-xl font-bold text-[#193663]'>
                          {summary.pendingExercises ?? 0}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='flex h-[280px] flex-col items-center justify-center text-center'>
                    <Dumbbell size={34} className='text-blue-200' />
                    <p className='mt-3 font-semibold text-[#193663]'>No exercises yet</p>
                    <p className='mt-2 max-w-xs text-sm text-slate-500'>
                      Save a workout plan to start tracking your progress.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Weekly consistency */}
            <section className='rounded-2xl border border-blue-100 bg-gradient-to-r from-[#EAF2FF] to-[#F5F8FF] p-6 sm:p-7'>
              <div className='flex items-start gap-4'>
                <div className='rounded-full bg-white p-3 text-blue-700'>
                  <Activity size={23} />
                </div>

                <div>
                  <h2 className='font-bold text-[#193663]'>Weekly Consistency</h2>
                  <p className='mt-2 text-sm leading-6 text-slate-600'>
                    You completed exercises on{" "}
                    <span className='font-bold text-[#244C91]'>
                      {summary.activeDaysLast7Days ?? 0} of the last 7 days
                    </span>
                    .
                  </p>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                    Keep showing up and building consistency, one workout at a time.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className='rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm'>
            <Activity size={32} className='mx-auto text-blue-700' />
            <h2 className='mt-3 font-semibold text-[#193663]'>No progress data available</h2>
            <button
              type='button'
              onClick={handleRefresh}
              className='mt-4 rounded-full bg-[#244C91] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800'
            >
              Load progress
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
