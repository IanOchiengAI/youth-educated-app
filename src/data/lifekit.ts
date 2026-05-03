// ─────────────────────────────────────────────────────────────
// YE+ Life Kit — Month 1 Content Library
// Short-form guides and mentor stories for Kenyan youth (10–22)
// ─────────────────────────────────────────────────────────────

export interface LifeKitArticle {
  id: string
  title: string
  category: string
  tags: string[]
  emoji: string
  readTime: string
  month?: number
}

export interface LifeKitCategory {
  id: string
  label: string
  shortLabel: string
  emoji: string
}

// ── Categories ───────────────────────────────────────────────

export const LIFEKIT_CATEGORIES: LifeKitCategory[] = [
  { id: 'all', label: 'All', shortLabel: 'All', emoji: '✨' },
  { id: 'mentor-stories', label: 'Been There, Learnt That', shortLabel: 'Mentor Stories', emoji: '🏆' },
  { id: 'school', label: 'School & Learning', shortLabel: 'School', emoji: '📚' },
  { id: 'mental-health', label: 'Mental Health & Emotions', shortLabel: 'Mental Health', emoji: '💙' },
  { id: 'relationships', label: 'Relationships & Social Life', shortLabel: 'Relationships', emoji: '🤝' },
  { id: 'safety', label: 'Safety & Life Skills', shortLabel: 'Safety', emoji: '🛡️' },
  { id: 'future', label: 'Future & Career', shortLabel: 'Future', emoji: '🚀' },
  { id: 'money', label: 'Money Basics', shortLabel: 'Money', emoji: '💰' },
]

// ── Tags ─────────────────────────────────────────────────────

export const LIFEKIT_TAGS: string[] = [
  'Exams',
  'Friendship',
  'Stress',
  'Confidence',
  'Money',
  'Career',
  'MentalHealth',
  'School',
  'Safety',
  'Future',
  'Decisions',
  'Technology',
]

// ── Articles — Month 1 ──────────────────────────────────────

