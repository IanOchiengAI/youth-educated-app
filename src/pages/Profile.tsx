import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Award, 
  User as UserIcon, 
  ChevronRight, 
  LogOut, 
  Languages, 
  Heart,
  TrendingUp,
  Smartphone,
  Target,
  Sparkles,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAppContext } from '../AppContext';
import { getCurrentTier } from '../utils/gamification';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { signOut } from '../lib/auth';

const Profile: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'wellness' | 'achievements' | 'settings'>('overview');

  const currentTier = getCurrentTier(state.progress.points);

  const moodLogs = useLiveQuery(
    () => db.moodLogs.where('userId').equals(state.user?.id || '').toArray(),
    [state.user?.id]
  );

  const moodData = React.useMemo(() => {
    if (!moodLogs) return [];
    return moodLogs.slice(-7).map((log) => ({
      day: new Date(log.logDate).toLocaleDateString('en-KE', { weekday: 'short' }),
      score: log.energyLevel / 2 // Mapping back to 1-5 for the chart
    }));
  }, [moodLogs]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <UserIcon size={18} /> },
    { id: 'wellness', label: 'Wellness', icon: <Heart size={18} /> },
    { id: 'achievements', label: 'Badges', icon: <Award size={18} /> },
    { id: 'settings', label: 'Setup', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-off-white pb-32">
      <header className="bg-navy text-white pt-12 pb-16 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-50" />
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 bg-yellow rounded-[36px] flex items-center justify-center text-navy text-4xl shadow-xl shadow-yellow/20">
              {state.user?.gender === 'female' ? '👩‍🎓' : state.user?.gender === 'male' ? '👨‍🎓' : '🧑‍🎓'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xl shadow-lg border border-navy/5">
              {currentTier.icon}
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">{state.user?.name || 'Scholar'}</h1>
            <p className="text-white/50 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">
              Member Since {new Date(state.user?.joinedAt || new Date()).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
              {state.user?.county || 'Kenya'}
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
              {state.user?.ageBracket || '16-18'} Years
            </div>
          </div>
        </div>

        <div className="flex justify-around bg-white/5 border border-white/10 rounded-full p-2 mt-12 mx-auto max-w-sm backdrop-blur-md">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3 rounded-full flex items-center gap-2 transition-all ${
                activeTab === tab.id 
                  ? 'bg-yellow text-navy shadow-lg' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab.icon}
              {activeTab === tab.id && <span className="text-xs font-bold">{tab.label}</span>}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 -mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm">
                    <TrendingUp size={24} className="text-blue-500 mb-2" />
                    <p className="text-2xl font-bold text-navy">{state.progress.points}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Total Points</p>
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm">
                    <Award size={24} className="text-yellow-600 mb-2" />
                    <p className="text-2xl font-bold text-navy">{state.progress.achievements.filter(a => a.unlocked).length}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Badges Unlocked</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm space-y-4">
                  <h3 className="font-bold text-navy flex items-center gap-2">
                    <Target size={18} className="text-green-500" />
                    Active Goals
                  </h3>
                  <div className="space-y-3">
                    {state.user?.goals.map((goal, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-off-white rounded-2xl border border-navy/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow" />
                        <span className="text-xs font-bold text-navy">{goal}</span>
                      </div>
                    ))}
                    {(!state.user?.goals || state.user.goals.length === 0) && (
                       <p className="text-xs text-navy/30 italic">No goals set yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wellness' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-navy">Mood Trends</h3>
                    <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full text-[9px] font-black text-blue-600 uppercase tracking-widest">
                       Last 7 Logs
                    </div>
                  </div>
                  
                  {moodData.length > 0 ? (
                    <div className="h-48 w-full -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={moodData}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1E3A8B" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#1E3A8B" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} 
                          />
                          <YAxis hide domain={[0, 5]} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1E3A8B' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#1E3A8B" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorScore)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-off-white rounded-2xl border-2 border-dashed border-navy/5">
                       <p className="text-xs text-navy/30 font-bold uppercase tracking-widest text-center">No logs found. Check in from the dashboard!</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-600 p-8 rounded-[40px] text-white space-y-4 shadow-xl shadow-blue-900/20">
                  <div className="flex items-center gap-2 text-blue-200">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Jabari's Wisdom</span>
                  </div>
                  <p className="text-lg font-bold leading-tight italic">
                    "Self-care is the best kind of fuel. Keep monitoring your progress and believe in your light."
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-2 gap-4">
                {state.progress.achievements.map((ach) => (
                  <div 
                    key={ach.id} 
                    className={`bg-white p-6 rounded-[32px] border text-center space-y-3 transition-all ${
                      ach.unlocked 
                        ? 'border-yellow/20 bg-yellow/5' 
                        : 'border-navy/5 opacity-50 grayscale'
                    }`}
                  >
                    <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-sm">
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-navy">{ach.name}</h4>
                      <p className="text-[9px] text-navy/40 font-medium leading-tight mt-1">{ach.description}</p>
                    </div>
                    {ach.unlocked && (
                      <div className="text-[8px] font-black uppercase tracking-widest text-yellow-700 bg-yellow/20 px-2.5 py-1 rounded-full inline-block">
                        Unlocked
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-[40px] overflow-hidden border border-navy/5 shadow-sm mb-12">
                <div className="p-6 border-b border-navy/5">
                  <h3 className="font-bold text-navy">Account Sync</h3>
                </div>
                <div className="divide-y divide-navy/5">
                  <button className="w-full flex items-center justify-between p-6 hover:bg-off-white transition-colors text-left">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Languages size={18} /></div>
                      <div>
                        <p className="font-bold text-sm text-navy">App Language</p>
                        <p className="text-[10px] text-navy/40 font-bold uppercase">{state.user?.language}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-navy/20" />
                  </button>
                  <button className="w-full flex items-center justify-between p-6 hover:bg-off-white transition-colors text-left">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><Smartphone size={18} /></div>
                      <div>
                        <p className="font-bold text-sm text-navy">Security</p>
                        <p className="text-[10px] text-navy/40 font-bold uppercase">Phone Auth Active</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-navy/20" />
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-6 hover:bg-red-50 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100"><LogOut size={18} /></div>
                      <div>
                        <p className="font-bold text-sm text-navy group-hover:text-red-600">Sign Out</p>
                        <p className="text-[10px] text-navy/40 font-bold uppercase">Goodbye for now</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/privacy')}
                    className="w-full flex items-center justify-between p-6 hover:bg-off-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-navy/5 text-navy/60 rounded-xl"><Shield size={18} /></div>
                      <div>
                        <p className="font-bold text-sm text-navy">Privacy Policy</p>
                        <p className="text-[10px] text-navy/40 font-bold uppercase">How we protect your data</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-navy/20" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Profile;
