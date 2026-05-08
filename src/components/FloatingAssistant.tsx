import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Maximize2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { sendToJabari } from '../api/jabari';
import { checkSafeguarding } from '../lib/safeguarding';
import AIAvatar from './AIAvatar';
import SafeguardingCard from './SafeguardingCard';

interface Message {
  role: 'user' | 'model';
  text: string;
}

function getContextGreeting(pathname: string, name: string, persona: 'amara' | 'jabari', lang: 'English' | 'Kiswahili'): string {
  const firstName = name?.split(' ')[0] || '';
  const aiName = persona === 'jabari' ? 'Jabari' : 'Amara';

  if (lang === 'Kiswahili') {
    if (pathname.startsWith('/learn/article')) return `Habari ${firstName}! Umepata kitu cha kuvutia? Niulize ${aiName} ukitaka kuzama zaidi.`;
    if (pathname.startsWith('/learn')) return `Karibu kwenye Life Kit! Nahitaji msaada gani leo, ${firstName}?`;
    if (pathname.startsWith('/mentor')) return `Unatafuta mshauri? Nitakusaidia kupata anayekufaa, ${firstName}.`;
    if (pathname.startsWith('/goals')) return `Malengo mazuri yanabadilisha maisha! Nikisaidie kuweka lengo zuri, ${firstName}?`;
    if (pathname.startsWith('/circles')) return `Vikundi ni nguvu yetu. Una swali kuhusu majadiliano, ${firstName}?`;
    if (pathname.startsWith('/career')) return `Kazi ya maisha yako inaanza hapa. Niambie zaidi kuhusu ndoto zako, ${firstName}.`;
    if (pathname.startsWith('/opportunities')) return `Fursa nyingi hapa! Nikisaidie kuchagua inayokufaa, ${firstName}?`;
    return `Habari ${firstName}! Mimi ni ${aiName}. Ninawezaje kukusaidia leo?`;
  }

  if (pathname.startsWith('/learn/article')) return `Found something interesting? Ask me anything about this article, ${firstName}.`;
  if (pathname.startsWith('/learn')) return `Welcome to the Life Kit, ${firstName}! What are you looking to learn today?`;
  if (pathname.startsWith('/mentor')) return `Looking for a mentor? I can help you find the right match, ${firstName}.`;
  if (pathname.startsWith('/goals')) return `Great goals change lives. Want help setting one that's specific and achievable, ${firstName}?`;
  if (pathname.startsWith('/circles')) return `Your circle is your strength. Got a question about the discussion, ${firstName}?`;
  if (pathname.startsWith('/career')) return `Your career journey starts here. Tell me about your dreams, ${firstName}.`;
  if (pathname.startsWith('/opportunities')) return `So many doors open here. Want help choosing what's right for you, ${firstName}?`;
  return `Habari ${firstName}! I'm ${aiName}. How can I support you today?`;
}

const FloatingAssistant: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [escalation, setEscalation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const persona = state.user?.aiPersona ?? 'amara';
  const lang = state.user?.language ?? 'English';
  const aiName = persona === 'jabari' ? 'Jabari' : 'Amara';

  // ── All hooks MUST be above any early return ──────────────────

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping || !state.user) return;
    const text = input.trim();
    setInput('');

    const safe = checkSafeguarding(text, state.user.ageBracket ?? '', state.user.id, 'floating_chat');
    if (safe.triggered && safe.escalationText) {
      setEscalation(safe.escalationText);
      return;
    }

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const reply = await sendToJabari(
      text,
      history,
      state.user,
      state.isOffline,
      'default',
      undefined,
      persona
    );

    setMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsTyping(false);
  }, [input, isTyping, messages, state.user, state.isOffline, persona]);

  // ── Early return after all hooks ──────────────────────────────

  const hidden = ['/signin', '/onboarding', '/chat'].some(p => location.pathname.startsWith(p));
  if (hidden || !state.user) return null;

  // ── Event handlers (not hooks) ────────────────────────────────

  const handleOpen = () => {
    if (!isOpen && messages.length === 0) {
      const greeting = getContextGreeting(location.pathname, state.user?.name ?? '', persona, lang);
      setMessages([{ role: 'model', text: greeting }]);
    }
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const goToFullChat = () => {
    setIsOpen(false);
    navigate('/chat');
  };

  return (
    <>
      {/* Escalation overlay */}
      <AnimatePresence>
        {escalation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-navy/80 flex items-end p-4">
            <div className="w-full max-w-md mx-auto">
              <SafeguardingCard message={escalation} onDismiss={() => setEscalation(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className="fixed bottom-24 right-4 z-[80] shadow-2xl shadow-navy/30 rounded-full"
            aria-label={`Chat with ${aiName}`}
          >
            <AIAvatar persona={persona} size={56} />
            <span className="absolute inset-0 rounded-full border-2 border-yellow animate-ping opacity-40" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mini chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-20 right-3 left-3 max-w-sm mx-auto z-[80] bg-white rounded-[28px] shadow-2xl shadow-navy/20 border border-navy/5 flex flex-col overflow-hidden"
            style={{ maxHeight: '65vh' }}
          >
            {/* Header */}
            <div className="bg-navy px-4 py-3 flex items-center gap-3">
              <AIAvatar persona={persona} size={36} />
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{aiName}</p>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  {state.isOffline ? (lang === 'Kiswahili' ? 'Nje ya Mtandao' : 'Offline') : (lang === 'Kiswahili' ? 'Mtandaoni' : 'Online')}
                </p>
              </div>
              <button onClick={goToFullChat} className="p-1.5 text-white/40 hover:text-white transition-colors" title="Open full chat">
                <Maximize2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {msg.role === 'model' && <AIAvatar persona={persona} size={24} className="flex-shrink-0 mt-1" />}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-nunito leading-snug ${
                    msg.role === 'user'
                      ? 'bg-navy text-white rounded-br-sm'
                      : 'bg-off-white text-navy rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <AIAvatar persona={persona} size={24} />
                  <div className="bg-off-white rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-navy/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-navy/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang === 'Kiswahili' ? `Andika ujumbe kwa ${aiName}...` : `Message ${aiName}...`}
                className="flex-1 bg-off-white rounded-full px-4 py-2 text-sm text-navy outline-none border border-navy/10 focus:border-yellow transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 bg-yellow rounded-full flex items-center justify-center text-navy disabled:opacity-40 transition-opacity active:scale-90"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Full chat link */}
            <button onClick={goToFullChat} className="text-[10px] font-bold text-navy/30 uppercase tracking-widest text-center pb-3 hover:text-navy/60 transition-colors">
              {lang === 'Kiswahili' ? 'Fungua mazungumzo kamili →' : 'Open full chat →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAssistant;
