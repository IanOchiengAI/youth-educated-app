export interface VoiceOption {
  id: string;
  label: string;
  description: string;
  gender: 'male' | 'female';
  isPremium?: boolean;
  elevenLabsVoiceId?: string;
}

// ElevenLabs voice IDs
export const ELEVENLABS_VOICE_IDS = {
  amara: 'ijKilL5CnjXKMWDHOJH8',  // Female African accent — Amara
  jabari: 'uLfPT2jUO3X81OwnftBP', // Male African accent — Jabari
} as const;

export const JABARI_VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'default_female',
    label: 'Amara (Standard)',
    description: 'Clear female voice — free',
    gender: 'female',
  },
  {
    id: 'default_male',
    label: 'Jabari (Standard)',
    description: 'Clear male voice — free',
    gender: 'male',
  },
  {
    id: 'slow_clear',
    label: 'Tutor Mode',
    description: 'Slower, very clear — great for learning',
    gender: 'female',
  },
  {
    id: 'elevenlabs_amara',
    label: 'Amara (African) ✦',
    description: 'Premium African accent — Amara voice',
    gender: 'female',
    isPremium: true,
    elevenLabsVoiceId: ELEVENLABS_VOICE_IDS.amara,
  },
  {
    id: 'elevenlabs_jabari',
    label: 'Jabari (African) ✦',
    description: 'Premium African accent — Jabari voice',
    gender: 'male',
    isPremium: true,
    elevenLabsVoiceId: ELEVENLABS_VOICE_IDS.jabari,
  },
];

export const VOICE_STORAGE_KEY = 'ye_jabari_voice';

export function getSelectedVoiceId(): string {
  try {
    return localStorage.getItem(VOICE_STORAGE_KEY) || 'default_female';
  } catch {
    return 'default_female';
  }
}

export function setSelectedVoiceId(voiceId: string): void {
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, voiceId);
  } catch {
    console.warn('Could not persist voice preference to localStorage');
  }
}

export function getDefaultVoiceForPersona(persona: 'amara' | 'jabari'): string {
  return persona === 'jabari' ? 'default_male' : 'default_female';
}
