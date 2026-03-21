import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  MessageCircle, 
  Quote, 
  Trophy,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppContext } from '../AppContext';
import { LessonSection } from '../data/modules';
import { useModules } from '../hooks/useContent';
import { addPoints, checkAchievements, getCurrentTier } from '../lib/gamification';
import TierUpgradeModal from '../components/TierUpgradeModal';

const ModuleView: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const { data: MODULES, loading } = useModules();

  const module = MODULES.find((m) => m.id === moduleId);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showTierUpgrade, setShowTierUpgrade] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [insight, setInsight] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">Loading Lesson...</p>
      </div>
    );
  }

  if (!module) return <div className="p-20 text-center font-bold text-navy">Module Not Found</div>;

  const currentLesson = module.content[currentLessonIndex] || module.content[0];
  const isLastLesson = currentLessonIndex === module.content.length - 1;

  useEffect(() => {
    // Start module if not already in progress
    if (!state.modules.inProgress.includes(module.id)) {
      dispatch({ type: 'START_MODULE', payload: module.id });
    }
  }, [module.id]);

  const handleNext = () => {
    if (isLastLesson) {
      handleCompleteModule();
    } else {
      // Award points for lesson completion
      const result = addPoints(
        'COMPLETE_LESSON',
        state.progress.points,
        state.progress.weeklyPoints,
        state.progress.lastWeeklyReset
      );
      
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: { points: result.newTotal, weeklyPoints: result.newWeeklyPoints } 
      });

      if (result.upgraded) setShowTierUpgrade(true);

      setCurrentLessonIndex(currentLessonIndex + 1);
      setQuizAnswer(null);
      setQuizFeedback(null);
      setInsight('');
      window.scrollTo(0, 0);
    }
  };

  const handleCompleteModule = () => {
    const result = addPoints(
      'COMPLETE_MODULE',
      state.progress.points,
      state.progress.weeklyPoints,
      state.progress.lastWeeklyReset
    );
    
    dispatch({ type: 'COMPLETE_MODULE', payload: module.id });
    dispatch({ 
      type: 'UPDATE_PROGRESS', 
      payload: { points: result.newTotal, weeklyPoints: result.newWeeklyPoints } 
    });

    if (result.upgraded) setShowTierUpgrade(true);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E3A8A', '#FACC15']
    });

    setShowComplete(true);
  };

  const handleQuizSubmt = (index: number, correct: number) => {
    setQuizAnswer(index);
    if (index === correct) {
      setQuizFeedback('correct');
      confetti({ particleCount: 40, spread: 30, origin: { y: 0.8 } });
    } else {
      setQuizFeedback('wrong');
    }
  };

  const renderSection = (section: LessonSection, i: number) => {
    switch(section.type) {
      case 'text':
        return <p key={i} className="text-lg leading-relaxed text-navy/80 whitespace-pre-wrap">{section.content}</p>;
      case 'pullquote':
        return (
          <div key={i} className="bg-blue-50 p-8 rounded-[32px] border-l-8 border-blue-600 relative my-8">
            <Quote className="text-blue-200 absolute top-4 left-4" size={48} />
            <p className="text-xl font-bold text-blue-900 italic relative z-10">"{section.content}"</p>
          </div>
        );
      case 'insight_prompt':
        return (
          <div key={i} className="bg-yellow/10 p-8 rounded-[32px] border-2 border-yellow/20 space-y-4 my-8">
            <div className="flex items-center gap-2 text-yellow-700 font-bold uppercase tracking-widest text-xs">
              <Lightbulb size={16} />
              Jabari's Insight
            </div>
            <p className="text-lg font-bold text-navy">{section.prompt}</p>
            <textarea 
              value={insight}
              onChange={(e) => setInsight(e.target.value)}
              className="w-full bg-white border border-yellow/20 rounded-2xl p-4 text-navy placeholder:text-navy/20 focus:border-yellow outline-none transition-all h-32"
              placeholder="Write your thoughts here..."
            />
          </div>
        );
      case 'quiz':
        return (
          <div key={i} className="space-y-6 my-8">
            <h3 className="text-xl font-bold text-navy">{section.question}</h3>
            <div className="space-y-3">
              {section.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizSubmt(idx, section.correctIndex!)}
                  className={`w-full p-5 rounded-3xl border-2 text-left font-bold transition-all ${
                    quizAnswer === idx 
                      ? (idx === section.correctIndex ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700')
                      : 'bg-white border-navy/5 text-navy/60 hover:border-navy/10'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {quizFeedback === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 font-bold flex items-center gap-2">
                <CheckCircle2 size={18} /> Amazing! That's correct.
              </motion.div>
            )}
            {quizFeedback === 'wrong' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 font-bold flex items-center gap-2">
                <X size={18} /> Not quite. Try again!
              </motion.div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-off-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-navy/5 px-6 py-6 sticky top-0 z-40 flex justify-between items-center">
        <button onClick={() => navigate('/learn')} className="w-10 h-10 rounded-full bg-off-white flex items-center justify-center text-navy">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center px-4">
          <h2 className="text-sm font-bold text-navy truncate">{module.title}</h2>
          <div className="flex justify-center items-center gap-1 mt-1">
            {module.content.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${
                  i === currentLessonIndex ? 'w-6 bg-yellow' : i < currentLessonIndex ? 'w-2 bg-navy' : 'w-2 bg-navy/10'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-10 h-10 flex items-center justify-center text-navy font-bold text-xs bg-yellow rounded-full">
          {currentLessonIndex + 1}/{module.content.length}
        </div>
      </header>

      <main className="px-6 py-8 flex flex-col max-w-2xl mx-auto min-h-[calc(100vh-80px)]">
        <motion.div
          key={currentLessonIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 flex-1"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30">Lesson {currentLessonIndex + 1}</span>
            <h1 className="text-3xl font-bold text-navy leading-tight">{currentLesson.title}</h1>
          </div>

          <div className="space-y-6">
            {currentLesson.sections.map((section, i) => renderSection(section, i))}
          </div>
        </motion.div>

        <div className="mt-12 pt-8 border-t border-navy/5">
          <button
            onClick={handleNext}
            className="w-full py-5 bg-navy text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-navy/20 active:scale-95 transition-all"
          >
            {isLastLesson ? 'Complete Module' : 'Next Lesson'}
            <ArrowRight size={22} />
          </button>
        </div>
      </main>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showComplete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
              className="w-32 h-32 bg-yellow rounded-full flex items-center justify-center text-navy text-6xl shadow-2xl shadow-yellow/20 mb-8"
            >
              <Trophy size={64} />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-2">Hongera!</h2>
            <p className="text-white/60 text-lg mb-12">You've completed the {module.title} module.</p>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl w-full max-w-xs mb-12 flex justify-between items-center">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Reward Received</p>
                <p className="text-2xl font-bold text-yellow">+150 Points</p>
              </div>
              <CheckCircle2 size={32} className="text-yellow" />
            </div>

            <button 
              onClick={() => navigate('/learn')}
              className="w-full py-5 bg-yellow text-navy rounded-full font-bold text-lg max-w-xs"
            >
              Back to Learning
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showTierUpgrade && (
        <TierUpgradeModal 
          tier={getCurrentTier(state.progress.points)}
          userName={state.user?.name || 'Student'}
          points={state.progress.points} 
          onClose={() => setShowTierUpgrade(false)} 
        />
      )}
    </div>
  );
};

export default ModuleView;
