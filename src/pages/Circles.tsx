import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  MessageCircle, 
  Heart, 
  Users, 
  Sparkles, 
  Send,
  Shield,
  Clock,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { CIRCLE_PROMPTS, CIRCLE_MEMBERS, CirclePrompt } from '../data/circles';
import { checkSafeguarding } from '../lib/safeguarding';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { supabase } from '../lib/supabase';
import { queueOfflineAction } from '../lib/sync';

const Circles: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [activePrompt, setActivePrompt] = useState<CirclePrompt | null>(null);
  const [responseText, setResponseText] = useState('');

  const weekNumber = Math.ceil(new Date().getDate() / 7);

  const responses = useLiveQuery(
    () => db.circleResponses.where('weekNumber').equals(weekNumber).reverse().toArray(),
    [weekNumber]
  );

  useEffect(() => {
    const filtered = CIRCLE_PROMPTS.filter(p => {
      if (p.gender && p.gender !== 'all' && p.gender !== state.user?.gender) return false;
      if (p.minAge && parseInt(state.user?.ageBracket.split('-')[0] || '10') < p.minAge) return false;
      return true;
    });
    
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setActivePrompt(random);

    // Initial fetch from Supabase if online
    if (!state.isOffline && state.user) {
      supabase.from('circle_responses')
        .select('*')
        .eq('week_number', weekNumber)
        .then(({ data }) => {
          if (data) {
            data.forEach(async (r: any) => {
              const existing = await db.circleResponses.where({ userId: r.user_id, weekNumber: r.week_number }).first();
              if (!existing) {
                await db.circleResponses.add({
                  circleId: r.circle_id || 'default',
                  userId: r.user_id,
                  weekNumber: r.week_number,
                  responseText: r.response_text,
                  synced: true
                });
              }
            });
          }
        });
    }
  }, [state.user, state.isOffline, weekNumber]);

  const handlePostResponse = async () => {
    if (!responseText.trim() || !state.user) return;

    // 1. Safeguarding
    const safeguard = checkSafeguarding(responseText, state.user.ageBracket);
    if (safeguard.triggered) {
      // Sync safeguarding event
      if (!state.isOffline) {
        await supabase.from('ai_conversations').upsert({
          user_id: state.user.id,
          message_history: [{ role: 'user', content: responseText }],
          safeguarding_flagged: true,
          updated_at: new Date().toISOString()
        });
      }
      alert("Please keep our community safe. Your message contains sensitive content.");
      return;
    }

    const payload = {
      circle_id: 'default-circle-id', // In a real app, this would be dynamic
      week_number: weekNumber,
      response_text: responseText
    };

    // 2. Local Update
    await db.circleResponses.add({
      circleId: payload.circle_id,
      userId: state.user.id,
      weekNumber: weekNumber,
      responseText: responseText,
      synced: !state.isOffline
    });

    // 3. Sync
    if (!state.isOffline) {
      const { error } = await supabase.from('circle_responses').insert({
        user_id: state.user.id,
        ...payload
      });
      if (error) await queueOfflineAction(state.user.id, 'CIRCLE_RESPONSE', payload);
    } else {
      await queueOfflineAction(state.user.id, 'CIRCLE_RESPONSE', payload);
    }

    // 4. Award points
    dispatch({ type: 'ADD_POINTS', payload: { points: 25, reason: 'Circle Participation' } });
    setResponseText('');
  };

  const hasSubmittedThisWeek = responses?.some(r => r.userId === state.user?.id);

  return (
    <div className="min-h-screen bg-off-white pb-32">
      <header className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-60 h-60 bg-yellow/5 rounded-full blur-3xl opacity-20" />
        
        <div className="flex justify-between items-start mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold font-poppins text-yellow">Your Circle</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{state.user?.county || 'Kenya'} Cohort</p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
          {CIRCLE_MEMBERS.map((member) => (
            <div key={member.id} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/10 relative shadow-inner">
                {member.avatar}
                {member.lastActive === 'Active' && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-navy" />}
              </div>
              <span className="text-[10px] font-bold text-white/60 font-nunito">{member.name}</span>
            </div>
          ))}
          <button className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 border border-white/5 flex-shrink-0 hover:bg-white/10 transition-colors">
            <Users size={20} />
          </button>
        </div>
      </header>

      <main className="px-6 -mt-8 space-y-6">
        <section className="bg-white p-8 rounded-[40px] shadow-xl shadow-navy/5 border border-navy/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow text-navy rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
              <Sparkles size={11} /> 
              {activePrompt?.category === 'brothers-keeper' ? "Brother's Keeper" : "Weekly Check-in"}
            </div>
            <div className="flex items-center gap-1 text-navy/20 font-bold text-[9px] uppercase tracking-wider">
              <Clock size={12} />
              Week {weekNumber}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-navy leading-tight font-poppins">
            {activePrompt?.question}
          </h3>

          <div className="relative">
            <textarea 
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder={hasSubmittedThisWeek ? "Join the conversation..." : "What's your take? Share with the circle..."}
              className="w-full bg-off-white rounded-[32px] p-6 text-navy placeholder:text-navy/20 outline-none focus:border-yellow border border-navy/5 transition-all h-32 font-nunito shadow-inner"
            />
            <button 
              disabled={!responseText.trim()}
              onClick={handlePostResponse}
              className={`absolute bottom-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                responseText.trim() ? 'bg-navy text-white shadow-xl shadow-navy/20' : 'bg-grey/10 text-grey cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </section>

        <div className="space-y-4 pt-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30 ml-2">Circle Feed ({responses?.length || 0})</h4>
          
          <AnimatePresence initial={false}>
            {responses?.map((resp) => (
              <motion.div 
                key={resp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm space-y-4 group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-off-white rounded-xl flex items-center justify-center text-lg shadow-inner">
                      {resp.userId === state.user?.id ? (state.user?.gender === 'female' ? '👩‍🎓' : '👨‍🎓') : '👤'}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-navy font-poppins">{resp.userId === state.user?.id ? 'You' : 'Scholar'}</h5>
                      <p className="text-[9px] text-navy/30 font-black uppercase tracking-wider">{!resp.synced ? 'Pending Sync' : 'Shared'}</p>
                    </div>
                  </div>
                  <button className="text-navy/10 hover:text-navy transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
                
                <p className="text-[15px] text-navy/80 leading-relaxed font-nunito font-medium">
                  {resp.responseText}
                </p>

                <div className="flex gap-6 pt-2">
                  <button className="flex items-center gap-2 text-navy/20 hover:text-red-500 transition-colors group/btn">
                    <Heart size={18} className="group-hover/btn:fill-red-500" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Support</span>
                  </button>
                  <button className="flex items-center gap-2 text-navy/20 hover:text-navy transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Reply</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {(!responses || responses.length === 0) && (
            <div className="text-center py-12 opacity-20">
              <MessageCircle size={48} className="mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Start the conversation</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 py-8 opacity-20">
          <Shield size={14} className="text-navy" />
          <span className="text-[10px] font-black uppercase tracking-widest text-navy">Verified Safe Space</span>
        </div>
      </main>
    </div>
  );
};

export default Circles;
