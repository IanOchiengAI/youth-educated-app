import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  Trophy, 
  Lock, 
  Sparkles,
  MessageCircle,
  MapPin,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { Opportunity } from '../data/opportunities';
import { useOpportunities } from '../hooks/useContent';

const Opportunities: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'all' | Opportunity['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: OPPORTUNITIES, loading } = useOpportunities();

  const CATEGORIES = ['all', 'scholarship', 'mentorship', 'internship', 'grant', 'TVET'];

  const filteredOpps = OPPORTUNITIES.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         opp.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
    
    // Auto-filter based on user profile
    const matchesAge = state.user ? (state.user.ageBracket === '10-12' ? opp.minAge === 10 : opp.maxAge >= parseInt(state.user.ageBracket.split('-')[0])) : true;
    const matchesGender = state.user ? (opp.gender === 'all' || opp.gender === state.user.gender) : true;
    const matchesCounty = opp.counties.includes('All') || opp.counties.includes(state.user?.county || '');

    return matchesSearch && matchesCategory; // && matchesAge && matchesGender && matchesCounty;
  });

  const getUrgency = (deadline: string) => {
    const today = new Date();
    const dead = new Date(deadline);
    const diff = dead.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 30) return { label: `${days} days left`, color: 'bg-red-100 text-red-600' };
    if (days < 90) return { label: 'Closing soon', color: 'bg-orange-100 text-orange-600' };
    return { label: 'Apply anytime', color: 'bg-blue-100 text-blue-600' };
  };

  return (
    <div className="min-h-screen bg-off-white pb-32">
      <header className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute bottom-[-40px] left-[-40px] w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">Opportunities</h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Growth & Funding</p>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            type="text"
            placeholder="Search programs, scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-yellow outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider border ${
                activeCategory === cat 
                  ? 'bg-yellow border-yellow text-navy' 
                  : 'bg-white/10 border-white/5 text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 -mt-8 space-y-4">
        {/* Your Score Section */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-navy/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow/20 text-yellow-700 rounded-2xl flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/30 leading-none mb-1">Your Merit Score</p>
              <p className="text-lg font-bold text-navy">{state.progress.points} Points</p>
            </div>
          </div>
          <Sparkles className="text-yellow" size={24} />
        </div>

        {/* Opportunity List */}
        <div className="space-y-4 pt-4">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">Loading Opportunities...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOpps.map((opp) => {
                const urgency = getUrgency(opp.deadline);
              const isLocked = state.progress.points < opp.pointsRequired;

              return (
                <motion.div
                  key={opp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-[32px] overflow-hidden border border-navy/5 shadow-sm transition-all ${
                    isLocked ? 'opacity-80 saturate-[0.8]' : ''
                  }`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-navy/5 text-[9px] font-black text-navy uppercase tracking-widest rounded-lg">
                            {opp.category}
                          </span>
                          <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${urgency.color}`}>
                            {urgency.label}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-navy leading-tight">{opp.title}</h3>
                        <p className="text-sm font-bold text-navy/40">{opp.provider}</p>
                      </div>
                      {isLocked && <Lock size={20} className="text-red-400 mt-1" />}
                    </div>

                    <p className="text-sm text-navy/60 leading-relaxed line-clamp-2">
                      {opp.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy/40 uppercase">
                        <MapPin size={12} />
                        {opp.counties[0] === 'All' ? 'Kenya' : opp.counties[0]}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy/40 uppercase">
                        <Users size={12} />
                        {opp.gender === 'all' ? 'Open to all' : opp.gender === 'female' ? 'Women only' : 'Men only'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-off-white p-4 flex gap-3 border-t border-navy/5">
                    {isLocked ? (
                      <div className="w-full py-4 text-center text-xs font-bold text-red-500 uppercase tracking-widest">
                        Need {opp.pointsRequired - state.progress.points} more points to apply
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate('/chat', { state: { initialMessage: `Jabari, tell me more about the ${opp.title}. How can I apply?` }})}
                          className="flex-1 py-4 bg-yellow text-navy rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={18} />
                          Apply with Jabari
                        </button>
                        <a 
                          href={opp.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-14 h-14 bg-white border border-navy/5 rounded-2xl flex items-center justify-center text-navy"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </>
                    )}
                  </div>
                 </motion.div>
              );
            })}
          </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default Opportunities;
