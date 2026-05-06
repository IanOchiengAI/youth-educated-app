export interface FallbackMentor {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  county: string;
  icon: string;
  avatarUrl?: string;
}

export const FALLBACK_MENTORS: FallbackMentor[] = [
  { id: 'fm-1', name: 'Amina Odhiambo', expertise: ['Technology', 'Entrepreneurship'], bio: 'Software engineer helping youth break into tech.', county: 'Nairobi', icon: '👩‍💻', avatarUrl: 'https://i.ibb.co/d4x0WC9y/mentor-amina-odhiambo.png' },
  { id: 'fm-2', name: 'Brian Kamau', expertise: ['Finance', 'Business'], bio: 'Accountant and business mentor for young entrepreneurs.', county: 'Kiambu', icon: '📊', avatarUrl: 'https://i.ibb.co/40H1LGk/mentor-brian-kamau.png' },
  { id: 'fm-3', name: 'Dr. Fatuma Ali', expertise: ['Health', 'Education'], bio: 'Public health practitioner and youth advocate.', county: 'Mombasa', icon: '🏥', avatarUrl: 'https://i.ibb.co/CFYm97X/mentor-fatuma-ali.png' },
  { id: 'fm-4', name: 'James Otieno', expertise: ['Law', 'Human Rights'], bio: 'Advocate helping young people understand their rights.', county: 'Kisumu', icon: '⚖️', avatarUrl: 'https://i.ibb.co/hxBRQ80j/mentor-james-otieno.png' },
  { id: 'fm-5', name: 'Grace Njeri', expertise: ['Creative Arts', 'Media'], bio: 'Graphic designer and media trainer.', county: 'Nairobi', icon: '🎨', avatarUrl: 'https://i.ibb.co/rRbhRkJ6/mentor-grace-njeri.png' },
  { id: 'fm-6', name: 'Peter Mwangi', expertise: ['Entrepreneurship', 'Business'], bio: 'Serial entrepreneur helping youth build businesses.', county: 'Nakuru', icon: '🚀', avatarUrl: 'https://i.ibb.co/mVD3fk0z/mentor-peter-mwangi.png' },
];
