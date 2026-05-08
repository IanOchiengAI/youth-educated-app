import { User } from '../AppContext';
import { supabase } from '../lib/supabase';
import offlineResponses from '../data/jabariOffline.json';

export type InteractionMode = 'default' | 'roleplay' | 'quiz';

export interface RoleplayScenario {
  id: string;
  name: string;
  persona: string;
  description: string;
  goal: string;
}

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  { id: 'boss', name: 'Job Interview', persona: 'Mr. Otieno (Firm Boss)', description: 'Practice a job interview for a local shop.', goal: 'Learn professional communication.' },
  { id: 'parent', name: 'Tricky Talk with Parent', persona: 'Mama K. (Concerned Parent)', description: 'Talk about staying out late or school grades.', goal: 'Learn negotiation & respect.' },
  { id: 'friend', name: 'Peer Pressure', persona: 'Jakes (Cool Friend)', description: 'Refuse an offer to skip school.', goal: 'Build assertiveness.' },
];

const JABARI_CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jabari-chat`;

async function getAuthHeader(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token
    ? `Bearer ${session.access_token}`
    : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
}

export const fetchAIConversations = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('message_history')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching AI history:', error);
  }
  return data?.message_history || [];
};

export const updateAIConversations = async (userId: string, history: any[]) => {
  const { error } = await supabase
    .from('ai_conversations')
    .upsert({
      user_id: userId,
      message_history: history,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error updating AI history:', error);
  }
};

const PERSONA_PROMPTS = {
  amara: {
    name: 'Amara',
    meaning: 'grace',
    gender: 'female',
    archetype: 'a trusted older sister, auntie, or community mother figure',
    pronoun: 'She',
    greeting: 'Safi! I am Amara. How can I support you today?',
  },
  jabari: {
    name: 'Jabari',
    meaning: 'brave one',
    gender: 'male',
    archetype: 'a trusted older brother, uncle, or community elder figure',
    pronoun: 'He',
    greeting: 'Safi! Jabari hapa — ready to walk this path with you. What\'s on your mind?',
  },
} as const;

export const buildJabariPrompt = (
  user: User | null,
  mode: InteractionMode = 'default',
  scenario?: RoleplayScenario,
  persona: 'amara' | 'jabari' = 'amara'
) => {
  const p = PERSONA_PROMPTS[persona];
  if (!user) return `You are ${p.name}, a supportive life-skills companion for Kenyan youth.`;

  const { name, ageBracket, county, language, goals } = user;
  const isKsw = language === 'Kiswahili';

  let modeInstructions = '';

  if (mode === 'roleplay' && scenario) {
    modeInstructions = `
ACTION MODE: ROLEPLAY
You are NO LONGER ${p.name}. You are playing the character: ${scenario.persona}.
Scenario: ${scenario.description}
Goal: Help the student practice: ${scenario.goal}
- Stay strictly in character.
- Be realistic (not too easy, not too hard).
- After 3-4 exchanges, provide a brief 'Mentor Tip' in brackets [...] then exit the mode.
`;
  } else if (mode === 'quiz') {
    modeInstructions = `
ACTION MODE: SOCRATIC QUIZ
You are testing the student's knowledge in a fun, supportive way.
- Ask ONE question at a time.
- Use Socratic questioning: if they get it wrong, don't give the answer, ask a hint question.
- Focus on life skills (HIV prevention, Financial Literacy, Confidence).
`;
  } else {
    modeInstructions = `
You are ${p.name}, a wise and warm AI mentor built for African youth.
Your name means "${p.meaning}" in many African languages.
You are ${p.gender} — ${p.archetype}.

Your personality:
- You speak like ${p.archetype}, not a corporate chatbot.
- You use warm, direct language. No fluff, no jargon.
- You occasionally use common African/Kenyan phrases naturally like pole pole, mambo, sawa but never force it.
- You understand the Kenyan context: county schools, KCSE exams, matatu culture, M-Pesa, village life vs city life.
- You celebrate wins genuinely. You don't lecture — you guide.

Your role:
- You are standing in for the user's human mentor between their sessions.
- You know the goals the mentor has set for this mentee. Always reference them.
- You check in on progress, celebrate effort, and push back gently when needed.
- You never replace the human mentor — you extend them.

