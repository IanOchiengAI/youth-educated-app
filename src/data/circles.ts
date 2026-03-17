export interface CirclePrompt {
  id: string;
  question: string;
  category: 'daily' | 'brothers-keeper' | 'wellbeing';
  minAge?: number;
  gender?: 'male' | 'female' | 'all';
}

export const CIRCLE_PROMPTS: CirclePrompt[] = [
  {
    id: 'daily-1',
    question: "If you could change one thing in your community today, what would it be?",
    category: 'daily',
    gender: 'all'
  },
  {
    id: 'daily-2',
    question: "What is a 'hidden talent' you have that most people don't know about?",
    category: 'daily',
    gender: 'all'
  },
  {
    id: 'bk-1',
    question: "How do you handle pressure from friends to do things you're not comfortable with?",
    category: 'brothers-keeper',
    gender: 'male',
    minAge: 13
  },
  {
    id: 'bk-2',
    question: "What does being a 'positive role model' mean to you in your neighborhood?",
    category: 'brothers-keeper',
    gender: 'male',
    minAge: 13
  },
  {
    id: 'wellbeing-1',
    question: "When you're feeling stressed, what's your go-to way to relax?",
    category: 'wellbeing',
    gender: 'all'
  },
  {
    id: 'wellbeing-2',
    question: "Who is the person you trust most when you need to talk about a problem?",
    category: 'wellbeing',
    gender: 'all'
  }
];

export interface CircleMember {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
}

export const CIRCLE_MEMBERS: CircleMember[] = [
  { id: '1', name: 'Juma', avatar: '🦁', lastActive: '2m ago' },
  { id: '2', name: 'Zainab', avatar: '🦒', lastActive: '15m ago' },
  { id: '3', name: 'Mwangi', avatar: '🐘', lastActive: '1h ago' },
  { id: '4', name: 'Kendi', avatar: '🦓', lastActive: 'Active' },
  { id: '5', name: 'Otieno', avatar: '🐆', lastActive: '3h ago' },
];
