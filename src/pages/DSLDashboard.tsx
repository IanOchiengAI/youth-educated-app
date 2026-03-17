import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../AppContext';

interface SafeguardingFlag {
  id: string;
  user_id: string;
  category: 'A' | 'B';
  message: string;
  created_at: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

const DSLDashboard: React.FC = () => {
  const [flags, setFlags] = useState<SafeguardingFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext();

  useEffect(() => {
    const fetchFlags = async () => {
      if (state.isOffline) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('safeguarding_flags')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setFlags(data);
        }
      } catch (err) {
        console.error('Failed to fetch safeguarding flags', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlags();
  }, [state.isOffline]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      if (!state.isOffline) {
        const { error } = await supabase.from('safeguarding_flags').update({ status: newStatus }).eq('id', id);
        if (error) throw error;
      }
      setFlags(flags.map(f => f.id === id ? { ...f, status: newStatus as any } : f));
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const pendingCount = flags.filter(f => f.status === 'pending').length;

  return (
    <div className="min-h-screen bg-off-white pb-24">
      <header className="bg-red-900 text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-red-500/20 rounded-full blur-3xl opacity-50" />
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <ShieldAlert size={28} className="text-red-400" />
          <h1 className="text-3xl font-bold">DSL Portal</h1>
        </div>
        <p className="text-white/60 relative z-10">Safeguarding & Escalation Management</p>
      </header>

      <main className="px-6 -mt-8 space-y-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-navy/5 flex items-center justify-between">
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-1">Pending Actions</p>
             <p className="text-4xl font-black text-red-600">{pendingCount}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-navy px-2">Recent Flags</h2>
          
          {loading ? (
             <div className="flex justify-center p-8">
               <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : flags.length === 0 ? (
             <div className="bg-white p-8 rounded-[32px] text-center border border-navy/5">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <p className="text-navy font-bold text-lg mb-1">All Clear</p>
                <p className="text-sm text-navy/50 font-medium">No safeguarding flags found.</p>
             </div>
          ) : (
            flags.map(flag => (
              <div key={flag.id} className={`bg-white rounded-[32px] p-6 shadow-sm border-l-4 ${flag.category === 'A' ? 'border-l-red-600' : 'border-l-orange-500'} border-r border-t border-b border-navy/5`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 items-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest text-white uppercase ${flag.category === 'A' ? 'bg-red-600' : 'bg-orange-500'}`}>
                      CAT {flag.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${flag.status === 'pending' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {flag.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-navy/40 uppercase tracking-wider">
                    <Clock size={12} />
                    {new Date(flag.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div className="bg-off-white p-4 rounded-2xl border border-navy/5 mb-4 relative">
                  <div className="absolute top-4 left-4 text-navy/10"><ShieldAlert size={20} /></div>
                  <p className="italic text-navy/80 text-sm pl-8">"{flag.message}"</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-navy/30 uppercase mb-1">User ID</p>
                    <p className="text-xs font-bold text-navy truncate max-w-[120px]">{flag.user_id}</p>
                  </div>
                  
                  {flag.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateStatus(flag.id, 'reviewed')} 
                        className="px-4 py-2 bg-yellow text-navy rounded-xl text-xs font-bold active:scale-95 transition-transform"
                      >
                        Review
                      </button>
                      <button 
                        onClick={() => updateStatus(flag.id, 'resolved')} 
                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DSLDashboard;
