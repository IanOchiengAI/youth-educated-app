export interface FallbackMentor {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  county: string;
  icon: string;
}

export const FALLBACK_MENTORS: FallbackMentor[] = [
  { id: 'fm-1', name: 'Amina Odhiambo', expertise: ['Technology', 'Entrepreneurship'], bio: 'Software engineer helping youth break into tech.', county: 'Nairobi', icon: '👩‍💻' },
  { id: 'fm-2', name: 'Brian Kamau', expertise: ['Finance', 'Business'], bio: 'Accountant and business mentor for young entrepreneurs.', county: 'Kiambu', icon: '📊' },
  { id: 'fm-3', name: 'Dr. Fatuma Ali', expertise: ['Health', 'Education'], bio: 'Public health practitioner and youth advocate.', county: 'Mombasa', icon: '🏥' },
  { id: 'fm-4', name: 'James Otieno', expertise: ['Law', 'Human Rights'], bio: 'Advocate helping young people understand their rights.', county: 'Kisumu', icon: '⚖️' },
  { id: 'fm-5', name: 'Grace Njeri', expertise: ['Creative Arts', 'Media'], bio: 'Graphic designer and media trainer.', county: 'Nairobi', icon: '🎨' },
  { id: 'fm-6', name: 'Peter Mwangi', expertise: ['Entrepreneurship', 'Business'], bio: 'Serial entrepreneur helping youth build businesses.', county: 'Nakuru', icon: '🚀' },
];
