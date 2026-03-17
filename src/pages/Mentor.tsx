import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageCircle, 
  Search, 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  Calendar, 
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Lock,
  Sparkles,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

const Mentor: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [isMatched, setIsMatched] = useState(false); // Toggle for demo

  const MOCK_MENTORS = [
    { id: '1', name: 'Dr. Jane G.', field: 'Medicine / Health', exp: '12 years', rating: 4.9, icon: '👩‍⚕️', bio: "Passionate about youth health and SRH education." },
    { id: '2', name: 'Eng. Kevin O.', field: 'Software / STEM', exp: '8 years', rating: 4.8, icon: '👨‍💻', bio: "Building the next generation of Kenyan tech leaders." },
    { id: '3', name: 'Sarah W.', field: 'Finance / Business', exp: '15 years', rating: 5.0, icon: '👩‍💼', bio: "Helping youth master their money and start businesses." },
  ];

  const ENDORSEMENTS = [
    { title: 'Critical Thinker', date: 'Oct 2025', from: 'Jabari AI', icon: <Sparkles size={16} /> },
    { title: 'Goal Crusher', date: 'Sept 2025', from: 'Dr. Jane G.', icon: <Target size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-off-white pb-32">
      <header className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-40px] left-[-40px] w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold">Mentor Space</h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Guided by Experience</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
            <Users size={24} className="text-yellow" />
          </div>
        </div>

        {/* Toggle just for demonstration of the two states */}
        <div className="flex bg-white/5 rounded-full p-1 border border-white/10 max-w-xs mx-auto mb-8 relative z-10">
          <button 
            onClick={() => setIsMatched(false)}
            className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isMatched ? 'bg-yellow text-navy' : 'text-white/40'}`}
          >
            Find a Mentor
          </button>
          <button 
            onClick={() => setIsMatched(true)}
            className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isMatched ? 'bg-yellow text-navy' : 'text-white/40'}`}
          >
            My Connection
          </button>
        </div>
      </header>

      <main className="px-6 -mt-8 space-y-8 relative z-20">
        <AnimatePresence mode="wait">
          {!isMatched ? (
            <motion.div 
              key="unmatched"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={20} />
                <input 
                  type="text"
                  placeholder="Search by field (e.g. Medicine)..."
                  className="w-full bg-white border border-navy/5 rounded-[32px] pl-12 pr-4 py-5 text-navy outline-none focus:border-yellow shadow-xl shadow-navy/5 font-medium placeholder:text-navy/20"
                />
              </div>

              {/* Recommended Mentors */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-navy">Recommended for You</h2>
                <div className="space-y-4">
                  {MOCK_MENTORS.map((m) => (
                    <div key={m.id} className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm flex items-center gap-5 group active:scale-[0.98] transition-all">
                      <div className="w-16 h-16 bg-off-white rounded-3xl flex items-center justify-center text-3xl shadow-inner">
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-navy">{m.name}</h3>
                          <div className="flex items-center gap-0.5 text-yellow-600">
                             <Star size={12} className="fill-current" />
                             <span className="text-[10px] font-black">{m.rating}</span>
                          </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-navy/30 mb-1">{m.field}</p>
                        <p className="text-xs text-navy/60 line-clamp-1">{m.bio}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-off-white flex items-center justify-center text-navy/20 group-hover:bg-yellow group-hover:text-navy transition-colors">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  ))}
                </div>
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
              <div className="bg-white rounded-[40px] overflow-hidden border border-navy/5 shadow-xl shadow-navy/5 group">
                 <div className="bg-navy p-8 text-white flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600">Your Mentor</span>
                       <h3 className="text-2xl font-bold">Dr. Jane G.</h3>
                       <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Medicine / Health</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-4xl border border-white/10 group-hover:scale-110 transition-transform">
                       👩‍⚕️
                    </div>
                 </div>
                 <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-off-white p-4 rounded-3xl text-center space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-navy/30">Sessions</p>
                          <p className="text-lg font-bold text-navy">4 / 10</p>
                       </div>
                       <div className="bg-off-white p-4 rounded-3xl text-center space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-navy/30">Next Sync</p>
                          <p className="text-lg font-bold text-navy">Tomorrow</p>
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
                       <button className="w-14 h-14 bg-off-white border border-navy/5 rounded-2xl flex items-center justify-center text-navy">
                          <Calendar size={20} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Endorsement Cards */}
              <section className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <h2 className="text-xl font-bold text-navy">Endorsements</h2>
                    <div className="flex items-center gap-1.5 bg-yellow/20 px-3 py-1 rounded-full text-[9px] font-black text-yellow-700 uppercase tracking-widest">
                       Earned Rewards
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {ENDORSEMENTS.map((e, i) => (
                       <div key={i} className="bg-white p-5 rounded-[32px] border border-navy/5 shadow-sm space-y-3 relative overflow-hidden group hover:border-yellow transition-colors">
                          <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow/10 rounded-full opacity-50 group-hover:scale-150 transition-transform" />
                          <div className="w-10 h-10 bg-off-white rounded-2xl flex items-center justify-center text-navy">
                             {e.icon}
                          </div>
                          <div>
                             <h4 className="font-bold text-navy text-sm">{e.title}</h4>
                             <p className="text-[9px] text-navy/30 font-bold uppercase mt-0.5">By {e.from}</p>
                          </div>
                          <div className="pt-2 flex items-center gap-1.5 text-[9px] font-black text-green-600 uppercase">
                             <CheckCircle2 size={12} /> Verified
                          </div>
                       </div>
                    ))}
                    {/* Locked Endorsement Slot */}
                    <div className="bg-off-white p-5 rounded-[32px] border border-dashed border-navy/10 flex flex-col items-center justify-center gap-3 opacity-40">
                       <Lock size={20} className="text-navy/20" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-navy/20">Next Slot Locked</span>
                    </div>
                 </div>
              </section>

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
