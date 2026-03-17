import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  Target, 
  Heart,
  MessageCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { generateMentorBriefing } from '../api/jabari';

interface Student {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
  progress: string;
  recentActivity: string; // This data feeds the AI briefing
}

const MentorDashboard: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [briefings, setBriefings] = useState<{ [key: string]: string }>({});
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

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

  return (
    <div className="min-h-screen bg-off-white pb-24">
      {/* Header */}
      <header className="bg-navy text-white pt-12 pb-20 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-20" />
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow/60">Mentor Console</span>
            <h1 className="text-3xl font-bold">Jambo, {state.user?.name}!</h1>
            <p className="text-white/60 font-medium">Empowering your students today.</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
            <Users size={24} className="text-yellow" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          {[
            { label: 'Students', val: '12', icon: <Users size={14} /> },
            { label: 'Sessions', val: '48', icon: <Calendar size={14} /> },
            { label: 'Impact', val: '8.4', icon: <Heart size={14} /> },
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
            <h2 className="text-xl font-bold text-navy">My Portfolio</h2>
            <div className="flex items-center gap-1 text-[10px] font-black text-navy/40 uppercase tracking-widest">
              <Clock size={12} /> Recent Sync: Just Now
            </div>
          </div>

          <div className="space-y-4">
            {STUDENTS.map((student) => (
              <div key={student.id} className="bg-white rounded-[40px] border border-navy/5 shadow-xl shadow-navy/5 overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-off-white rounded-3xl flex items-center justify-center text-3xl shadow-inner">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy">{student.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy/30">{student.lastActive}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-navy/10" />
                      <span className="text-[10px] font-bold text-blue-600">{student.progress}</span>
                    </div>
                  </div>
                  <button 
                    className="w-12 h-12 bg-off-white rounded-2xl flex items-center justify-center text-navy/20 hover:bg-navy hover:text-white transition-all shadow-sm"
                    aria-label={`Message ${student.name}`}
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>

                {/* AI Briefing Area */}
                <div className="px-6 pb-6 pt-0">
                  <div className={`rounded-[32px] p-6 transition-all ${briefings[student.id] ? 'bg-yellow/10 border border-yellow/20' : 'bg-off-white/50 border border-dashed border-navy/5'}`}>
                    {briefings[student.id] ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <Sparkles size={16} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Jabari AI Briefing</span>
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
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MentorDashboard;
