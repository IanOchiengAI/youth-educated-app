import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  RefreshCw, 
  Target, 
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  AlertTriangle,
  Shield,
  WifiOff,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { generateMentorBriefing } from '../api/jabari';
import { updateMentorGoals } from '../lib/mentoring';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { checkSafeguarding } from '../lib/safeguarding';
import { t, type Language } from '../lib/i18n';

interface Student {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
  progress: string;
  recentActivity: string;
  guardian_phone?: string;
  totalPoints: number;
  streakDays: number;
  tier: string;
  lastActiveRaw: string | null;
}

interface PendingRequest {
  id: string;
  studentId: string;
  studentName: string;
  county: string;
  createdAt: string;
}

interface JabariCheckin {
  id: string;
  checkin_date: string;
  summary: string;
  goals_touched: string[];
  mood_signal: string;
  safeguarding_flag: boolean | string | null;
}

interface GoalFormData {
  goals: [string, string, string];
  agenda: string;
}

const DEFAULT_FORM: GoalFormData = { goals: ['', '', ''], agenda: '' };

// ── Safeguarding flag renderer ──
function SafeguardingBanner({ flag }: { flag: boolean | string | null }) {
  if (!flag) return null;
  const cat = typeof flag === 'string' ? flag.toUpperCase() : 'A';

  if (cat === 'B') return (
    <div className="mt-2 bg-orange-500 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 font-bold text-xs">
      <AlertTriangle size={14} /> Serious Concern
    </div>
  );
  if (cat === 'C') return (
    <p className="mt-1.5 text-[10px] font-bold text-yellow-600 uppercase tracking-widest flex items-center gap-1">
      <AlertTriangle size={10} /> Monitoring
    </p>
  );
  // Category A or boolean true — highest severity
  return (
    <div className="mt-2 bg-red-600 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 font-bold text-xs">
      <Shield size={14} /> IMMEDIATE — Childline Kenya 116
    </div>
  );
}

