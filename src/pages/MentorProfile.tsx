import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin, User, Sparkles, Calendar, Flag, X } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { requestMentorMatch } from '../lib/mentoring';
import { FALLBACK_MENTORS } from '../data/mentors';

interface MentorData {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  icon: string;
  county: string | null;
  isVerified: boolean;
  availabilityDays: string[];
  todayWisdom: string | null;
  wisdomUpdatedAt: string | null;
}

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PILL_COLORS = [
  'bg-blue-500/10 text-blue-700',
  'bg-yellow/20 text-yellow-700',
  'bg-green-500/10 text-green-700',
  'bg-purple-500/10 text-purple-700',
  'bg-pink-500/10 text-pink-700',
  'bg-emerald-500/10 text-emerald-700',
  'bg-orange-500/10 text-orange-700',
  'bg-red-500/10 text-red-700',
];

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

// Skeleton loader
const ProfileSkeleton: React.FC = () => (
  <div className="min-h-screen bg-off-white pb-32">
    <div className="bg-navy px-6 pt-12 pb-16 rounded-b-[40px]">
      <div className="h-8 w-8 rounded-full bg-white/10 mb-8" />
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse" />
        <div className="h-6 w-40 bg-white/10 rounded-full animate-pulse" />
        <div className="h-4 w-24 bg-white/10 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="px-6 -mt-6 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-[28px] p-6 border border-navy/5">
          <div className="h-4 w-24 bg-navy/5 rounded-full mb-3 animate-pulse" />
          <div className="h-3 w-full bg-navy/5 rounded-full animate-pulse" />
          <div className="h-3 w-3/4 bg-navy/5 rounded-full mt-2 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const MentorProfile: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();

  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      if (!mentorId) { setError(true); setLoading(false); return; }

      // Offline / unconfigured — try fallback
      if (state.isOffline || !isSupabaseConfigured) {
        const fallback = FALLBACK_MENTORS.find(m => m.id === mentorId);
        if (fallback) {
          setMentor({
            id: fallback.id,
            name: fallback.name,
            bio: fallback.bio,
            expertise: fallback.expertise,
            icon: fallback.icon,
            county: fallback.county,
            isVerified: true,
            availabilityDays: [],
            todayWisdom: null,
            wisdomUpdatedAt: null,
          });
        } else {
          setError(true);
        }
        setLoading(false);
        return;
      }

      try {
        // Fetch mentor profile joined with profiles table
        const { data, error: fetchErr } = await supabase
          .from('mentor_profiles')
          .select(`
            id,
            bio,
            expertise,
            avatar_url,
            county,
            is_verified,
            availability_days,
            today_wisdom,
            wisdom_updated_at,
            profiles (
              name
            )
          `)
          .eq('id', mentorId)
          .maybeSingle();

        if (fetchErr || !data) {
          setError(true);
          setLoading(false);
          return;
        }

        setMentor({
          id: data.id,
          name: (data.profiles as any)?.name || 'Mentor',
          bio: data.bio || 'Ready to help you succeed.',
          expertise: data.expertise || [],
          icon: data.avatar_url || '👩‍🏫',
          county: data.county || null,
          isVerified: data.is_verified ?? false,
          availabilityDays: data.availability_days || [],
          todayWisdom: data.today_wisdom || null,
          wisdomUpdatedAt: data.wisdom_updated_at || null,
        });

        // Check if already connected
        if (state.user?.id) {
          const { data: matchData } = await supabase
            .from('mentor_matches')
            .select('id')
            .eq('student_id', state.user.id)
            .eq('mentor_id', mentorId)
            .in('status', ['pending', 'active'])
            .maybeSingle();

          if (matchData) setIsConnected(true);
        }
      } catch (err) {
        console.error('[MentorProfile] fetch failed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId, state.user?.id, state.isOffline]);

  const handleReport = async () => {
    if (!reportReason || !state.user?.id || !mentor) return;
    setSubmittingReport(true);
    await supabase.from('mentor_reports').insert({
      reporter_id: state.user.id,
      reported_user_id: mentor.id,
      reason: reportReason,
      details: reportDetails,
    });
    setSubmittingReport(false);
    setReportSent(true);
    setTimeout(() => { setShowReport(false); setReportSent(false); setReportReason(''); setReportDetails(''); }, 2000);
  };

  const handleConnect = async () => {
    if (!state.user?.id || !mentor || connecting || isConnected) return;
    setConnecting(true);
    const result = await requestMentorMatch(state.user.id, mentor.id);
    setConnecting(false);
    if (result) setIsConnected(true);
  };

  if (loading) return <ProfileSkeleton />;

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm text-center max-w-sm w-full">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-navy mb-2">Mentor Not Found</h2>
          <p className="text-sm text-navy/50 mb-6">
            This mentor profile may no longer be available.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-navy text-white rounded-full px-6 py-3 font-bold text-sm active:scale-95 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const showWisdom = mentor.todayWisdom && isToday(mentor.wisdomUpdatedAt);

  return (
    <div className="min-h-screen bg-off-white pb-32">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden"
      >
        <div className="absolute top-[-40px] right-[-40px] w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="relative z-10 w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-6 active:scale-95 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 bg-navy border-2 border-white/20 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-navy/30 mb-4 overflow-hidden">
            {mentor.icon.length < 5
              ? mentor.icon
              : <img src={mentor.icon} alt={mentor.name} className="w-full h-full object-cover" />
            }
          </div>

          {/* Name + Verified */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{mentor.name}</h1>
            {mentor.isVerified && (
              <div className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} />
                ✓
              </div>
            )}
          </div>

          {/* Field tags */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-2">
            {mentor.expertise.slice(0, 3).map((tag, i) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${PILL_COLORS[i % PILL_COLORS.length].replace(/text-\S+/, 'text-white/70')} bg-white/10`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* County */}
          {mentor.county && (
            <div className="flex items-center gap-1 text-white/40 text-xs font-medium">
              <MapPin size={12} />
              {mentor.county}
            </div>
          )}
        </div>
      </motion.div>

      {/* Content sections */}
      <main className="px-6 -mt-6 space-y-4 max-w-md mx-auto relative z-20">
        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-[28px] p-6 border border-navy/5 shadow-sm"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30 mb-3">About</h2>
          <p className="text-sm text-navy/70 leading-relaxed">{mentor.bio}</p>
        </motion.div>

        {/* Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-[28px] p-6 border border-navy/5 shadow-sm"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30 mb-3">Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.map((tag, i) => (
              <span
                key={tag}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${PILL_COLORS[i % PILL_COLORS.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-[28px] p-6 border border-navy/5 shadow-sm"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30 mb-3 flex items-center gap-1.5">
            <Calendar size={12} className="text-navy/20" />
            Availability
          </h2>
          {mentor.availabilityDays.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {DAY_LABELS.map(day => {
                const isAvailable = mentor.availabilityDays.some(
                  d => d.toLowerCase() === day.toLowerCase()
                );
                return (
                  <span
                    key={day}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      isAvailable
                        ? 'bg-green-500/10 text-green-700'
                        : 'bg-navy/5 text-navy/20'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-navy/40 italic">Not specified</p>
          )}
        </motion.div>

        {/* Today's Wisdom */}
        {showWisdom && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-yellow rounded-[28px] p-6 shadow-lg shadow-yellow/20"
          >
            <div className="flex items-center gap-2 text-navy/40 mb-3">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Today's Wisdom</span>
            </div>
            <p className="text-navy text-base font-bold leading-relaxed italic">
              "{mentor.todayWisdom}"
            </p>
          </motion.div>
        )}

        {/* Connect CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <button
            disabled={connecting || isConnected}
            onClick={handleConnect}
            className={`w-full py-4 rounded-2xl font-bold text-base active:scale-[0.98] transition shadow-lg ${
              isConnected
                ? 'bg-green-500/10 text-green-700 border border-green-200 shadow-none cursor-default'
                : 'bg-navy text-white shadow-navy/20'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isConnected
              ? 'Connected ✓'
              : connecting
                ? 'Sending Request…'
                : 'Connect with ' + mentor.name.split(' ')[0]
            }
          </button>
        </motion.div>

        {/* Discreet report link */}
        <div className="text-center pb-4">
          <button
            onClick={() => setShowReport(true)}
            className="text-[10px] font-bold text-navy/25 uppercase tracking-widest hover:text-red-400 transition-colors flex items-center gap-1 mx-auto"
          >
            <Flag size={10} /> Report this mentor
          </button>
        </div>
      </main>

      {/* Report dialog */}
      <AnimatePresence>
        {showReport && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowReport(false)}
              className="fixed inset-0 z-[100] bg-navy/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-[110] bg-white rounded-t-[32px] px-6 pt-5 pb-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy">Report a concern</h3>
                <button onClick={() => setShowReport(false)}><X size={20} className="text-navy/40" /></button>
              </div>
              {reportSent ? (
                <div className="text-center py-6">
                  <p className="text-2xl mb-2">✓</p>
                  <p className="font-bold text-navy">Report submitted</p>
                  <p className="text-sm text-navy/50 mt-1">Our safeguarding team will review this.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-navy/50">Your report is confidential and will go directly to the safeguarding team.</p>
                  <div className="space-y-2">
                    {['Inappropriate messages', 'Requests for personal info', 'Made me uncomfortable', 'Doesn\'t seem legitimate', 'Other'].map(r => (
                      <button key={r} onClick={() => setReportReason(r)}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                          reportReason === r ? 'border-navy bg-navy/5 text-navy' : 'border-navy/5 text-navy/50'
                        }`}
                      >{r}</button>
                    ))}
                  </div>
                  <textarea
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Any additional details (optional)"
                    rows={3}
                    className="w-full bg-off-white rounded-2xl px-4 py-3 text-sm text-navy outline-none border border-navy/10 focus:border-yellow transition-all resize-none"
                  />
                  <button
                    onClick={handleReport}
                    disabled={!reportReason || submittingReport}
                    className="w-full py-4 bg-red-500 text-white rounded-full font-bold disabled:opacity-40"
                  >
                    {submittingReport ? 'Submitting…' : 'Submit Report'}
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorProfile;
