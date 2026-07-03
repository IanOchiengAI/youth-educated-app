import React, { useState, useEffect, useRef } from 'react';
import { Users, Shield, GraduationCap, Clock, CheckCircle, Star, Flag, XCircle, Search } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

interface VerifiedMentor {
  id: string;
  name: string;
  expertise: string[];
  is_featured: boolean;
}

const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [pendingMentors, setPendingMentors] = useState<PendingMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [verifiedMentors, setVerifiedMentors] = useState<VerifiedMentor[]>([]);
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string>('');
  const [settingFeatured, setSettingFeatured] = useState(false);
  const [page, setPage] = useState(1);
  const [mentorReports, setMentorReports] = useState<any[]>([]);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const PAGE_SIZE = 50;
  const { state } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const recentSignupsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleManageRolesClick = () => {
    recentSignupsRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 400);
  };

  useEffect(() => {
    setPage(1);
  }, [state.isOffline, state.user?.role]);

  useEffect(() => {
    const fetchData = async () => {
      if (state.isOffline || !isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        // Fetch profiles with range-based pagination
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, role, joined_at, county')
          .order('joined_at', { ascending: false })
          .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
        
        if (!profilesError && profilesData) {
          setProfiles(prev => {
            const combined = page === 1 ? profilesData : [...prev, ...profilesData];
            const seen = new Set();
            return combined.filter(p => {
              if (seen.has(p.id)) return false;
              seen.add(p.id);
              return true;
            });
          });
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

        // Fetch verified mentors (for Featured Mentor selector)
        if (state.user?.role === 'admin') {
          const { data: verifiedData, error: verifiedError } = await supabase
            .from('mentor_profiles')
            .select('id, expertise, is_featured, profiles(name)')
            .eq('is_verified', true);

          if (!verifiedError && verifiedData) {
            const mapped = verifiedData.map((m: any) => ({
              id: m.id,
              name: m.profiles?.name || 'Mentor',
              expertise: m.expertise || [],
              is_featured: m.is_featured || false,
            }));
            setVerifiedMentors(mapped);
            // Pre-select the currently featured mentor
            const current = mapped.find((m: VerifiedMentor) => m.is_featured);
            if (current) setSelectedFeaturedId(current.id);
          }
        }
        // Fetch mentor reports
        const { data: reportsData } = await supabase
          .from('mentor_reports')
          .select('id, reason, details, status, created_at, reporter:reporter_id(name), reported:reported_user_id(name)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(20);
        if (reportsData) setMentorReports(reportsData);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [state.isOffline, page, state.user?.role]);

  const handleReject = async (id: string) => {
    if (state.isOffline) return;
    setRejecting(id);
    try {
      // Demote the user role back to student
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'student' })
        .eq('id', id);

      if (profileError) {
        console.error('Failed to demote user to student:', profileError);
        return;
      }

      // Delete their mentor profile
      const { error: mentorError } = await supabase
        .from('mentor_profiles')
        .delete()
        .eq('id', id);

      if (!mentorError) {
        setPendingMentors(prev => prev.filter(m => m.id !== id));
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: 'student' } : p));
      } else {
        console.error('Failed to delete mentor profile:', mentorError);
      }
    } finally {
      setRejecting(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (state.isOffline) return;
    setUpdatingRole(userId);
    try {
      // 1. Update the role in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (profileError) {
        console.error('Failed to update role:', profileError);
        return;
      }

      // 2. If new role is 'mentor', ensure mentor_profile exists and is verified
      if (newRole === 'mentor') {
        const { error: mentorError } = await supabase
          .from('mentor_profiles')
          .upsert({
            id: userId,
            specialization: 'General',
            bio: 'Mentor profile automatically created by Admin.',
            expertise: ['General'],
            is_verified: true,
          });
        if (mentorError) {
          console.error('Failed to create mentor profile:', mentorError);
        }
      } else {
        // If changed away from mentor, delete mentor profile
        await supabase
          .from('mentor_profiles')
          .delete()
          .eq('id', userId);
      }

      // Update local state
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
    } catch (err) {
      console.error('Role change error:', err);
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleResolveReport = async (id: number) => {
    await supabase.from('mentor_reports').update({ status: 'reviewed' }).eq('id', id);
    setMentorReports(prev => prev.filter(r => r.id !== id));
  };

  const handleApprove = async (id: string) => {
    if (state.isOffline) return;
    setApproving(id);
    try {
      const { error: mentorError } = await supabase
        .from('mentor_profiles')
        .update({ is_verified: true })
        .eq('id', id);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'mentor' })
        .eq('id', id);
      
      if (!mentorError && !profileError) {
        setPendingMentors(prev => prev.filter(m => m.id !== id));
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: 'mentor' } : p));
      } else {
        console.error('Failed to approve mentor:', mentorError || profileError);
      }
    } finally {
      setApproving(null);
    }
  };

  const handleSetFeatured = async () => {
    if (!selectedFeaturedId || state.isOffline || settingFeatured) return;
    setSettingFeatured(true);
    try {
      // Clear featured on all others
      await supabase
        .from('mentor_profiles')
        .update({ is_featured: false })
        .neq('id', selectedFeaturedId);

      // Set selected as featured
      const { error } = await supabase
        .from('mentor_profiles')
        .update({ is_featured: true, featured_at: new Date().toISOString() })
        .eq('id', selectedFeaturedId);

      if (!error) {
        setVerifiedMentors(prev => prev.map(m => ({
          ...m,
          is_featured: m.id === selectedFeaturedId,
        })));
      } else {
        console.error('Failed to set featured mentor:', error);
      }
    } finally {
      setSettingFeatured(false);
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
            <button 
              onClick={handleManageRolesClick}
              className="px-4 py-2 bg-off-white text-navy font-bold text-xs rounded-xl hover:bg-navy/5 active:scale-95 transition-all"
            >
              Manage Roles
            </button>
          </div>
        </div>

        {/* Featured Mentor Selector (Admin Only) */}
        {state.user?.role === 'admin' && verifiedMentors.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-navy/5">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow" size={20} />
              <h2 className="text-lg font-bold text-navy">Featured Mentor</h2>
            </div>
            <p className="text-xs text-navy/40 font-medium mb-4">Choose which mentor appears as the "Featured This Week" card on the student browse page.</p>
            <select
              value={selectedFeaturedId}
              onChange={e => setSelectedFeaturedId(e.target.value)}
              className="w-full bg-off-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-medium text-navy mb-3 outline-none focus:border-yellow"
            >
              <option value="">Select a mentor…</option>
              {verifiedMentors.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.expertise.join(', ')}{m.is_featured ? ' ⭐ (current)' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={handleSetFeatured}
              disabled={!selectedFeaturedId || settingFeatured || state.isOffline}
              className="w-full py-3 bg-yellow text-navy font-bold text-sm rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {settingFeatured ? (
                <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
              ) : (
                <Star size={16} />
              )}
              {settingFeatured ? 'Updating…' : 'Set as Featured'}
            </button>
          </div>
        )}

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
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleReject(m.id)}
                        disabled={rejecting === m.id || state.isOffline}
                        className="px-3 py-2 bg-red-100 text-red-600 font-bold text-xs rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {rejecting === m.id ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <XCircle size={14} />}
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(m.id)}
                        disabled={approving === m.id || state.isOffline}
                        className="px-3 py-2 bg-green-500 text-white font-bold text-xs rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {approving === m.id ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={14} />}
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mentor Reports */}
        {mentorReports.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-red-100">
            <div className="flex items-center gap-2 mb-4">
              <Flag size={18} className="text-red-500" />
              <h2 className="text-lg font-bold text-navy">Mentor Reports</h2>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold ml-auto">{mentorReports.length}</span>
            </div>
            <div className="space-y-4">
              {mentorReports.map((r: any) => (
                <div key={r.id} className="border border-red-50 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-navy">{r.reported?.name || 'Unknown mentor'}</p>
                      <p className="text-[10px] text-navy/40 font-bold uppercase">reported by {r.reporter?.name || 'Anonymous'}</p>
                    </div>
                    <button
                      onClick={() => handleResolveReport(r.id)}
                      className="text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-2 py-1 rounded-lg"
                    >
                      Mark reviewed
                    </button>
                  </div>
                  <p className="text-sm font-bold text-red-600">{r.reason}</p>
                  {r.details && <p className="text-xs text-navy/50 font-nunito">{r.details}</p>}
                  <p className="text-[10px] text-navy/30">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Users with Pagination */}
        <div ref={recentSignupsRef} className="bg-white rounded-[32px] p-6 shadow-sm border border-navy/5">
          <h2 className="text-lg font-bold text-navy mb-4">Recent Signups</h2>
          
          <div className="relative mb-4">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none">
              <Search size={16} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-off-white border border-navy/10 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-navy outline-none focus:border-yellow focus:bg-white transition-all"
            />
          </div>

          {loading && page === 1 ? (
             <div className="flex justify-center p-8">
               <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : profiles.length === 0 ? (
             <p className="text-center text-sm text-navy/40 py-4 font-medium italic">No recent users or offline.</p>
          ) : (
             <>
               <div className="space-y-4">
                 {profiles.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                   <p className="text-center text-sm text-navy/40 py-4 font-medium italic">No matching users found.</p>
                 ) : (
                   profiles
                     .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                     .map(p => (
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
                         <div className="flex items-center gap-3">
                           <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-navy/40 uppercase tracking-wider">
                                <Clock size={12} />
                                {new Date(p.joined_at).toLocaleDateString()}
                              </div>
                           </div>
                           <select
                             value={p.role}
                             disabled={updatingRole === p.id || state.isOffline}
                             onChange={(e) => handleRoleChange(p.id, e.target.value)}
                             className="bg-off-white text-navy font-bold text-xs rounded-xl px-2 py-1 outline-none border border-navy/10 focus:border-yellow disabled:opacity-50"
                           >
                             <option value="student">Student</option>
                             <option value="mentor">Mentor</option>
                             <option value="admin">Admin</option>
                             <option value="dsl">DSL</option>
                           </select>
                         </div>
                       </div>
                     ))
                 )}
               </div>
               
               {!state.isOffline && profiles.length >= page * PAGE_SIZE && searchQuery === '' && (
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
