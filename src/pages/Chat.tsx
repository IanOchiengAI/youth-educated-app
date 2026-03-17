import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  ChevronLeft, 
  Info, 
  AlertCircle, 
  Languages, 
  WifiOff, 
  Sparkles,
  Phone,
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
  InteractionMode, 
  RoleplayScenario,
  ROLEPLAY_SCENARIOS 
} from '../api/jabari';
import { checkSafeguarding } from '../lib/safeguarding';
import { addPoints } from '../lib/gamification';

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
  const [activeScenario, setActiveScenario] = useState<RoleplayScenario | null>(null);
  const [showActionModeMenu, setShowActionModeMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
        // Initial greeting if no history
        const greeting = language === 'English' 
          ? `Jambo ${state.user?.name}! I'm Jabari. I'm here to support you. What's on your mind?`
          : `Jambo ${state.user?.name}! Mimi ni Jabari. Niko hapa kukusaidia. Unafikiria nini leo?`;
        
        setMessages([{
          id: '1',
          role: 'model',
          text: greeting,
          timestamp: new Date().toISOString()
        }]);
      }
    };

    loadHistory();
  }, [state.user?.id]);

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
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: safeguard.escalationText!,
          timestamp: new Date().toISOString(),
          isEscalation: true
        }]);
        if (safeguard.category === 'A' || safeguard.category === 'B') {
          setIsLocked(true);
        }
      }, 1000);
      return;
    }

    // 2. AI Response
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

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
      // Sync to Supabase
      if (state.user?.id && !state.isOffline) {
        const geminiHistory = updated.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        updateAIConversations(state.user.id, geminiHistory);
      }
      return updated;
    });

    // 3. Award Points
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
              🦁
            </div>
            <div>
              <h2 className="font-bold">Jabari</h2>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${state.isOffline ? 'bg-grey' : 'bg-green-400'}`} />
                <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest">
                  {state.isOffline ? 'Offline Mode' : 'Online'}
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
            Exit Mode
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
              <div className={`max-w-[85%] rounded-[28px] p-4 ${
                message.role === 'user' 
                  ? 'bg-navy text-white rounded-br-none shadow-md' 
                  : message.isEscalation 
                    ? 'bg-red-50 border-2 border-red-200 text-red-700 rounded-bl-none shadow-sm' 
                    : 'bg-white text-navy rounded-bl-none shadow-sm border border-navy/5'
              }`}>
                {message.isEscalation && (
                  <div className="flex items-center gap-2 mb-2 text-red-600">
                    <AlertCircle size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Priority Support 116</span>
                  </div>
                )}
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
                {message.isEscalation && (
                  <button className="mt-4 w-full py-3 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                    <Phone size={18} />
                    Call Childline 116
                  </button>
                )}
              </div>
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
                <h3 className="text-xs font-black uppercase tracking-widest text-navy/40">Action Modes</h3>
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
                    <h4 className="text-sm font-bold text-navy">Socratic Quiz</h4>
                    <p className="text-[10px] text-navy/40 font-medium">Test your knowledge with Jabari.</p>
                  </div>
                </button>

                <div className="mt-4 pt-4 border-t border-navy/5 px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-navy/20 mb-3">Roleplay Scenarios</h3>
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
            placeholder={isLocked ? "Chat disabled for your safety. Please seek help." : "Talk to Jabari..."}
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
