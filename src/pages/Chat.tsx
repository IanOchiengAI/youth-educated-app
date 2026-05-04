import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  ChevronLeft, 
  Languages, 
  WifiOff, 
  Sparkles,
  Plus,
  Target,
  BookOpen,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { 
  sendToJabari, 
  fetchAIConversations, 
  updateAIConversations, 
  generateCheckinSummary,
  InteractionMode, 
  RoleplayScenario,
  ROLEPLAY_SCENARIOS 
} from '../api/jabari';
import { checkSafeguarding } from '../lib/safeguarding';
import { addPoints } from '../lib/gamification';
import { supabase } from '../lib/supabase';
import { t, type Language } from '../lib/i18n';
import SafeguardingCard from '../components/SafeguardingCard';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isEscalation?: boolean;
}

const Chat: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Kiswahili'>(state.user?.language || 'English');
  const [activeMode, setActiveMode] = useState<InteractionMode>('default');
  const lang: Language = state.user?.language ?? 'English';
  const [activeScenario, setActiveScenario] = useState<RoleplayScenario | null>(null);
  const [showActionModeMenu, setShowActionModeMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refs for check-in logging (need stable references accessible in cleanup)
  const messagesRef = useRef<Message[]>([]);
  const safeguardingTriggeredRef = useRef(false);
  const checkinFiredRef = useRef(false);

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ── Goal fetching from mentor_matches ──
  useEffect(() => {
    const fetchGoals = async () => {
      if (!state.user?.id || state.isOffline) return;

      try {
        const { data } = await supabase
          .from('mentor_matches')
          .select('id, jabari_goals, jabari_agenda')
          .eq('student_id', state.user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (data && data.jabari_goals?.length > 0) {
          dispatch({ type: 'SET_JABARI_GOALS', payload: { goals: data.jabari_goals, agenda: data.jabari_agenda || '' } });
          dispatch({ type: 'SET_MENTOR_PAIR', payload: data.id });
        } else {
          // Fallback to onboarding goals
          dispatch({ type: 'SET_JABARI_GOALS', payload: { goals: state.user.goals || [], agenda: '' } });
        }
      } catch (err) {
        console.error('Failed to fetch mentor goals:', err);
      }
    };

    fetchGoals();
  }, [state.user?.id]);

  // ── Load history or show goal-aware greeting ──
  useEffect(() => {
    const loadHistory = async () => {
      if (!state.user?.id || state.isOffline) return;
      
      const history = await fetchAIConversations(state.user.id);
      if (history && history.length > 0) {
        const formattedMessages: Message[] = history.map((m: any, i: number) => ({
          id: `hist-${i}`,
          role: m.role,
          text: m.parts[0].text,
          timestamp: new Date().toISOString()
        }));
        setMessages(formattedMessages);
      } else {
        // Build goal-aware greeting
        const goals = state.jabariGoals.length > 0 ? state.jabariGoals : (state.user?.goals || []);
        const goalsText = goals.join(', ');
        const hasMentorGoals = state.user?.mentorPairId && state.jabariGoals.length > 0;

        let greeting: string;
        if (language === 'Kiswahili') {
          greeting = `Jambo ${state.user?.name}! Mimi ni Amara. Niko hapa kukusaidia. Unafikiria nini leo?`;
        } else if (hasMentorGoals && goalsText) {
          greeting = `Habari ${state.user?.name}! I see your mentor wants us to focus on: ${goalsText}. How are things going?`;
        } else if (goalsText) {
          greeting = `Jambo ${state.user?.name}! I know you're working on: ${goalsText}. What's on your mind today?`;
        } else {
          greeting = `Jambo ${state.user?.name}! I'm Amara. I'm here to support you. What's on your mind?`;
        }
        
        setMessages([{
          id: '1',
          role: 'model',
          text: greeting,
          timestamp: new Date().toISOString()
        }]);
      }
    };

    loadHistory();
  }, [state.user?.id, state.jabariGoals, state.user?.mentorPairId]);

  // ── Check-in logging on unmount ──
  const performCheckin = useCallback(async () => {
    if (checkinFiredRef.current) return;
    if (messagesRef.current.length < 3) return;
    if (!state.user?.id || state.isOffline) return;

    checkinFiredRef.current = true;

    try {
      const history = messagesRef.current.map(m => ({
        role: m.role as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const summaryText = await generateCheckinSummary(history);
      if (!summaryText) return;

      // Parse: SUMMARY: ... | GOALS: ... | MOOD: ...
      const summaryMatch = summaryText.match(/SUMMARY:\s*(.+?)\s*\|\s*GOALS:\s*(.+?)\s*\|\s*MOOD:\s*(.+)/i);
      if (!summaryMatch) return;

      const [, summary, goalsTouched, moodSignal] = summaryMatch;

      await supabase.from('jabari_checkins').insert({
        mentee_id: state.user.id,
        pair_id: state.user.mentorPairId || null,
        summary: summary.trim(),
        goals_touched: goalsTouched.trim().split(',').map((g: string) => g.trim()),
        mood_signal: moodSignal.trim().toLowerCase(),
        safeguarding_flag: safeguardingTriggeredRef.current,
      });
    } catch {
      // Silent fail — never block navigation
    }
  }, [state.user?.id, state.user?.mentorPairId, state.isOffline]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      performCheckin();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      performCheckin();
    };
  }, [performCheckin]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping || isLocked) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // 1. Safeguarding Check
    const safeguard = checkSafeguarding(userMessage.text, state.user?.ageBracket || '16-18', state.user?.id);
    
    if (safeguard.triggered && safeguard.escalationText) {
      safeguardingTriggeredRef.current = true;
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: safeguard.escalationText!,
          timestamp: new Date().toISOString(),
          isEscalation: true
        }]);
        if (safeguard.category === 'A') {
          setIsLocked(true);
        }
      }, 1000);
      return;
    }

    // 2. Build goal context for injection
    const goals = state.jabariGoals.length > 0 ? state.jabariGoals : (state.user?.goals || []);
    const goalContext = goals.length > 0
      ? `[MENTEE GOALS: ${goals.join(' | ')}]` + (state.jabariAgenda ? `\n[MENTOR AGENDA: ${state.jabariAgenda}]` : '')
      : '';

    // 3. Build history with goal context as silent first turn
    const baseHistory = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const history = goalContext
      ? [
          { role: 'user' as const, parts: [{ text: goalContext }] },
          { role: 'model' as const, parts: [{ text: 'Understood. I will keep these goals and agenda in mind throughout our conversation.' }] },
          ...baseHistory
        ]
      : baseHistory;

    const responseText = await sendToJabari(
      userMessage.text, 
      history, 
      state.user, 
      state.isOffline,
      activeMode,
      activeScenario || undefined
    );
    
    setIsTyping(false);
    const newModelMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const updated = [...prev, newModelMessage];
      // Sync to Supabase (without the injected goal context turns)
      if (state.user?.id && !state.isOffline) {
        const geminiHistory = updated.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        updateAIConversations(state.user.id, geminiHistory);
      }
      return updated;
    });

    // 4. Award Points
    const result = addPoints(
      'AI_INTERACTION',
      state.progress.points,
      state.progress.weeklyPoints,
      state.progress.lastWeeklyReset
    );
    dispatch({ type: 'UPDATE_PROGRESS', payload: { points: result.newTotal, weeklyPoints: result.newWeeklyPoints } });
  };

  return (
    <div className="flex flex-col h-screen bg-off-white">
      {/* Header */}
      <header className="bg-navy p-4 text-white flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow rounded-full flex items-center justify-center text-navy text-xl font-bold">
              🌸
            </div>
            <div>
              <h2 className="font-bold">Amara</h2>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${state.isOffline ? 'bg-grey' : 'bg-green-400'}`} />
                <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest">
                  {state.isOffline ? t('chat.offline_mode', lang) : t('chat.online', lang)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setLanguage(l => l === 'English' ? 'Kiswahili' : 'English')}
            className="p-2 bg-white/10 rounded-full flex items-center gap-2 px-3"
          >
            <Languages size={18} className="text-yellow" />
            <span className="text-xs font-bold uppercase">{language.slice(0, 2)}</span>
          </button>
          <button onClick={() => navigate('/chat/voice')} className="p-2 bg-white/10 rounded-full" aria-label="Voice Chat">
            <Mic size={20} className="text-white" />
          </button>
        </div>
      </header>

      {/* Mode Indicator */}
      {activeMode !== 'default' && (
        <div className="bg-yellow px-4 py-2 flex items-center justify-between gap-2 shadow-sm relative z-10">
          <div className="flex items-center gap-2 text-navy text-[10px] font-black uppercase tracking-widest">
            {activeMode === 'quiz' ? <BookOpen size={14} /> : <Target size={14} />}
            {activeMode === 'quiz' ? 'Socratic Quiz Mode' : `Roleplay: ${activeScenario?.name}`}
          </div>
          <button 
            onClick={() => {
              setActiveMode('default');
              setActiveScenario(null);
            }}
            className="text-[9px] font-black uppercase bg-navy/10 px-2 py-1 rounded-lg hover:bg-navy/20"
          >
            {t('chat.exit_mode', lang)}
          </button>
        </div>
      )}

      {state.isOffline && (
        <div className="bg-yellow/90 px-4 py-2 flex items-center justify-center gap-2 text-navy text-[11px] font-bold uppercase tracking-widest">
          <WifiOff size={14} />
          Using Limited Offline Brain
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.isEscalation ? (
                <div className="max-w-[85%]">
                  <SafeguardingCard
                    message={message.text}
                    showDismiss={!isLocked}
                    onDismiss={() => setIsLocked(false)}
                  />
                </div>
              ) : (
                <div className={`max-w-[85%] rounded-[28px] p-4 ${
                  message.role === 'user'
                    ? 'bg-navy text-white rounded-br-none shadow-md'
                    : 'bg-white text-navy rounded-bl-none shadow-sm border border-navy/5'
                }`}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white rounded-[28px] rounded-bl-none p-4 shadow-sm border border-navy/5 flex gap-1">
              <span className="w-1.5 h-1.5 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-navy/5 pb-[calc(1rem+env(safe-area-inset-bottom))] relative">
        {/* Action Mode Menu */}
        <AnimatePresence>
          {showActionModeMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-full left-4 mb-4 bg-white rounded-[32px] shadow-2xl border border-navy/5 p-4 w-72 z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-navy/40">{t('chat.action_modes', lang)}</h3>
                <button onClick={() => setShowActionModeMenu(false)} className="text-navy/20 hover:text-navy">
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setActiveMode('quiz');
                    setActiveScenario(null);
                    setShowActionModeMenu(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-off-white transition-colors group text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy">{t('chat.socratic_quiz', lang)}</h4>
                    <p className="text-[10px] text-navy/40 font-medium">{t('chat.socratic_desc', lang)}</p>
                  </div>
                </button>

                <div className="mt-4 pt-4 border-t border-navy/5 px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-navy/20 mb-3">{t('chat.roleplay_scenarios', lang)}</h3>
                  <div className="space-y-1">
                    {ROLEPLAY_SCENARIOS.map((scenario) => (
                      <button 
                        key={scenario.id}
                        onClick={() => {
                          setActiveMode('roleplay');
                          setActiveScenario(scenario);
                          setShowActionModeMenu(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-off-white flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-navy">{scenario.name}</p>
                          <p className="text-[9px] text-navy/40">{scenario.description}</p>
                        </div>
                        <Plus size={14} className="text-navy/10 group-hover:text-navy" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`flex items-center gap-2 bg-off-white border border-navy/5 p-2 rounded-full pl-6 shadow-inner ${isLocked ? 'opacity-70' : ''}`}>
          <button 
            onClick={() => setShowActionModeMenu(!showActionModeMenu)}
            disabled={isLocked}
            aria-label="Toggle Practice Mode Menu"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              showActionModeMenu ? 'bg-navy text-white' : 'hover:bg-navy/5 text-navy/40'
            }`}
          >
            <Sparkles size={20} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLocked ? t('chat.locked_safety', lang) : t('chat.amara_greeting', lang)}
            disabled={isLocked}
            className="flex-1 bg-transparent outline-none text-navy placeholder:text-navy/30 py-2 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping || isLocked}
            aria-label="Send message"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() && !isTyping && !isLocked ? 'bg-yellow text-navy scale-100 shadow-md' : 'bg-grey/10 text-grey scale-90'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
