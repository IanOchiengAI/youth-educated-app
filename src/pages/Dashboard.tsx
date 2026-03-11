import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Flame, Trophy, BookOpen, Users } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';
import { getCurrentTier } from '../utils/gamification';

const COHORT_ACTIVITIES = [
  "Someone finished Module 1",
  "A teammate reached 500 pts",
  "Module 2: Ethics was completed",
  "New goal added by a peer",
  "Someone completed a weekly reflection",
  "A peer joined a mentorship session",
  "Achievement unlocked: 'Fast Learner'",
  "Someone shared a goal with their mentor"
];

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const [activities, setActivities] = useState<string[]>([]);
  const currentTier = getCurrentTier(state.progress.points);

  useEffect(() => {
    // Shuffle activities on load
    const shuffled = [...COHORT_ACTIVITIES].sort(() => 0.5 - Math.random()).slice(0, 4);
    setActivities(shuffled);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="bg-navy p-6 rounded-b-[32px] shadow-lg">
        <div className="flex justify-between items-start mb-6 pt-4">
          <div className="space-y-1">
            <h1 className="text-white text-2xl font-poppins font-bold">Jambo, {state.user?.name.split(' ')[0]}.</h1>
            <div className="inline-flex items-center bg-yellow px-3 py-1 rounded-full shadow-sm">
              <span className="text-navy font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                {currentTier.icon} {currentTier.swahili}
              </span>
            </div>
          </div>
          <div className="bg-white/10 px-3 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-sm border border-white/5">
            <Flame size={20} className="text-yellow fill-yellow" />
            <span className="text-white font-bold text-xl">{state.progress.streakDays}</span>
          </div>
        </div>
      </section>

      <div className="px-4 space-y-6 -mt-10">
        {/* Weekly Challenge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card border-t-4 border-yellow shadow-xl"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-grey text-[11px] font-bold uppercase tracking-wider">Weekly Challenge</span>
            <Trophy size={20} className="text-navy" />
          </div>
          <h2 className="text-lg mb-3 font-poppins font-bold">Speak up in class today</h2>
          <div className="space-y-2">
            <div className="w-full bg-off-white h-2.5 rounded-full overflow-hidden">
              <div className="bg-navy h-full w-1/3 rounded-full" />
            </div>
            <p className="text-grey text-[13px] font-medium">4 of 12 students done</p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Weekly Points', value: state.progress.weeklyPoints, icon: Trophy },
            { label: 'Day Streak', value: state.progress.streakDays, icon: Flame },
            { label: 'Modules Done', value: state.modules.completed.length, icon: BookOpen },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="card flex flex-col items-center justify-center text-center p-3 shadow-sm"
            >
              <span className="text-navy font-bold text-xl">{stat.value}</span>
              <span className="text-grey text-[10px] uppercase font-bold mt-1 leading-tight">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Cohort Activity */}
        <section className="card space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-sm font-poppins font-bold text-navy">Your Cohort This Week</h3>
            <button className="text-navy text-xs font-bold">View All</button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-off-white flex items-center justify-center shrink-0">
                  <Users size={18} className="text-grey" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-navy/80 font-medium">{activity}</p>
                  <span className="text-grey text-[11px]">{i + 1}m ago</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <Leaderboard />
      </div>
    </div>
  );
};

export default Dashboard;
