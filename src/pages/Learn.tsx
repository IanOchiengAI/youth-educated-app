import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { MODULES } from '../constants';
import { motion } from 'motion/react';
import { Download, CheckCircle, Clock, BookOpen, Search, Wifi, WifiOff } from 'lucide-react';

const Learn: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredModules = MODULES.filter((m) => {
    if (filter === 'All') return true;
    if (filter === 'Downloaded') return state.modules.downloaded.includes(m.id);
    if (filter === 'In Progress') return state.modules.inProgress.includes(m.id);
    if (filter === 'Completed') return state.modules.completed.includes(m.id);
    return true;
  });

  const handleDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch({ type: 'DOWNLOAD_MODULE', payload: id });
  };

  return (
    <div className="space-y-6">
      <header className="bg-navy px-6 py-5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <h1 className="text-white">Learn</h1>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            state.isOffline ? 'bg-red/20 text-red' : 'bg-green/20 text-green'
          }`}>
            {state.isOffline ? (
              <>
                <WifiOff size={10} />
                Offline
              </>
            ) : (
              <>
                <Wifi size={10} />
                Online
              </>
            )}
          </div>
        </div>
        <button className="text-white">
          <Search size={24} />
        </button>
      </header>

      <div className="px-4 space-y-6">
        {/* Filter Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'Downloaded', 'In Progress', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filter === f ? 'bg-navy text-white shadow-sm' : 'bg-white text-grey border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Featured Module */}
        <section className="bg-navy rounded-[20px] p-6 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                🌍
              </div>
              <span className="bg-yellow text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                Featured
              </span>
            </div>
            <h2 className="text-white text-2xl mb-1">Sustainable Leadership</h2>
            <div className="mb-4">
              <span className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/20">
                Advanced
              </span>
            </div>
            <p className="text-white/80 text-sm mb-6 leading-relaxed max-w-[80%]">
              Master the core principles of community building and sustainable global impact.
            </p>
            <div className="space-y-4">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow h-full w-[65%]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs font-medium">65% Completed</span>
                <button 
                  onClick={(e) => handleDownload(e, 'sustainable-leadership')}
                  className="bg-yellow text-navy px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 active:scale-95 transition-transform"
                >
                  {state.modules.downloaded.includes('sustainable-leadership') ? (
                    <>
                      <CheckCircle size={14} />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </section>

        {/* Module Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredModules.map((module, i) => {
            const isDownloaded = state.modules.downloaded.includes(module.id);
            const isCompleted = state.modules.completed.includes(module.id);
            const isInProgress = state.modules.inProgress.includes(module.id);
            const progress = state.modules.moduleProgress[module.id];
            const completedCount = progress?.completedLessons?.length || 0;
            const percent = isCompleted ? 100 : Math.round((completedCount / module.lessons) * 100);

            return (
              <motion.div
                key={module.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/learn/${module.id}`)}
                className={`card flex flex-col gap-4 border border-transparent transition-all active:scale-[0.98] ${
                  isDownloaded ? 'bg-pale-yellow/50 border-yellow/30' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-2xl">
                    {module.icon}
                  </div>
                  <div className="flex gap-2">
                    {isDownloaded && (
                      <span className="bg-yellow text-navy text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={10} />
                        Ready offline
                      </span>
                    )}
                    {isCompleted && (
                      <span className="bg-green text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg mb-0.5">{module.title}</h4>
                  <div className="mb-2">
                    <span className="bg-navy/5 text-navy/60 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {(module as any).difficulty}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  {(isInProgress || isCompleted) && (
                    <div className="mb-3">
                      <div className="w-full bg-navy/5 h-1 rounded-full overflow-hidden mb-1">
                        <div 
                          className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green' : 'bg-yellow'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-grey font-medium">{percent}% Completed</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-grey text-xs">
                    <div className="flex items-center gap-1">
                      <BookOpen size={12} />
                      <span>{module.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold text-navy/60 uppercase tracking-widest">
                    {module.competency}
                  </span>
                  {!isDownloaded && (
                    <button
                      onClick={(e) => handleDownload(e, module.id)}
                      className="text-navy p-2 hover:bg-navy/5 rounded-full"
                    >
                      <Download size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Learn;
