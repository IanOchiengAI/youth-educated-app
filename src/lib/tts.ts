/**
 * TTS Service Abstraction
 * Default: Web Speech API (browser-native, free, works offline)
 * Premium: ElevenLabs via Supabase Edge Function (API key never reaches browser)
 */

import { getSelectedVoiceId, ELEVENLABS_VOICE_IDS, JABARI_VOICE_OPTIONS } from '../data/voices';
import { supabase, isSupabaseConfigured } from './supabase';

export interface TTSService {
  speak(text: string, lang?: string): void;
  stop(): void;
  isSpeaking(): boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

class WebSpeechTTS implements TTSService {
  onStart?: () => void;
  onEnd?: () => void;

  private get synth(): SpeechSynthesis | null {
    return typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  speak(text: string, lang = 'en-US'): void {
    const synth = this.synth;
    if (!synth) return;

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voiceId = getSelectedVoiceId();
    const voice = this.resolveVoice(voiceId, lang);

    if (voice) utterance.voice = voice;
    if (voiceId === 'slow_clear') utterance.rate = 0.8;

    utterance.onstart = () => this.onStart?.();
    utterance.onend = () => this.onEnd?.();
    utterance.onerror = () => this.onEnd?.();

    synth.speak(utterance);
  }

  stop(): void {
    this.synth?.cancel();
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth?.getVoices() ?? [];
  }

  private resolveVoice(voiceId: string, lang: string): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (voices.length === 0) return null;

    const langPrefix = lang.split('-')[0].toLowerCase();
    const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));

    switch (voiceId) {
      case 'default_male': {
        const googleMale = langVoices.find((v) => this.isMaleVoice(v) && this.isGoogleVoice(v));
        if (googleMale) return googleMale;
        const anyMale = langVoices.find((v) => this.isMaleVoice(v));
        return anyMale ?? langVoices[0] ?? null;
      }
      case 'default_female':
      case 'slow_clear': {
        const googleFemale = langVoices.find((v) => this.isFemaleVoice(v) && this.isGoogleVoice(v));
        if (googleFemale) return googleFemale;
        const anyFemale = langVoices.find((v) => this.isFemaleVoice(v));
        return anyFemale ?? langVoices[0] ?? null;
      }
      default:
        return langVoices[0] ?? null;
    }
  }

  private isMaleVoice(voice: SpeechSynthesisVoice): boolean {
    const name = voice.name.toLowerCase();
    const maleIndicators = [
      'male', 'man', 'david', 'james', 'mark', 'daniel',
      'google uk english male', 'microsoft david', 'microsoft mark',
      'microsoft james', 'alex', 'tom', 'fred',
    ];
    return maleIndicators.some((kw) => name.includes(kw));
  }

  private isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
    const name = voice.name.toLowerCase();
    const femaleIndicators = [
      'female', 'woman', 'samantha', 'zira', 'susan',
      'google uk english female', 'microsoft zira', 'karen',
      'victoria', 'fiona', 'moira', 'tessa',
    ];
    return femaleIndicators.some((kw) => name.includes(kw));
  }

  private isGoogleVoice(voice: SpeechSynthesisVoice): boolean {
    return voice.name.toLowerCase().includes('google');
  }
}

class ElevenLabsTTS implements TTSService {
  onStart?: () => void;
  onEnd?: () => void;

  private audioElement: HTMLAudioElement | null = null;
  private fallback = new WebSpeechTTS();

  constructor(private readonly voiceId: string) {}

  speak(text: string, lang = 'en-US'): void {
    if (!isSupabaseConfigured) {
      this.speakFallback(text, lang);
      return;
    }

    this.onStart?.();

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        const authHeader = session?.access_token
          ? `Bearer ${session.access_token}`
          : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;

        return fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({ text, voiceId: this.voiceId }),
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error(`TTS function responded with ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        this.audioElement = new Audio(url);
        this.audioElement.addEventListener('ended', () => {
          URL.revokeObjectURL(url);
          this.onEnd?.();
        });
        this.audioElement.addEventListener('error', () => {
          URL.revokeObjectURL(url);
          this.onEnd?.();
        });
        void this.audioElement.play();
      })
      .catch((err) => {
        console.warn('[ElevenLabsTTS] Edge TTS failed, using Web Speech fallback:', err);
        this.speakFallback(text, lang);
      });
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.fallback.stop();
    this.onEnd?.();
  }

  isSpeaking(): boolean {
    return !!this.audioElement && !this.audioElement.paused && !this.audioElement.ended;
  }

  private speakFallback(text: string, lang: string): void {
    this.fallback.onStart = this.onStart;
    this.fallback.onEnd = this.onEnd;
    this.fallback.speak(text, lang);
  }
}

let currentService: TTSService | null = null;
let lastVoiceId: string | null = null;

export function getTTSService(): TTSService {
  if (typeof window === 'undefined') return new WebSpeechTTS();

  const selectedVoice = getSelectedVoiceId();
  if (selectedVoice === lastVoiceId && currentService) return currentService;

  currentService?.stop();
  lastVoiceId = selectedVoice;

  const voiceOption = JABARI_VOICE_OPTIONS.find((v) => v.id === selectedVoice);
  const elevenLabsId = voiceOption?.elevenLabsVoiceId;

  currentService = elevenLabsId && isSupabaseConfigured
    ? new ElevenLabsTTS(elevenLabsId)
    : new WebSpeechTTS();

  return currentService;
}

export const tts: TTSService = {
  speak: (text: string, lang?: string) => {
    const service = getTTSService();
    service.onStart = tts.onStart;
    service.onEnd = tts.onEnd;
    service.speak(text, lang);
  },
  stop: () => {
    const service = getTTSService();
    service.onEnd = tts.onEnd;
    service.stop();
  },
  isSpeaking: () => getTTSService().isSpeaking(),
};

export const getElevenLabsAmaraTTS = () => new ElevenLabsTTS(ELEVENLABS_VOICE_IDS.amara);
export const getElevenLabsJabariTTS = () => new ElevenLabsTTS(ELEVENLABS_VOICE_IDS.jabari);
