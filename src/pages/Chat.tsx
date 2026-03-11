import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../AppContext';
import { CHAT_TREE } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, WifiOff, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'jabari' | 'user';
  timestamp: string;
  competency?: string;
}

const Chat: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('youth_educated_chat');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      setMessages([
        {
          id: '1',
          text: `Jambo ${state.user?.name.split(' ')[0]}! I am Jabari, your life-skills companion. How can I support your journey today?`,
          sender: 'jabari',
          timestamp: new Date().toISOString(),
          competency: 'Self-Efficacy'
        }
      ]);
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('youth_educated_chat', JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate Jabari response
    setTimeout(() => {
      const response = CHAT_TREE.find(t => userMsg.text.toLowerCase().includes(t.prompt.toLowerCase()))?.response 
                   || "That's a great question. Success starts with a single step toward your goals. What's one thing you want to achieve this week?";
      
      const jabariMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'jabari',
        timestamp: new Date().toISOString(),
        competency: 'Communication & Collaboration'
      };

      setMessages(prev => [...prev, jabariMsg]);
      dispatch({ type: 'ADD_POINTS', payload: 15 });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: { unreadChat: false } });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-off-white">
      <header className="bg-navy px-4 pt-6 pb-4 flex flex-col items-center sticky top-0 z-50">
        <div className="flex items-center w-full">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-yellow overflow-hidden bg-navy/40 flex items-center justify-center text-2xl">
              🦁
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green border-2 border-navy rounded-full" />
          </div>
          <div className="flex-1 flex flex-col items-center mr-6">
            <h1 className="font-poppins font-bold text-white text-xl leading-tight">Jabari</h1>
            <p className="text-yellow text-[10px] font-bold uppercase tracking-wider">Your 24/7 life-skills companion</p>
          </div>
        </div>
      </header>

      {state.isOffline && (
        <div className="bg-pale-yellow px-4 py-2 flex items-center justify-center gap-2 border-b border-yellow/20">
          <WifiOff size={14} className="text-navy" />
          <p className="text-navy text-[11px] font-bold">Composing offline — will send when connected.</p>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-wider">
                {msg.sender === 'jabari' ? 'Jabari' : 'You'}
              </span>
              {msg.competency && (
                <span className="bg-navy text-yellow px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                  <Sparkles size={8} />
                  {msg.competency}
                </span>
              )}
            </div>
            <div
              className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                msg.sender === 'jabari'
                  ? 'bg-navy text-white rounded-tl-none'
                  : 'bg-yellow text-navy rounded-tr-none font-medium'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={scrollRef} />
      </main>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="bg-pale-yellow/50 p-4 rounded-2xl border-l-4 border-yellow mb-4">
          <p className="font-bold text-navy text-sm mb-3">How are you feeling today?</p>
          <div className="flex gap-2">
            {['😊', '🤔', '💪'].map(emoji => (
              <button
                key={emoji}
                onClick={() => setInputValue(prev => prev + ' ' + emoji)}
                className="bg-white px-4 py-2 rounded-full text-xl shadow-sm active:scale-95 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-off-white rounded-full px-4 py-2 border border-gray-200">
            <input
              type="text"
              className="w-full bg-transparent border-none focus:ring-0 text-navy placeholder-navy/40 text-[15px]"
              placeholder="Message Jabari..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Mic size={20} className="text-navy/50" />
          </div>
          <button
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-yellow flex items-center justify-center text-navy shadow-lg active:scale-95 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
