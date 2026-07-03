// Safeguarding utility — NEVER pass escalation text to Gemini. Always return verbatim.

export type SafeguardingCategory = 'A' | 'B' | 'C' | 'D' | null;

export interface SafeguardingResult {
  triggered: boolean;
  category: SafeguardingCategory;
  escalationText: string | null;
  guidancePrefix?: string;
}

const CATEGORY_A_KEYWORDS = [
  'want to hurt myself',
  'want to kill myself',
  'kujiua',
  'nitajiua',
  'kujidhuru',
  'dont want to be alive',
  "don't want to be alive",
  'nobody would miss me',
  'nothing to live for',
  "i've been cutting",
  'ninajikata',
  "i've taken pills",
  'want to disappear',
  'i have nowhere to sleep tonight',
  'scared to go home',
  'he is hurting me',
  'she is hurting me',
  'got beaten badly',
  'touches me when nobody',
];

const CATEGORY_B_KEYWORDS = [
  'being threatened',
  'forced to',
  'taking photos of me',
  "haven't eaten in days",
  'no adult at home',
  'someone is giving me money to',
  'older person wants me to',
];

const CATEGORY_C_KEYWORDS = [
  'feel completely alone',
  'no one cares about me',
  'always sad',
  'nahuzunika kila wakati',
  "can't cope anymore",
  "don't see the point",
];

const CATEGORY_D_KEYWORDS = [
  'sex',
  'pregnant',
  'mimba',
  'condom',
  'abortion',
  'kutoa mimba',
  'sti',
  'std',
  'hiv',
  'ukimwi'
];

// These texts are FIXED. Never modify. Never pass to Gemini.
export const ESCALATION_TEXT = {
  A: "What you've shared with me is important, and I want to make sure you get the right support. You are not alone. 💙 Childline Kenya: 116 (free, 24/7)",
  B: "Thank you for trusting me with this. What you're describing sounds really hard, and you deserve proper support. Childline Kenya: 116",
  C: "I hear that this feels heavy. If you feel unsafe or this gets worse, please speak to a trusted adult or contact Childline Kenya on 116.",
  D: "I want to be helpful, but I am not equipped to provide advice on this topic. Please speak to a trusted adult, health professional, or counselor for accurate information.",
} as const;

export const REDACTED_SAFEGUARDING_MESSAGE = '[REDACTED SAFEGUARDING DISCLOSURE]';

function matchesKeywords(text: string, keywords: string[]): boolean {
  // 1. First run the standard regex check (very clean, handles normal text with word boundaries)
  const lower = text.toLowerCase();
  const matchedOriginal = keywords.some((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(lower);
  });
  if (matchedOriginal) return true;

  // 2. Next, check for spacing and leetspeak bypasses using normalized text
  const normalizedText = text.toLowerCase()
    .replace(/[1!|]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[4@]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/[7+]/g, 't')
    .replace(/0/g, 'o')
    .replace(/9/g, 'g')
    .replace(/[^a-z0-9]/g, ''); // strip spaces and punctuation

  const matchedNormalized = keywords.some((keyword) => {
    const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Only use normalized substring match if the keyword is sufficiently long (>= 5 chars)
    // to prevent false positives on short words like 'sex' or 'hiv'
    if (normalizedKeyword.length >= 5) {
      return normalizedText.includes(normalizedKeyword);
    }
    
    // For short keywords (like 'sex', 'hiv', 'std', 'sti'), run regex match on leetspeak-replaced text (retaining spaces)
    const leetText = text.toLowerCase()
      .replace(/[1!|]/g, 'i')
      .replace(/3/g, 'e')
      .replace(/[4@]/g, 'a')
      .replace(/[5$]/g, 's')
      .replace(/[7+]/g, 't')
      .replace(/0/g, 'o')
      .replace(/9/g, 'g');
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(leetText);
  });

  return matchedNormalized;
}

import { supabase } from './supabase';
import { sendGuardianSMS } from './notifications';

export async function reportSafeguardingFlag(userId: string, category: SafeguardingCategory, message: string, source: string) {
  if (!category) return;

  const { error } = await supabase.from('safeguarding_flags').insert({
    user_id: userId,
    category,
    message: REDACTED_SAFEGUARDING_MESSAGE,
    source,
    status: 'pending'
  });

  if (error) console.error("Failed to log safeguarding flag:", error);

  // Send critical alert SMS to parent/guardian of minor under 16 for Category A/B flags
  if (category === 'A' || category === 'B') {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('guardian_phone, age_bracket, name, language')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        const isUnder16 = profile.age_bracket === '10-12' || profile.age_bracket === '13-15';
        if (isUnder16 && profile.guardian_phone) {
          const smsMessage = profile.language === 'Kiswahili'
            ? `Ujumbe muhimu: Tahadhari ya usalama imetolewa kwa mtoto wako ${profile.name} kwenye Youth Educated. Timu yetu inakagua tukio hili mara moja.`
            : `IMPORTANT: A safeguarding alert was raised for your child ${profile.name} on Youth Educated. Our team is reviewing this event immediately.`;
          sendGuardianSMS(profile.guardian_phone, smsMessage);
        }
      }
    } catch (fetchErr) {
      console.error("Failed to check guardian for safeguarding SMS:", fetchErr);
    }
  }
}

export function checkSafeguarding(text: string, ageBracket: string, userId?: string, source?: string): SafeguardingResult {
  let result: SafeguardingResult = { triggered: false, category: null, escalationText: null };

  // Check Category A first (most severe)
  if (matchesKeywords(text, CATEGORY_A_KEYWORDS)) {
    result = { triggered: true, category: 'A', escalationText: ESCALATION_TEXT.A };
  }
  // Check Category B
  else if (matchesKeywords(text, CATEGORY_B_KEYWORDS)) {
    // Age 10-12: B escalates to A
    if (ageBracket === '10-12') {
      result = { triggered: true, category: 'A', escalationText: ESCALATION_TEXT.A };
    } else {
      result = { triggered: true, category: 'B', escalationText: ESCALATION_TEXT.B };
    }
  }
  // Check Category C
  else if (matchesKeywords(text, CATEGORY_C_KEYWORDS)) {
    // Age 10-12: C escalates to B
    if (ageBracket === '10-12') {
      result = { triggered: true, category: 'B', escalationText: ESCALATION_TEXT.B };
    } else {
      result = { triggered: true, category: 'C', escalationText: null, guidancePrefix: ESCALATION_TEXT.C };
    }
  }
  // Check Category D (SRH for under 16)
  else if (matchesKeywords(text, CATEGORY_D_KEYWORDS)) {
    if (ageBracket === '10-12' || ageBracket === '13-15') {
      result = { triggered: true, category: 'D', escalationText: ESCALATION_TEXT.D };
    }
  }

  // Log to Supabase if triggered and userId is provided
  if (result.triggered && userId && result.category) {
    void reportSafeguardingFlag(userId, result.category, text, source || 'chat');
  }

  return result;
}
