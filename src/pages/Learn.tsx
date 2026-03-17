import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Module } from '../data/modules';
import { useModules } from '../hooks/useContent';

const Learn: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: MODULES, loading } = useModules();

  const CATEGORIES = ['All', 'Basics', 'Life Skills', 'Health', 'Career'];

  const filteredModules = MODULES.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Basics') return matchesSearch && ['confidence', 'resilience', 'finance'].includes(m.id);
    if (activeCategory === 'Life Skills') return matchesSearch && ['communication', 'relationships'].includes(m.id);
    if (activeCategory === 'Health') return matchesSearch && ['srh', 'healthy-choices'].includes(m.id);
    if (activeCategory === 'Career') return matchesSearch && ['career'].includes(m.id);
    return matchesSearch;
  });

  const isLocked = (module: Module) => {
    if (module.id === 'srh' && !state.canAccessSRH) return true;
    if (module.id === 'healthy-choices' && !state.canAccessDrugModule) return true;
    return false;
  };

  const getLockReason = (module: Module) => {
    if (module.id === 'srh' && !state.canAccessSRH) return `Unlocks at age 16`;
    if (module.id === 'healthy-choices' && !state.canAccessDrugModule) return `Unlocks at age 13`;
    return null;
  };

  return (
    <div className="min-h-screen bg-off-white pb-24">
      <header className="bg-navy text-white px-6 pt-12 pb-8 rounded-b-[40px]">
        <h1 className="text-3xl font-bold mb-6">Learning Path</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-yellow transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-yellow text-navy' 
                  : 'bg-white/10 text-white/60 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 py-8 space-y-6">
        {/* Featured Module */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-navy">Recommended for You</h2>
          <motion.div 
            onClick={() => navigate('/learn/confidence')}
            className="group bg-gradient-to-br from-blue-600 to-navy p-8 rounded-[40px] text-white relative overflow-hidden cursor-pointer shadow-xl shadow-blue-900/20"
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <BookOpen size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="inline-block px-4 py-1 bg-yellow text-navy text-[10px] font-black uppercase tracking-widest rounded-full">
                Popular
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold leading-tight">Confidence Building</h3>
                <p className="text-white/70 max-w-[200px]">Unlock your potential and believe in yourself.</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold pt-4 border-t border-white/10">
                <span className="flex items-center gap-1"><Clock size={16} /> 42 min</span>
                <span className="flex items-center gap-1"><BookOpen size={16} /> 7 Lessons</span>
              </div>
            </div>
            <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white text-navy flex items-center justify-center group-hover:bg-yellow transition-colors">
              <ArrowRight size={24} />
            </div>
          </motion.div>
        </section>

        {/* Module Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-navy">All Modules</h2>
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">Loading Modules...</p>
              </div>
            ) : filteredModules.map((module) => {
              const locked = isLocked(module);
              const lockReason = getLockReason(module);
              const completed = state.modules.completed.includes(module.id);
              const inProgress = state.modules.inProgress.includes(module.id);

              return (
                <motion.div
                  key={module.id}
                  onClick={() => !locked && navigate(`/learn/${module.id}`)}
                  className={`bg-white p-5 rounded-[32px] border shadow-sm flex items-center gap-5 transition-all ${
                    locked 
                      ? 'border-navy/5 saturate-0 opacity-70 cursor-not-allowed' 
                      : 'border-navy/5 cursor-pointer active:scale-[0.98]'
                  }`}
                  whileHover={!locked ? { y: -2 } : {}}
                >
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner ${
                    locked ? 'bg-grey/10' : 'bg-off-white'
                  }`}>
                    {module.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-navy truncate">{module.title}</h4>
                      {completed && <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />}
                      {locked && <Lock size={14} className="text-navy/40 flex-shrink-0" />}
                    </div>
                    
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-navy/40">
                      <span className="flex items-center gap-1"><Clock size={12} /> {module.duration}</span>
                      <span>•</span>
                      <span>{module.lessons} Lessons</span>
                    </div>

                    {locked && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">
                        {lockReason}
                      </p>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-off-white flex items-center justify-center text-navy/20">
                    <ChevronRight size={18} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Locked Bottom Sheet Logic would go here in an actual app, 
          for now we just prevent click on locked cards */}
    </div>
  );
};

export default Learn;
