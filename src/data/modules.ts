export interface LessonSection {
  type: 'text' | 'pullquote' | 'insight_prompt' | 'quiz';
  content?: string;
  prompt?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  sections: LessonSection[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  min_age: number;
  is_sensitive: boolean;
  brothers_keepers_variant: boolean;
  lessons: number;
  duration: string;
  competency: string;
  difficulty: string;
  content: Lesson[];
  isPremium?: boolean;
}

import { FREE_MODULES } from './freeModules';
import { PREMIUM_MODULE_METADATA } from './moduleMetadata';

export { FREE_MODULES } from './freeModules';
export { PREMIUM_MODULE_IDS, PREMIUM_MODULE_METADATA } from './moduleMetadata';

export const MODULES: Module[] = [
  ...FREE_MODULES,
  ...PREMIUM_MODULE_METADATA,
];

export const COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans-Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi"
];

export const GOAL_OPTIONS = [
  "Build confidence",
  "Improve grades",
  "Find my career path",
  "Manage stress",
  "Understand my rights",
  "Build healthy habits",
  "Make better decisions",
  "Understand relationships",
  "Learn about money",
  "Improve communication",
  "Find a mentor",
  "Support my mental health"
];
