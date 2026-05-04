
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, Users, WifiOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  name: string;
  points: number;
  isUser: boolean;
}

const Leaderboard: React.FC = () => {
  const { state } = useAppContext();
  const { user, progress } = state;
  const [members, setMembers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        if (state.isOffline) {
          throw new Error('offline');
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, points')
          .eq('county', user?.county || 'Nairobi')
          .order('points', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          const entries: LeaderboardEntry[] = data.map(p => ({
            name: p.name || 'Scholar',
            points: p.points || 0,
            isUser: p.id === user?.id,
          }));

          // Ensure the current user is in the list
          const userInList = entries.some(e => e.isUser);
          if (!userInList) {
            entries.push({
              name: user?.name || 'You',
              points: progress.weeklyPoints,
              isUser: true,
            });
          }

          setMembers(entries.sort((a, b) => b.points - a.points));
          setIsOffline(false);
        } else {
          // Empty table — show user-only fallback
          throw new Error('empty');
        }
      } catch {
        // Offline or fetch failed — show user-only entry
        setIsOffline(true);
        setMembers([{
          name: user?.name || 'You',
          points: progress.weeklyPoints,
          isUser: true,
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user?.county, user?.id, user?.name, progress.weeklyPoints, state.isOffline]);

  const top5 = members.slice(0, 5);
  const userRank = members.findIndex(m => m.isUser) + 1;
  const isInTopHalf = userRank <= Math.ceil(members.length / 2);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-3 border-yellow border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

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

      {isOffline && (
        <div className="bg-navy/5 rounded-2xl p-3 mb-4 flex items-center gap-2">
          <WifiOff size={14} className="text-navy/40" />
          <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Leaderboard unavailable offline</span>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {top5.map((member, index) => (
          <motion.div
            key={`${member.name}-${index}`}
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

      {userRank > 5 && top5.length >= 5 && (
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
