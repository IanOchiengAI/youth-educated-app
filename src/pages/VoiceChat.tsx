import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { sendToJabari, fetchAIConversations, updateAIConversations, generateCheckinSummary } from '../api/jabari';
import { checkSafeguarding } from '../lib/safeguarding';
import { supabase } from '../lib/supabase';
import { tts } from '../lib/tts';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const VoiceChat: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEscalation, setIsEscalation] = useState(false);

  const recognitionRef = useRef<any>(null);
  // TTS singleton callbacks wired to local state
  useEffect(() => {
    tts.onStart = () => setIsSpeaking(true);
    tts.onEnd = () => setIsSpeaking(false);
    return () => {
      tts.onStart = undefined;
      tts.onEnd = undefined;
    };
  }, []);

  // Refs for check-in logging
  const messagesRef = useRef<Message[]>([]);
  const safeguardingTriggeredRef = useRef(false);
  const checkinFiredRef = useRef(false);

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
          dispatch({ type: 'SET_JABARI_GOALS', payload: { goals: state.user.goals || [], agenda: '' } });
        }
      } catch (err) {
        console.error('Failed to fetch mentor goals:', err);
      }
    };

    fetchGoals();
  }, [state.user?.id]);

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
      tts.stop();
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

  // ── Check-in logging on unmount ──
  const performCheckin = useCallback(async () => {
    if (checkinFiredRef.current) return;
    if (messagesRef.current.length < 3) return;
    if (!state.user?.id || state.isOffline) return;

    checkinFiredRef.current = true;

    try {
      const summaryText = await generateCheckinSummary(messagesRef.current);
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
        tts.stop();
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
      safeguardingTriggeredRef.current = true;
      setResponse(safeguard.escalationText);
      setIsEscalation(true);
      speak(safeguard.escalationText);
      return;
    }

    // 2. Build goal context for injection
    const goals = state.jabariGoals.length > 0 ? state.jabariGoals : (state.user?.goals || []);
    const goalContext = goals.length > 0
      ? `[MENTEE GOALS: ${goals.join(' | ')}]` + (state.jabariAgenda ? `\n[MENTOR AGENDA: ${state.jabariAgenda}]` : '')
      : '';

    // 3. Build history with goal context as silent first turn
    const historyWithContext = goalContext
      ? [
          { role: 'user' as const, parts: [{ text: goalContext }] },
          { role: 'model' as const, parts: [{ text: 'Understood. I will keep these goals and agenda in mind throughout our conversation.' }] },
          ...messages
        ]
      : messages;

    setIsThinking(true);
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 15000)
      );
      const resp = await Promise.race([
        sendToJabari(text, historyWithContext, state.user, state.isOffline),
        timeoutPromise
      ]) as string;
      
      setResponse(resp);
      speak(resp);

      // Sync and update history (without injected goal context turns)
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
        setError("Amara is taking too long to respond. Please try again.");
      } else {
        setError("Could not reach Amara. Check your connection.");
      }
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    const lang = state.user?.language === 'Kiswahili' ? 'sw-KE' : 'en-KE';
    tts.speak(text, lang);
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
            {state.isOffline ? 'Offline' : 'Amara Active'}
          </span>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center gap-12 z-10 text-center">
        <div className="space-y-4 max-w-sm">
          <h1 className="text-4xl font-bold tracking-tight">Voice Chat</h1>
          <p className="text-white/40 font-medium">Talk to Amara naturally. She's listening.</p>
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={isEscalation
                ? "bg-red-500/20 p-6 rounded-[32px] border-2 border-red-400/40"
                : "bg-white/10 p-6 rounded-[32px] border border-white/10"
              }>
              {isEscalation && (
                <div className="flex items-center justify-center gap-2 mb-3 text-red-300">
                  <AlertCircle size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Priority Support 116</span>
                </div>
              )}
              <p className={`font-medium text-sm leading-relaxed ${isEscalation ? 'text-white' : 'text-yellow'}`}>
                {response}
              </p>
              {isEscalation && (
                <a href="tel:116" className="mt-4 w-full py-3 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 no-underline">
                  📞 Call Childline 116
                </a>
              )}
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
          disabled={isSpeaking || isThinking || isEscalation}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isListening ? 'bg-red-500 shadow-2xl shadow-red-500/40' : 
            (isSpeaking || isThinking || isEscalation) ? 'bg-grey text-navy shadow-none opacity-50' :
            'bg-yellow text-navy shadow-2xl shadow-yellow/40'
          }`}
        >
          {isListening ? <MicOff size={40} /> : <Mic size={40} />}
        </motion.button>
        
        <div className="flex gap-4">
          <button 
            onClick={() => { tts.stop(); setIsSpeaking(false); }}
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
