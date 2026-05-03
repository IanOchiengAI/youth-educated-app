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
    maxOutputTokens: 600,
    temperature: 0.8,
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
  if (!user) return "You are Amara, a supportive life-skills companion for Kenyan youth.";

  const { name, ageBracket, county, language, goals } = user;
  const isKsw = language === 'Kiswahili';

  let modeInstructions = '';

  if (mode === 'roleplay' && scenario) {
    modeInstructions = `
ACTION MODE: ROLEPLAY
You are NO LONGER Amara. You are playing the character: ${scenario.persona}.
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
You are Amara, a wise and warm AI mentor built for African youth.
Your name means "grace" in many African languages.
You are female — a trusted older sister, auntie, or community mother figure.

Your personality:
- You speak like a trusted older sister or community elder, not a corporate chatbot.
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

  return `You are Amara, a supportive and wise life-skills companion for a ${ageBracket} year old in ${county}, Kenya. 
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
    return fallback ? fallback.response : "Mambo! I'm in offline mode right now, but I'm still here for you. What's on your mind? 😊";
  }

  try {
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: buildJabariPrompt(user, mode, scenario) }] },
        { 
          role: 'model', 
          parts: [{ 
            text: mode === 'default' 
              ? "Safi! I am Amara. How can I support you today?" 
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

export const generateCheckinSummary = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string | null> => {
  if (!API_KEY || history.length < 3) return null;

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(
      "Based on our conversation, give a 1-sentence summary, list which goals came up, and rate the mood as positive, neutral, or concerning. Format exactly as: SUMMARY: ... | GOALS: ... | MOOD: ..."
    );
    return result.response.text();
  } catch {
    return null;
  }
};
