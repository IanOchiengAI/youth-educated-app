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
  WifiOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { generateMentorBriefing } from '../api/jabari';
import { updateMentorGoals } from '../lib/mentoring';
import { supabase } from '../lib/supabase';
import { t, type Language } from '../lib/i18n';

interface Student {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
  progress: string;
  recentActivity: string;
  guardian_phone?: string;
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

  // Mock students for the Mentor
  const STUDENTS: Student[] = [
    { 
      id: 'student-1', 
      name: 'John Kamau', 
      avatar: '🦁',
      lastActive: '2h ago',
      progress: 'Module 4: Finance',
      recentActivity: "Logged mood 3/10 (Anxious). Chat history: 'I am worried about my rent next month.' Completed lesson 2/5 in Financial Literacy."
    },
    { 
      id: 'student-2', 
      name: 'Sarah Wambui', 
      avatar: '🦒',
      lastActive: '1d ago',
      progress: 'Module 2: Confidence',
      recentActivity: "Logged mood 8/10 (Happy). Chat history: 'I passed my interview!' Completed lesson 5/5 in Self Discovery."
    },
    { 
      id: 'student-3', 
      name: 'Musa Ali', 
      avatar: '🐘',
      lastActive: '3h ago',
      progress: 'Module 1: Mental Health',
      recentActivity: "Logged mood 5/10 (Neutral). Chat history: 'How can I manage stress during exams?' In progress with Mental Health module."
    }
  ];

  // Fetch pair IDs and student profiles
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairsAndStudents = async () => {
      if (!state.user?.id) return;
      
      try {
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

        const pairs: typeof studentPairs = {};
        const forms: Record<string, GoalFormData> = {};
        const fetchedStudents: Student[] = [];

        data.forEach((m: any) => {
          pairs[m.student_id] = {
            pairId: m.id,
            goals: m.jabari_goals ?? [],
            agenda: m.jabari_agenda ?? '',
          };
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
              recentActivity: 'Student assigned and active.', // Will be refined by checkins later
              guardian_phone: m.profiles.guardian_phone || undefined
            } as any); // Type cast until we update Student interface
          }
        });

        setStudentPairs(pairs);
        setGoalForms(prev => ({ ...prev, ...forms }));
        setStudents(fetchedStudents);
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPairsAndStudents();
  }, [state.user?.id]);

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
            { label: t('mentor.students', lang), val: '12', icon: <Users size={14} /> },
            { label: t('mentor.sessions', lang), val: '48', icon: <Calendar size={14} /> },
            { label: t('mentor.impact', lang), val: '8.4', icon: <Heart size={14} /> },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1.5 text-white/40 mb-1">
                {s.icon} <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
              </div>
              <p className="text-lg font-bold">{s.val}</p>
            </div>
          ))}
        </div>
      </header>

      <main className="px-6 -mt-10 space-y-8 relative z-20">
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