export const LIFEKIT_ARTICLES: LifeKitArticle[] = [
  // ▸ Mentor Stories
  {
    id: 'ms-1',
    title: 'I wish I took school more seriously. Here is why',
    category: 'mentor-stories',
    tags: ['School', 'Confidence'],
    emoji: '📖',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'ms-2',
    title: 'What no one tells you about choosing a career',
    category: 'mentor-stories',
    tags: ['Career', 'Future'],
    emoji: '🗺️',
    readTime: '4 min',
    month: 1,
  },
  {
    id: 'ms-3',
    title: 'How I dealt with failing and what it taught me',
    category: 'mentor-stories',
    tags: ['Confidence', 'Stress'],
    emoji: '💪',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'ms-4',
    title: 'Confidence is not natural. Here is how I built mine',
    category: 'mentor-stories',
    tags: ['Confidence'],
    emoji: '⭐',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'ms-5',
    title: 'The friends you keep will shape your life',
    category: 'mentor-stories',
    tags: ['Friendship', 'Decisions'],
    emoji: '🤝',
    readTime: '4 min',
    month: 1,
  },

  // ▸ School & Learning
  {
    id: 'sl-1',
    title: 'Struggling with grades? Start with this 3-step reset',
    category: 'school',
    tags: ['School', 'Exams', 'Stress'],
    emoji: '📝',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'sl-2',
    title: 'How to study when you do not feel like it',
    category: 'school',
    tags: ['School', 'Exams'],
    emoji: '📚',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'sl-3',
    title: 'Last-minute revision that actually works',
    category: 'school',
    tags: ['Exams', 'School'],
    emoji: '⏰',
    readTime: '2 min',
    month: 1,
  },
  {
    id: 'sl-4',
    title: 'How to ask your teacher for help without feeling awkward',
    category: 'school',
    tags: ['School', 'Confidence'],
    emoji: '🙋',
    readTime: '2 min',
    month: 1,
  },

  // ▸ Mental Health & Emotions
  {
    id: 'mh-1',
    title: 'Feeling overwhelmed? Try this 5-minute reset',
    category: 'mental-health',
    tags: ['Stress', 'MentalHealth'],
    emoji: '🧘',
    readTime: '2 min',
    month: 1,
  },
  {
    id: 'mh-2',
    title: 'How to deal with pressure from school and home',
    category: 'mental-health',
    tags: ['Stress', 'MentalHealth', 'School'],
    emoji: '💙',
    readTime: '4 min',
    month: 1,
  },
  {
    id: 'mh-3',
    title: 'What to do when you feel like you are not good enough',
    category: 'mental-health',
    tags: ['Confidence', 'MentalHealth'],
    emoji: '❤️',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'mh-4',
    title: 'Overthinking at night? Here is how to stop',
    category: 'mental-health',
    tags: ['Stress', 'MentalHealth'],
    emoji: '🌙',
    readTime: '3 min',
    month: 1,
  },

  // ▸ Relationships & Social Life
  {
    id: 'rs-1',
    title: 'Getting bullied? Here is what to do and what not to do',
    category: 'relationships',
    tags: ['Safety', 'Friendship', 'Confidence'],
    emoji: '🛡️',
    readTime: '4 min',
    month: 1,
  },
  {
    id: 'rs-2',
    title: 'Friend drama? How to handle it without making things worse',
    category: 'relationships',
    tags: ['Friendship', 'Decisions'],
    emoji: '💬',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'rs-3',
    title: 'How to say no without losing your friends',
    category: 'relationships',
    tags: ['Friendship', 'Confidence'],
    emoji: '✋',
    readTime: '2 min',
    month: 1,
  },
  {
    id: 'rs-4',
    title: 'Crushes and distractions. How to stay focused',
    category: 'relationships',
    tags: ['School', 'Decisions'],
    emoji: '😊',
    readTime: '3 min',
    month: 1,
  },

  // ▸ Safety & Life Skills
  {
    id: 'sa-1',
    title: 'Online safety. 5 things you should never share',
    category: 'safety',
    tags: ['Safety', 'Technology'],
    emoji: '🔒',
    readTime: '2 min',
    month: 1,
  },
  {
    id: 'sa-2',
    title: 'Peer pressure. How to stand your ground',
    category: 'safety',
    tags: ['Safety', 'Confidence', 'Decisions'],
    emoji: '💪',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'sa-3',
    title: 'What to do if you are in trouble and who to talk to',
    category: 'safety',
    tags: ['Safety', 'MentalHealth'],
    emoji: '🆘',
    readTime: '3 min',
    month: 1,
  },

  // ▸ Future & Career
  {
    id: 'fc-1',
    title: 'Do not know what you want to be? Start here',
    category: 'future',
    tags: ['Career', 'Future'],
    emoji: '🌟',
    readTime: '4 min',
    month: 1,
  },
  {
    id: 'fc-2',
    title: 'How to discover what you are good at',
    category: 'future',
    tags: ['Career', 'Confidence'],
    emoji: '🔍',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'fc-3',
    title: 'Skills that matter more than grades, yes really',
    category: 'future',
    tags: ['Career', 'School', 'Future'],
    emoji: '🚀',
    readTime: '3 min',
    month: 1,
  },

  // ▸ Money Basics
  {
    id: 'mb-1',
    title: 'Got pocket money? Here is how to manage it',
    category: 'money',
    tags: ['Money'],
    emoji: '💰',
    readTime: '2 min',
    month: 1,
  },
  {
    id: 'mb-2',
    title: 'Saving vs spending. How to balance both',
    category: 'money',
    tags: ['Money', 'Decisions'],
    emoji: '⚖️',
    readTime: '3 min',
    month: 1,
  },
  {
    id: 'mb-3',
    title: 'Small ways to make money as a student',
    category: 'money',
    tags: ['Money', 'Career'],
    emoji: '💡',
    readTime: '3 min',
    month: 1,
  },
  // ▸ Additional — reaching 28 articles
  {
    id: 'sa-4',
    title: 'What to do if you feel unsafe walking home',
    category: 'safety',
    tags: ['Safety', 'Confidence'],
    emoji: '🚶',
    readTime: '2 min',
    month: 1,
  },
  {
    id: 'mh-5',
    title: 'Why it is okay to cry — even for boys',
    category: 'mental-health',
    tags: ['MentalHealth', 'Confidence'],
    emoji: '💧',
    readTime: '3 min',
    month: 1,
  },
]
