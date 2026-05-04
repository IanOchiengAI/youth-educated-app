import React, { useState, useEffect } from 'react';
import { Users, Shield, GraduationCap, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../AppContext';

interface Profile {
  id: string;
  name: string;
  role: string;
  joined_at: string;
  county: string;
}

interface PendingMentor {
  id: string;
  name: string;
  expertise: string[];
  joined_at: string;
}

const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [pendingMentors, setPendingMentors] = useState<PendingMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;
  const { state } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      if (state.isOffline) {
        setLoading(false);
        return;
      }
      try {
        // Fetch profiles with pagination
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, role, joined_at, county')
          .order('joined_at', { ascending: false })
          .limit(page * PAGE_SIZE);
        
        if (!profilesError && profilesData) {
          setProfiles(profilesData);
        }

        // Fetch pending mentors
        const { data: mentorsData, error: mentorsError } = await supabase
          .from('mentor_profiles')
          .select('id, expertise, profiles(name, joined_at)')
          .eq('is_verified', false);

        if (!mentorsError && mentorsData) {
          const pending = mentorsData.map((m: any) => ({
            id: m.id,
            name: m.profiles?.name || 'Anonymous',
            expertise: m.expertise || [],
            joined_at: m.profiles?.joined_at || new Date().toISOString(),
          }));
          setPendingMentors(pending);
        }
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [state.isOffline, page]);

  const handleApprove = async (id: string) => {
    if (state.isOffline) return;
    setApproving(id);
    try {
      const { error } = await supabase
        .from('mentor_profiles')
        .update({ is_verified: true })
        .eq('id', id);
      
      if (!error) {
        setPendingMentors(prev => prev.filter(m => m.id !== id));
      } else {
        console.error('Failed to approve mentor:', error);
      }
    } finally {
      setApproving(null);
    }
  };

  const stats = {
    total: profiles.length,
    students: profiles.filter(p => p.role === 'student').length,
    mentors: profiles.filter(p => p.role === 'mentor').length,
    dsls: profiles.filter(p => p.role === 'dsl').length,
  };

  return (
    <div className="min-h-screen bg-off-white pb-24">
      <header className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
        <h1 className="text-3xl font-bold mb-2 relative z-10">Admin Portal</h1>
        <p className="text-white/60 relative z-10">Overview & User Management</p>
      </header>

      <main className="px-6 -mt-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-navy/5 flex flex-col items-center justify-center text-center">
            <Users className="text-blue-500 mb-2" size={24} />
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Recent Users</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-navy/5 flex flex-col items-center justify-center text-center">
            <GraduationCap className="text-green-500 mb-2" size={24} />
            <p className="text-2xl font-bold text-navy">{stats.students}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Students</p>
          </div>
          <div className="col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-navy/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow/20 text-yellow-700 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-navy">{stats.mentors} Mentors</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">{stats.dsls} DSLs</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-off-white text-navy font-bold text-xs rounded-xl hover:bg-navy/5 transition-colors">
              Manage Roles
            </button>
          </div>
        </div>

        {/* Pending Mentor Approvals */}
        {(!loading || pendingMentors.length > 0) && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-navy/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy">Pending Mentors</h2>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-bold">
                {pendingMentors.length}
              </span>
            </div>
            
            {pendingMentors.length === 0 ? (
               <p className="text-center text-sm text-navy/40 py-4 font-medium italic">No pending mentor approvals.</p>
            ) : (
              <div className="space-y-4">
                {pendingMentors.map(m => (
                  <div key={m.id} className="flex items-center justify-between border-b border-navy/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-navy">{m.name}</p>
                      <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest mt-1">
                        {m.expertise.join(', ') || 'General'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-navy/30 uppercase mt-1">
                        <Clock size={10} />
                        Joined {new Date(m.joined_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApprove(m.id)}
                      disabled={approving === m.id || state.isOffline}
                      className="ml-4 px-4 py-2 bg-green-500 text-white font-bold text-xs rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {approving === m.id ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Users with Pagination */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-navy/5">
          <h2 className="text-lg font-bold text-navy mb-4">Recent Signups</h2>
          {loading && page === 1 ? (
             <div className="flex justify-center p-8">
               <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : profiles.length === 0 ? (
             <p className="text-center text-sm text-navy/40 py-4 font-medium italic">No recent users or offline.</p>
          ) : (
            <>
              <div className="space-y-4">
                {profiles.map(p => (
                  <div key={p.id} className="flex items-center justify-between border-b border-navy/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-navy font-bold text-lg shadow-inner">
                        {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy">{p.name || 'Anonymous'}</p>
                        <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">{p.role === 'student' ? 'Student' : p.role} • {p.county || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <div className="flex items-center gap-1 text-[10px] font-bold text-navy/40 uppercase tracking-wider">
                         <Clock size={12} />
                         {new Date(p.joined_at).toLocaleDateString()}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {!state.isOffline && profiles.length >= page * PAGE_SIZE && (
                <button 
                  onClick={() => setPage(p => p + 1)}
                  className="w-full mt-6 py-3 bg-off-white text-navy font-bold text-xs rounded-xl hover:bg-navy/5 transition-colors"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
