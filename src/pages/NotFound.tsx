import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
        <Frown size={48} className="text-yellow" />
      </div>
      <h1 className="text-6xl font-black mb-2">404</h1>
      <p className="text-xl font-bold mb-2">Page Not Found</p>
      <p className="text-white/50 font-medium mb-10 max-w-xs">
        Hii ukurasa haipo. Let's get you back on track!
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 bg-yellow text-navy font-bold px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        <Home size={20} />
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
