import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageCircle, 
  Search, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  WifiOff,
  User,
  Lightbulb,
  TrendingUp,
  Dumbbell,
  GraduationCap,
  Coins,
  HeartPulse,
  Map,
  Ear,
  Flame,
  Handshake,
  CalendarDays,
  CalendarRange,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { requestMentorMatch } from '../lib/mentoring';
import { MENTOR_FIELDS } from '../constants';
import { FALLBACK_MENTORS } from '../data/mentors';

const QUIZ_GOALS = [
  { id: 'learn_skill', label: 'Learn a skill', emoji: <Lightbulb size={32} className="text-yellow" /> },
  { id: 'start_something', label: 'Start something', emoji: <TrendingUp size={32} className="text-yellow" /> },
  { id: 'build_confidence', label: 'Build confidence', emoji: <Dumbbell size={32} className="text-yellow" /> },
  { id: 'improve_school', label: 'Improve at school', emoji: <GraduationCap size={32} className="text-yellow" /> },
  { id: 'understand_money', label: 'Understand money', emoji: <Coins size={32} className="text-yellow" /> },
  { id: 'health_wellbeing', label: 'Health & wellbeing', emoji: <HeartPulse size={32} className="text-yellow" /> },
];

const QUIZ_STYLES = [
  { id: 'clear_plan', label: 'Give me a clear plan and structure', emoji: <Map size={24} className="text-navy/60" /> },
  { id: 'listen_figure', label: 'Listen to me and help me figure it out', emoji: <Ear size={24} className="text-navy/60" /> },
  { id: 'challenge_me', label: 'Challenge me and push me harder', emoji: <Flame size={24} className="text-navy/60" /> },
  { id: 'regular_checkins', label: 'Check in on me regularly', emoji: <Handshake size={24} className="text-navy/60" /> },
];

const QUIZ_AVAILABILITY = [
  { id: 'once_a_week', label: 'Once a week (30 min)', emoji: <CalendarDays size={24} className="text-navy/60" /> },
  { id: 'every_two_weeks', label: 'Every two weeks (45 min)', emoji: <CalendarRange size={24} className="text-navy/60" /> },
  { id: 'once_a_month', label: 'Once a month (60 min)', emoji: <Clock size={24} className="text-navy/60" /> },
  { id: 'flexible', label: 'Flexible — just when I need it', emoji: <MessageSquare size={24} className="text-navy/60" /> },
];

const goalReasonMap: Record<string, string> = {
  'learn_skill': 'learn new skills',
  'start_something': 'start their own projects',
  'build_confidence': 'build self-confidence',
  'improve_school': 'improve academically',
  'understand_money': 'understand personal finance',
  'health_wellbeing': 'improve their wellbeing'
};

interface MentorProfile {
  id: string;
  name: string;
  field: string;
  expertise: string[];
  bio: string;
  icon: string;
  county: string | null;
}

interface FeaturedMentorData {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  icon: string;
  county: string | null;
  featured_quote: string | null;
}

interface MatchData {
  id: string;
  mentor: MentorProfile;
}

const quizVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const quizVariantsResults = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const Mentor: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [isMatched, setIsMatched] = useState(false);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [myMatch, setMyMatch] = useState<MatchData | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [featuredMentor, setFeaturedMentor] = useState<FeaturedMentorData | null>(null);

  const [matchStep, setMatchStep] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState({ goal: '', style: '', availability: '' });
  const [topMatches, setTopMatches] = useState<(MentorProfile & { score: number })[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showRematch, setShowRematch] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  // Fetch mentors, featured mentor, and match status
  useEffect(() => {
    const fetchData = async () => {
      if (!state.user?.id || state.isOffline || !isSupabaseConfigured) {
        setMentors(FALLBACK_MENTORS.map(m => ({
          ...m,
          field: m.expertise[0] || 'General',
          icon: m.avatarUrl || m.icon,
        })));
        setFeaturedMentor(null);
        setLoading(false);
        return;
      }
      
      try {
        // 1. Fetch available mentors
        const { data: mentorData, error: mentorError } = await supabase
          .from('mentor_profiles')
          .select(`
            id,
            bio,
            expertise,
            avatar_url,
            county,
            profiles:id (
              name
            )
          `)
          .eq('is_verified', true);

        if (!mentorError && mentorData && mentorData.length > 0) {
          const formatted = mentorData.map((m: any) => ({
            id: m.id,
            name: m.profiles?.name || 'Mentor',
            field: m.expertise?.[0] || 'General',
            expertise: m.expertise || [],
            bio: m.bio || 'Ready to help you succeed.',
            icon: m.avatar_url || '👩‍🏫',
            county: m.county || null,
          }));
          setMentors(formatted);
        } else {
          // No verified mentors in DB yet — use fallback data so categories aren't empty
          setMentors(FALLBACK_MENTORS.map(m => ({
            ...m,
            field: m.expertise[0] || 'General',
            icon: m.avatarUrl || m.icon,
          })));
        }

        // 2. Fetch featured mentor
        const { data: featuredData, error: featuredError } = await supabase
          .from('mentor_profiles')
          .select(`
            id,
            bio,
            expertise,
            avatar_url,
            county,
            featured_quote,
            profiles:id (
              name
            )
          `)
          .eq('is_featured', true)
          .eq('is_verified', true)
          .order('featured_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!featuredError && featuredData) {
          setFeaturedMentor({
            id: featuredData.id,
            name: (featuredData as any).profiles?.name || 'Mentor',
            expertise: featuredData.expertise || [],
            bio: featuredData.bio || '',
            icon: featuredData.avatar_url || '👩‍🏫',
            county: featuredData.county || null,
            featured_quote: featuredData.featured_quote || null,
          });
        }

        // 3. Fetch active match for current user
        const { data: matchData, error: matchError } = await supabase
          .from('mentor_matches')
          .select(`
            id,
            mentor_id,
            profiles!mentor_matches_mentor_id_fkey (
              name
            ),
            mentor_profiles!mentor_matches_mentor_id_fkey (
              bio,
              expertise,
              avatar_url
            )
          `)
          .eq('student_id', state.user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (!matchError && matchData && matchData.profiles) {
          setMyMatch({
            id: matchData.id,
            mentor: {
              id: matchData.mentor_id,
              name: (matchData.profiles as any)?.name || 'Mentor',
              field: (matchData.mentor_profiles as any)?.expertise?.[0] || 'General',
              expertise: (matchData.mentor_profiles as any)?.expertise || [],
              bio: (matchData.mentor_profiles as any)?.bio || '',
              icon: (matchData.mentor_profiles as any)?.avatar_url || '👩‍🏫',
              county: null,
            }
          });
          setIsMatched(true);
        }
      } catch (err) {
        console.error('Failed to fetch mentor data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state.user?.id, state.isOffline]);

  useEffect(() => {
    const checkRematch = async () => {
      if (!myMatch?.id || !state.user?.id) return;
      const { data: sessions } = await supabase
        .from('mentor_sessions')
        .select('id')
        .eq('mentee_id', state.user.id)
        .eq('status', 'completed');
      
      if (!sessions || sessions.length < 2) return;

      const sessionIds = sessions.map(s => s.id);
      const { data: ratings } = await supabase
        .from('session_ratings')
        .select('session_id, rater_id, score')
        .in('session_id', sessionIds);

      if (!ratings) return;

      const ratingsBySession = ratings.reduce((acc: any, r: any) => {
        if (!acc[r.session_id]) acc[r.session_id] = [];
        acc[r.session_id].push(r.score);
        return acc;
      }, {});

      let poorCount = 0;
      for (const sid in ratingsBySession) {
        if (ratingsBySession[sid].length === 2 && ratingsBySession[sid].every((score: number) => score <= 2)) {
          poorCount++;
        }
      }

      if (poorCount >= 2) {
        setShowRematch(true);
      }
    };
    checkRematch();
  }, [myMatch?.id, state.user?.id]);

  const handleRematch = async () => {
    if (!myMatch) return;
    await supabase.from('mentor_matches').update({ status: 'ended' }).eq('id', myMatch.id);
    setIsMatched(false);
    setMyMatch(null);
    setShowRematch(false);
  };

  // Count mentors per field category
  const countByField = (fieldId: string) =>
    mentors.filter(m =>
      m.expertise.some(e => e.toLowerCase().includes(fieldId))
    ).length;

  // Filter mentors by selected category
  const filteredMentors = mentors.filter(m => {
    if (!selectedField) return true;
    return m.expertise.some(e => e.toLowerCase().includes(selectedField));
  });

  // Handle category tile tap
  const handleFieldSelect = (fieldId: string) => {
    setSelectedField(fieldId);
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scoreMatch = (mentor: MentorProfile, answers: {goal: string, style: string, availability: string}) => {
    let score = 0;
    const exp = mentor.expertise.map(e => e.toLowerCase());
    
    if (answers.goal === 'learn_skill' && exp.some(e => ['technology','creative','education'].includes(e))) score += 3;
    if (answers.goal === 'start_something' && exp.some(e => ['entrepreneurship','business'].includes(e))) score += 3;
    if (answers.goal === 'health_wellbeing' && exp.some(e => ['health'].includes(e))) score += 3;
    if (answers.goal === 'understand_money' && exp.some(e => ['finance'].includes(e))) score += 3;
    if (answers.goal === 'build_confidence' && exp.some(e => ['creative', 'health'].includes(e))) score += 3;
    if (answers.goal === 'improve_school' && exp.some(e => ['education', 'technology'].includes(e))) score += 3;
    
    if (mentor.county?.toLowerCase() === state.user?.county?.toLowerCase()) score += 2;
    return score;
  };

  const handleQuizSubmit = (answers: {goal: string, style: string, availability: string}) => {
    setMatchStep(4);
    setLoadingMatches(true);
    setTimeout(() => {
      const scored = mentors.map(m => ({ ...m, score: scoreMatch(m, answers) }));
      scored.sort((a, b) => b.score - a.score);
      setTopMatches(scored.slice(0, 3));
      setLoadingMatches(false);
    }, 1500);
  };

  // Check if a mentor is the current match
  const isCurrentMatch = (mentorId: string) => myMatch?.mentor.id === mentorId;

  // Handle connect
  const handleConnect = async (mentor: MentorProfile) => {
    if (!state.user?.id || connectingId) return;
    setConnectingId(mentor.id);
    const result = await requestMentorMatch(state.user.id, mentor.id);
    setConnectingId(null);
    if (result) {
      setMyMatch({ id: result.id, mentor });
      setIsMatched(true);
    }
  };

  return (
    <div className="min-h-screen bg-off-white pb-32">
      <header className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-40px] left-[-40px] w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">Talk to a Mentor</h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Your guide. Your pace.</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
            <Users size={24} className="text-yellow" />
          </div>
        </div>

        {myMatch && (
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10 max-w-xs mx-auto mb-8 relative z-10">
            <button 
              onClick={() => setIsMatched(false)}
              className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isMatched ? 'bg-yellow text-navy' : 'text-white/40'}`}
            >
              Browse Mentors
            </button>
            <button 
              onClick={() => setIsMatched(true)}
              className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isMatched ? 'bg-yellow text-navy' : 'text-white/40'}`}
            >
              My Mentor
            </button>
          </div>
        )}
      </header>

      {state.isOffline && (
        <div className="mx-6 -mt-4 mb-2 relative z-30 bg-yellow/90 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-navy text-[11px] font-bold uppercase tracking-widest shadow-sm">
          <WifiOff size={14} />
          Offline — Displaying cached data
        </div>
      )}

      <main className="px-6 -mt-8 space-y-8 relative z-20 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!isMatched ? (
            <motion.div 
              key="unmatched"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Safeguarding Badge */}
              <p className="text-center text-navy/40 text-xs font-medium py-2 flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-green-600" />
                All mentors are vetted and safeguarding-trained
              </p>

              {matchStep === 0 ? (
                <div className="space-y-6">
                  {/* Jabari Quiz Trigger */}
                  <button 
                    onClick={() => setMatchStep(1)}
                    className="w-full bg-navy text-white rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl animate-pulse flex-shrink-0">
                      🤖
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">Help me find the right mentor</h3>
                      <p className="text-white/60 text-sm mt-0.5 font-nunito">Jabari will guide you to your best match</p>
                    </div>
                  </button>

                  {/* ─── 1. CATEGORY GRID (2×N) ─── */}
                  <div className="grid grid-cols-2 gap-3">
                {MENTOR_FIELDS.map(f => {
                  const count = countByField(f.id);
                  const isSelected = selectedField === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleFieldSelect(f.id)}
                      className={`bg-gradient-to-br ${f.color} border ${f.border} rounded-[28px] p-5 text-left transition-transform active:scale-95
                        ${isSelected ? 'ring-2 ring-yellow ring-offset-2 shadow-lg' : ''}
                        ${count === 0 ? 'opacity-50' : ''}`}
                    >
                      <span className="text-[32px] leading-none block mb-2">{f.emoji}</span>
                      <span className="text-sm font-bold text-navy block">{f.label}</span>
                      <span className="text-[11px] text-navy/40 font-medium block mt-0.5">
                        {count === 0 ? 'Coming soon' : `${count} mentor${count !== 1 ? 's' : ''}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ─── 2. FEATURED MENTOR CARD ─── */}
              {!state.isOffline && featuredMentor && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-navy rounded-[32px] p-6 text-white relative overflow-hidden"
                >
                  {/* Featured badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Featured This Week</span>
                    <span className="bg-yellow text-navy px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      ⭐ Featured
                    </span>
                  </div>

                  {/* Avatar + Info */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-4xl border-2 border-white/20 mb-3 overflow-hidden">
                      {featuredMentor.icon.length < 5 ? featuredMentor.icon : <img src={featuredMentor.icon} alt={featuredMentor.name} className="w-full h-full object-cover" />}
                    </div>
                    <h3 className="text-2xl font-bold">{featuredMentor.name}</h3>
                    <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                      {featuredMentor.expertise.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-white/10 text-white/70 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                      {featuredMentor.county && (
                        <span className="bg-yellow/10 text-yellow px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          📍 {featuredMentor.county}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-white/60 line-clamp-2 text-center mb-4 font-nunito">{featuredMentor.bio}</p>

                  {/* Featured Quote */}
                  {featuredMentor.featured_quote && (
                    <div className="border-t border-white/10 pt-4 mb-4">
                      <p className="text-[11px] text-white/30 font-medium mb-1">One thing I wish I knew at your age…</p>
                      <p className="text-sm text-white/80 italic font-nunito leading-relaxed">"{featuredMentor.featured_quote}"</p>
                    </div>
                  )}

                  {/* Connect Button */}
                  {isCurrentMatch(featuredMentor.id) ? (
                    <div className="w-full py-3.5 bg-white/10 text-white/60 rounded-2xl font-bold text-sm text-center">
                      Your Mentor ✓
                    </div>
                  ) : (
                    <button
                      disabled={connectingId === featuredMentor.id || state.isOffline}
                      onClick={() => handleConnect({
                        id: featuredMentor.id,
                        name: featuredMentor.name,
                        field: featuredMentor.expertise[0] || 'General',
                        expertise: featuredMentor.expertise,
                        bio: featuredMentor.bio,
                        icon: featuredMentor.icon,
                        county: featuredMentor.county,
                      })}
                      className="w-full py-3.5 bg-yellow text-navy rounded-2xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {state.isOffline ? 'Offline' : connectingId === featuredMentor.id ? 'Sending…' : 'Connect with this mentor'}
                    </button>
                  )}
                </motion.div>
              )}

              {/* ─── 3. FILTERED MENTOR LIST ─── */}
              <div ref={listRef} className="space-y-4">
                {/* Heading + "All Fields" reset */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-navy">
                    {selectedField
                      ? `${MENTOR_FIELDS.find(f => f.id === selectedField)?.label || ''} Mentors`
                      : 'All Mentors'}
                  </h2>
                  {selectedField && (
                    <button
                      onClick={() => setSelectedField(null)}
                      className="px-3 py-1.5 bg-navy/5 text-navy/50 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-navy/10 transition-colors"
                    >
                      All Fields
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredMentors.length === 0 ? (
                  <div className="bg-white p-8 rounded-[32px] border border-navy/5 text-center shadow-sm">
                    <p className="text-sm font-medium text-navy/40">No mentors available in this category yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMentors.map((m, index) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.3 }}
                        onClick={() => navigate(`/mentor/${m.id}`)}
                        className="bg-white p-5 rounded-[28px] border border-navy/5 shadow-sm cursor-pointer active:scale-[0.98] hover:border-navy/10 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-14 h-14 bg-off-white rounded-2xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0 overflow-hidden">
                            {m.icon.length < 5 ? m.icon : <img src={m.icon} alt={m.name} className="w-full h-full object-cover" />}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-navy truncate">{m.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {m.expertise.slice(0, 3).map(tag => (
                                <span key={tag} className="bg-navy/5 text-navy/50 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {m.county && (
                              <p className="text-[11px] text-navy/30 font-medium mt-1">📍 {m.county}</p>
                            )}
                            <p className="text-xs text-navy/50 line-clamp-2 mt-1.5 font-nunito">{m.bio}</p>
                          </div>
                        </div>

                        {/* Connect Button */}
                        <div className="flex justify-end mt-3">
                          {isCurrentMatch(m.id) ? (
                            <span className="px-5 py-2.5 bg-navy/5 text-navy/40 rounded-full font-bold text-xs">
                              Connected ✓
                            </span>
                          ) : (
                            <button
                              disabled={connectingId === m.id || state.isOffline}
                              onClick={(e) => { e.stopPropagation(); handleConnect(m); }}
                              className="px-5 py-2.5 bg-navy text-white rounded-full font-bold text-xs active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {state.isOffline ? 'Offline' : connectingId === m.id ? 'Sending…' : 'Connect'}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Badge Section */}
              <div className="bg-green-50 rounded-[40px] p-8 border border-green-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                    <ShieldCheck size={32} />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-green-900 font-bold">Safe & Verified</h4>
                    <p className="text-green-700/60 text-xs font-medium leading-relaxed">All mentors undergo strict vetting and safeguarding training.</p>
                 </div>
              </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Skip Option */}
                  <button 
                    onClick={() => setMatchStep(0)}
                    className="text-navy/50 font-bold text-sm w-full text-center hover:text-navy transition-colors flex items-center justify-center gap-2"
                  >
                    I know what I'm looking for &rarr; Browse all mentors
                  </button>
                  
                  {/* Quiz Screens */}
                  <div className="bg-white rounded-[32px] p-6 shadow-sm border border-navy/5 relative min-h-[300px]">
                      {matchStep === 1 && (
                        <div key="step1">
                          <div className="flex items-center gap-3 mb-6">
                             <div className="text-3xl animate-pulse">🤖</div>
                             <h3 className="text-xl font-bold text-navy leading-tight">What's the one thing you most want to change in the next 3 months?</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                             {QUIZ_GOALS.map(g => (
                               <button 
                                  key={g.id}
                                  onClick={() => {
                                    setMatchAnswers(prev => ({...prev, goal: g.id}));
                                    setMatchStep(2);
                                  }}
                                  className="p-4 bg-off-white border border-navy/5 rounded-2xl text-left active:scale-95 transition-transform"
                               >
                                 <span className="text-2xl block mb-2">{g.emoji}</span>
                                 <span className="font-bold text-navy text-[13px] leading-tight">{g.label}</span>
                               </button>
                             ))}
                          </div>
                        </div>
                      )}

                      {matchStep === 2 && (
                        <div key="step2">
                          <div className="flex items-center gap-3 mb-6">
                             <div className="text-3xl animate-pulse">🤖</div>
                             <h3 className="text-xl font-bold text-navy leading-tight">How do you prefer to get guidance?</h3>
                          </div>
                          <div className="flex flex-col gap-3">
                             {QUIZ_STYLES.map(s => (
                               <button 
                                  key={s.id}
                                  onClick={() => {
                                    setMatchAnswers(prev => ({...prev, style: s.id}));
                                    setMatchStep(3);
                                  }}
                                  className="p-4 bg-off-white border border-navy/5 rounded-2xl text-left active:scale-95 transition-transform flex items-center gap-4"
                               >
                                 <span className="text-2xl">{s.emoji}</span>
                                 <span className="font-bold text-navy text-sm">{s.label}</span>
                               </button>
                             ))}
                          </div>
                        </div>
                      )}

                      {matchStep === 3 && (
                        <div key="step3">
                          <div className="flex items-center gap-3 mb-6">
                             <div className="text-3xl animate-pulse">🤖</div>
                             <h3 className="text-xl font-bold text-navy leading-tight">How often can you commit to meeting?</h3>
                          </div>
                          <div className="flex flex-col gap-3">
                             {QUIZ_AVAILABILITY.map(a => (
                               <button 
                                  key={a.id}
                                  onClick={() => {
                                    const answers = { ...matchAnswers, availability: a.id };
                                    setMatchAnswers(answers);
                                    handleQuizSubmit(answers);
                                  }}
                                  className="p-4 bg-off-white border border-navy/5 rounded-2xl text-left active:scale-95 transition-transform flex items-center gap-4"
                               >
                                 <span className="text-2xl">{a.emoji}</span>
                                 <span className="font-bold text-navy text-sm">{a.label}</span>
                               </button>
                             ))}
                          </div>
                        </div>
                      )}

                      {matchStep === 4 && (
                        <div key="step4">
                          {loadingMatches ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
                              <div className="text-5xl animate-bounce">🤖</div>
                              <div className="font-bold text-navy text-lg">Jabari is finding your matches...</div>
                              <div className="flex gap-1.5 mt-2 justify-center">
                                <div className="w-2.5 h-2.5 bg-yellow rounded-full animate-pulse"></div>
                                <div className="w-2.5 h-2.5 bg-yellow rounded-full animate-pulse delay-150"></div>
                                <div className="w-2.5 h-2.5 bg-yellow rounded-full animate-pulse delay-300"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex items-center gap-3 mb-2">
                                 <div className="text-3xl">🎉</div>
                                 <h3 className="text-xl font-bold text-navy">Your Top Matches</h3>
                              </div>
                              {topMatches.length === 0 ? (
                                <p className="text-center text-navy/50 py-8 text-sm font-medium">No matches found right now. Try browsing all mentors!</p>
                              ) : (
                                topMatches.map((m, idx) => (
                                  <div key={m.id} className="bg-off-white p-5 rounded-3xl border border-navy/5 relative overflow-hidden">
                                    {idx === 0 && <div className="absolute top-0 right-0 bg-yellow text-navy text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10">Top Match</div>}
                                    
                                    <div className="flex gap-4">
                                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 overflow-hidden">
                                        {m.icon.length < 5 ? m.icon : <img src={m.icon} alt={m.name} className="w-full h-full object-cover" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-navy truncate">{m.name}</h4>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {m.expertise.slice(0, 2).map(tag => (
                                            <span key={tag} className="bg-navy/5 text-navy/50 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-white rounded-2xl border border-navy/5 relative">
                                      <div className="absolute -top-2 -left-2 text-2xl bg-white rounded-full leading-none shadow-sm p-0.5">🤖</div>
                                      <p className="text-xs text-navy/70 font-medium leading-relaxed pl-4">
                                         <span className="font-bold text-navy">{m.name}</span> specialises in <span className="font-bold text-navy">{m.expertise[0] || 'general mentoring'}</span> and has helped students <span className="font-bold text-navy">{goalReasonMap[matchAnswers.goal] || 'achieve their goals'}</span>.
                                      </p>
                                    </div>
                                    
                                    <div className="mt-4">
                                      {isCurrentMatch(m.id) ? (
                                        <div className="w-full py-3.5 bg-navy/5 text-navy/40 rounded-xl font-bold text-sm text-center">
                                          Connected ✓
                                        </div>
                                      ) : (
                                        <button
                                          disabled={connectingId === m.id}
                                          onClick={(e) => { e.stopPropagation(); handleConnect(m); }}
                                          className="w-full py-3.5 bg-navy text-white rounded-xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {connectingId === m.id ? 'Sending Request…' : 'Connect'}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="matched"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* My Mentor Hero Card */}
              {showRematch && (
                <div className="bg-red-50 rounded-[32px] p-6 border border-red-100 shadow-sm relative z-10 mb-6">
                  <h4 className="text-red-900 font-bold mb-2">Finding the right fit</h4>
                  <p className="text-red-700/80 text-sm mb-4">
                    Sometimes it takes a few tries to find the right mentor. Would you like to explore other mentors?
                  </p>
                  <div className="flex gap-3">
                    <button onClick={handleRematch} className="bg-red-100 text-red-800 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">
                      Browse Again
                    </button>
                    <button onClick={() => setShowRematch(false)} className="bg-white text-navy/60 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform border border-navy/10">
                      Stay with {myMatch?.mentor.name}
                    </button>
                  </div>
                </div>
              )}
              {myMatch && (
                <div className="bg-white rounded-[40px] overflow-hidden border border-navy/5 shadow-xl shadow-navy/5 group">
                   <div className="bg-navy p-8 text-white flex justify-between items-start">
                      <div className="space-y-1">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600">Your Mentor</span>
                         <h3 className="text-2xl font-bold">{myMatch.mentor.name}</h3>
                         <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{myMatch.mentor.field}</p>
                      </div>
                      <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-4xl border border-white/10 group-hover:scale-110 transition-transform overflow-hidden">
                         {myMatch.mentor.icon.length < 5 ? myMatch.mentor.icon : <img src={myMatch.mentor.icon} alt={myMatch.mentor.name} className="w-full h-full object-cover" />}
                      </div>
                   </div>
                   <div className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-off-white p-4 rounded-3xl text-center space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy/30">Sessions</p>
                            <p className="text-lg font-bold text-navy">Active</p>
                         </div>
                         <div className="bg-off-white p-4 rounded-3xl text-center space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy/30">Next Sync</p>
                            <p className="text-lg font-bold text-navy">Scheduled</p>
                         </div>
                      </div>
                      
                      <div className="flex gap-3">
                         <button 
                           onClick={() => navigate('/chat')}
                           className="flex-1 py-4 bg-navy text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-navy/20"
                         >
                            <MessageCircle size={20} />
                            Message
                         </button>
                         <button onClick={() => navigate('/calendar')} className="w-14 h-14 bg-off-white border border-navy/5 rounded-2xl flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all">
                            <Calendar size={20} />
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {/* Quick Wisdom */}
              <div className="bg-yellow rounded-[40px] p-8 text-navy space-y-4 shadow-xl shadow-yellow/20">
                 <div className="flex items-center gap-2 text-navy/40">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mentor's Wisdom</span>
                 </div>
                 <p className="text-lg font-bold leading-tight italic">
                    "Success is not about how fast you go, but how far you've come from where you started."
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Mentor;
