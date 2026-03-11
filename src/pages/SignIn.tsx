import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Mail, ChevronRight } from 'lucide-react';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate credentials
    // For MVP, we just redirect if user exists in localStorage
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <header className="p-6">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-navy">
          <ArrowLeft size={20} />
        </button>
      </header>

      <main className="flex-1 px-6 pt-4 pb-12 flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl mb-2">Welcome Back</h1>
          <p className="text-grey leading-relaxed">
            Continue your journey of growth and mentorship.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6 flex-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-navy uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-navy uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button type="button" className="text-navy text-sm font-bold block text-right">
            Forgot Password?
          </button>

          <div className="pt-8 space-y-4">
            <button type="submit" className="btn-primary w-full">
              Sign In
              <ChevronRight size={20} className="ml-2" />
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="w-full py-4 text-navy font-bold text-sm"
            >
              New here? <span className="text-yellow-600">Create an account</span>
            </button>
          </div>
        </form>

        <div className="mt-auto text-center">
          <p className="text-grey text-[11px]">
            By signing in, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
