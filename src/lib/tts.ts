/**
 * TTS Service Abstraction
 * Current: Web Speech API (browser-native, free, works offline)
 * Future: ElevenLabs API (trained African accent voice)
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
// Singleton — single TTS engine instance for the entire app
// ---------------------------------------------------------------------------

export const tts = new WebSpeechTTS();
