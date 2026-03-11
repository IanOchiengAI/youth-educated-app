import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { GOAL_OPTIONS } from '../constants';
import { motion } from 'motion/react';
import { Target, CheckCircle2, Plus, Calendar, Share2, ArrowRight } from 'lucide-react';

const Goals: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showAddGoal, setShowAddGoal] = useState(false);

  const handleToggleGoal = (title: string) => {
    // In a real app, this would update a 'completed' status for the day
    dispatch({ type: 'ADD_POINTS', payload: 10 });
  };

  const progress = Math.min(100, (state.user?.goals.length || 0) * 33);

  return (
    <div className="space-y-6">
      <header className="bg-navy px-6 pt-8 pb-12 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white">Your Week</h1>
            <div className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2">
              <Calendar size={14} className="text-yellow" />
              <span className="text-white text-[11px] font-bold uppercase tracking-wider">Oct 12 - 18</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#FFD700"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * progress) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-xl">{progress}%</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg mb-1">On Track!</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                You've logged {state.user?.goals.length} goals this week. Keep going!
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow/10 rounded-full blur-3xl" />
      </header>

      <div className="px-4 space-y-6 -mt-6">
        {/* Weekly Summary Banner (Friday State) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-yellow p-5 rounded-[24px] shadow-lg flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="text-navy font-bold text-[16px]">Weekly Summary Ready</h4>
            <p className="text-navy/70 text-xs">Reflect on your progress this week.</p>
          </div>
          <button className="bg-navy text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
            Share <Share2 size={14} />
          </button>
        </motion.div>

        {/* Goals List */}
        <div className="space-y-4">
          {state.user?.goals.map((goalTitle, i) => {
            const goalInfo = GOAL_OPTIONS.find(g => g.title === goalTitle);
            return (
              <motion.div
                key={goalTitle}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="card border-l-8 border-navy flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-off-white flex items-center justify-center text-2xl">
                    {goalInfo?.icon || '🎯'}
                  </div>
                  <div>
                    <h4 className="text-[16px] mb-1">{goalTitle}</h4>
                    <span className="text-grey text-[11px] font-bold uppercase tracking-wider">Daily Log</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleGoal(goalTitle)}
                  className="w-10 h-10 rounded-full bg-off-white border-2 border-navy/10 flex items-center justify-center text-navy/20 hover:text-navy hover:border-navy transition-all"
                >
                  <CheckCircle2 size={24} />
                </button>
              </motion.div>
            );
          })}

          {/* Add Goal Card */}
          <button
            onClick={() => setShowAddGoal(true)}
            className="w-full border-2 border-dashed border-navy/20 rounded-[24px] p-6 flex flex-col items-center justify-center gap-2 text-navy/40 hover:text-navy hover:border-navy transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center">
              <Plus size={24} />
            </div>
            <span className="font-bold text-sm">Add New Goal</span>
          </button>
        </div>
      </div>

      {/* Add Goal Modal (Simplified) */}
      {showAddGoal && (
        <div className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-sm flex items-end">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="w-full bg-white rounded-t-[40px] p-8 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl">Choose a Goal</h2>
              <button onClick={() => setShowAddGoal(false)} className="text-grey">Close</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  key={goal.title}
                  onClick={() => {
                    // In a real app, update state.user.goals
                    setShowAddGoal(false);
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-off-white hover:bg-pale-yellow transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-bold text-navy">{goal.title}</span>
                  </div>
                  <ArrowRight size={20} className="text-navy/20" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Goals;
