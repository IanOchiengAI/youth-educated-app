import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { MODULES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, ChevronRight, HelpCircle, Clock, WifiOff, ArrowRight } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import TierUpgradeModal from '../components/TierUpgradeModal';
import AchievementToast from '../components/AchievementToast';
import { Tier } from '../utils/gamification';

const Confetti = () => {
  const colors = ['#FFD700', '#FFFFFF', '#FFF9DB'];
  return (
    <div className="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
            rotate: 0
          }}
          animate={{ 
            top: '120%',
            left: `${(Math.random() * 100) + (Math.random() * 20 - 10)}%`,
            rotate: Math.random() * 360 + 360
          }}
          transition={{ 
            duration: Math.random() * 2 + 1,
            ease: "linear",
            repeat: 0
          }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};

const ModuleView: React.FC = () => {
  const { moduleId } = useParams();
  const { state, dispatch } = useAppContext();
  const { addPoints } = useGamification();
  const navigate = useNavigate();
  const module = MODULES.find((m) => m.id === moduleId);
  
  const progress = state.modules.moduleProgress[moduleId!] || {
    currentLesson: 1,
    completedLessons: [],
    insights: {}
  };

  const [currentLessonId, setCurrentLessonId] = useState(progress.currentLesson);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [revealQuiz, setRevealQuiz] = useState(false);
  const [flashWrong, setFlashWrong] = useState(false);
  const [insight, setInsight] = useState(progress.insights[currentLessonId] || '');
  const [showCompletion, setShowCompletion] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [isModuleComplete, setIsModuleComplete] = useState(false);
  const [showTierUpgrade, setShowTierUpgrade] = useState(false);
  const [newTier, setNewTier] = useState<Tier | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<{name: string, icon: string} | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [insight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLessonId === 1 && !showCompletion && !showTierUpgrade) {
        setShowSwipeHint(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentLessonId, showCompletion, showTierUpgrade]);

  useEffect(() => {
    setCurrentLessonId(progress.currentLesson);
    setInsight(progress.insights[progress.currentLesson] || '');
  }, [moduleId]);

  if (!module) return <div className="p-10 text-center">Module not found</div>;

  const lessons = module.content;
  const lesson = lessons.find(l => l.id === currentLessonId) || lessons[0];
  const isLastLesson = currentLessonId === lessons.length;

  const handleInsightChange = (val: string) => {
    setInsight(val);
    dispatch({
      type: 'UPDATE_MODULE_PROGRESS',
      payload: {
        moduleId: module.id,
        progress: {
          insights: { ...progress.insights, [currentLessonId]: val }
        }
      }
    });
  };

  const handleQuizSelect = (index: number) => {
    if (revealQuiz || flashWrong) return;
    setQuizAnswer(index);
    
    const isCorrect = index === lesson.quiz.correctIndex;
    
    setTimeout(() => {
      if (isCorrect) {
        setRevealQuiz(true);
        const result = addPoints('COMPLETE_LESSON');
        if (result.unlockedAchievements.length > 0) {
          setUnlockedAchievement({
            name: result.unlockedAchievements[0],
            icon: '🌱' // Simplified for MVP
          });
        }
      } else {
        setFlashWrong(true);
        setTimeout(() => {
          setFlashWrong(false);
          setRevealQuiz(true);
        }, 300);
      }
    }, 400);
  };

  const handleFinishLesson = () => {
    const isFinal = currentLessonId === lessons.length;
    setIsModuleComplete(isFinal);
    setShowCompletion(true);

    const updatedCompleted = Array.from(new Set([...progress.completedLessons, currentLessonId]));
    
    dispatch({
      type: 'UPDATE_MODULE_PROGRESS',
      payload: {
        moduleId: module.id,
        progress: {
          completedLessons: updatedCompleted
        }
      }
    });

    if (isFinal) {
      dispatch({ type: 'COMPLETE_MODULE', payload: module.id });
      const result = addPoints('COMPLETE_MODULE', { moduleId: module.id });
      
      if (result.upgraded) {
        setNewTier(result.newTier);
        setTimeout(() => {
          setShowCompletion(false);
          setShowTierUpgrade(true);
        }, 2500);
      }

      if (result.unlockedAchievements.length > 0) {
        setUnlockedAchievement({
          name: result.unlockedAchievements[0],
          icon: '🏆' // Simplified for MVP
        });
      }
    }
  };

  const handleNextLesson = () => {
    const nextId = currentLessonId + 1;
    setCurrentLessonId(nextId);
    setQuizAnswer(null);
    setRevealQuiz(false);
    setFlashWrong(false);
    setInsight(progress.insights[nextId] || '');
    setShowCompletion(false);
    dispatch({
      type: 'UPDATE_MODULE_PROGRESS',
      payload: {
        moduleId: module.id,
        progress: { currentLesson: nextId }
      }
    });
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setShowSwipeHint(false);
    if (direction === 'left') {
      if (quizAnswer !== null || !lesson.quiz) {
        if (!isLastLesson) handleNextLesson();
        else handleFinishLesson();
      }
    } else if (direction === 'right') {
      if (currentLessonId > 1) {
        const prevId = currentLessonId - 1;
        setCurrentLessonId(prevId);
        setQuizAnswer(null);
        setRevealQuiz(false);
        setFlashWrong(false);
        setInsight(progress.insights[prevId] || '');
      }
    }
  };

  const progressPercent = (currentLessonId / lessons.length) * 100;

  return (
    <div className="bg-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-white/30">
        <motion.div 
          className="h-full bg-yellow"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-gray-100 mt-1">
        <button onClick={() => navigate('/learn')} className="p-2 -ml-2 text-navy">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-grey uppercase tracking-widest">Lesson {currentLessonId} of {lessons.length}</span>
          <h4 className="text-navy truncate max-w-[180px]">{module.title}</h4>
        </div>
        <div className="w-10" />
      </header>

      <motion.main 
        key={currentLessonId}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) handleSwipe('left');
          if (info.offset.x > 100) handleSwipe('right');
        }}
        className="flex-1 overflow-y-auto pb-32"
      >
        <div className="p-6 space-y-8">
          {/* 1. CBC Chip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="inline-flex bg-navy px-3 py-1 rounded-full"
          >
            <span className="text-yellow text-[11px] font-bold uppercase tracking-wider">{module.competency}</span>
          </motion.div>

          {/* 2. Title */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-[22px] font-poppins font-bold leading-tight"
          >
            {lesson.title}
          </motion.h1>

          {/* 3. Meta */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-4 text-grey text-[13px]"
          >
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>5 min read</span>
            </div>
            {state.isOffline && (
              <div className="flex items-center gap-1.5 text-navy">
                <WifiOff size={14} />
                <span className="font-bold">Offline Mode</span>
              </div>
            )}
          </motion.div>

          {/* 4. Body */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[16px] leading-[1.7] text-near-black font-nunito"
          >
            {lesson.text}
          </motion.div>

          {/* 5. Pull Quote */}
          {lesson.quote && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-pale-yellow border-l-4 border-yellow p-5 rounded-r-2xl"
            >
              <p className="font-poppins font-medium italic text-[15px] text-navy">
                "{lesson.quote}"
              </p>
            </motion.div>
          )}

          {/* 6. Insight Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-navy p-6 rounded-[24px] space-y-4"
          >
            <p className="text-white font-poppins font-semibold text-[15px] leading-relaxed">
              {lesson.insightPrompt}
            </p>
            <textarea
              ref={textareaRef}
              value={insight}
              onChange={(e) => handleInsightChange(e.target.value)}
              placeholder="Type your reflection here..."
              className="w-full bg-white/10 border-none rounded-xl p-4 text-white placeholder:text-white/30 focus:ring-2 focus:ring-yellow/50 resize-none min-h-[100px] font-nunito"
            />
            <p className="text-yellow text-[12px] font-bold tracking-wide">Your words. Your growth.</p>
          </motion.div>

          {/* 7. Quiz Section */}
          {lesson.quiz && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-6 pt-4"
            >
              <div className="flex items-center gap-2 bg-navy p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-yellow">
                  <HelpCircle size={18} />
                </div>
                <h4 className="text-white uppercase tracking-widest text-[12px]">Quick Check</h4>
              </div>
              
              <p className="font-bold text-[17px] text-navy px-1">{lesson.quiz.question}</p>

              <div className="space-y-3">
                {lesson.quiz.options.map((option, i) => {
                  const isSelected = quizAnswer === i;
                  const isCorrect = i === lesson.quiz.correctIndex;
                  
                  let cardStyle = 'bg-off-white border-transparent text-near-black';
                  if (revealQuiz) {
                    if (isCorrect) cardStyle = 'bg-green text-white border-green';
                    else cardStyle = 'bg-off-white text-near-black border-transparent opacity-60';
                  } else if (flashWrong && isSelected) {
                    cardStyle = 'bg-red text-white border-red';
                  } else if (isSelected) {
                    cardStyle = 'bg-white border-2 border-navy text-navy';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => handleQuizSelect(i)}
                      className={`w-full p-4 rounded-[12px] text-left font-nunito text-[15px] transition-all relative overflow-hidden ${cardStyle}`}
                    >
                      <div className="flex justify-between items-center relative z-10">
                        <span>{option}</span>
                        {revealQuiz && isCorrect && (
                          <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            <CheckCircle size={20} />
                          </motion.div>
                        )}
                      </div>

                      {revealQuiz && isCorrect && isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.1, 1] }}
                          transition={{ duration: 0.3 }}
                          className="absolute right-12 top-1/2 -translate-y-1/2 bg-yellow text-navy text-[10px] font-bold px-2 py-1 rounded-full shadow-lg"
                        >
                          +20 PTS
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </motion.main>

      {/* Swipe Hint */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          >
            <div className="flex items-center gap-8">
              <motion.div animate={{ x: [-10, 0, -10] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowLeft className="text-navy/20" />
              </motion.div>
              <span className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">Swipe to Navigate</span>
              <motion.div animate={{ x: [10, 0, 10] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight className="text-navy/20" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <AnimatePresence>
        {(revealQuiz || !lesson.quiz) && (
          <motion.footer 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md z-50"
          >
            <button 
              onClick={handleFinishLesson}
              className="btn-secondary shadow-lg"
            >
              <span>{isLastLesson ? 'Finish Lesson' : 'Next Lesson'}</span>
              <ChevronRight size={20} className="ml-2" />
            </button>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center p-8 text-center"
          >
            <Confetti />
            
            <div className="space-y-8 max-w-xs w-full">
              <motion.h2 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-yellow text-[28px] font-poppins font-bold"
              >
                {isModuleComplete ? 'Module Complete 🏆' : 'Lesson Complete!'}
              </motion.h2>

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', damping: 10 }}
                className="text-6xl"
              >
                {module.icon}
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-yellow text-navy font-bold px-6 py-2 rounded-full inline-block text-xl shadow-xl"
              >
                +{isModuleComplete ? '150' : '20' } PTS
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white font-nunito text-lg"
              >
                🔥 {state.progress.streakDays} day streak
              </motion.p>

              {insight && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                    <p className="text-white italic text-sm font-nunito">"{insight}"</p>
                  </div>
                  <p className="text-yellow text-[12px] font-bold">This goes to your weekly reflection.</p>
                </motion.div>
              )}

              <div className="pt-8 space-y-4">
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={isModuleComplete ? () => navigate('/learn') : handleNextLesson}
                  className="w-full h-14 bg-yellow text-navy rounded-full font-bold text-lg shadow-lg active:scale-95 transition-transform"
                >
                  {isModuleComplete ? 'Back to Library' : 'Next Lesson →'}
                </motion.button>
                
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={() => navigate('/learn')}
                  className="w-full h-14 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg active:scale-95 transition-transform"
                >
                  Back to Library
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tier Upgrade Component */}
      {showTierUpgrade && newTier && (
        <TierUpgradeModal 
          tier={newTier} 
          points={isModuleComplete ? 150 : 20}
          userName={state.user?.name || 'Student'}
          onClose={() => navigate('/dashboard')} 
        />
      )}

      {/* Achievement Toast */}
      <AnimatePresence>
        {unlockedAchievement && (
          <AchievementToast 
            name={unlockedAchievement.name}
            icon={unlockedAchievement.icon}
            onClose={() => setUnlockedAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleView;
