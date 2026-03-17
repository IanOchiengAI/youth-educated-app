import React, { useState, useEffect } from 'react';
import { Users, Shield, GraduationCap, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../AppContext';

interface Profile {
  id: string;
  name: string;
  role: string;
  joined_at: string;
  county: string;
}

const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (state.isOffline) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, role, joined_at, county')
          .order('joined_at', { ascending: false })
          .limit(50);
        
        if (!error && data) {
          setProfiles(data);
        }
      } catch (err) {
        console.error('Failed to fetch profiles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [state.isOffline]);

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

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-navy/5">
          <h2 className="text-lg font-bold text-navy mb-4">Recent Signups</h2>
          {loading ? (
             <div className="flex justify-center p-8">
               <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : profiles.length === 0 ? (
             <p className="text-center text-sm text-navy/40 py-4 font-medium italic">No recent users or offline.</p>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
