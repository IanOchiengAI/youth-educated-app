import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { COUNTIES, GOAL_OPTIONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Search } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    language: 'English' as 'English' | 'Kiswahili',
    ageBracket: '',
    county: '',
    goals: [] as string[],
    guardianPhone: '',
  });

  const [countySearch, setCountySearch] = useState('');

  const handleGoalToggle = (goal: string) => {
    if (formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: formData.goals.filter((g) => g !== goal) });
    } else if (formData.goals.length < 3) {
      setFormData({ ...formData, goals: [...formData.goals, goal] });
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1: return formData.name.length > 2;
      case 2: return formData.ageBracket !== '';
      case 3: return formData.county !== '';
      case 4: return formData.goals.length === 3;
      case 5:
        if (['10-12', '13-15'].includes(formData.ageBracket)) {
          return formData.guardianPhone.length >= 10;
        }
        return true;
      default: return false;
    }
  };

  const handleContinue = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      const newUser = {
        name: formData.name,
        ageBracket: formData.ageBracket,
        county: formData.county,
        language: formData.language,
        goals: formData.goals,
        joinedAt: new Date().toISOString(),
        consent: ['10-12', '13-15'].includes(formData.ageBracket) ? {
          granted: true,
          timestamp: new Date().toISOString(),
          guardianPhone: formData.guardianPhone
        } : undefined
      };
      dispatch({ type: 'SET_USER', payload: newUser });
      dispatch({ type: 'ADD_POINTS', payload: 50 });
      navigate('/dashboard');
    }
  };

  const filteredCounties = COUNTIES.filter(c => c.toLowerCase().includes(countySearch.toLowerCase()));

  return (
    <div className="p-4 pt-10 flex flex-col min-h-screen">
      <div className="flex justify-center gap-2 mb-10">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              s === step ? 'bg-yellow' : s < step ? 'bg-navy' : 'bg-navy/20'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h1 className="text-center">Welcome! Let's get started.</h1>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-bold text-navy">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-navy">Preferred Language</label>
                  <div className="flex bg-white rounded-full p-1 border border-gray-200">
                    <button
                      className={`flex-1 py-2 rounded-full font-semibold transition-colors ${
                        formData.language === 'English' ? 'bg-navy text-white' : 'text-grey'
                      }`}
                      onClick={() => setFormData({ ...formData, language: 'English' })}
                    >
                      English
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-full font-semibold transition-colors ${
                        formData.language === 'Kiswahili' ? 'bg-navy text-white' : 'text-grey'
                      }`}
                      onClick={() => setFormData({ ...formData, language: 'Kiswahili' })}
                    >
                      Kiswahili
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h1 className="text-center">How old are you?</h1>
              <div className="grid grid-cols-2 gap-4">
                {['10-12', '13-15', '16-18', '19-22'].map((bracket) => (
                  <button
                    key={bracket}
                    className={`card h-32 flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.ageBracket === bracket ? 'border-2 border-navy bg-navy/5' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, ageBracket: bracket })}
                  >
                    <span className="text-2xl font-bold text-navy">{bracket}</span>
                    <span className="text-grey text-xs">Years Old</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h1 className="text-center">Where do you live?</h1>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" size={20} />
                  <input
                    type="text"
                    className="input-field pl-12"
                    placeholder="Search county..."
                    value={countySearch}
                    onChange={(e) => setCountySearch(e.target.value)}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {filteredCounties.map((county) => (
                    <button
                      key={county}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                        formData.county === county ? 'bg-navy text-white border-navy' : 'bg-white border-gray-200'
                      }`}
                      onClick={() => setFormData({ ...formData, county })}
                    >
                      {county}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h1 className="text-center">What are your goals?</h1>
              <p className="text-center text-grey">Tap 3 goals that matter most to you.</p>
              <div className="grid grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((goal) => {
                  const isSelected = formData.goals.includes(goal.title);
                  return (
                    <button
                      key={goal.title}
                      className={`p-3 rounded-xl text-center text-[13px] font-bold transition-all h-20 flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-navy text-white shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                          : 'bg-white text-navy border border-gray-100'
                      }`}
                      onClick={() => handleGoalToggle(goal.title)}
                    >
                      <span className="text-xl">{goal.icon}</span>
                      <span>{goal.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h1 className="text-center">Almost there!</h1>
              {['10-12', '13-15'].includes(formData.ageBracket) ? (
                <div className="card space-y-4">
                  <h3 className="text-center">Parental Consent</h3>
                  <p className="text-sm text-grey text-center">
                    Since you are under 16, we need a parent or guardian's phone number to continue.
                  </p>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Guardian Phone Number"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  />
                  <div className="flex items-center gap-2 text-xs text-grey bg-off-white p-3 rounded-lg">
                    <Check size={14} className="text-green" />
                    <span>Consent will be locked with a timestamp.</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto">
                    <Check size={40} className="text-green" />
                  </div>
                  <h3>You're all set!</h3>
                  <p className="text-grey">Ready to join the Youth Educated community?</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10">
        {isStepComplete() && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="btn-primary"
            onClick={handleContinue}
          >
            <span>{step === 5 ? 'Get Started' : 'Continue'}</span>
            <ChevronRight size={20} className="ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
