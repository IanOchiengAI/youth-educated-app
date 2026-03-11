
import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, Users } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { state } = useAppContext();
  const { user, progress } = state;

  // Simulate cohort members
  const cohortMembers = useMemo(() => {
    const seed = user?.county || 'Nairobi';
    const members = [
      { name: 'Keziah M.', points: 1240, isUser: false },
      { name: 'Otieno J.', points: 1150, isUser: false },
      { name: 'Wanjiku N.', points: 980, isUser: false },
      { name: 'Musa A.', points: 850, isUser: false },
      { name: 'Fatuma S.', points: 720, isUser: false },
      { name: 'Brian K.', points: 640, isUser: false },
      { name: 'Achieng L.', points: 590, isUser: false },
      { name: 'Mutua P.', points: 410, isUser: false },
      { name: 'Zainab R.', points: 320, isUser: false },
      { name: 'David O.', points: 280, isUser: false },
    ];

    // Add user
    members.push({
      name: user?.name || 'You',
      points: progress.weeklyPoints,
      isUser: true
    });

    // Sort by points
    return members.sort((a, b) => b.points - a.points);
  }, [user, progress.weeklyPoints]);

  const top5 = cohortMembers.slice(0, 5);
  const userRank = cohortMembers.findIndex(m => m.isUser) + 1;
  const isInTopHalf = userRank <= Math.ceil(cohortMembers.length / 2);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow/20 rounded-lg flex items-center justify-center text-yellow">
            <Trophy size={18} />
          </div>
          <h2 className="font-poppins font-bold text-navy">Cohort Leaders</h2>
        </div>
        <div className="bg-pale-yellow px-3 py-1 rounded-full flex items-center gap-1.5">
          <Users size={12} className="text-navy/60" />
          <span className="text-[10px] font-bold text-navy/60 uppercase tracking-wider">
            {user?.county || 'Nairobi'} Cohort
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {top5.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
              member.isUser ? 'bg-yellow border-2 border-navy/10' : 'bg-off-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 text-center font-poppins font-bold ${
                index === 0 ? 'text-yellow-600' : 
                index === 1 ? 'text-gray-400' : 
                index === 2 ? 'text-orange-400' : 'text-navy/30'
              }`}>
                {index + 1}
              </span>
              <span className={`font-bold ${member.isUser ? 'text-navy' : 'text-navy/80'}`}>
                {member.name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-navy">{member.points}</span>
              <span className="text-[10px] font-bold text-navy/40 uppercase">pts</span>
            </div>
          </motion.div>
        ))}
      </div>

      {userRank > 5 && (
        <div className="bg-navy/5 rounded-2xl p-4 flex items-center gap-3 border border-dashed border-navy/10">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy shadow-sm">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-navy font-bold text-sm">
              {isInTopHalf ? "You're in the top half!" : "Keep pushing, you're getting there!"}
            </p>
            <p className="text-navy/60 text-[11px] font-medium">
              Only {top5[4].points - progress.weeklyPoints} pts away from the top 5
            </p>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] font-bold text-navy/30 uppercase tracking-[2px] mt-6">
        Resets every Monday at 00:00 EAT
      </p>
    </div>
  );
};

export default Leaderboard;
