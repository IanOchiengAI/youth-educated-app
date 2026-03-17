// Safeguarding utility — NEVER pass escalation text to Gemini. Always return verbatim.

export type SafeguardingCategory = 'A' | 'B' | 'C' | 'D' | null;

export interface SafeguardingResult {
  triggered: boolean;
  category: SafeguardingCategory;
  escalationText: string | null;
}

const CATEGORY_A_KEYWORDS = [
  'want to hurt myself',
  'want to kill myself',
  'kujiua',
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
  D: "I want to be helpful, but I am not equipped to provide advice on this topic. Please speak to a trusted adult, health professional, or counselor for accurate information.",
} as const;

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(lower);
  });
}

import { supabase } from './supabase';

export function checkSafeguarding(text: string, ageBracket: string, userId?: string): SafeguardingResult {
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
      result = { triggered: true, category: 'C', escalationText: null };
    }
  }

  // Check Category D (SRH for under 16)
  else if (matchesKeywords(text, CATEGORY_D_KEYWORDS)) {
    if (ageBracket === '10-12' || ageBracket === '13-15') {
      result = { triggered: true, category: 'D', escalationText: ESCALATION_TEXT.D };
    }
  }

  // Log to Supabase if triggered and userId is provided
  if (result.triggered && userId && result.category && result.category !== 'C' && result.category !== 'D') {
    supabase.from('safeguarding_flags').insert({
      user_id: userId,
      category: result.category,
      message: text,
      status: 'pending'
    }).then(({ error }) => {
       if (error) console.error("Failed to log safeguarding flag:", error);
    });
  }

  return result;
}
