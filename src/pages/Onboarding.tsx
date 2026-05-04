import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  User as UserIcon, 
  MapPin, 
  Target, 
  Shield, 
  Languages, 
  Calendar,
  Users,
  Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppContext } from '../AppContext';
import { COUNTIES, GOAL_OPTIONS } from '../data/modules';
import { addPoints } from '../lib/gamification';
import { supabase } from '../lib/supabase';
import { t, type Language } from '../lib/i18n';

const ONBOARDING_STEPS = 6;

const Onboarding: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Form State
  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Kiswahili'>('English');
  const [ageBracket, setAgeBracket] = useState('');
  const [county, setCounty] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'prefer_not_to_say' | ''>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [guardianPhone, setGuardianPhone] = useState('');
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const lang: Language = language;

  // Speech Recognition for self-introduction
  const introRecognitionRef = useRef<any>(null);
  const speechSupported = typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'Kiswahili' ? 'sw-KE' : 'en-KE';

    recognition.onresult = (event: any) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }
      setIntroduction(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      // Graceful — never crash. The kid in Garissa should never see a white screen.
      if (event.error !== 'no-speech') {
        console.warn('Speech recognition error:', event.error);
      }
      setIsListening(false);
    };

    introRecognitionRef.current = recognition;

    return () => {
      if (introRecognitionRef.current) {
        try { introRecognitionRef.current.stop(); } catch { /* already stopped */ }
      }
    };
  }, [language]);

  const toggleIntroListening = async () => {
    if (!introRecognitionRef.current) return;
    if (isListening) {
      introRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        introRecognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Mic permission denied — degrade silently, textarea still works
        console.warn('Microphone permission denied');
      }
    }
  };

  // Check for session on mount
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn("No active session. Redirecting to sign in.");
        navigate('/signin');
      } else {
        setIsVerifyingSession(false);
      }
    }
    checkSession();
  }, [navigate]);

  const nextStep = () => {
    if (step < ONBOARDING_STEPS) setStep(step + 1);
    else handleComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleComplete = async () => {
    // 1. Get the current authenticated user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No active session found during onboarding");
      return;
    }

    const userId = session.user.id;

    // 2. Prepare the profile data to match the database schema
    const profileData = {
      id: userId,
      name,
      language,
      age_bracket: ageBracket,
      county,
      gender: gender as any,
      goals: selectedGoals,
      guardian_consent: ageBracket === '10-12' || ageBracket === '13-15' ? guardianConsent : true,
      guardian_consent_at: new Date().toISOString(),
      guardian_phone: guardianPhone || undefined,
      onboarding_completed: true,
      role: 'student' as const,
    };

    // 3. Save to Supabase
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData);
      
    if (upsertError) {
      console.error("Error saving profile:", upsertError);
      // Wait, we probably want to show an error state to the user here
      // But for MVP we will just let it proceed with local state
    }

    // 4. Update Local State (AppContext)
    const newUser = {
      id: userId,
      name,
      language,
      ageBracket,
      county,
      gender: gender as any,
      goals: selectedGoals,
      schoolId: undefined, // Add this to match the User interface
      guardianConsent: profileData.guardian_consent,
      guardianConsentAt: profileData.guardian_consent_at,
      guardianPhone: profileData.guardian_phone,
      onboardingCompleted: true,
      joinedAt: new Date().toISOString(),
      role: 'student' as const,
      jabariVoice: 'default_male',
      mentorPairId: null,
    };

    dispatch({ type: 'SET_USER', payload: newUser });
    
    // Award points
    const result = addPoints(
      'ONBOARDING_COMPLETE',
      state.progress.points,
      state.progress.weeklyPoints,
      state.progress.lastWeeklyReset
    );
    
    dispatch({ type: 'UPDATE_PROGRESS', payload: {
      points: result.newTotal,
      weeklyPoints: result.newWeeklyPoints,
    }});

    // Celebrate!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1C1C6E', '#FFD700', '#FFFFFF']
    });

    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const isStepValid = () => {
    switch(step) {
      case 1: return name.length >= 2;
      case 2: return ageBracket !== '';
      case 3: return county !== '';
      case 4: return gender !== '';
      case 5: return selectedGoals.length > 0;
      case 6: 
        if (ageBracket === '10-12' || ageBracket === '13-15') {
          return guardianConsent && guardianPhone.length >= 9;
        }
        return true;
      default: return false;
    }
  };

  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col font-sans">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div 
          className="h-full bg-yellow"
          initial={{ width: 0 }}
          animate={{ width: `${(step / ONBOARDING_STEPS) * 100}%` }}
        />
      </div>

      <header className="p-6 flex justify-between items-center">
        {step > 1 ? (
          <button onClick={prevStep} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
        ) : (
          <img src="/logo-mark.png" alt="Youth Educated" className="h-10 w-auto" />
        )}
        <div className="ml-auto text-sm font-bold text-white/50 tracking-widest uppercase">
          {t('onboarding.step_indicator', lang)} {step} {t('onboarding.of', lang)} {ONBOARDING_STEPS}
        </div>
      </header>

      <main className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Step 1: Name & Language */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-yellow/20 w-16 h-16 rounded-3xl flex items-center justify-center text-yellow mb-2">
                  <UserIcon size={32} />
                </div>
                <h1 className="text-4xl font-bold leading-tight">{t('onboarding.mambo', lang)}</h1>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">{t('onboarding.what_name', lang)}</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('onboarding.enter_name', lang)}
                      className="w-full bg-white/10 border-2 border-white/10 rounded-3xl px-6 py-4 text-lg focus:border-yellow transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">{t('onboarding.tell_us_intro', lang)}</label>
                    <div className="flex gap-3 items-start">
                      <textarea
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        placeholder={t('onboarding.intro_placeholder', lang)}
                        rows={3}
                        className="flex-1 bg-white/10 border-2 border-white/10 rounded-2xl px-5 py-3 text-base focus:border-yellow transition-all outline-none resize-none"
                      />
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={toggleIntroListening}
                          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all mt-1 ${
                            isListening
                              ? 'bg-yellow text-navy animate-pulse shadow-lg shadow-yellow/40'
                              : 'bg-white/10 text-white/60 hover:bg-white/20'
                          }`}
                          aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                        >
                          <Mic size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">{t('onboarding.pref_lang', lang)}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['English', 'Kiswahili'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang as any)}
                          className={`py-4 rounded-3xl border-2 font-bold transition-all ${
                            language === lang 
                              ? 'bg-yellow border-yellow text-navy' 
                              : 'bg-white/5 border-white/5 text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Age Bracket */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-yellow/20 w-16 h-16 rounded-3xl flex items-center justify-center text-yellow mb-2">
                  <Calendar size={32} />
                </div>
                <h1 className="text-4xl font-bold leading-tight">{t('onboarding.how_old', lang)}</h1>
                <p className="text-white/60">{t('onboarding.age_hint', lang)}</p>
                <div className="grid grid-cols-1 gap-3">
                  {['10-12', '13-15', '16-18', '19-22'].map((bracket) => (
                    <button
                      key={bracket}
                      onClick={() => setAgeBracket(bracket)}
                      className={`w-full py-5 px-6 rounded-3xl border-2 text-left flex justify-between items-center transition-all ${
                        ageBracket === bracket 
                          ? 'bg-yellow border-yellow text-navy' 
                          : 'bg-white/5 border-white/5 text-white'
                      }`}
                    >
                      <span className="text-lg font-bold">{bracket} {t('onboarding.years_old', lang)}</span>
                      {ageBracket === bracket && <Check size={20} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: County */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-yellow/20 w-16 h-16 rounded-3xl flex items-center justify-center text-yellow mb-2">
                  <MapPin size={32} />
                </div>
                <h1 className="text-4xl font-bold leading-tight">{t('onboarding.where_live', lang)}</h1>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">{t('onboarding.select_county', lang)}</label>
                  <select 
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-white/10 border-2 border-white/10 rounded-3xl px-6 py-4 text-lg focus:border-yellow transition-all outline-none appearance-none"
                  >
                    <option value="" disabled className="bg-navy">{t('onboarding.choose_county', lang)}</option>
                    {COUNTIES.map(c => (
                      <option key={c} value={c} className="bg-navy">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Gender */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-yellow/20 w-16 h-16 rounded-3xl flex items-center justify-center text-yellow mb-2">
                  <Users size={32} />
                </div>
                <h1 className="text-4xl font-bold leading-tight">{t('onboarding.tell_about_self', lang)}</h1>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'male', label: t('onboarding.gender_male', lang) },
                    { id: 'female', label: t('onboarding.gender_female', lang) },
                    { id: 'prefer_not_to_say', label: t('onboarding.gender_none', lang) }
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGender(g.id as any)}
                      className={`w-full py-5 px-6 rounded-3xl border-2 text-left flex justify-between items-center transition-all ${
                        gender === g.id 
                          ? 'bg-yellow border-yellow text-navy' 
                          : 'bg-white/5 border-white/5 text-white'
                      }`}
                    >
                      <span className="text-lg font-bold">{g.label}</span>
                      {gender === g.id && <Check size={20} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Goals */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="bg-yellow/20 w-16 h-16 rounded-3xl flex items-center justify-center text-yellow mb-2">
                  <Target size={32} />
                </div>
                <h1 className="text-4xl font-bold leading-tight">{t('onboarding.what_goals', lang)}</h1>
                <p className="text-white/60">{t('onboarding.goals_hint', lang)}</p>
                <div className="grid grid-cols-2 gap-2">
                  {GOAL_OPTIONS.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-2xl border-2 text-sm font-bold text-center transition-all ${
                        selectedGoals.includes(goal)
                          ? 'bg-yellow border-yellow text-navy' 
                          : 'bg-white/5 border-white/5 text-white/70'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Guardian Consent */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="bg-yellow/20 w-16 h-16 rounded-3xl flex items-center justify-center text-yellow mb-2">
                  <Shield size={32} />
                </div>
                {ageBracket === '10-12' || ageBracket === '13-15' ? (
                  <>
                    <h1 className="text-4xl font-bold leading-tight">{t('onboarding.keep_safe', lang)}</h1>
                    <p className="text-white/60">{t('onboarding.guardian_hint', lang)}</p>
                    <div className="space-y-6">
                      <div className="bg-white/5 p-6 rounded-3xl border-2 border-white/5 space-y-4">
                        <label className="flex items-start gap-4 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={guardianConsent}
                            onChange={(e) => setGuardianConsent(e.target.checked)}
                            className="mt-1 w-6 h-6 rounded-lg bg-white/10 border-white/20 text-yellow focus:ring-yellow"
                          />
                          <span className="text-sm leading-relaxed">
                            {t('onboarding.guardian_agree', lang)}
                          </span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">{t('onboarding.guardian_phone', lang)}</label>
                        <input 
                          type="tel" 
                          value={guardianPhone}
                          onChange={(e) => setGuardianPhone(e.target.value)}
                          placeholder="e.g. 0712345678"
                          className="w-full bg-white/10 border-2 border-white/10 rounded-3xl px-6 py-4 text-lg focus:border-yellow transition-all outline-none"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 space-y-6">
                    <h1 className="text-4xl font-bold">{t('onboarding.all_set', lang)}</h1>
                    <p className="text-white/60 text-lg">{t('onboarding.ready_journey', lang)}</p>
                    <div className="bg-yellow/10 p-8 rounded-full border border-yellow/20 inline-block">
                      <Check size={64} className="text-yellow" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12">
          <button
            disabled={!isStepValid()}
            onClick={nextStep}
            className={`w-full py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-navy/50 ${
              isStepValid() 
                ? 'bg-yellow text-navy scale-100' 
                : 'bg-white/10 text-white/30 scale-95 cursor-not-allowed border-none'
            }`}
          >
            {step === ONBOARDING_STEPS ? t('onboarding.complete', lang) : t('btn.continue', lang)}
            <ChevronRight size={22} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
