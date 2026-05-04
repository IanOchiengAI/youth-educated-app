export interface VoiceOption {
  id: string;
  label: string;
  description: string;
  gender: 'male' | 'female';
}

export const JABARI_VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'default_female',
    label: 'Amara (Default)',
    description: 'Standard female voice',
    gender: 'female'
  },
  {
    id: 'default_male',
    label: 'Jabari',
    description: 'Male voice',
    gender: 'male'
  },
  {
    id: 'slow_clear',
    label: 'Tutor Mode',
    description: 'Slower, very clear',
    gender: 'female'
  },
  {
    id: 'elevenlabs_african',
    label: 'Jabari (African)',
    description: 'Premium African accent voice',
    gender: 'male'
  }
];

export const VOICE_STORAGE_KEY = 'ye_jabari_voice';

/**
 * Reads the user's selected voice ID from localStorage.
 * Defaults to 'default_male' if no preference is stored.
 */
export function getSelectedVoiceId(): string {
  try {
    return localStorage.getItem(VOICE_STORAGE_KEY) || 'default_female';
  } catch {
    // SSR or localStorage unavailable
    return 'default_female';
  }
}

/**
 * Persists the user's selected voice ID to localStorage.
 */
export function setSelectedVoiceId(voiceId: string): void {
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, voiceId);
  } catch {
    console.warn('Could not persist voice preference to localStorage');
  }
}
