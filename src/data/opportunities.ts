export interface Opportunity {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: 'scholarship' | 'mentorship' | 'internship' | 'grant' | 'TVET';
  minAge: number;
  maxAge: number;
  counties: string[]; // ['All'] or specific counties
  gender: 'all' | 'female' | 'male';
  deadline: string;
  link: string;
  pointsRequired: number;
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'wings-to-fly',
    title: "Wings to Fly Scholarship",
    provider: "Equity Group Foundation",
    description: "Full secondary school scholarships for high-achieving but financially challenged students.",
    category: 'scholarship',
    minAge: 13,
    maxAge: 15,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-12-15',
    link: 'https://equitygroupfoundation.com/wings-to-fly/',
    pointsRequired: 500
  },
  {
    id: 'elimu-scholarship',
    title: "Elimu Scholarship Program",
    provider: "Ministry of Education / Equity",
    description: "Support for vulnerable learners from marginalized areas and urban slums.",
    category: 'scholarship',
    minAge: 13,
    maxAge: 15,
    counties: ['All'],
    gender: 'all',
    deadline: '2027-01-10',
    link: 'https://www.education.go.ke/',
    pointsRequired: 400
  },
  {
    id: 'akira-chix',
    title: "codeHive Program",
    provider: "AkiraChix",
    description: "Fully-funded 1-year residential tech program for young women from underserved communities.",
    category: 'internship',
    minAge: 18,
    maxAge: 24,
    counties: ['All'],
    gender: 'female',
    deadline: '2026-11-30',
    link: 'https://akirachix.com/',
    pointsRequired: 1200
  },
  {
    id: 'kuccps-tvet',
    title: "TVET Government Sponsorship",
    provider: "KUCCPS",
    description: "Placement and funding for technical and vocational training in various disciplines.",
    category: 'TVET',
    minAge: 17,
    maxAge: 30,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-08-30',
    link: 'https://kuccps.net/',
    pointsRequired: 800
  },
  {
    id: 'm-pesa-foundation',
    title: "M-Pesa Foundation Academy",
    provider: "Safaricom",
    description: "A co-educational residential high school providing world-class education for gifted but poor students.",
    category: 'scholarship',
    minAge: 13,
    maxAge: 14,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-07-15',
    link: 'https://mpesafoundationacademy.ac.ke/',
    pointsRequired: 600
  },
  {
    id: 'ajira-digital',
    title: "Ajira Digital Training",
    provider: "Ministry of ICT",
    description: "Free training on digital tools and online work to enable youth to earn from home.",
    category: 'internship',
    minAge: 18,
    maxAge: 35,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-12-31',
    link: 'https://ajiradigital.go.ke/',
    pointsRequired: 300
  },
  {
    id: 'kenya-youth-employment',
    title: "KYEOP Grant",
    provider: "Government of Kenya",
    description: "Grants and business training for youth entrepreneurs starting small businesses.",
    category: 'grant',
    minAge: 18,
    maxAge: 29,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-09-15',
    link: 'https://kyeop.go.ke/',
    pointsRequired: 1500
  },
  {
    id: 'google-africa-scholarship',
    title: "Google Africa Developer Scholarship",
    provider: "Google / Pluralsight",
    description: "Get certified in Android, Web, or Cloud development for free.",
    category: 'internship',
    minAge: 18,
    maxAge: 24,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-05-20',
    link: 'https://developers.google.com/africa',
    pointsRequired: 2000
  },
  {
    id: 'yali-leadership',
    title: "YALI Regional Leadership",
    provider: "USAID",
    description: "Developing the next generation of African leaders through intensive training.",
    category: 'mentorship',
    minAge: 18,
    maxAge: 35,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-10-10',
    link: 'https://www.yalieastafrica.org/',
    pointsRequired: 1800
  },
  {
    id: 'global-minimum-kenya',
    title: "Inチャレンジing Innovators",
    provider: "Global Minimum",
    description: "Support for young Kenyan inventors to build prototypes for community solutions.",
    category: 'grant',
    minAge: 14,
    maxAge: 19,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-11-15',
    link: 'https://gmin.org/',
    pointsRequired: 900
  },
  {
    id: 'ashoka-youth-venturers',
    title: "Ashoka Youth Venturers",
    provider: "Ashoka East Africa",
    description: "Global community support for young changemakers starting social enterprises.",
    category: 'mentorship',
    minAge: 12,
    maxAge: 20,
    counties: ['All'],
    gender: 'all',
    deadline: '2026-12-01',
    link: 'https://www.ashoka.org/',
    pointsRequired: 1000
  },
  {
    id: 'jielimishe-girls',
    title: "Jielimishe GEC Scholarship",
    provider: "I Choose Life - Africa",
    description: "Keeping girls in school in marginalized regions (Laikipia, Meru, Mombasa).",
    category: 'scholarship',
    minAge: 10,
    maxAge: 18,
    counties: ['Laikipia', 'Meru', 'Mombasa'],
    gender: 'female',
    deadline: '2026-08-15',
    link: 'https://ichooselife.or.ke/',
    pointsRequired: 700
  }
];
