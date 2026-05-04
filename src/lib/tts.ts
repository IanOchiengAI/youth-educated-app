/**
 * TTS Service Abstraction
 * Current: Web Speech API (browser-native, free, works offline)
 * Premium: ElevenLabs API (multilingual v2 — African accent voice)
 * To swap: implement TTSService interface with ElevenLabs SDK
 */

import { getSelectedVoiceId } from '../data/voices';

// ---------------------------------------------------------------------------
// Interface — the contract every TTS backend must fulfill
// ---------------------------------------------------------------------------

export interface TTSService {
  speak(text: string, lang?: string): void;
  stop(): void;
  isSpeaking(): boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

// ---------------------------------------------------------------------------
// Web Speech API implementation
// ---------------------------------------------------------------------------

class WebSpeechTTS implements TTSService {
  onStart?: () => void;
  onEnd?: () => void;

  private get synth(): SpeechSynthesis | null {
    return typeof window !== 'undefined' ? window.speechSynthesis : null;
  }

  // ------ public API -------------------------------------------------------

  speak(text: string, lang = 'en-US'): void {
    const synth = this.synth;
    if (!synth) return;

    // Cancel anything currently playing
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voiceId = getSelectedVoiceId();
    const voice = this.resolveVoice(voiceId, lang);

    if (voice) {
      utterance.voice = voice;
    }

    // Tutor Mode → slower, clearer delivery
    if (voiceId === 'slow_clear') {
      utterance.rate = 0.8;
    }

    // Wire callbacks
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

  /**
   * Returns all voices currently available on the device.
   * Useful for debugging or building a custom voice picker.
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth?.getVoices() ?? [];
  }

  // ------ private helpers --------------------------------------------------

  /**
   * Maps a Jabari voice ID to the best-matching SpeechSynthesisVoice.
   * Falls back gracefully: preferred → any matching gender → null (system default).
   */
  private resolveVoice(
    voiceId: string,
    lang: string
  ): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (voices.length === 0) return null;

    const langPrefix = lang.split('-')[0].toLowerCase(); // 'en'

    // Filter voices that match the requested language
    const langVoices = voices.filter(
      (v) => v.lang.toLowerCase().startsWith(langPrefix)
    );

    switch (voiceId) {
      case 'default_male': {
        // Prefer Google-provided male voices for consistency
        const googleMale = langVoices.find(
          (v) => this.isMaleVoice(v) && this.isGoogleVoice(v)
        );
        if (googleMale) return googleMale;

        // Any male voice for this language
        const anyMale = langVoices.find((v) => this.isMaleVoice(v));
        if (anyMale) return anyMale;

        // Fallback: first voice for the language, or null
        return langVoices[0] ?? null;
      }

      case 'default_female':
      case 'slow_clear': {
        // Prefer Google-provided female voices
        const googleFemale = langVoices.find(
          (v) => this.isFemaleVoice(v) && this.isGoogleVoice(v)
        );
        if (googleFemale) return googleFemale;

        const anyFemale = langVoices.find((v) => this.isFemaleVoice(v));
        if (anyFemale) return anyFemale;

        return langVoices[0] ?? null;
      }

      default:
        return langVoices[0] ?? null;
    }
  }

  /**
   * Heuristic: voice names containing common male-associated keywords.
   * Web Speech API doesn't expose gender metadata, so we pattern-match.
   */
  private isMaleVoice(voice: SpeechSynthesisVoice): boolean {
    const name = voice.name.toLowerCase();
    const maleIndicators = [
      'male', 'man', 'david', 'james', 'mark', 'daniel',
      'google uk english male', 'microsoft david', 'microsoft mark',
      'microsoft james', 'alex', 'tom', 'fred'
    ];
    return maleIndicators.some((kw) => name.includes(kw));
  }

