import type { Module } from './modules';

export const PREMIUM_MODULE_IDS = [
  "finance",
  "career",
  "srh",
  "healthy-choices",
  "adulting-101"
];

export const PREMIUM_MODULE_METADATA: Module[] = [
  {
    "id": "finance",
    "title": "Financial Basics",
    "description": "Master the fundamentals of saving, budgeting, and managing money wisely.",
    "icon": "💰",
    "min_age": 10,
    "is_sensitive": false,
    "brothers_keepers_variant": false,
    "isPremium": true,
    "lessons": 5,
    "duration": "30 min",
    "competency": "Self-Efficacy",
    "difficulty": "Beginner",
    "content": []
  },
  {
    "id": "career",
    "title": "Career Clarity",
    "description": "Discover your passions and map out a path to your dream career.",
    "icon": "🎯",
    "min_age": 10,
    "is_sensitive": false,
    "brothers_keepers_variant": false,
    "isPremium": true,
    "lessons": 8,
    "duration": "48 min",
    "competency": "Critical Thinking",
    "difficulty": "Intermediate",
    "content": []
  },
  {
    "id": "srh",
    "title": "Sexual & Reproductive Health",
    "description": "Understand your body, your rights, and how to make informed decisions about your health.",
    "icon": "🩺",
    "min_age": 15,
    "is_sensitive": true,
    "brothers_keepers_variant": false,
    "isPremium": true,
    "lessons": 6,
    "duration": "36 min",
    "competency": "Critical Thinking",
    "difficulty": "Intermediate",
    "content": []
  },
  {
    "id": "healthy-choices",
    "title": "Healthy Choices",
    "description": "Learn to make informed decisions about substances and peer pressure.",
    "icon": "🛡️",
    "min_age": 13,
    "is_sensitive": true,
    "brothers_keepers_variant": false,
    "isPremium": true,
    "lessons": 5,
    "duration": "30 min",
    "competency": "Critical Thinking",
    "difficulty": "Intermediate",
    "content": []
  },
  {
    "id": "adulting-101",
    "title": "Adulting 101: The Real World",
    "description": "Everything they didn't teach you in school about surviving and thriving after KCSE.",
    "icon": "🌍",
    "min_age": 18,
    "is_sensitive": false,
    "brothers_keepers_variant": false,
    "isPremium": true,
    "lessons": 3,
    "duration": "45 min",
    "competency": "Life Skills",
    "difficulty": "Intermediate",
    "content": []
  }
];