Safeguarding:
- If a user expresses immediate danger, self-harm, or abuse, always respond with empathy first, then provide: Childline Kenya: 116 (free, 24/7 — you can call or text).
- Never diagnose. Never give medical advice. Refer to professionals for health issues.

Goal context will be injected at the start of each conversation as:
[MENTEE GOALS: goal1 | goal2 | goal3]
You should acknowledge these goals naturally in your responses.
`;
  }

  return `You are ${p.name}, a supportive and wise life-skills companion for a ${ageBracket} year old in ${county}, Kenya.
User Name: ${name}
Primary Language: ${language}
Top Goals: ${goals.join(', ')}

${modeInstructions}

RULES:
${isKsw ? '- Respond primarily in Kiswahili.' : '- Respond primarily in English.'}
- If the user writes in Sheng (Kenyan youth slang mixing Swahili and English), respond naturally in Sheng — do not correct them or switch to formal language. Sheng is valid and shows you understand their world.
- Never give professional medical or legal advice.
- Avoid being overly formal or robotic. Use emojis naturally.`;
};

function getInitialModelResponse(mode: InteractionMode, persona: 'amara' | 'jabari', scenario?: RoleplayScenario): string {
  const p = PERSONA_PROMPTS[persona];
  if (mode === 'quiz') return "Safi! Let's test your knowledge. Ready for the first question?";
  if (mode === 'roleplay') return `Jambo! I'm now in Roleplay mode for the '${scenario?.name}' scenario. Let's begin.`;
  return p.greeting;
}

export const sendToJabari = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  user: User | null,
  isOffline: boolean,
  mode: InteractionMode = 'default',
  scenario?: RoleplayScenario,
  persona: 'amara' | 'jabari' = 'amara'
): Promise<string> => {
  if (isOffline) {
    const lowerMessage = message.toLowerCase();
    const fallback = (offlineResponses as { triggers: string[]; response: string }[]).find(r =>
      r.triggers.some(t => lowerMessage.includes(t))
    );
    return fallback ? fallback.response : "Mambo! I'm in offline mode right now, but I'm still here for you. What's on your mind? 😊";
  }

  try {
    const preparedHistory = [
      { role: 'user' as const, parts: [{ text: buildJabariPrompt(user, mode, scenario, persona) }] },
      { role: 'model' as const, parts: [{ text: getInitialModelResponse(mode, persona, scenario) }] },
      ...history,
    ];

    const authHeader = await getAuthHeader();
    const response = await fetch(JABARI_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
      body: JSON.stringify({ action: 'chat', message, preparedHistory }),
    });

    if (response.status === 429) {
      return "Pole — give me just a second to think! 😊";
    }

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error ?? `HTTP ${response.status}`;
      console.error('[jabari] Edge function error:', response.status, errMsg);
      throw new Error(errMsg);
    }

    if (data.error === 'SAFETY_BLOCK') {
      return "I want to be helpful, but I am not equipped to provide advice on this topic. Please speak to a trusted adult. 💙";
    }
    if (data.error === 'TOO_FAST') {
      return "Pole — give me just a second! 😊";
    }
    if (data.error) {
      console.error('[jabari] API returned error:', data.error);
      throw new Error(data.error);
    }

    return data.text ?? '';
  } catch (error) {
    console.error('[jabari] Unexpected error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
      return "Pole sana — I'm getting a lot of messages right now. Give me a moment and try again! 🙏";
    }
    return "Pole sana, I'm having a bit of trouble connecting right now. Let's try again in a moment! 🙏";
  }
};

export const generateMentorBriefing = async (
  studentName: string,
  activityData: string
): Promise<string> => {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(JABARI_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
      body: JSON.stringify({ action: 'mentor-briefing', studentName, activityData }),
    });

    if (!response.ok) throw new Error(`Edge function error: ${response.status}`);

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text ?? 'AI Summary unavailable.';
  } catch (error) {
    console.error("Mentor Briefing Error:", error);
    return "Could not generate briefing at this time. Please review recent activity manually.";
  }
};

export const generateCheckinSummary = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string | null> => {
  if (history.length < 3) return null;

  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(JABARI_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
      body: JSON.stringify({ action: 'checkin-summary', history }),
    });

    if (!response.ok) throw new Error(`Edge function error: ${response.status}`);

    const data = await response.json();
    return data.text ?? null;
  } catch {
    return null;
  }
};
