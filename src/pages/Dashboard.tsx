import React, { useState, useEffect } from 'react';
import { t, type Language } from '../lib/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  Target, 
  Heart,
  Users,
  Briefcase,
  Compass,
  X,
  ThumbsUp,
  Send,
  RefreshCw,
  BrainCircuit
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import Leaderboard from '../components/Leaderboard';
import MoodTracker from '../components/MoodTracker';
import { getCurrentTier, getProgressToNextTier } from '../utils/gamification';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { useLiveQuery } from 'dexie-react-hooks';
import { checkSafeguarding } from '../lib/safeguarding';
import { MODULES } from '../data/modules';
import { LIFEKIT_ARTICLES } from '../data/lifekit';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const lang: Language = state.user?.language ?? 'English';

  // Nudge state
  const [unreadNudge, setUnreadNudge] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyStatus, setReplyStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Session Commit state
  const [upcomingSession, setUpcomingSession] = useState<any | null>(null);
  const [commitmentText, setCommitmentText] = useState('');
  const [savingCommitment, setSavingCommitment] = useState(false);

  // Session Rating state
  const [unratedSession, setUnratedSession] = useState<any | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(0);
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    if (!state.user?.id) return;

    const fetchUpcomingSession = async () => {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('mentor_sessions')
        .select(`
          id, scheduled_at, title, student_commitment, mentor_id,
          profiles!mentor_sessions_mentor_id_fkey(name)
        `)
        .eq('mentee_id', state.user.id)
        .eq('status', 'confirmed')
        .gte('scheduled_at', startOfToday.toISOString())
        .lte('scheduled_at', endOfToday.toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .single();
      
      if (data && !data.student_commitment && !error) {
        setUpcomingSession(data);
      } else {
        setUpcomingSession(null);
      }
    };
    
    fetchUpcomingSession();

    const channel = supabase
      .channel('dashboard_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_sessions' }, () => {
        fetchUpcomingSession();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.user?.id]);

  useEffect(() => {
    const fetchUnratedSession = async () => {
      if (!state.user?.id) return;
      
      const { data: recentCompleted } = await supabase
        .from('mentor_sessions')
        .select('id, title, mentor_id, profiles!mentor_sessions_mentor_id_fkey(name)')
        .eq('mentee_id', state.user.id)
        .eq('status', 'completed')
        .order('scheduled_at', { ascending: false })
        .limit(5);

      if (recentCompleted && recentCompleted.length > 0) {
        const sessionIds = recentCompleted.map(s => s.id);
        const { data: ratings } = await supabase
          .from('session_ratings')
          .select('session_id')
          .in('session_id', sessionIds)
          .eq('rater_id', state.user.id);
        
        const ratedIds = new Set(ratings?.map(r => r.session_id) || []);
        const unrated = recentCompleted.find(s => !ratedIds.has(s.id));
        if (unrated) {
          setUnratedSession(unrated);
        }
      }
    };
    fetchUnratedSession();
  }, [state.user?.id]);

  const handleSaveCommitment = async () => {
    if (!upcomingSession || !commitmentText.trim()) return;
    
    const safeCheck = checkSafeguarding(commitmentText, state.user?.ageBracket || '', state.user?.id, 'session_commitment');
    if (safeCheck.triggered && safeCheck.escalationText) {
      alert(safeCheck.escalationText);
    }

    setSavingCommitment(true);
    const { error } = await supabase
      .from('mentor_sessions')
      .update({ student_commitment: commitmentText.trim() })
      .eq('id', upcomingSession.id);
    
    if (!error) {
      setUpcomingSession(null);
    }
    setSavingCommitment(false);
  };

  const handleSaveRating = async () => {
    if (!unratedSession || ratingScore === 0) return;
    setSavingRating(true);
    const { error } = await supabase
      .from('session_ratings')
      .insert({
        session_id: unratedSession.id,
        rater_id: state.user?.id,
        score: ratingScore
      });
    if (!error) setUnratedSession(null);
    setSavingRating(false);
  };

  useEffect(() => {
    if (!state.user?.id) return;

    const fetchUnreadNudge = async () => {
      const { data, error } = await supabase
        .from('mentor_nudges')
        .select(`
          id, message, created_at,
          mentor_matches!inner(student_id, status),
          profiles!mentor_nudges_mentor_id_fkey(name)
        `)
        .eq('mentor_matches.student_id', state.user.id)
        .eq('mentor_matches.status', 'active')
        .is('read_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data && !error) {
        setUnreadNudge(data);
      } else {
        setUnreadNudge(null);
      }
    };

    fetchUnreadNudge();

    const channel = supabase
      .channel('dashboard_nudges')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mentor_nudges' }, () => {
        fetchUnreadNudge();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mentor_nudges' }, () => {
        fetchUnreadNudge();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.user?.id]);

  const handleGotIt = async () => {
    if (!unreadNudge) return;
    setUnreadNudge(null);
    await supabase
      .from('mentor_nudges')
      .update({ read_at: new Date().toISOString() })
      .eq('id', unreadNudge.id);
  };

  const handleReply = async () => {
    if (!unreadNudge || !replyText.trim()) return;
    
    const safeCheck = checkSafeguarding(replyText, state.user?.ageBracket || '', state.user?.id, 'nudge_reply');
    if (safeCheck.triggered && safeCheck.escalationText) {
      alert(safeCheck.escalationText);
    }

    setReplyStatus('sending');
    const { error } = await supabase
      .from('mentor_nudges')
      .update({ 
        response: replyText.trim(),
        read_at: new Date().toISOString() 
      })
      .eq('id', unreadNudge.id);
    
    if (!error) {
      setUnreadNudge(null);
    } else {
      setReplyStatus('idle');
    }
  };
  
  const [todaysWisdom, setTodaysWisdom] = useState<{ text: string; mentorName: string } | null>(null);
  const [isWisdomExpanded, setIsWisdomExpanded] = useState(false);

  useEffect(() => {
    const fetchMentorWisdom = async () => {
      if (!state.user?.id) return;
      
      const { data, error } = await supabase
        .from('mentor_matches')
        .select(`
          mentor_id,
          profiles!mentor_matches_mentor_id_fkey (
            name
          )
        `)
        .eq('student_id', state.user.id)
        .eq('status', 'active')
        .single();
        
      if (data && data.mentor_id) {
        const { data: profile } = await supabase
          .from('mentor_profiles')
          .select('today_wisdom, wisdom_updated_at')
          .eq('id', data.mentor_id)
          .single();
          
        if (profile?.today_wisdom && profile?.wisdom_updated_at) {
          const isToday = new Date(profile.wisdom_updated_at).toDateString() === new Date().toDateString();
          if (isToday) {
            setTodaysWisdom({
              text: profile.today_wisdom,
              mentorName: (data.profiles as any)?.name || 'Your Mentor'
            });
          }
        }
      }
    };
    
    fetchMentorWisdom();
  }, [state.user?.id]);

  const currentTier = getCurrentTier(state.progress.points);
  const progressToNext = getProgressToNextTier(state.progress.points);

  const recentResponses = useLiveQuery(
    () => db.circleResponses.orderBy('id').reverse().limit(3).toArray()
  ) || [];

  const inProgressId = state.modules.inProgress[state.modules.inProgress.length - 1];
  const nextModule = MODULES.find(m => m.id === inProgressId)
    ?? MODULES.find(m => !state.modules.completed.includes(m.id))
    ?? MODULES[0];
  const moduleIndex = MODULES.findIndex(m => m.id === nextModule.id) + 1;
  const moduleProgress = state.modules.moduleProgress[nextModule.id];
  const progressPercent = moduleProgress && nextModule.content.length > 0
    ? Math.round((moduleProgress.completedLessons.length / nextModule.content.length) * 100)
    : 0;

  const featuredArticles = LIFEKIT_ARTICLES.slice(0, 3);

  const QUICK_ACTIONS = [
    { id: 'mentor', icon: <Users size={24} />, label: t('action.mentor', lang), path: '/mentor', color: 'bg-yellow', text: 'text-navy' },
    { id: 'goals', icon: <Target size={24} />, label: t('action.goals', lang), path: '/goals', color: 'bg-navy/10', text: 'text-navy' },
    { id: 'learn', icon: <BrainCircuit size={24} />, label: t('action.learn', lang), path: '/learn', color: 'bg-navy/10', text: 'text-navy' },
    { id: 'community', icon: <MessageCircle size={24} />, label: t('action.community', lang), path: '/community', color: 'bg-navy/10', text: 'text-navy' },
  ];

  return (
    <div className="min-h-screen bg-off-white pb-24">
      {/* Navy Hero Section */}
      <header className="bg-navy text-white pt-12 pb-20 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-mark.png" 
              alt="Youth Educated" 
              className="w-14 h-14 rounded-2xl object-contain shadow-lg shadow-yellow/20"
            />
            <div>
              <h2 className="text-sm font-bold text-yellow tracking-wide">{t('app.name_full', lang)}</h2>
              <p className="text-white/40 italic font-nunito text-[11px]">{t('dashboard.tagline', lang)}</p>
            </div>
          </div>
        </div>
        <div className="mb-8 relative z-10">
          <h1 className="text-3xl font-bold">{t('dashboard.greeting', lang)}, {state.user?.name}!</h1>
          <p className="text-white/60 font-medium">{t('dashboard.ready', lang)}</p>
        </div>

        <div className="bg-white/10 rounded-[32px] p-6 border border-white/10 backdrop-blur-md relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{currentTier.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">{t('dashboard.current_tier', lang)}</p>
                <h3 className="text-xl font-bold text-yellow">
                  {lang === 'Kiswahili' ? currentTier.swahili : currentTier.name}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{state.progress.points}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('dashboard.total_points', lang)}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>Next: {progressToNext.nextTier ? (lang === 'Kiswahili' ? progressToNext.nextTier.swahili : progressToNext.nextTier.name) : 'MAX'}</span>
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
            <h3 className="text-2xl font-bold text-navy leading-tight">{t('dashboard.mood_checkin', lang)}</h3>
            <p className="text-navy/70 text-sm font-medium">{t('dashboard.earn_points', lang)}</p>
          </div>
          <div className="w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center shadow-lg">
            <Heart size={28} className="fill-current" />
          </div>
        </section>

        {/* Mentor Daily Nudge Card */}
        <AnimatePresence>
          {unreadNudge && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy rounded-[40px] p-6 text-white shadow-xl shadow-navy/20 relative overflow-hidden"
            >
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl opacity-40 pointer-events-none" />
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {unreadNudge.profiles?.avatar && unreadNudge.profiles.avatar.length >= 5 
                    ? <img src={unreadNudge.profiles.avatar} alt="Mentor" className="w-full h-full object-cover" />
                    : unreadNudge.profiles?.avatar || '👤'}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow/80">
                    Message from {unreadNudge.profiles?.name || 'Mentor'}
                  </p>
                  <p className="text-sm font-medium leading-snug">{unreadNudge.message}</p>
                  
                  {!showReplyInput ? (
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={handleGotIt}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <ThumbsUp size={14} /> Got it
                      </button>
                      <button 
                        onClick={() => setShowReplyInput(true)}
                        className="bg-yellow hover:brightness-105 text-navy text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <MessageCircle size={14} /> Reply
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <input 
                        type="text"
                        maxLength={80}
                        autoFocus
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Your reply..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs font-nunito text-white placeholder:text-white/40 outline-none focus:border-yellow transition-colors"
                      />
                      <button 
                        onClick={handleReply}
                        disabled={replyStatus === 'sending' || !replyText.trim()}
                        className="bg-yellow text-navy px-3 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all"
                      >
                        {replyStatus === 'sending' ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Session Commitment Prompt */}
        <AnimatePresence>
          {upcomingSession && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-6 shadow-xl shadow-navy/5 border border-navy/10 relative overflow-hidden"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-yellow/20 text-yellow-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target size={24} />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">
                    📌 Session Today with {upcomingSession.profiles?.name || 'Mentor'}
                  </p>
                  <p className="text-sm font-bold text-navy leading-snug">
                    What's one thing you want to achieve in this session?
                  </p>
                  
                  <div className="flex gap-2 pt-2">
                    <input 
                      type="text"
                      maxLength={100}
                      value={commitmentText}
                      onChange={e => setCommitmentText(e.target.value)}
                      placeholder="Type your goal here..."
                      className="flex-1 bg-off-white border border-navy/10 rounded-xl px-3 py-2 text-xs font-nunito text-navy outline-none focus:border-yellow transition-colors"
                    />
                    <button 
                      onClick={handleSaveCommitment}
                      disabled={savingCommitment || !commitmentText.trim()}
                      className="bg-navy text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1.5"
                    >
                      {savingCommitment ? <RefreshCw size={14} className="animate-spin" /> : 'Commit →'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Session Rating Prompt */}
        <AnimatePresence>
          {unratedSession && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy rounded-[40px] p-6 text-white shadow-xl shadow-navy/20"
            >
              <div className="text-center space-y-3">
                <p className="text-xs font-medium text-white/80">
                  How was your connection in the session with {unratedSession.profiles?.name}?
                </p>
                <div className="flex justify-center gap-3">
                  {[
                    { s: 1, e: '😕' },
                    { s: 2, e: '😐' },
                    { s: 3, e: '🙂' },
                    { s: 4, e: '😊' },
                    { s: 5, e: '🤩' }
                  ].map(({ s, e }) => (
                    <button
                      key={s}
                      onClick={() => setRatingScore(s)}
                      className={`text-3xl transition-transform ${ratingScore === s ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'opacity-50 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleSaveRating}
                    disabled={savingRating || ratingScore === 0}
                    className="bg-yellow text-navy px-6 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all"
                  >
                    {savingRating ? 'Saving...' : 'Submit'}
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Today's Wisdom */}
        {todaysWisdom && (
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow rounded-3xl p-6 shadow-md border border-yellow/50 max-w-md mx-auto"
          >
            <h3 className="text-[10px] font-black uppercase tracking-widest text-navy/60 flex items-center gap-1.5 mb-2">
              💬 {todaysWisdom.mentorName} says today:
            </h3>
            <p className="font-nunito italic text-navy text-[15px] leading-relaxed">
              "{isWisdomExpanded || todaysWisdom.text.length <= 100 ? todaysWisdom.text : todaysWisdom.text.slice(0, 100).trim() + '...'}"
              {!isWisdomExpanded && todaysWisdom.text.length > 100 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsWisdomExpanded(true); }}
                  className="text-blue-600 not-italic text-xs font-bold ml-2 hover:underline focus:outline-none"
                >
                  [read more →]
                </button>
              )}
            </p>
          </motion.section>
        )}

        {/* Cohort Activity Feed (Horizontal) */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-navy">{t('dashboard.circle_activity', lang)}</h2>
            <button onClick={() => navigate('/circles')} className="text-xs font-bold text-blue-600 flex items-center">
              {t('dashboard.view_all', lang)} <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
            {recentResponses.length > 0 ? recentResponses.map((resp, index) => (
              <div key={resp.id || index} className="min-w-[280px] bg-white p-5 rounded-[32px] border border-navy/5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-off-white rounded-xl flex items-center justify-center text-sm shadow-inner">
                    {resp.userId === state.user?.id ? '👤' : ['🦁', '🦒', '🐘', '🐆', '🦓'][index % 5]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy">{resp.userId === state.user?.id ? 'You' : 'Scholar'}</h4>
                    <p className="text-[9px] text-navy/30 font-bold uppercase">Week {resp.weekNumber}</p>
                  </div>
                </div>
                <p className="text-xs text-navy/60 font-medium line-clamp-2">
                  {resp.responseText}
                </p>
              </div>
            )) : (
              <div className="min-w-[280px] bg-white p-5 rounded-[32px] border border-navy/5 shadow-sm text-center">
                <p className="text-xs text-navy/60 font-medium">{t('dashboard.no_recent_activity', lang) || "No recent activity. Start the conversation!"}</p>
              </div>
            )}
          </div>
        </section>

        {/* Continue Learning */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-navy">{t('dashboard.continue_learning', lang)}</h2>
          <div 
            onClick={() => navigate(`/learn/${nextModule.id}`)}
            className="bg-navy rounded-[40px] p-8 text-white flex items-center justify-between shadow-xl shadow-navy/20 cursor-pointer group"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Module {moduleIndex}</span>
              <h3 className="text-2xl font-bold leading-tight">{nextModule.title}</h3>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1 text-[10px] font-bold text-white/40">
                  <BookOpen size={12} /> {nextModule.duration}
                </div>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-yellow group-hover:text-navy transition-all">
              <ChevronRight size={24} />
            </div>
          </div>
        </section>

        {/* From the Life Kit */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-navy">{t('dashboard.from_lifekit', lang)}</h2>
            <Link to="/learn" className="text-xs font-bold text-blue-600 flex items-center">
              {t('dashboard.see_all', lang)} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {featuredArticles.map((article, idx) => (
              <div
                key={article.id || idx}
                onClick={() => navigate(`/learn/article/${article.id}`)}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-navy/5 cursor-pointer hover:border-yellow active:scale-[0.98] transition-all duration-120 group"
              >
                <span className="text-2xl flex-shrink-0 leading-none">{article.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-nunito font-semibold text-navy text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {lang === 'Kiswahili' ? article.title_sw : article.title}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-pale-yellow text-navy/70 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="text-grey text-[11px] ml-auto flex-shrink-0">
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-navy/30 flex-shrink-0 group-hover:text-yellow transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="space-y-4 pb-4">
          <h2 className="text-xl font-bold text-navy">{t('dashboard.top_cohort', lang)}</h2>
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
