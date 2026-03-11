import React from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Settings, Award, Shield, LogOut, ChevronRight, MapPin, Globe } from 'lucide-react';

const Profile: React.FC = () => {
  const { state } = useAppContext();

  const achievements = [
    { id: '1', title: 'Early Bird', icon: '🌅', date: 'Oct 12' },
    { id: '2', title: 'Fast Learner', icon: '⚡', date: 'Oct 14' },
    { id: '3', title: 'Social Star', icon: '🌟', date: 'Oct 15' },
  ];

  return (
    <div className="space-y-6 pb-24">
      <header className="bg-navy px-6 pt-12 pb-20 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-3xl border-4 border-yellow overflow-hidden bg-white/10 flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow text-navy p-2 rounded-xl shadow-lg">
              <Settings size={16} />
            </div>
          </div>
          <h1 className="text-white text-2xl mb-1">{state.user?.name}</h1>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-yellow" />
              <span>{state.user?.county}</span>
            </div>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-1">
              <Globe size={14} className="text-yellow" />
              <span>{state.user?.language === 'en' ? 'English' : 'Kiswahili'}</span>
            </div>
          </div>
        </div>
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      </header>

      <div className="px-4 space-y-6 -mt-10">
        {/* Tier Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-yellow p-6 rounded-[24px] shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <span className="text-navy/60 text-[10px] font-bold uppercase tracking-widest">Current Status</span>
              <h2 className="text-navy text-2xl">{state.progress.tier}</h2>
            </div>
            <div className="bg-navy text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
              Level 4
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-navy text-xs font-bold">
              <span>{state.progress.points} Points</span>
              <span>1000 to Next Tier</span>
            </div>
            <div className="w-full bg-navy/10 h-2.5 rounded-full overflow-hidden">
              <div className="bg-navy h-full w-[45%]" />
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-navy">Achievements</h3>
            <button className="text-navy text-xs font-bold">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {achievements.map((ach) => (
              <div key={ach.id} className="card min-w-[120px] flex flex-col items-center p-4 text-center">
                <span className="text-3xl mb-2">{ach.icon}</span>
                <span className="font-bold text-xs mb-1">{ach.title}</span>
                <span className="text-grey text-[10px]">{ach.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Options */}
        <section className="space-y-3">
          {[
            { label: 'Safeguarding & Support', icon: Shield, color: 'text-red' },
            { label: 'My Achievements', icon: Award, color: 'text-navy' },
            { label: 'Settings', icon: Settings, color: 'text-navy' },
            { label: 'Log Out', icon: LogOut, color: 'text-grey' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full card flex items-center justify-between p-4 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-off-white flex items-center justify-center ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <span className={`font-bold text-sm ${item.color === 'text-red' ? 'text-red' : 'text-navy'}`}>
                  {item.label}
                </span>
              </div>
              <ChevronRight size={18} className="text-grey" />
            </button>
          ))}
        </section>

        <div className="text-center pt-4">
          <p className="text-grey text-[11px] font-medium">Youth Educated v1.0.0</p>
          <p className="text-grey text-[10px] mt-1">Conversation. Choice. Change.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