const MentorDashboard: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const lang: Language = state.user?.language ?? 'English';

  // AI briefing state
  const [briefings, setBriefings] = useState<{ [key: string]: string }>({});
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  // Goal form state
  const [goalFormsOpen, setGoalFormsOpen] = useState<Record<string, boolean>>({});
  const [goalForms, setGoalForms] = useState<Record<string, GoalFormData>>({});
  const [savingGoals, setSavingGoals] = useState<Record<string, boolean>>({});
  const [goalSuccess, setGoalSuccess] = useState<Record<string, boolean>>({});

  // Pair IDs: studentId → { pairId, goals, agenda }
  const [studentPairs, setStudentPairs] = useState<Record<string, { pairId: string; goals: string[]; agenda: string }>>({});

  // Check-in state: studentId → checkins[]
  const [checkins, setCheckins] = useState<Record<string, JabariCheckin[]>>({});
  const [checkinsOpen, setCheckinsOpen] = useState<Record<string, boolean>>({});

  // Dynamic stats state
  const [sessionCount, setSessionCount] = useState(0);
  const [impactScore, setImpactScore] = useState('—');
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [refetchKey, setRefetchKey] = useState(0);

  // Nudge state
  const [nudgeDrafts, setNudgeDrafts] = useState<Record<string, string>>({});
  const [nudgeStatus, setNudgeStatus] = useState<Record<string, 'idle' | 'sending' | 'sent'>>({});
  const [todaysNudges, setTodaysNudges] = useState<Record<string, boolean>>({});

  const NUDGE_PROMPTS = [
    "What's one thing you're going to do differently today?",
    "What was hard this week and what did you learn?",
    "Name one person you're grateful for today."
  ];

  // Wisdom state
  const [wisdomText, setWisdomText] = useState('');
  const [isEditingWisdom, setIsEditingWisdom] = useState(false);
  const [savingWisdom, setSavingWisdom] = useState(false);

  // Session Rating state
  const [unratedSession, setUnratedSession] = useState<any | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(0);
  const [savingRating, setSavingRating] = useState(false);

  // Fetch pair IDs and student profiles
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnratedSession = async () => {
      if (!state.user?.id) return;
      
      const { data: recentCompleted } = await supabase
        .from('mentor_sessions')
        .select('id, title, mentee_id, profiles!mentor_sessions_mentee_id_fkey(name)')
        .eq('mentor_id', state.user.id)
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
        } else {
          setUnratedSession(null);
        }
      }
    };
    
    fetchUnratedSession();

    if (!state.user?.id) return;
    const channel = supabase
      .channel('mentor_unrated_sessions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'session_ratings' }, () => {
        fetchUnratedSession();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.user?.id, refetchKey]);

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
    const fetchPairsAndStudents = async () => {
      if (!state.user?.id || !isSupabaseConfigured) { setLoading(false); return; }
      
      try {
        // Fetch session count
        const { count: sessCount } = await supabase
          .from('mentor_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('mentor_id', state.user.id)
          .eq('status', 'completed');
        setSessionCount(sessCount ?? 0);

        // Fetch mentor's today wisdom
        const { data: mentorProfile } = await supabase
          .from('mentor_profiles')
          .select('today_wisdom, wisdom_updated_at')
          .eq('id', state.user.id)
          .single();
        
        if (mentorProfile) {
          if (mentorProfile.wisdom_updated_at && new Date(mentorProfile.wisdom_updated_at).toDateString() === new Date().toDateString()) {
            setWisdomText(mentorProfile.today_wisdom || '');
          } else {
            setWisdomText('');
          }
        }

        const { data, error } = await supabase
          .from('mentor_matches')
          .select(`
            id,
            student_id,
            jabari_goals,
            jabari_agenda,
            profiles!mentor_matches_student_id_fkey (
              name,
              current_tier,
              total_points,
              streak_days,
              last_active_date,
              guardian_phone
            )
          `)
          .eq('mentor_id', state.user.id)
          .eq('status', 'active');

        if (error || !data) {
          setLoading(false);
          return;
        }

        // Fetch pending requests
        const { data: pendingData } = await supabase
          .from('mentor_matches')
          .select('id, student_id, created_at')
          .eq('mentor_id', state.user.id)
          .eq('status', 'pending');

        if (pendingData && pendingData.length > 0) {
          const studentIds = pendingData.map((p: any) => p.student_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, county')
            .in('id', studentIds);
          const profileMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
          setPendingRequests(pendingData.map((p: any) => ({
            id: p.id,
            studentId: p.student_id,
            studentName: profileMap.get(p.student_id)?.name || 'Student',
            county: profileMap.get(p.student_id)?.county || '',
            createdAt: p.created_at,
          })));
        }

        const pairs: typeof studentPairs = {};
        const forms: Record<string, GoalFormData> = {};
        const fetchedStudents: Student[] = [];
        const pairIdToStudentId: Record<string, string> = {};

        data.forEach((m: any) => {
          pairs[m.student_id] = {
            pairId: m.id,
            goals: m.jabari_goals ?? [],
            agenda: m.jabari_agenda ?? '',
          };
          pairIdToStudentId[m.id] = m.student_id;
          forms[m.student_id] = {
            goals: [
              m.jabari_goals?.[0] ?? '',
              m.jabari_goals?.[1] ?? '',
              m.jabari_goals?.[2] ?? '',
            ] as [string, string, string],
            agenda: m.jabari_agenda ?? '',
          };
          
          if (m.profiles) {
            fetchedStudents.push({
              id: m.student_id,
              name: m.profiles.name || 'Anonymous Student',
              avatar: '👤',
              lastActive: m.profiles.last_active_date 
                ? new Date(m.profiles.last_active_date).toLocaleDateString()
                : 'Unknown',
              progress: m.profiles.current_tier || 'New',
              recentActivity: 'Student assigned and active.',
              guardian_phone: m.profiles.guardian_phone || undefined,
              totalPoints: m.profiles.total_points ?? 0,
              streakDays: m.profiles.streak_days ?? 0,
              tier: m.profiles.current_tier || 'MWANZO',
              lastActiveRaw: m.profiles.last_active_date || null,
            });
          }
        });

        // Enrich recentActivity from mood_logs + ai_conversations
        for (const student of fetchedStudents) {
          try {
            const [moodResult, chatResult] = await Promise.all([
              supabase.from('mood_logs')
                .select('mood_score, created_at')
                .eq('user_id', student.id)
                .order('created_at', { ascending: false }).limit(3),
              supabase.from('ai_conversations')
                .select('user_message, created_at')
                .eq('user_id', student.id)
                .order('created_at', { ascending: false }).limit(3),
            ]);
            const moods = moodResult.data ?? [];
            const chats = chatResult.data ?? [];
            student.recentActivity = [
              moods.length > 0 ? `Recent moods: ${moods.map((m: any) => m.mood_score).join(', ')}/10` : '',
              chats.length > 0 ? `Recent Amara messages: "${(chats[0] as any).user_message}"` : '',
              `Points: ${student.totalPoints}, Streak: ${student.streakDays}d, Tier: ${student.tier}`,
            ].filter(Boolean).join('. ') || 'No recent activity recorded.';
          } catch { /* keep placeholder */ }
        }

        // Compute impact score
        const now = new Date();
        const activeCount = fetchedStudents.filter(s => {
          if (!s.lastActiveRaw) return false;
          const diff = (now.getTime() - new Date(s.lastActiveRaw).getTime()) / (1000*60*60*24);
          return diff < 7;
        }).length;
        const impact = fetchedStudents.length > 0
          ? (activeCount / fetchedStudents.length * 10).toFixed(1) : '—';
        setImpactScore(impact);

        // Fetch today's nudges to disable send button
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const { data: nudgesData } = await supabase
          .from('mentor_nudges')
          .select('pair_id')
          .eq('mentor_id', state.user.id)
          .gte('created_at', startOfToday.toISOString());

        const nudgesMap: Record<string, boolean> = {};
        if (nudgesData) {
          nudgesData.forEach((n: any) => {
            const sid = pairIdToStudentId[n.pair_id];
            if (sid) nudgesMap[sid] = true;
          });
        }

        setStudentPairs(pairs);
        setGoalForms(prev => ({ ...prev, ...forms }));
        setStudents(fetchedStudents);
        setTodaysNudges(nudgesMap);
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPairsAndStudents();
  }, [state.user?.id, refetchKey]);

  // ── Fetch check-ins for paired students ──
  useEffect(() => {
    const fetchAllCheckins = async () => {
      if (state.isOffline) return;
      const entries = Object.entries(studentPairs);
      if (entries.length === 0) return;

      const result: Record<string, JabariCheckin[]> = {};

      for (const [studentId, pair] of entries) {
        const { data } = await supabase
          .from('jabari_checkins')
          .select('id, checkin_date, summary, goals_touched, mood_signal, safeguarding_flag')
          .eq('pair_id', pair.pairId)
          .order('checkin_date', { ascending: false })
          .limit(10);
        if (data) result[studentId] = data;
      }
      setCheckins(result);
    };
    fetchAllCheckins();
  }, [studentPairs, state.isOffline]);

  // ── Handlers ──
  const handleGenerateBriefing = async (student: Student) => {
    setLoadingIds(prev => [...prev, student.id]);
    try {
      const summary = await generateMentorBriefing(student.name, student.recentActivity);
      setBriefings(prev => ({ ...prev, [student.id]: summary }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== student.id));
    }
  };

  const handleGoalChange = (sid: string, idx: number, val: string) => {
    if (val.length > 60) return;
    setGoalForms(prev => {
      const cur = prev[sid] ?? { ...DEFAULT_FORM, goals: ['', '', ''] as [string, string, string] };
      const goals = [...cur.goals] as [string, string, string];
      goals[idx] = val;
      return { ...prev, [sid]: { ...cur, goals } };
    });
  };

  const handleAgendaChange = (sid: string, val: string) => {
    if (val.length > 200) return;
    setGoalForms(prev => {
      const cur = prev[sid] ?? { ...DEFAULT_FORM, goals: ['', '', ''] as [string, string, string] };
      return { ...prev, [sid]: { ...cur, agenda: val } };
    });
  };

  const handleSaveGoals = async (sid: string) => {
    const pair = studentPairs[sid];
    if (!pair) return;

    const form = goalForms[sid] ?? DEFAULT_FORM;
    setSavingGoals(prev => ({ ...prev, [sid]: true }));

    const filtered = form.goals.filter(g => g.trim().length > 0);
    const ok = await updateMentorGoals(pair.pairId, filtered, form.agenda);

    setSavingGoals(prev => ({ ...prev, [sid]: false }));
    if (ok) {
      setGoalSuccess(prev => ({ ...prev, [sid]: true }));
      setTimeout(() => setGoalSuccess(prev => ({ ...prev, [sid]: false })), 2500);
    }
  };

  const handleAcceptRequest = async (matchId: string) => {
    const { error } = await supabase
      .from('mentor_matches').update({ status: 'active' }).eq('id', matchId);
    if (!error) {
      setPendingRequests(prev => prev.filter(r => r.id !== matchId));
      setRefetchKey(k => k + 1);
    }
  };
  const handleDeclineRequest = async (matchId: string) => {
    const { error } = await supabase
      .from('mentor_matches').update({ status: 'ended' }).eq('id', matchId);
    if (!error) setPendingRequests(prev => prev.filter(r => r.id !== matchId));
  };

  const handleSendNudge = async (studentId: string, pairId: string) => {
    const draft = nudgeDrafts[studentId] || '';
    if (!draft.trim() || draft.length > 80 || todaysNudges[studentId]) return;

    const safeCheck = checkSafeguarding(draft, state.user?.ageBracket || 'adult', state.user?.id, 'mentor_nudge');
    if (safeCheck.triggered && safeCheck.escalationText) {
      alert(safeCheck.escalationText);
    }

    setNudgeStatus(prev => ({ ...prev, [studentId]: 'sending' }));

    const { error } = await supabase.from('mentor_nudges').insert({
      mentor_id: state.user!.id,
      pair_id: pairId,
      message: draft.trim()
    });

    if (!error) {
      setNudgeStatus(prev => ({ ...prev, [studentId]: 'sent' }));
      setTodaysNudges(prev => ({ ...prev, [studentId]: true }));
      setNudgeDrafts(prev => ({ ...prev, [studentId]: '' }));
    } else {
      setNudgeStatus(prev => ({ ...prev, [studentId]: 'idle' }));
    }
  };

  const handleSaveWisdom = async () => {
    if (!state.user?.id) return;
    setSavingWisdom(true);
    const { error } = await supabase
      .from('mentor_profiles')
      .update({
        today_wisdom: wisdomText,
        wisdom_updated_at: new Date().toISOString(),
      })
      .eq('id', state.user.id);
    setSavingWisdom(false);
    if (!error) {
      setIsEditingWisdom(false);
    }
  };

  const moodColor = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'positive': return 'bg-green-500';
      case 'neutral': return 'bg-yellow';
      case 'concerning': return 'bg-red-500';
      default: return 'bg-navy/20';
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return d; }
  };

  return (
    <div className="min-h-screen bg-off-white pb-24">
      {/* Header */}
      <header className="bg-navy text-white pt-12 pb-20 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-20" />
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow/60">{t('mentor.console', lang)}</span>
            <h1 className="text-3xl font-bold">Jambo, {state.user?.name}!</h1>
            <p className="text-white/60 font-medium">{t('mentor.empowering', lang)}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
            <Users size={24} className="text-yellow" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          {[
            { label: t('mentor.students', lang), val: String(students.length), icon: <Users size={14} /> },
            { label: t('mentor.sessions', lang), val: String(sessionCount), icon: <Calendar size={14} /> },
            { label: t('mentor.impact', lang), val: impactScore, icon: <Heart size={14} /> },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1.5 text-white/40 mb-1">
                {s.icon} <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
              </div>
              <p className="text-lg font-bold">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Today's Wisdom */}
        <div className="mt-6 bg-white/10 rounded-3xl p-5 border border-white/10 relative z-10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow/90 flex items-center gap-1.5">
              <Sparkles size={12} /> TODAY'S WISDOM
            </span>
            {!isEditingWisdom && (
              <button onClick={() => setIsEditingWisdom(true)} className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold uppercase bg-white/5 px-2 py-1 rounded-lg">
                ✏️ Edit
              </button>
            )}
          </div>
          {isEditingWisdom ? (
            <div className="space-y-3">
              <textarea
                value={wisdomText}
                onChange={(e) => setWisdomText(e.target.value)}
                maxLength={200}
                placeholder="Share your wisdom for today..."
                className="w-full bg-white/5 border border-white/20 rounded-2xl p-4 text-sm font-nunito text-white placeholder:text-white/40 focus:outline-none focus:border-yellow resize-none shadow-inner"
                rows={2}
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white/40">{wisdomText.length}/200</span>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditingWisdom(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSaveWisdom} disabled={savingWisdom} className="px-5 py-2 rounded-xl text-xs font-bold bg-yellow text-navy hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-yellow/10">
                    {savingWisdom ? 'Saving...' : 'Done'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="font-nunito italic text-white/90 text-[15px] leading-relaxed">
              {wisdomText ? `"${wisdomText}"` : <span className="text-white/40 not-italic">Share your wisdom for today...</span>}
            </p>
          )}
        </div>
      </header>

      <main className="px-6 -mt-10 space-y-8 relative z-20">
        {/* Session Rating Prompt */}
        <AnimatePresence>
          {unratedSession && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] p-6 shadow-xl shadow-navy/5 border border-navy/10 relative overflow-hidden"
            >
              <div className="text-center space-y-3 relative z-10">
                <p className="text-xs font-bold text-navy">
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
                      className={`text-3xl transition-transform ${ratingScore === s ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'opacity-50 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleSaveRating}
                    disabled={savingRating || ratingScore === 0}
                    className="bg-yellow text-navy px-6 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-all shadow-sm"
                  >
                    {savingRating ? 'Saving...' : 'Submit Rating'}
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-yellow rounded-full animate-pulse" />
              Pending Requests ({pendingRequests.length})
            </h2>
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-yellow/10 border border-yellow/30 rounded-[32px] p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy">{req.studentName}</p>
                  <p className="text-xs text-navy/40">
                    {req.county && `${req.county} · `}
                    Requested {new Date(req.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAcceptRequest(req.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors">
                    Accept
                  </button>
                  <button onClick={() => handleDeclineRequest(req.id)}
                    className="px-4 py-2 bg-off-white text-navy/60 rounded-xl text-xs font-bold hover:bg-navy/10 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Student List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold text-navy">{t('mentor.portfolio', lang)}</h2>
            <div className="flex items-center gap-1 text-[10px] font-black text-navy/40 uppercase tracking-widest">
              <Clock size={12} /> {t('mentor.recent_sync', lang)}: {t('mentor.just_now', lang)}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white p-8 rounded-[32px] border border-navy/5 text-center shadow-sm">
                <p className="text-sm font-medium text-navy/40">{t('mentor.no_students', lang)}</p>
              </div>
            ) : students.map((student) => {
              const form = goalForms[student.id] ?? { ...DEFAULT_FORM, goals: ['', '', ''] as [string, string, string] };
              const hasPair = !!studentPairs[student.id];
              const studentCheckins = checkins[student.id] ?? [];

              return (
              <div key={student.id} className="bg-white rounded-[40px] border border-navy/5 shadow-xl shadow-navy/5 overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-off-white rounded-3xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy truncate">{student.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy/30">{student.lastActive}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-navy/10 flex-shrink-0" />
                      <span className="text-[10px] font-bold text-blue-600 truncate">{student.progress}</span>
                    </div>
                    {student.guardian_phone && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-orange-600">
                        <span>📞 Parent/Guardian: {student.guardian_phone}</span>
                      </div>
                    )}
                  </div>

                {/* Student Progress Grid */}
                <div className="grid grid-cols-3 gap-2 mt-3 px-6 pb-2">
                  <div className="bg-off-white rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Points</p>
                    <p className="font-bold text-navy">{student.totalPoints.toLocaleString()}</p>
                  </div>
                  <div className="bg-off-white rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Streak</p>
                    <p className="font-bold text-navy">{student.streakDays}d</p>
                  </div>
                  <div className="bg-off-white rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Tier</p>
                    <p className="font-bold text-navy text-xs">{student.tier}</p>
                  </div>
                </div>
                  <button 
                    className="w-12 h-12 bg-off-white rounded-2xl flex items-center justify-center text-navy/20 hover:bg-navy hover:text-white transition-all shadow-sm flex-shrink-0"
                    aria-label={`Message ${student.name}`}
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>

                {/* AI Briefing Area */}
                <div className="px-6 pb-4 pt-0">
                  <div className={`rounded-[32px] p-6 transition-all ${briefings[student.id] ? 'bg-yellow/10 border border-yellow/20' : 'bg-off-white/50 border border-dashed border-navy/5'}`}>
                    {briefings[student.id] ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <Sparkles size={16} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Amara AI Briefing</span>
                        </div>
                        <div className="text-sm text-navy/80 font-medium whitespace-pre-line leading-relaxed">
                          {briefings[student.id]}
                        </div>
                        <button 
                          onClick={() => handleGenerateBriefing(student)}
                          className="text-[10px] font-black uppercase text-navy/40 flex items-center gap-1.5 hover:text-navy transition-colors"
                        >
                          <RefreshCw size={12} /> Regenerate Summary
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-4 space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-navy/20 shadow-sm">
                          <Target size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-navy/80">Prep for your next session</p>
                          <p className="text-xs text-navy/40 font-medium">Get a 3-bullet summary of {student.name}'s recent growth.</p>
                        </div>
                        <button 
                          onClick={() => handleGenerateBriefing(student)}
                          disabled={loadingIds.includes(student.id)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                            loadingIds.includes(student.id) ? 'bg-navy/10 text-navy/30 cursor-not-allowed' : 'bg-navy text-white shadow-lg shadow-navy/20 hover:scale-[1.02]'
                          }`}
                        >
                          {loadingIds.includes(student.id) ? (
                            <RefreshCw size={18} className="animate-spin" />
                          ) : (
                            <Sparkles size={18} />
                          )}
                          {loadingIds.includes(student.id) ? 'Analyzing...' : 'Generate AI Briefing'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Goal-Setting Form ── */}
                <div className="px-6 pb-4">
                  <button
                    onClick={() => setGoalFormsOpen(p => ({ ...p, [student.id]: !p[student.id] }))}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 group-hover:text-navy/60 transition-colors flex items-center gap-2">
                      Set Goals for Amara
                      {state.isOffline && <WifiOff size={12} className="text-yellow-600" />}
                    </span>
                    <motion.div animate={{ rotate: goalFormsOpen[student.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} className="text-navy/20" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {goalFormsOpen[student.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-off-white rounded-[32px] p-6 border border-navy/5 mt-3 space-y-4">
                          {[0, 1, 2].map(idx => (
                            <div key={idx}>
                              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 block mb-1.5">
                                Goal {idx + 1}
                              </label>
                              <input
                                type="text"
                                maxLength={60}
                                value={form.goals[idx]}
                                onChange={e => handleGoalChange(student.id, idx, e.target.value)}
                                placeholder={`e.g. ${['Improve budgeting skills', 'Build interview confidence', 'Practice self-care routine'][idx]}`}
                                className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-nunito text-navy placeholder:text-navy/25 outline-none focus:border-yellow/60 transition-colors"
                              />
                              <p className="text-[10px] text-navy/30 text-right mt-1">{form.goals[idx].length}/60</p>
                            </div>
                          ))}

                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 block mb-1.5">
                              Session Agenda
                            </label>
                            <textarea
                              maxLength={200}
                              value={form.agenda}
                              onChange={e => handleAgendaChange(student.id, e.target.value)}
                              placeholder="What should Amara focus on in the next session?"
                              className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-nunito text-navy placeholder:text-navy/25 outline-none focus:border-yellow/60 transition-colors min-h-[80px] resize-none"
                            />
                            <p className="text-[10px] text-navy/30 text-right mt-1">{form.agenda.length}/200</p>
                          </div>

                          {/* Save button + success confirmation */}
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={() => handleSaveGoals(student.id)}
                              disabled={savingGoals[student.id] || !hasPair || state.isOffline}
                              className={`bg-yellow text-navy rounded-full px-8 py-4 font-bold text-sm transition-all ${
                                savingGoals[student.id] || state.isOffline ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-105 active:scale-[0.97] shadow-md shadow-yellow/20'
                              } ${!hasPair ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              {savingGoals[student.id] ? 'Saving...' : state.isOffline ? 'Offline' : 'Save Goals'}
                            </button>

                            <AnimatePresence>
                              {goalSuccess[student.id] && (
                                <motion.div
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="flex items-center gap-1.5 text-green-600"
                                >
                                  <Check size={16} />
                                  <span className="text-xs font-bold">Saved!</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {state.isOffline && (
                            <p className="text-[10px] text-yellow-600 font-bold flex items-center gap-1.5"><WifiOff size={10} /> You're offline — goals will sync when you reconnect.</p>
                          )}
                          {!hasPair && !state.isOffline && (
                            <p className="text-[10px] text-navy/30 italic">No active pairing found — goals will be saved once matched.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Jabari Check-in Log ── */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => setCheckinsOpen(p => ({ ...p, [student.id]: !p[student.id] }))}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 group-hover:text-navy/60 transition-colors">
                      Amara Check-ins {studentCheckins.length > 0 && `(${studentCheckins.length})`}
                    </span>
                    <motion.div animate={{ rotate: checkinsOpen[student.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} className="text-navy/20" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {checkinsOpen[student.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-3">
                          {studentCheckins.length === 0 ? (
                            <div className="bg-off-white/50 rounded-2xl p-6 text-center border border-dashed border-navy/5">
                              {state.isOffline ? (
                                <p className="text-xs text-yellow-600 font-bold flex items-center justify-center gap-1.5"><WifiOff size={12} /> Offline — check-ins will load when you reconnect.</p>
                              ) : (
                                <p className="text-xs text-navy/30 font-medium">No check-ins recorded yet.</p>
                              )}
                            </div>
                          ) : (
                            studentCheckins.map(ci => (
                              <div key={ci.id} className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm space-y-2">
                                {/* Date + Mood */}
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/30">
                                    {formatDate(ci.checkin_date)}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${moodColor(ci.mood_signal)}`} />
                                    <span className="text-[10px] font-bold text-navy/40 capitalize">{ci.mood_signal}</span>
                                  </div>
                                </div>

                                {/* Summary */}
                                <p className="text-sm text-navy/70 font-nunito leading-relaxed">{ci.summary}</p>

                                {/* Goals touched */}
                                {ci.goals_touched && ci.goals_touched.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {ci.goals_touched.map((g, i) => (
                                      <span key={i} className="bg-yellow/15 text-navy/60 text-[10px] font-bold px-3 py-1 rounded-full">
                                        {g}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Safeguarding flag */}
                                <SafeguardingBanner flag={ci.safeguarding_flag} />
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Daily Nudge ── */}
                {hasPair && (
                  <div className="px-6 pb-6">
                    <div className="bg-navy/5 rounded-2xl p-4 border border-navy/10 space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/40">Send Today's Nudge</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={80}
                          value={nudgeDrafts[student.id] || ''}
                          onChange={e => setNudgeDrafts(p => ({ ...p, [student.id]: e.target.value }))}
                          disabled={todaysNudges[student.id] || state.isOffline}
                          placeholder={NUDGE_PROMPTS[students.findIndex(s => s.id === student.id) % NUDGE_PROMPTS.length]}
                          className="flex-1 bg-white border border-navy/10 rounded-xl px-4 py-2 text-sm font-nunito text-navy placeholder:text-navy/30 outline-none focus:border-yellow/60 transition-colors disabled:opacity-60"
                        />
                        <button
                          onClick={() => handleSendNudge(student.id, studentPairs[student.id].pairId)}
                          disabled={todaysNudges[student.id] || !nudgeDrafts[student.id]?.trim() || nudgeStatus[student.id] === 'sending' || state.isOffline}
                          className={`px-4 py-2 rounded-xl flex items-center justify-center transition-all ${
                            todaysNudges[student.id] 
                              ? 'bg-green-500 text-white cursor-default' 
                              : nudgeDrafts[student.id]?.trim() && !state.isOffline
                                ? 'bg-yellow text-navy hover:brightness-105 active:scale-95 shadow-sm'
                                : 'bg-navy/10 text-navy/30 cursor-not-allowed'
                          }`}
                        >
                          {todaysNudges[student.id] ? (
                            <span className="text-xs font-bold flex items-center gap-1"><Check size={14} /> Sent</span>
                          ) : nudgeStatus[student.id] === 'sending' ? (
                            <RefreshCw size={18} className="animate-spin" />
                          ) : (
                            <span className="text-xs font-bold flex items-center gap-1">Send <Send size={12} /></span>
                          )}
                        </button>
                      </div>
                      {!todaysNudges[student.id] && (
                        <p className="text-[10px] text-navy/30 text-right">{nudgeDrafts[student.id]?.length || 0}/80</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MentorDashboard;
