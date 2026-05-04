import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Plus, Calendar, Clock,
  User, CheckCircle, XCircle, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { supabase } from '../lib/supabase';

interface Session {
  id: string;
  mentor_id: string;
  mentee_id: string;
  scheduled_at: string;
  duration_minutes: number;
  title: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  mentor_name?: string;
  mentee_name?: string;
}

const STATUS_META = {
  pending:   { label: 'Pending',   color: 'bg-yellow/20 text-yellow-800 border-yellow/40',   icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800 border-green-200',     icon: CheckCircle },
  completed: { label: 'Done',      color: 'bg-navy/10 text-navy border-navy/20',              icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200',           icon: XCircle },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const SessionCalendar: React.FC = () => {
  const { state } = useAppContext();
  const isMentor = state.user?.role === 'mentor';

  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    date: today.toISOString().slice(0, 10),
    time: '10:00',
    duration: 30,
    notes: '',
    mentee_id: '',
  });

  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

  const fetchSessions = useCallback(async () => {
    if (!state.user) return;
    setLoading(true);

    const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).toISOString();
    const end   = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

    let query = supabase
      .from('mentor_sessions')
      .select('*, mentor:profiles!mentor_id(name), mentee:profiles!mentee_id(name)')
      .gte('scheduled_at', start)
      .lte('scheduled_at', end)
      .order('scheduled_at', { ascending: true });

    if (isMentor) {
      query = query.eq('mentor_id', state.user.id);
    } else {
      query = query.eq('mentee_id', state.user.id);
    }

    const { data, error } = await query;
    if (!error && data) {
      setSessions(data.map((s: any) => ({
        ...s,
        mentor_name: s.mentor?.name,
        mentee_name: s.mentee?.name,
      })));
    } else if (error) {
      // Log real errors — distinguish from genuinely empty results
      console.warn('[SessionCalendar] fetch error:', error.message, error.code);
      // PGRST116 = table doesn't exist yet; treat as empty. Otherwise surface it.
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        setSessions([]);
      } else {
        setStatusError(`Could not load sessions: ${error.message}`);
        setSessions([]);
      }
    } else {
      setSessions([]);
    }
    setLoading(false);
  }, [state.user, viewDate, isMentor]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  useEffect(() => {
    if (isMentor && state.user) {
      supabase
        .from('mentor_pairs')
        .select('mentee_id, profiles!mentee_id(id, name)')
        .eq('mentor_id', state.user.id)
        .then(({ data }) => {
          if (data) setStudents(data.map((p: any) => ({ id: p.profiles?.id, name: p.profiles?.name })).filter(Boolean));
        });
    }
  }, [isMentor, state.user]);

  // Calendar grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const sessionsOnDay = (day: number) => {
    const d = new Date(year, month, day);
    return sessions.filter(s => isSameDay(new Date(s.scheduled_at), d));
  };

  const selectedSessions = selectedDay
    ? sessions.filter(s => isSameDay(new Date(s.scheduled_at), selectedDay))
    : [];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSave = async () => {
    if (!state.user) return;
    if (!form.title.trim()) { setFormError('Session title is required.'); return; }
    if (isMentor && !form.mentee_id) { setFormError('Select a student for this session.'); return; }
    if (!isMentor && !state.user.mentorPairId) { setFormError('You don\'t have a mentor assigned yet. Ask your coordinator to pair you.'); return; }

    setSaving(true);
    setFormError(null);

    const scheduled_at = new Date(`${form.date}T${form.time}:00`).toISOString();

    const { error } = await supabase.from('mentor_sessions').insert({
      mentor_id: isMentor ? state.user.id : state.user.mentorPairId,
      mentee_id: isMentor ? form.mentee_id : state.user.id,
      title: form.title,
      scheduled_at,
      duration_minutes: form.duration,
      notes: form.notes || null,
      status: isMentor ? 'confirmed' : 'pending',
    });

    if (error) {
      setFormError(error.message);
    } else {
      setShowForm(false);
      setForm({ title: '', date: today.toISOString().slice(0, 10), time: '10:00', duration: 30, notes: '', mentee_id: '' });
      fetchSessions();
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, status: Session['status']) => {
    setStatusError(null);
    const { error } = await supabase.from('mentor_sessions').update({ status }).eq('id', id);
    if (error) {
      console.error('[SessionCalendar] updateStatus error:', error.message);
      setStatusError(`Failed to update session: ${error.message}`);
      return;
    }
    fetchSessions();
  };

  return (
    <div className="min-h-screen bg-off-white pb-24">
      {/* Header */}
      <div className="bg-navy px-6 pt-10 pb-8">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-yellow text-[11px] font-black uppercase tracking-[0.2em]">
              {isMentor ? 'Mentor Panel' : 'My Sessions'}
            </p>
            <h1 className="text-white text-2xl font-poppins font-bold">Session Calendar</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-11 h-11 bg-yellow rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Plus size={22} className="text-navy" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-2">
        {/* Month nav */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center active:scale-95">
              <ChevronLeft size={18} className="text-navy" />
            </button>
            <span className="font-poppins font-bold text-navy text-[16px]">
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center active:scale-95">
              <ChevronRight size={18} className="text-navy" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-bold text-navy/30 uppercase tracking-wide py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarCells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const cellDate = new Date(year, month, day);
              const isToday = isSameDay(cellDate, today);
              const isSelected = selectedDay && isSameDay(cellDate, selectedDay);
              const daySessions = sessionsOnDay(day);
              const hasSessions = daySessions.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(cellDate)}
                  className={`relative flex flex-col items-center justify-center aspect-square rounded-xl transition-all active:scale-95 text-[13px] font-bold
                    ${isSelected ? 'bg-navy text-white shadow-md' : isToday ? 'bg-yellow/30 text-navy' : 'hover:bg-navy/5 text-navy'}`}
                >
                  {day}
                  {hasSessions && (
                    <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-yellow' : 'bg-navy'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sessions for selected day */}
        <div className="space-y-3">
          {statusError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center justify-between">
              <p className="text-red-600 text-[13px] font-bold flex-1">{statusError}</p>
              <button onClick={() => setStatusError(null)} className="text-red-400 ml-2 shrink-0">
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between px-1">
            <h2 className="font-poppins font-bold text-navy text-[15px]">
              {selectedDay
                ? isSameDay(selectedDay, today) ? 'Today' : selectedDay.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'short' })
                : 'Select a day'}
            </h2>
            {loading && <RefreshCw size={14} className="text-grey animate-spin" />}
          </div>

          {selectedSessions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <Calendar size={32} className="text-navy/20 mx-auto mb-3" />
              <p className="text-navy/40 font-bold text-sm">No sessions scheduled</p>
              <p className="text-navy/25 text-xs mt-1">Tap + to book one</p>
            </div>
          ) : (
            selectedSessions.map(session => {
              const meta = STATUS_META[session.status];
              const StatusIcon = meta.icon;
              const time = new Date(session.scheduled_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins font-bold text-navy text-[15px] truncate">{session.title}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-grey text-[12px]">
                          <span className="flex items-center gap-1"><Clock size={12} />{time}</span>
                          <span className="flex items-center gap-1"><User size={12} />
                            {isMentor ? session.mentee_name ?? 'Student' : session.mentor_name ?? 'Mentor'}
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-grey text-[12px] mt-2 line-clamp-2">{session.notes}</p>
                        )}
                      </div>
                      <span className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${meta.color}`}>
                        <StatusIcon size={11} />
                        {meta.label}
                      </span>
                    </div>

                    {/* Mentor actions */}
                    {isMentor && session.status === 'pending' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-navy/5">
                        <button
                          onClick={() => updateStatus(session.id, 'confirmed')}
                          className="flex-1 py-2 bg-green-50 text-green-700 font-bold text-[12px] rounded-xl border border-green-200 active:scale-95 transition-transform"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(session.id, 'cancelled')}
                          className="flex-1 py-2 bg-red-50 text-red-600 font-bold text-[12px] rounded-xl border border-red-200 active:scale-95 transition-transform"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {isMentor && session.status === 'confirmed' && (
                      <div className="mt-3 pt-3 border-t border-navy/5">
                        <button
                          onClick={() => updateStatus(session.id, 'completed')}
                          className="w-full py-2 bg-navy/5 text-navy font-bold text-[12px] rounded-xl active:scale-95 transition-transform"
                        >
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Book session modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-end"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 pb-10 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-poppins font-bold text-navy text-lg">
                  {isMentor ? 'Schedule Session' : 'Request Session'}
                </h3>
                <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center">
                  <X size={18} className="text-navy" />
                </button>
              </div>

              {isMentor && students.length > 0 && (
                <div>
                  <label className="text-[12px] font-bold text-navy/60 uppercase tracking-wider block mb-1.5">Student</label>
                  <select
                    value={form.mentee_id}
                    onChange={e => setForm(f => ({ ...f, mentee_id: e.target.value }))}
                    className="w-full bg-navy/5 rounded-xl px-4 py-3 text-navy font-bold text-[14px] border-0 outline-none"
                  >
                    <option value="">Select student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[12px] font-bold text-navy/60 uppercase tracking-wider block mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Goal check-in, Career talk..."
                  className="w-full bg-navy/5 rounded-xl px-4 py-3 text-navy font-bold text-[14px] border-0 outline-none placeholder:text-navy/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-navy/60 uppercase tracking-wider block mb-1.5">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    min={today.toISOString().slice(0, 10)}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-navy/5 rounded-xl px-3 py-3 text-navy font-bold text-[13px] border-0 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-navy/60 uppercase tracking-wider block mb-1.5">Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full bg-navy/5 rounded-xl px-3 py-3 text-navy font-bold text-[13px] border-0 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-navy/60 uppercase tracking-wider block mb-1.5">Duration</label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, duration: d }))}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] transition-all ${form.duration === d ? 'bg-navy text-white' : 'bg-navy/5 text-navy'}`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-navy/60 uppercase tracking-wider block mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Topics to cover, questions..."
                  rows={2}
                  className="w-full bg-navy/5 rounded-xl px-4 py-3 text-navy font-bold text-[14px] border-0 outline-none placeholder:text-navy/30 resize-none"
                />
              </div>

              {formError && (
                <p className="text-red-500 text-[13px] bg-red-50 rounded-xl px-4 py-2.5 font-bold">{formError}</p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-navy text-white font-bold rounded-2xl text-[15px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98 transition-transform"
              >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Calendar size={18} />}
                {isMentor ? 'Schedule Session' : 'Send Request'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionCalendar;
