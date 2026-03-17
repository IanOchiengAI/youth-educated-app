import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  CloudRain, 
  Sun, 
  ChevronRight, 
  Sparkles,
  MessageCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppContext } from '../AppContext';
import { addPoints } from '../lib/gamification';
import { checkSafeguarding } from '../lib/safeguarding';
import { supabase } from '../lib/supabase';
import { queueOfflineAction } from '../lib/sync';
import { db } from '../lib/db';

interface MoodLog {
  date: string;
  score: number;
  emoji: string;
  note?: string;
}

const MOODS = [
  { score: 1, emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-600', active: 'bg-blue-500 text-white' },
  { score: 2, emoji: '😕', label: 'Low', color: 'bg-indigo-100 text-indigo-600', active: 'bg-indigo-500 text-white' },
  { score: 3, emoji: '😐', label: 'Okay', color: 'bg-grey/10 text-grey', active: 'bg-grey text-white' },
  { score: 4, emoji: '😊', label: 'Good', color: 'bg-green-100 text-green-600', active: 'bg-green-500 text-white' },
  { score: 5, emoji: '🤩', label: 'Great', color: 'bg-yellow shadow-lg shadow-yellow/30 text-navy', active: 'bg-yellow text-navy' },
];

const MoodTracker: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { state, dispatch } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [jabariResponse, setJabariResponse] = useState('');

  const handleSubmit = async () => {
    if (selectedMood === null) return;

    // 1. Safeguarding on note
    const safeguard = checkSafeguarding(note, state.user?.ageBracket || '16-18');
    
    // 2. Points
    const result = addPoints(
      'MOOD_CHECKIN',
      state.progress.points,
      state.progress.weeklyPoints,
      state.progress.lastWeeklyReset
    );
    dispatch({ type: 'ADD_POINTS', payload: { points: 10, reason: 'Mood Check-in' } });

    // 3. Persistence & Sync
    const logDate = new Date().toISOString().split('T')[0];
    const payload = {
      mood: MOODS.find(m => m.score === selectedMood)!.label,
      energy_level: selectedMood * 2, // Map 1-5 to 1-10
      log_date: logDate,
      shared_with_mentor: false
    };

    if (state.user) {
      if (!state.isOffline) {
        const { error } = await supabase.from('mood_logs').insert({
          user_id: state.user.id,
          ...payload
        });
        if (error) {
          await queueOfflineAction(state.user.id, 'MOOD_LOG', payload);
        }
      } else {
        await queueOfflineAction(state.user.id, 'MOOD_LOG', payload);
      }
      
      // Local DB update for instant UI feedback in Profile
      await db.moodLogs.add({
        userId: state.user.id,
        mood: payload.mood,
        energyLevel: payload.energy_level,
        logDate: payload.log_date,
        sharedWithMentor: payload.shared_with_mentor,
        synced: !state.isOffline
      });
    }
    
    // Legacy persistence for compatibility (optional but kept as fallback)
    const moodLog: MoodLog = {
      date: new Date().toISOString(),
      score: selectedMood,
      emoji: MOODS.find(m => m.score === selectedMood)!.emoji,
      note: note.trim() || undefined
    };
    const logs = JSON.parse(localStorage.getItem('youth_educated_moods') || '[]');
    logs.push(moodLog);
    localStorage.setItem('youth_educated_moods', JSON.stringify(logs));

    // 4. Jabari Response
    let resp = "";
    if (safeguard.triggered) {
      resp = safeguard.escalationText!;
      // Special sync for safeguarding flag
      if (state.user && !state.isOffline) {
        await supabase.from('ai_conversations').upsert({
          user_id: state.user.id,
          message_history: [{ role: 'user', content: note }, { role: 'assistant', content: resp }],
          safeguarding_flagged: true,
          updated_at: new Date().toISOString()
        });
      }
    } else if (selectedMood <= 2) {
      resp = "Pole sana. I'm sorry you're feeling this way. Remember, I'm here if you want to talk about it. 💙 You are not alone.";
    } else if (selectedMood === 3) {
      resp = "It's okay to have quiet days. Take it easy today! 😊";
    } else {
      resp = "Safi sana! I love to see you feeling great. Let's keep that energy going! 🌟";
    }
    
    setJabariResponse(resp);
    setIsSubmitted(true);
    
    if (selectedMood >= 4) {
      confetti({ particleCount: 100, spread: 50, origin: { y: 0.8 }, colors: ['#FACC15', '#1E3A8A'] });
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 border border-navy/5 shadow-xl shadow-navy/5 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-navy">How are you feeling, {state.user?.name}?</h3>
              <p className="text-navy/40 text-sm font-medium">Checking in helps you track your wellness.</p>
            </div>

            <div className="flex justify-between items-center px-2">
              {MOODS.map((m) => (
                <button
                  key={m.score}
                  onClick={() => setSelectedMood(m.score)}
                  className={`flex flex-col items-center gap-3 transition-all ${
                    selectedMood === m.score ? 'scale-125' : 'scale-100 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-3xl transition-all ${
                    selectedMood === m.score ? m.active : 'bg-off-white'
                  }`}>
                    {m.emoji}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    selectedMood === m.score ? 'text-navy' : 'text-navy/20'
                  }`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-navy/30 ml-1">Any particular reason? (Optional)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?..."
                className="w-full bg-off-white border border-navy/5 rounded-[32px] p-5 text-navy outline-none focus:border-yellow focus:bg-white transition-all h-24 placeholder:text-navy/20"
              />
            </div>

            <button
              disabled={selectedMood === null}
              onClick={handleSubmit}
              className={`w-full py-5 rounded-full font-bold text-lg transition-all shadow-xl ${
                selectedMood !== null 
                  ? 'bg-navy text-white shadow-navy/20 scale-100' 
                  : 'bg-grey/10 text-grey cursor-not-allowed scale-95'
              }`}
            >
              Check In (+10 Pts)
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="response"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-4"
          >
            <div className="w-20 h-20 bg-yellow rounded-full mx-auto flex items-center justify-center text-navy text-4xl shadow-xl shadow-yellow/20">
              🦁
            </div>
            <div className="bg-yellow/10 border border-yellow/20 p-6 rounded-[32px] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow rounded-full border-4 border-white flex items-center justify-center">
                <Sparkles size={14} className="text-navy" />
              </div>
              <p className="text-navy font-bold text-lg leading-relaxed">
                {jabariResponse}
              </p>
            </div>
            <button 
              onClick={() => onComplete?.()}
              className="w-full py-4 bg-navy text-white rounded-full font-bold text-sm"
            >
              Continue My Day
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodTracker;
