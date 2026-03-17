import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MessageCircle, 
  BookOpen, 
  Trophy, 
  ChevronRight, 
  Sparkles, 
  Target, 
  Heart,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Compass,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import Leaderboard from '../components/Leaderboard';
import MoodTracker from '../components/MoodTracker';
import { getCurrentTier, getProgressToNextTier } from '../utils/gamification';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  const currentTier = getCurrentTier(state.progress.points);
  const progressToNext = getProgressToNextTier(state.progress.points);

  const QUICK_ACTIONS = [
    { id: 'chat', label: 'Ask Jabari', icon: <MessageCircle size={24} />, color: 'bg-blue-500', path: '/chat' },
    { id: 'career', label: 'Career Map', icon: <Compass size={24} />, color: 'bg-purple-500', path: '/career-mapper' },
    { id: 'opps', label: 'Opps Board', icon: <Briefcase size={24} />, color: 'bg-orange-500', path: '/opportunities' },
    { id: 'goals', label: 'My Goals', icon: <Target size={24} />, color: 'bg-green-500', path: '/goals' },
  ];

  return (
    <div className="min-h-screen bg-off-white pb-24">
      {/* Navy Hero Section */}
      <header className="bg-navy text-white pt-12 pb-20 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">Jambo, {state.user?.name}!</h1>
            <p className="text-white/60 font-medium">Ready for your next step?</p>
          </div>
          <div className="w-12 h-12 bg-yellow rounded-2xl flex items-center justify-center text-navy shadow-lg shadow-yellow/20">
            <Trophy size={28} />
          </div>
        </div>

        <div className="bg-white/10 rounded-[32px] p-6 border border-white/10 backdrop-blur-md relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{currentTier.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Current Tier</p>
                <h3 className="text-xl font-bold text-yellow">{currentTier.swahili}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{state.progress.points}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Points</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>Next: {progressToNext.nextTier?.swahili || 'MAX'}</span>
              <span>{Math.round(progressToNext.percent)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-yellow"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext.percent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-10 space-y-8 relative z-20">
        {/* Quick Actions Grid */}
        <section className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 ${action.color} text-white rounded-[20px] flex items-center justify-center shadow-lg group-active:scale-90 transition-all`}>
                {action.icon}
              </div>
              <span className="text-[10px] font-bold text-navy uppercase tracking-tighter text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </section>

        {/* Daily Mood Check-in Card */}
        <section 
          onClick={() => setShowMoodTracker(true)}
          className="bg-yellow rounded-[40px] p-8 flex items-center justify-between shadow-xl shadow-yellow/20 cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-navy leading-tight">Mood Check-in</h3>
            <p className="text-navy/70 text-sm font-medium">Earn +10 points daily.</p>
          </div>
          <div className="w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center shadow-lg">
            <Heart size={28} className="fill-current" />
          </div>
        </section>

        {/* Cohort Activity Feed (Horizontal) */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-navy">Circle Activity</h2>
            <button onClick={() => navigate('/circles')} className="text-xs font-bold text-blue-600 flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[280px] bg-white p-5 rounded-[32px] border border-navy/5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-off-white rounded-xl flex items-center justify-center text-sm shadow-inner">
                    {['🦁', '🦒', '🐘'][i-1]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy">{['Juma', 'Zainab', 'Mwangi'][i-1]}</h4>
                    <p className="text-[9px] text-navy/30 font-bold uppercase">{i * 10}m ago</p>
                  </div>
                </div>
                <p className="text-xs text-navy/60 font-medium line-clamp-2">
                  {i === 1 ? "Just completed the High Confidence module! Highly recommend. 🔥" : 
                   i === 2 ? "Who wants to study together this Saturday? 📚" : 
                   "Started a new goal: Save 500 KES this month! 💰"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Continue Learning */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-navy">Continue Learning</h2>
          <div 
            onClick={() => navigate('/learn/finance')}
            className="bg-navy rounded-[40px] p-8 text-white flex items-center justify-between shadow-xl shadow-navy/20 cursor-pointer group"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Module 3</span>
              <h3 className="text-2xl font-bold leading-tight">Financial Literacy</h3>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1 text-[10px] font-bold text-white/40">
                  <BookOpen size={12} /> 12 min left
                </div>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-yellow rounded-full" />
                </div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow group-hover:text-navy transition-all">
              <ChevronRight size={24} />
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="space-y-4 pb-4">
          <h2 className="text-xl font-bold text-navy">Top of the Cohort</h2>
          <Leaderboard />
        </section>
      </main>

      {/* Mood Tracker Modal */}
      <AnimatePresence>
        {showMoodTracker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMoodTracker(false)}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm relative z-10"
            >
              <button 
                onClick={() => setShowMoodTracker(false)}
                className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
              <MoodTracker onComplete={() => setShowMoodTracker(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
