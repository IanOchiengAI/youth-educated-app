import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Sparkles,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { sendToJabari, fetchAIConversations, updateAIConversations } from '../api/jabari';
import { checkSafeguarding } from '../lib/safeguarding';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const VoiceChat: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = state.user?.language === 'Kiswahili' ? 'sw-KE' : 'en-KE';

      let finalTranscript = '';
      recognitionRef.current.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
        finalTranscript = text;
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (finalTranscript) {
          handleProcessVoice(finalTranscript);
          finalTranscript = '';
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          setError("Microphone error. Please check permissions.");
        }
        setIsListening(false);
      };
    } else {
      setError("Voice recognition is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [state.user?.language]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!state.user?.id || state.isOffline) return;
      const history = await fetchAIConversations(state.user.id);
      if (history) setMessages(history);
    };
    loadHistory();
  }, [state.user?.id]);

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setError(null);
        setTranscript('');
        setResponse('');
        if (synthRef.current) synthRef.current.cancel();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setError("Microphone permission denied. Please allow it in settings.");
      }
    }
  };

  const handleProcessVoice = async (text: string) => {
    // 1. Safeguarding Check
    const safeguard = checkSafeguarding(text, state.user?.ageBracket || '16-18', state.user?.id);
    if (safeguard.triggered && safeguard.escalationText) {
      setResponse(safeguard.escalationText);
      speak(safeguard.escalationText);
      if (safeguard.category === 'A' || safeguard.category === 'B') {
        // Optionally lock or handle severe cases
      }
      return;
    }

    setIsThinking(true);
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 15000)
      );
      const resp = await Promise.race([
        sendToJabari(text, messages, state.user, state.isOffline),
        timeoutPromise
      ]) as string;
      
      setResponse(resp);
      speak(resp);

      // Sync and update history
      const updatedMessages: Message[] = [
        ...messages,
        { role: 'user', parts: [{ text }] },
        { role: 'model', parts: [{ text: resp }] }
      ];
      setMessages(updatedMessages);
      if (state.user?.id && !state.isOffline) {
        updateAIConversations(state.user.id, updatedMessages);
      }
    } catch (err: any) {
      if (err.message === 'Timeout') {
        setError("Jabari is taking too long to respond. Please try again.");
      } else {
        setError("Could not reach Jabari. Check your connection.");
      }
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.user?.language === 'Kiswahili' ? 'sw-KE' : 'en-KE';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Find a nice voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes(utterance.lang) && v.name.includes('Google'));
    if (preferredVoice) utterance.voice = preferredVoice;

    synthRef.current.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-between p-8 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow rounded-full blur-[120px]" />
      </div>

      <header className="w-full flex justify-between items-center z-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-2xl">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${state.isOffline ? 'bg-grey' : 'bg-green-400 animate-pulse'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            {state.isOffline ? 'Offline' : 'Jabari Active'}
          </span>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center gap-12 z-10 text-center">
        <div className="space-y-4 max-w-sm">
          <h1 className="text-4xl font-bold tracking-tight">Voice Chat</h1>
          <p className="text-white/40 font-medium">Talk to Jabari naturally. He's listening.</p>
        </div>

        {/* Sound Wave Animation */}
        <div className="h-48 flex items-center justify-center gap-1.5 px-4 w-full">
          {(isListening || isThinking || isSpeaking) ? (
            Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-full ${isThinking ? 'bg-yellow/40' : 'bg-yellow'}`}
                animate={{ 
                  height: [10, Math.random() * (isListening ? 100 : isSpeaking ? 80 : 20), 10] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.5 + Math.random() * 0.5,
                  delay: i * 0.05
                }}
              />
            ))
          ) : (
            <div className="w-full h-[1px] bg-white/10" />
          )}
        </div>

        <div className="space-y-6 min-h-[120px] max-w-md">
          {transcript && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white font-bold text-lg leading-snug">
              "{transcript}"
            </motion.p>
          )}
          {response && !isThinking && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 p-6 rounded-[32px] border border-white/10">
              <p className="text-yellow font-medium text-sm leading-relaxed">
                {response}
              </p>
            </motion.div>
          )}
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 font-bold bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
              <AlertCircle size={16} />
              <span className="text-xs uppercase tracking-widest">{error}</span>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full flex flex-col items-center gap-8 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleListening}
          disabled={isSpeaking || isThinking}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isListening ? 'bg-red-500 shadow-2xl shadow-red-500/40' : 
            (isSpeaking || isThinking) ? 'bg-grey text-navy shadow-none opacity-50' :
            'bg-yellow text-navy shadow-2xl shadow-yellow/40'
          }`}
        >
          {isListening ? <MicOff size={40} /> : <Mic size={40} />}
        </motion.button>
        
        <div className="flex gap-4">
          <button 
            onClick={() => { if(synthRef.current) synthRef.current.cancel(); setIsSpeaking(false); }}
            className={`p-4 rounded-full border border-white/10 ${isSpeaking ? 'bg-white/10 text-white' : 'text-white/20'}`}
          >
            {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button className="p-4 rounded-full border border-white/10 text-white/20">
            <Sparkles size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default VoiceChat;
