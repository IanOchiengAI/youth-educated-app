import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Briefcase, 
  Hammer, 
  Palette, 
  Users,
  Dna
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { useCareerQuestions } from '../hooks/useContent';
import { addPoints } from '../lib/gamification';

const CareerMapper: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1-10: Questions, 11: Result
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const { data: CAREER_QUESTIONS, loading } = useCareerQuestions();

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);
    
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: number[]) => {
    const scores = { stem: 0, arts: 0, social: 0, tvet: 0 };
    
    finalAnswers.forEach((ansIdx, qIdx) => {
      const option = CAREER_QUESTIONS[qIdx].options[ansIdx];
      scores.stem += option.weights.stem;
      scores.arts += option.weights.arts;
      scores.social += option.weights.social;
      scores.tvet += option.weights.tvet;
    });

    const pathways = [
      { id: 'stem', label: 'STEM (Science, Tech, Engineering, Math)', score: scores.stem, icon: <Dna size={32} /> },
      { id: 'arts', label: 'Arts & Sports', score: scores.arts, icon: <Palette size={32} /> },
      { id: 'social', label: 'Social Sciences', score: scores.social, icon: <Users size={32} /> },
      { id: 'tvet', label: 'TVET (Practical & Technical Skills)', score: scores.tvet, icon: <Hammer size={32} /> },
    ];

    const topPath = pathways.sort((a, b) => b.score - a.score)[0];

    const results = {
      ...scores,
      topPathway: topPath.id,
      completedAt: new Date().toISOString(),
    };

    dispatch({ type: 'SET_CAREER_RESULTS', payload: results });
    
    // Award points
    const result = addPoints(
      'CAREER_ASSESSMENT',
      state.progress.points,
      state.progress.weeklyPoints,
      state.progress.lastWeeklyReset
    );
    dispatch({ type: 'UPDATE_PROGRESS', payload: { points: result.newTotal, weeklyPoints: result.newWeeklyPoints } });

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E3A8A', '#FACC15']
    });

    setShowResult(true);
  };

  const getPathwayInfo = (id: string) => {
    switch(id) {
      case 'stem': return { 
        title: "STEM Explorer", 
        desc: "You have a logical mind and love discovering how things work. The world of science and technology is yours to conquer!", 
        careers: ["Software Dev", "Doctor", "Engineer", "Data Analyst"] 
      };
      case 'arts': return { 
        title: "Creative Soul", 
        desc: "You see the beauty and possibility in everything. Your creativity will inspire many through art, music, or design.", 
        careers: ["Artist", "Graphic Designer", "Musician", "Fashion Icon"] 
      };
      case 'social': return { 
        title: "Community Leader", 
        desc: "You connect deeply with people and want to make a difference. Leadership and service are your true calling.", 
        careers: ["Teacher", "Lawyer", "Social Worker", "Journalist"] 
      };
      case 'tvet': return { 
        title: "Master Craftsperson", 
        desc: "You are a problem solver who loves practical challenges. Your skills will build the future of our nation's infrastructure.", 
        careers: ["Electrician", "Automotive Expert", "Agribusiness", "Welder"] 
      };
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-off-white pb-24">
      <header className="bg-navy text-white px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-yellow/10 rounded-full blur-3xl opacity-50" />
        <div className="flex justify-between items-start mb-8">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">Career Mapper</h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Find your path</p>
          </div>
        </div>

        {!showResult && currentStep > 0 && (
          <div className="bg-white/5 rounded-full p-1 border border-white/10">
            <div className="h-2 rounded-full bg-yellow" style={{ width: `${(currentStep / 10) * 100}%` }} />
          </div>
        )}
      </header>

      <main className="px-6 -mt-8 flex flex-col max-w-lg mx-auto w-full min-h-[60vh]">
        <AnimatePresence mode="wait">
          {!showResult ? (
            currentStep === 0 ? (
              <motion.div 
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-8 rounded-[40px] shadow-xl shadow-navy/5 text-center space-y-8"
              >
                <div className="w-20 h-20 bg-yellow rounded-full mx-auto flex items-center justify-center text-navy text-4xl shadow-lg">
                  🎯
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-navy">Discover Your Future</h2>
                  <p className="text-navy/50 font-medium">10 quick questions to see which Kenyan educational pathway fits you best. Ready?</p>
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-5 bg-navy text-white rounded-full font-bold text-lg shadow-xl shadow-navy/20 active:scale-95 transition-all"
                >
                  Start Assessment
                </button>
                <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">Earn +75 Points for completing</p>
                {loading && <p className="text-xs font-bold text-navy/40 mt-4 animate-pulse">Loading latest questions...</p>}
              </motion.div>
            ) : (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-navy/5 space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-navy/30">Question {currentStep} of 10</span>
                    <Sparkles size={20} className="text-yellow" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy leading-tight">
                    {CAREER_QUESTIONS[currentStep - 1].text}
                  </h3>
                  <div className="space-y-3">
                    {CAREER_QUESTIONS[currentStep - 1].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="w-full p-5 rounded-3xl border-2 border-navy/5 bg-off-white text-left font-bold text-navy hover:border-yellow hover:bg-white transition-all active:scale-[0.98]"
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-navy/5 text-center space-y-8 border-2 border-yellow/20">
                <div className="w-24 h-24 bg-yellow rounded-[40px] mx-auto flex items-center justify-center text-navy text-5xl shadow-2xl shadow-yellow/30">
                  {state.careerResults?.topPathway === 'stem' && <Dna size={48} />}
                  {state.careerResults?.topPathway === 'arts' && <Palette size={48} />}
                  {state.careerResults?.topPathway === 'social' && <Users size={48} />}
                  {state.careerResults?.topPathway === 'tvet' && <Hammer size={48} />}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600">Your Result</h4>
                  <h2 className="text-3xl font-bold text-navy">
                    {getPathwayInfo(state.careerResults!.topPathway!)?.title}
                  </h2>
                </div>

                <p className="text-navy/60 font-medium leading-relaxed italic">
                   "{getPathwayInfo(state.careerResults!.topPathway!)?.desc}"
                </p>

                <div className="bg-off-white p-6 rounded-3xl space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-navy/30 text-left">Potential Careers</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {getPathwayInfo(state.careerResults!.topPathway!)?.careers.map((c, i) => (
                      <div key={i} className="bg-white p-3 rounded-2xl border border-navy/5 text-xs font-bold text-navy flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    onClick={() => navigate('/learn')}
                    className="w-full py-5 bg-navy text-white rounded-full font-bold text-lg flex items-center justify-center gap-2"
                  >
                    Start Pathway Exploration
                    <ChevronRight size={22} />
                  </button>
                  <button 
                    onClick={() => navigate('/onboarding')}
                    className="w-full py-4 text-navy font-bold text-sm"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CareerMapper;
