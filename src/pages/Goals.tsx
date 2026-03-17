import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  Target, 
  Sparkles,
  BarChart3,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppContext } from '../AppContext';
import { addPoints } from '../lib/gamification';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { supabase } from '../lib/supabase';
import { queueOfflineAction } from '../lib/sync';

const Goals: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [newGoalText, setNewGoalText] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  const weekNumber = Math.ceil(new Date().getDate() / 7);

  const goals = useLiveQuery(
    () => db.goals.where('userId').equals(state.user?.id || '').and(g => g.weekNumber === weekNumber).toArray(),
    [state.user?.id, weekNumber]
  );

  const addGoal = async () => {
    if (!newGoalText.trim() || !state.user) return;
    
    const payload = {
      title: newGoalText.trim(),
      is_completed: false,
      week_number: weekNumber
    };

    // 1. Local UX update
    const id = await db.goals.add({
      userId: state.user.id,
      title: payload.title,
      isCompleted: false,
      weekNumber: weekNumber,
      synced: !state.isOffline
    });

    // 2. Sync
    if (!state.isOffline) {
      const { error } = await supabase.from('goals').insert({
        user_id: state.user.id,
        ...payload
      });
      if (error) await queueOfflineAction(state.user.id, 'GOAL_CREATE', payload);
    } else {
      await queueOfflineAction(state.user.id, 'GOAL_CREATE', payload);
    }

    setNewGoalText('');
  };

  const toggleGoal = async (id: number, currentStatus: boolean) => {
    if (!state.user) return;

    // 1. Local update
    await db.goals.update(id, { isCompleted: !currentStatus });

    if (!currentStatus) {
      // Award points for completion
      dispatch({ type: 'ADD_POINTS', payload: { points: 15, reason: 'Goal Completed' } });
      confetti({ particleCount: 40, spread: 30, origin: { y: 0.8 } });
      
      // Sync completion
      const goal = await db.goals.get(id);
      if (goal && !state.isOffline) {
        // We need the remote ID if we want to update it. 
        // For simplicity, we'll use a title-based match or assume we have the ID from Supabase.
        // In a real app, 'goals' table would have a 'remote_id'.
        const { error } = await supabase.from('goals').update({ is_completed: true }).eq('user_id', state.user.id).eq('title', goal.title);
        if (error) await queueOfflineAction(state.user.id, 'GOAL_COMPLETE', { title: goal.title });
      } else if (state.isOffline) {
        await queueOfflineAction(state.user.id, 'GOAL_COMPLETE', { title: goal?.title });
      }
    }
  };

  const deleteGoal = async (id: number) => {
    await db.goals.delete(id);
  };

  const handleReflectionSubmit = () => {
    if (!reflectionText.trim()) return;
    
    dispatch({ type: 'ADD_POINTS', payload: { points: 40, reason: 'Weekly Reflection' } });
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E3A8A', '#FACC15']
    });

    setShowReflection(false);
    setReflectionText('');
  };

  const completedCount = goals?.filter(g => g.isCompleted).length || 0;
  const totalCount = goals?.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const REFLECTION_PROMPTS = [
    "What's one thing you're proud of achieving this week?",
    "What was your biggest challenge, and how did you face it?",
    "What's one thing you learned about yourself this week?",
    "Who is someone who supported you this week?",
    "What's your main focus for next week?"
  ];

  const currentPrompt = REFLECTION_PROMPTS[new Date().getDay() % REFLECTION_PROMPTS.length];

  return (
    <div className="min-h-screen bg-off-white pb-32">
      <header className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1 font-poppins text-yellow">Weekly Goals</h1>
            <p className="text-white/60 font-nunito">Small steps, big impact.</p>
          </div>
          <div className="w-14 h-14 bg-yellow rounded-2xl flex items-center justify-center text-navy shadow-lg shadow-yellow/20">
            <Target size={32} />
          </div>
        </div>

        <div className="bg-white/10 rounded-3xl p-6 border border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Weekly Progress</span>
            <span className="text-yellow font-bold">{completedCount}/{totalCount} Goals</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-yellow"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      <main className="px-6 -mt-8 space-y-8">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-navy/5 flex gap-3">
          <input 
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            placeholder="Add a new goal..."
            className="flex-1 bg-transparent px-2 outline-none text-navy placeholder:text-navy/30 font-medium font-nunito"
          />
          <button 
            onClick={addGoal}
            className="w-10 h-10 bg-navy text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-navy/20"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {totalCount === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center text-navy/20 mx-auto">
                  <Sparkles size={32} />
                </div>
                <p className="text-navy/40 font-black uppercase text-[10px] tracking-widest">No goals set yet</p>
              </div>
            ) : (
              goals?.map((goal) => (
                <motion.div 
                  key={goal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`bg-white p-5 rounded-3xl border flex items-center gap-4 transition-all shadow-sm ${
                    goal.isCompleted ? 'border-green-100 bg-green-50/30' : 'border-navy/5'
                  }`}
                >
                  <button 
                    onClick={() => goal.id && toggleGoal(goal.id, goal.isCompleted)}
                    className={`flex-shrink-0 transition-colors ${goal.isCompleted ? 'text-green-500' : 'text-navy/20'}`}
                  >
                    {goal.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <p className={`flex-1 font-bold text-navy font-nunito ${goal.isCompleted ? 'line-through text-navy/30' : ''}`}>
                    {goal.title}
                  </p>
                  <button 
                    onClick={() => goal.id && deleteGoal(goal.id)}
                    className="p-2 text-red-400 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <section className="bg-yellow rounded-[40px] p-8 space-y-6 shadow-xl shadow-yellow/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy text-white rounded-2xl flex items-center justify-center shadow-lg shadow-navy/10">
              <MessageCircle size={20} />
            </div>
            <h3 className="text-xl font-bold text-navy font-poppins">Weekly Reflection</h3>
          </div>
          <p className="text-navy/70 leading-relaxed font-bold font-nunito">
            Reflection helps you grow. Spend 2 minutes reviewing your progress and earn bonus points.
          </p>
          <button 
            onClick={() => setShowReflection(true)}
            className="w-full py-5 bg-navy text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-navy/20"
          >
            Start Reflection
            <ChevronRight size={22} />
          </button>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm space-y-2">
            <BarChart3 size={24} className="text-blue-500" />
            <p className="text-2xl font-bold text-navy font-poppins">{state.progress.weeklyPoints}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Weekly Points</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm space-y-2">
            <Calendar size={24} className="text-orange-500" />
            <p className="text-2xl font-bold text-navy font-poppins">{state.progress.streakDays}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Day Streak</p>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showReflection && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-md p-6 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 space-y-8 overflow-hidden relative shadow-2xl"
            >
              <button 
                onClick={() => setShowReflection(false)}
                className="absolute top-6 right-6 p-2 text-navy/20 hover:text-navy transition-colors"
              >
                <Trash2 size={24} />
              </button>

              <div className="space-y-4 pt-4">
                <div className="w-16 h-16 bg-yellow rounded-3xl flex items-center justify-center text-navy text-3xl shadow-lg shadow-yellow/20">
                  ✨
                </div>
                <h3 className="text-2xl font-bold text-navy leading-tight font-poppins">{currentPrompt}</h3>
                <textarea 
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="w-full min-h-[160px] bg-off-white border-2 border-navy/5 rounded-3xl p-6 text-navy placeholder:text-navy/20 focus:border-yellow focus:bg-white outline-none transition-all font-nunito"
                  placeholder="Type your reflection here..."
                />
              </div>

              <button 
                disabled={!reflectionText.trim()}
                onClick={handleReflectionSubmit}
                className={`w-full py-5 rounded-full font-bold text-lg transition-all ${
                  reflectionText.trim() ? 'bg-yellow text-navy shadow-xl shadow-yellow/20' : 'bg-grey/10 text-grey cursor-not-allowed'
                }`}
              >
                Earn +40 Points
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
