import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Calendar, Star, Award, ChevronRight, Video, Check, CheckCheck, Paperclip, Image as ImageIcon, X, Send, FileText } from 'lucide-react';

interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'mentor';
  timestamp: string;
  createdAt: number;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
}

const Mentor: React.FC = () => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('Chat');
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<{ type: 'image' | 'file', file: File, preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'mentor',
      text: `Hello ${state.user?.name.split(' ')[0]}! I've reviewed your goals for this week. Great progress on the leadership module.`,
      timestamp: '10:30 AM',
      createdAt: Date.now() - 1000000,
      status: 'read'
    },
    {
      id: '2',
      sender: 'user',
      text: "Thanks David! I'm finding the 'Harambee' concept very interesting.",
      timestamp: '10:32 AM',
      createdAt: Date.now() - 900000,
      status: 'read'
    }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSendMessage = () => {
    if (!inputText.trim() && !attachment) return;

    const now = Date.now();
    const newMessage: Message = {
      id: now.toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: now,
      status: 'sent',
      attachment: attachment ? {
        type: attachment.type,
        url: attachment.preview,
        name: attachment.file.name
      } : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setAttachment(null);

    // Simulate status updates
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m));
    }, 1500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('image/') ? 'image' : 'file';
    const preview = URL.createObjectURL(file);
    setAttachment({ type, file, preview });
  };

  const removeAttachment = () => {
    if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
  };

  // Simulated Mentor Data
  const mentor = {
    name: "David Kamau",
    role: "Senior Software Engineer & Youth Mentor",
    location: "Nairobi, Kenya",
    expertise: ["Career Guidance", "Tech Skills", "Leadership"],
    rating: 4.9,
    sessions: 124
  };

  return (
    <div className="flex flex-col min-h-screen bg-off-white">
      <header className="bg-navy px-6 pt-10 pb-20 rounded-b-[40px] shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl border-2 border-yellow overflow-hidden bg-white/10 flex items-center justify-center text-3xl">
            👨🏾‍💼
          </div>
          <div className="flex-1">
            <h1 className="text-white text-xl leading-tight">{mentor.name}</h1>
            <p className="text-yellow text-xs font-bold uppercase tracking-wider">{mentor.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-yellow mb-1">
              <Star size={14} fill="currentColor" />
              <span className="text-white font-bold text-sm">{mentor.rating}</span>
            </div>
            <span className="text-white/50 text-[10px] uppercase font-bold">Rating</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-yellow mb-1">
              <MessageSquare size={14} />
              <span className="text-white font-bold text-sm">{mentor.sessions}</span>
            </div>
            <span className="text-white/50 text-[10px] uppercase font-bold">Sessions</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-yellow mb-1">
              <Award size={14} />
              <span className="text-white font-bold text-sm">Top</span>
            </div>
            <span className="text-white/50 text-[10px] uppercase font-bold">Mentor</span>
          </div>
        </div>
      </header>

      <div className="px-4 space-y-6 -mt-10">
        {/* Next Session Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-yellow p-5 rounded-[24px] shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white">
              <Video size={24} />
            </div>
            <div>
              <h4 className="text-navy font-bold text-[15px]">Next Session</h4>
              <p className="text-navy/70 text-xs font-medium">Tomorrow, 4:00 PM</p>
            </div>
          </div>
          <button className="bg-navy text-white px-4 py-2 rounded-full text-xs font-bold">
            Join
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-100">
          {['Chat', 'Goals', 'Resources'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-navy text-white' : 'text-grey'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4 pb-32">
          {activeTab === 'Chat' && (
            <div className="space-y-6" ref={scrollRef}>
              {messages.map((msg, index) => {
                const prevMsg = messages[index - 1];
                const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender || (msg.createdAt - prevMsg.createdAt > 60000);
                const isLastInGroup = !messages[index + 1] || messages[index + 1].sender !== msg.sender || (messages[index + 1].createdAt - msg.createdAt > 60000);

                return (
                  <div key={msg.id} className="space-y-1">
                    {isFirstInGroup && (
                      <div className="flex justify-center my-4">
                        <span className="text-[10px] font-bold text-grey uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}>
                      <div className={`p-4 shadow-sm transition-all ${
                        msg.sender === 'user' 
                          ? 'bg-navy text-white' 
                          : 'bg-white text-navy border border-gray-100'
                      } ${
                        msg.sender === 'user'
                          ? `rounded-2xl ${isFirstInGroup ? 'rounded-tr-none' : ''} ${!isLastInGroup ? 'rounded-br-lg' : ''}`
                          : `rounded-2xl ${isFirstInGroup ? 'rounded-tl-none' : ''} ${!isLastInGroup ? 'rounded-bl-lg' : ''}`
                      }`}>
                        {msg.attachment && (
                          <div className="mb-2">
                            {msg.attachment.type === 'image' ? (
                              <img 
                                src={msg.attachment.url} 
                                alt="attachment" 
                                className="rounded-lg max-w-full h-auto border border-white/10"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
                                <FileText size={20} />
                                <span className="text-xs truncate max-w-[150px]">{msg.attachment.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                      </div>
                      
                      {isLastInGroup && msg.sender === 'user' && (
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className={msg.status === 'read' ? 'text-blue-400' : 'text-grey'}>
                            {msg.status === 'sent' ? (
                              <Check size={10} />
                            ) : (
                              <CheckCheck size={10} />
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="bg-pale-yellow p-4 rounded-2xl border-l-4 border-yellow mt-6">
                <p className="text-navy font-bold text-sm mb-2">Mentor Insight</p>
                <p className="text-navy/80 text-xs leading-relaxed">
                  David shared a new resource: "Leadership in the Digital Age". Click to view.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Goals' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy px-2">Shared Goals</h3>
              {state.user?.goals.map((goal, i) => (
                <div key={i} className="card flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center text-xl">
                      🎯
                    </div>
                    <span className="font-bold text-sm">{goal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green text-[10px] font-bold uppercase">On Track</span>
                    <ChevronRight size={16} className="text-grey" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Chat Input (only for Chat tab) */}
      {activeTab === 'Chat' && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40">
          <AnimatePresence>
            {attachment && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="mb-3 p-2 bg-off-white rounded-xl border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {attachment.type === 'image' ? (
                    <img src={attachment.preview} alt="preview" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center">
                      <FileText size={20} className="text-navy" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-navy truncate max-w-[200px]">{attachment.file.name}</span>
                    <span className="text-[10px] text-grey uppercase">{(attachment.file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <button onClick={removeAttachment} className="p-1 hover:bg-gray-200 rounded-full">
                  <X size={16} className="text-grey" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-grey hover:text-navy transition-colors"
              >
                <Paperclip size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>
            
            <div className="flex-1 bg-off-white rounded-full px-4 py-3 border border-gray-200">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message David..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm"
              />
            </div>
            
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() && !attachment}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                (!inputText.trim() && !attachment) ? 'bg-grey opacity-50' : 'bg-navy active:scale-95'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentor;