  /**
   * Heuristic: voice names containing common female-associated keywords.
   */
  private isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
    const name = voice.name.toLowerCase();
    const femaleIndicators = [
      'female', 'woman', 'samantha', 'zira', 'susan',
      'google uk english female', 'microsoft zira', 'karen',
      'victoria', 'fiona', 'moira', 'tessa'
    ];
    return femaleIndicators.some((kw) => name.includes(kw));
  }

  private isGoogleVoice(voice: SpeechSynthesisVoice): boolean {
    return voice.name.toLowerCase().includes('google');
  }
}

// ---------------------------------------------------------------------------
// ElevenLabs API implementation — premium African accent voice
// ---------------------------------------------------------------------------

class ElevenLabsTTS implements TTSService {
  onStart?: () => void;
  onEnd?: () => void;

  private voiceId: string;
  private audioElement: HTMLAudioElement | null = null;

  /** Shared WebSpeechTTS instance used as a fallback when the API is unreachable. */
  private fallback = new WebSpeechTTS();

  constructor(voiceId: string) {
    this.voiceId = voiceId;
  }

  // ------ public API -------------------------------------------------------

  speak(text: string, lang = 'en-US'): void {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;

    if (!apiKey) {
      console.warn('[ElevenLabsTTS] No API key configured — falling back to Web Speech.');
      this.fallback.onStart = this.onStart;
      this.fallback.onEnd = this.onEnd;
      this.fallback.speak(text, lang);
      return;
    }

    // Signal that speech is starting
    this.onStart?.();

    fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`ElevenLabs API responded with ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        this.audioElement = new Audio(url);
        this.audioElement.addEventListener('ended', () => this.onEnd?.());
        this.audioElement.addEventListener('error', () => this.onEnd?.());
        this.audioElement.play();
      })
      .catch((err) => {
        // Network failures are common on spotty Kenyan mobile data —
        // fall back to the free browser TTS so the student still hears the response.
        console.warn('[ElevenLabsTTS] Fetch failed, using Web Speech fallback:', err);
        this.fallback.onStart = this.onStart;
        this.fallback.onEnd = this.onEnd;
        this.fallback.speak(text, lang);
      });
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.onEnd?.();
  }

  isSpeaking(): boolean {
    if (!this.audioElement) return false;
    return !this.audioElement.paused && !this.audioElement.ended;
  }
}

// ---------------------------------------------------------------------------
// Singleton — single TTS engine instance for the entire app
// ---------------------------------------------------------------------------

let _currentService: TTSService | null = null;
let _lastVoiceId: string | null = null;

/**
 * Returns the appropriate TTS backend based on the user's selected voice
 * and whether the ElevenLabs API key is configured.
 */
export function getTTSService(): TTSService {
  if (typeof window === 'undefined') return new WebSpeechTTS();

  const selectedVoice = getSelectedVoiceId();
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;

  // Cache management — don't recreate the service if the voice hasn't changed
  if (selectedVoice === _lastVoiceId && _currentService) {
    return _currentService;
  }

  // If voice changed, stop current audio before switching
  if (_currentService) {
    _currentService.stop();
  }

  _lastVoiceId = selectedVoice;

  if (selectedVoice === 'elevenlabs_african' && apiKey) {
    _currentService = new ElevenLabsTTS('EXAVo6Kbc98qBr9vO0s9');
  } else {
    _currentService = new WebSpeechTTS();
  }

  return _currentService;
}

/**
 * The 'tts' singleton is a proxy that always uses the currently 
 * active service based on user settings.
 */
export const tts: TTSService = {
  speak: (text: string, lang?: string) => getTTSService().speak(text, lang),
  stop: () => getTTSService().stop(),
  isSpeaking: () => getTTSService().isSpeaking(),
};

/**
 * Direct factory for consuming code that wants to explicitly use ElevenLabs.
 */
export const getElevenLabsTTS = () =>
  new ElevenLabsTTS('EXAVo6Kbc98qBr9vO0s9');
