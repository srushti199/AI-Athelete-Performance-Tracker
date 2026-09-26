import { ChartNoAxesColumn, Target, HeartPulse } from "lucide-react";

import FeatureCard from "./FeatureCard";

function PlatformSection() {
  return (
    <section id='platform' className='border-t border-slate-200 bg-white'>
      <div className='mx-auto max-w-6xl px-5 py-20'>
        <div className='max-w-2xl'>
          <p className='text-xs font-bold tracking-[0.16em] text-[#31579f]'>
            ONE CONNECTED PLATFORM
          </p>

          <h2 className='mt-4 text-3xl font-bold tracking-tight sm:text-4xl'>
            Everything an athlete needs to improve.
          </h2>

          <p className='mt-4 text-base leading-7 text-slate-600'>
            Athlix connects training, nutrition, recovery, and goals, so you can focus on becoming a
            better athlete.
          </p>
        </div>

        <div className='mt-12 grid gap-5 md:grid-cols-3'>
          <FeatureCard
            icon={ChartNoAxesColumn}
            title='Personalized training'
            description='AI workout plans that adapt to your sport, goals, progress, and injury history.'
          />

          <FeatureCard
            icon={Target}
            title='Focused goals'
            description='Set performance goals, track progress, and stay motivated with clear milestones.'
          />

          <FeatureCard
            icon={HeartPulse}
            title='Smarter recovery'
            description='Track injuries and recovery so your training plan supports your body.'
          />
        </div>
      </div>
    </section>
  );
}

export default PlatformSection;
