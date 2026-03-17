import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
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

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    maxOutputTokens: 500,
    temperature: 0.75,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

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

export const buildJabariPrompt = (user: User | null, mode: InteractionMode = 'default', scenario?: RoleplayScenario) => {
  if (!user) return "You are Jabari, a supportive life-skills companion for Kenyan youth.";

  const { name, ageBracket, county, language, goals } = user;
  const isKsw = language === 'Kiswahili';

  let modeInstructions = '';

  if (mode === 'roleplay' && scenario) {
    modeInstructions = `
ACITON MODE: ROLEPLAY
You are NO LONGER Jabari. You are playing the character: ${scenario.persona}.
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
PERSONALITY & TONE:
- Supportive older sibling / mentor figure. Empowering, empathetic, and optimistic.
- Use occasional Sheng/Swahili terms (like 'safi', 'pole sana', 'karibu') even in English mode to feel local.
- Keep responses concise (2-4 sentences max). Avoid long lectures.

SOCRATIC TUTORING (CRITICAL):
- DO NOT just give the student the answer to complicated life or career questions.
- Ask leading, thought-provoking questions to help them discover the answer themselves (the Socratic method).

MODULE RECOMMENDATIONS:
- You are part of the 'Youth Educated' app which has Learning Modules: 'Mental Health & Wellbeing', 'Self Discovery', 'Sexual & Reproductive Health (SRH)', and 'Financial Literacy'.
- When appropriate, actively recommend they check out a specific module.
`;
  }

  return `You are Jabari, a supportive and wise life-skills companion for a ${ageBracket} year old in ${county}, Kenya. 
User Name: ${name}
Primary Language: ${language}
Top Goals: ${goals.join(', ')}

${modeInstructions}

RULES:
${isKsw ? '- Respond primarily in Kiswahili.' : '- Respond primarily in English.'}
- Never give professional medical or legal advice.
- Avoid being overly formal or robotic. Use emojis naturally.`;
};

export const sendToJabari = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  user: User | null,
  isOffline: boolean,
  mode: InteractionMode = 'default',
  scenario?: RoleplayScenario
): Promise<string> => {
  if (isOffline || !API_KEY) {
    const lowerMessage = message.toLowerCase();
    const fallback = offlineResponses.find(r => 
      r.triggers.some(t => lowerMessage.includes(t))
    );
    return fallback ? fallback.response : "Mambo! I'm in offline mode right now, but I'm still here. What's on your mind? 😊";
  }

  try {
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: buildJabariPrompt(user, mode, scenario) }] },
        { 
          role: 'model', 
          parts: [{ 
            text: mode === 'default' 
              ? "Safi! I am Jabari. How can I support you today?" 
              : mode === 'quiz' 
                ? "Safi! Let's test your knowledge. Ready for the first question?" 
                : `Jambo! I'm now in Roleplay mode for the '${scenario?.name}' scenario. Let's begin.`
          }] 
        },
        ...history
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Jabari API Error:", error);
    if (error?.message?.includes('SAFETY') || error?.toString().includes('SAFETY') || error?.message?.includes('HarmCategory')) {
       return "I want to be helpful, but I am not equipped to provide advice or discuss this topic due to my safety guidelines. Please speak to a trusted adult. 💙";
    }
    return "Pole sana, I'm having a bit of trouble connecting right now. Let's try again in a moment! 🙏";
  }
};
export const generateMentorBriefing = async (
  studentName: string,
  activityData: string
): Promise<string> => {
  if (!API_KEY) return "AI Summary unavailable offline.";

  try {
    const prompt = `You are a Mentor's Assistant at 'Youth Educated'. 
Your job is to provide a concise, professional briefing for a human mentor about their student, ${studentName}.

DATA PROVIDED:
${activityData}

INSTRUCTIONS:
1. Summarize the student's recent status into exactly 3 bullet points.
2. Focus on: Recent Mood Trends, Key Topics discussed with AI, and Progress towards Goals.
3. Be objective, professional, and helpful.
4. Keep the entire summary under 60 words.
5. If the data is sparse, provide the best summary possible.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Mentor Briefing Error:", error);
    return "Could not generate briefing at this time. Please review recent activity manually.";
  }
};
