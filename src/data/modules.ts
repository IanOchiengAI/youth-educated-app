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
}

export const MODULES: Module[] = [
  {
    id: 'confidence',
    title: 'Confidence Building',
    description: 'Learn to believe in your abilities and take bold steps towards your future.',
    icon: '⚡',
    min_age: 10,
    is_sensitive: false,
    brothers_keepers_variant: false,
    lessons: 7,
    duration: '42 min',
    competency: 'Self-Efficacy',
    difficulty: 'Beginner',
    content: [
      {
        id: 1,
        title: 'What is Confidence?',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Confidence is not about being perfect — it\'s about trusting yourself even when you make mistakes. Think about a matatu conductor who calls out stops confidently even in heavy traffic. That confidence comes from doing it over and over, not from knowing everything.\n\nIn Kenya, many young people feel pressure to have all the answers. But real confidence means being okay with not knowing and still stepping forward. It\'s the voice inside that says "I can figure this out."' },
          { type: 'pullquote', content: 'Confidence is a muscle. The more you use it, the stronger it gets.' },
          { type: 'insight_prompt', prompt: 'Think of a time you felt scared but did it anyway. How did you feel after?' },
          { type: 'quiz', question: 'Which of these is a sign of healthy confidence?', options: ['Never admitting you are wrong', 'Trying new things even if you are scared', 'Comparing yourself to others on social media'], correctIndex: 1 },
        ],
      },
      {
        id: 2,
        title: 'Building Your Confidence Daily',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Confidence grows through small daily actions. Every time you speak up in class, help a friend, or try something new, you\'re building the muscle.\n\nStart with something small today: greet someone new, answer a question in class even if you\'re not 100% sure, or share your opinion with a friend. Each small step adds up.\n\nRemember Wangari Maathai — she started by planting one tree. That one act of courage changed the whole of Kenya and inspired millions around the world.' },
          { type: 'pullquote', content: 'You cannot plant a tree and expect it to grow tall overnight. The same is true for confidence.' },
          { type: 'insight_prompt', prompt: 'What is one small thing you can do today to step outside your comfort zone?' },
          { type: 'quiz', question: 'What is the best way to build daily confidence?', options: ['Wait until you feel ready', 'Take small consistent actions every day', 'Only do things you are already good at'], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: 'resilience',
    title: 'Resilience',
    description: 'Develop the strength to bounce back from challenges and keep moving forward.',
    icon: '🌿',
    min_age: 10,
    is_sensitive: false,
    brothers_keepers_variant: false,
    lessons: 6,
    duration: '36 min',
    competency: 'Learning to Learn',
    difficulty: 'Beginner',
    content: [
      {
        id: 1,
        title: 'Bouncing Back',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Resilience is the ability to recover quickly from difficulties. Think of it like a spring — it gets compressed, but it always returns to its shape.\n\nIn Kenya, many young people face tough situations: family challenges, exam pressure, financial difficulties. Resilience doesn\'t mean these things don\'t affect you. It means you find a way through them.\n\nEliud Kipchoge failed many races before becoming a world champion. Each failure taught him something new. That\'s resilience — learning from the fall, not avoiding it.' },
          { type: 'pullquote', content: 'It\'s not how many times you fall, but how many times you get back up.' },
          { type: 'insight_prompt', prompt: 'What is one challenge you are facing right now? How can you "bounce back"?' },
          { type: 'quiz', question: 'What is the best way to build resilience?', options: ['Avoiding all difficult situations', 'Learning from failures and trying again', 'Waiting for someone else to fix your problems'], correctIndex: 1 },
        ],
      },
      {
        id: 2,
        title: 'The Growth Mindset',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'A growth mindset means believing you can improve through effort and practice. When you say "I can\'t do math," try adding "yet" — "I can\'t do math yet."\n\nPeople with a growth mindset see challenges as opportunities. A bad grade isn\'t the end — it\'s feedback telling you what to work on next.\n\nIn many Kenyan communities, we have a saying: "Haraka haraka haina baraka" — hurry hurry has no blessing. Growth takes time, and that\'s perfectly fine.' },
          { type: 'pullquote', content: 'The word "yet" is the most powerful word in the English language. Add it to any limitation.' },
          { type: 'insight_prompt', prompt: 'What is something you believe you "can\'t" do? Try adding "yet" and write how that feels different.' },
          { type: 'quiz', question: 'Someone with a growth mindset would say:', options: ['"I\'m just not smart enough"', '"This is hard, but I can learn if I keep trying"', '"Some people are just naturally talented"'], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Skills',
    description: 'Learn to express yourself clearly and listen effectively to others.',
    icon: '🗣️',
    min_age: 10,
    is_sensitive: false,
    brothers_keepers_variant: false,
    lessons: 6,
    duration: '36 min',
    competency: 'Communication & Collaboration',
    difficulty: 'Intermediate',
    content: [
      {
        id: 1,
        title: 'The Power of Listening',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Most people think communication is about speaking well. But the best communicators are actually the best listeners.\n\nActive listening means giving your full attention when someone is speaking — not planning what you\'ll say next, not checking your phone, but truly hearing them.\n\nIn Kenyan culture, elders teach us "Sikia kwanza, sema baadaye" — listen first, speak later. This wisdom applies in friendships, school, and future careers.' },
          { type: 'pullquote', content: 'You have two ears and one mouth. Use them in that proportion.' },
          { type: 'insight_prompt', prompt: 'Think of someone who makes you feel truly heard. What do they do differently?' },
          { type: 'quiz', question: 'What is active listening?', options: ['Waiting for your turn to speak', 'Giving your full attention and understanding the speaker', 'Agreeing with everything the other person says'], correctIndex: 1 },
        ],
      },
      {
        id: 2,
        title: 'Expressing Yourself Clearly',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Clear communication is about saying what you mean in a way others can understand. This doesn\'t mean using big words — it means being honest and direct.\n\nThe "I feel... when... because..." framework is powerful:\n• I feel frustrated when my ideas are ignored because I have good contributions.\n• I feel happy when people ask my opinion because it shows respect.\n\nPractice this with a friend or family member today.' },
          { type: 'pullquote', content: 'Clarity is kindness. When you say what you mean, you help everyone around you.' },
          { type: 'insight_prompt', prompt: 'Write an "I feel... when... because..." statement about something in your life right now.' },
          { type: 'quiz', question: 'Which is the clearest way to express a feeling?', options: ['"You always ignore me!"', '"I feel frustrated when my ideas aren\'t heard because I want to contribute"', '"Whatever, it doesn\'t matter"'], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: 'finance',
    title: 'Financial Basics',
    description: 'Master the fundamentals of saving, budgeting, and managing money wisely.',
    icon: '💰',
    min_age: 10,
    is_sensitive: false,
    brothers_keepers_variant: false,
    lessons: 5,
    duration: '30 min',
    competency: 'Self-Efficacy',
    difficulty: 'Beginner',
    content: [
      {
        id: 1,
        title: 'Why Saving Matters',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Saving money isn\'t about being stingy — it\'s about being prepared. Even saving Ksh 10 a day adds up to Ksh 3,650 in a year. That could pay for school supplies, a new phone, or even start a small business.\n\nM-Pesa makes saving easier than ever. Many Kenyans are now using M-Shwari and KCB M-Pesa to save small amounts regularly.\n\nThe secret isn\'t saving a lot — it\'s saving consistently. Start with whatever you can, even if it feels small.' },
          { type: 'pullquote', content: 'Kidogo kidogo hujaza kibaba — little by little fills the measure.' },
          { type: 'insight_prompt', prompt: 'If you saved Ksh 20 every day for one year, what would you use that money for?' },
          { type: 'quiz', question: 'What is the best saving strategy?', options: ['Save only when you have a lot of money', 'Save a small amount consistently every day', 'Keep all your money in cash at home'], correctIndex: 1 },
        ],
      },
      {
        id: 2,
        title: 'Making a Simple Budget',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'A budget is a plan for your money. It helps you know where every shilling goes.\n\nTry the 50-30-20 rule:\n• 50% for needs (food, transport, school)\n• 30% for wants (entertainment, snacks, clothes)\n• 20% for savings and future goals\n\nEven if your income is small — pocket money, a side hustle, or chama contributions — a budget gives you control. Write down everything you spend for one week and see where your money really goes.' },
          { type: 'pullquote', content: 'A budget is not about restricting yourself — it\'s about giving yourself permission to spend wisely.' },
          { type: 'insight_prompt', prompt: 'Track everything you spend for the next 3 days. What surprised you about your spending?' },
          { type: 'quiz', question: 'In the 50-30-20 rule, what percentage should go to savings?', options: ['50%', '30%', '20%'], correctIndex: 2 },
        ],
      },
    ],
  },
  {
    id: 'career',
    title: 'Career Clarity',
    description: 'Discover your passions and map out a path to your dream career.',
    icon: '🎯',
    min_age: 10,
    is_sensitive: false,
    brothers_keepers_variant: false,
    lessons: 8,
    duration: '48 min',
    competency: 'Critical Thinking',
    difficulty: 'Intermediate',
    content: [
      {
        id: 1,
        title: 'Discovering What You Love',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Career clarity starts with knowing yourself. What activities make you lose track of time? When do you feel most alive?\n\nIn Kenya\'s CBC system, students can follow four pathways: STEM, Arts & Sports, Social Sciences, or TVET. There\'s no "best" pathway — only the one that fits YOU.\n\nDon\'t let anyone tell you that only medicine, law, or engineering are "good careers." Kenya needs plumbers, designers, farmers, content creators, and so much more.' },
          { type: 'pullquote', content: 'The best career is not the one that pays the most — it\'s the one that lets you be the most YOU.' },
          { type: 'insight_prompt', prompt: 'List 3 activities that make you lose track of time. What do they have in common?' },
          { type: 'quiz', question: 'How many senior school pathways exist in the CBC system?', options: ['2', '3', '4'], correctIndex: 2 },
        ],
      },
      {
        id: 2,
        title: 'Exploring Kenyan Careers',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Kenya\'s economy is growing fast, creating new opportunities every day. Here are some fast-growing sectors:\n\n• Technology: Software development, data science, cybersecurity\n• Agriculture: Agritech, organic farming, food processing\n• Creative: Content creation, graphic design, music production\n• Healthcare: Nursing, pharmacy, community health\n• TVET: Electrical engineering, automotive repair, welding\n\nMany of these careers don\'t require a university degree. TVET institutions and online courses can get you started.' },
          { type: 'pullquote', content: 'The future belongs to those who prepare for it today.' },
          { type: 'insight_prompt', prompt: 'Which career sector interests you most? Why?' },
          { type: 'quiz', question: 'Which statement about TVET careers is true?', options: ['They are less important than university careers', 'They offer practical skills for high-demand jobs', 'They are only for students who fail exams'], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: 'relationships',
    title: 'Healthy Relationships',
    description: 'Build meaningful connections based on respect, trust, and communication.',
    icon: '💛',
    min_age: 10,
    is_sensitive: false,
    brothers_keepers_variant: true,
    lessons: 6,
    duration: '36 min',
    competency: 'Communication & Collaboration',
    difficulty: 'Intermediate',
    content: [
      {
        id: 1,
        title: 'What Makes a Healthy Relationship?',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Healthy relationships — whether friendships, family bonds, or romantic relationships — are built on three things: respect, trust, and communication.\n\nRespect means valuing someone\'s feelings, boundaries, and choices — even when you disagree. Trust is built through consistency — doing what you say you\'ll do. And communication means being honest and listening.\n\nUnhealthy relationships often involve control, put-downs, or pressure. If someone makes you feel small, pressured, or unsafe, that\'s not love — that\'s a red flag.' },
          { type: 'pullquote', content: 'A relationship should make you feel safe enough to be yourself, not scared of being yourself.' },
          { type: 'insight_prompt', prompt: 'Think of your closest friendship. What makes it healthy? What could be better?' },
          { type: 'quiz', question: 'Which is a sign of a healthy relationship?', options: ['One person makes all the decisions', 'Both people feel respected and heard', 'You change who you are to make them happy'], correctIndex: 1 },
        ],
      },
      {
        id: 2,
        title: 'Setting Boundaries',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Boundaries are the limits you set to protect your wellbeing. They\'re not selfish — they\'re necessary.\n\n"No" is a complete sentence. You don\'t have to explain why you don\'t want to do something. Healthy people respect boundaries.\n\nExamples of healthy boundaries:\n• "I\'m not comfortable with that"\n• "I need some time alone right now"\n• "Please don\'t go through my phone"\n• "I\'m not ready for that"' },
          { type: 'pullquote', content: 'Setting boundaries is not about building walls — it\'s about building doors that only open with your permission.' },
          { type: 'insight_prompt', prompt: 'What is one boundary you wish you could set? What stops you from setting it?' },
          { type: 'quiz', question: 'What should you do when someone doesn\'t respect your boundary?', options: ['Give in to keep the peace', 'Restate your boundary clearly and firmly', 'Get angry and shout at them'], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: 'srh',
    title: 'Sexual & Reproductive Health',
    description: 'Understand your body, your rights, and how to make informed decisions about your health.',
    icon: '🩺',
    min_age: 15,
    is_sensitive: true,
    brothers_keepers_variant: false,
    lessons: 6,
    duration: '36 min',
    competency: 'Critical Thinking',
    difficulty: 'Intermediate',
    content: [
      {
        id: 1,
        title: 'Understanding Your Body',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Your body goes through many changes during adolescence. These changes are completely normal and happen to everyone — though at different rates.\n\nUnderstanding how your body works helps you make informed decisions about your health. This includes knowing about puberty, hygiene, and how to take care of yourself.\n\nIt\'s okay to have questions. In fact, it\'s important. The more you understand, the better choices you can make for your own wellbeing.' },
          { type: 'pullquote', content: 'Knowledge about your own body is not something to be embarrassed about — it\'s something to be empowered by.' },
          { type: 'insight_prompt', prompt: 'What is one question about your health or body that you wish you could ask without feeling embarrassed?' },
          { type: 'quiz', question: 'Why is it important to understand your body during adolescence?', options: ['It\'s not important', 'It helps you make informed decisions about your health', 'Only adults need to know about their bodies'], correctIndex: 1 },
        ],
      },
      {
        id: 2,
        title: 'Your Rights and Consent',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'You have the right to say no. You have the right to change your mind. You have the right to feel safe.\n\nConsent means freely agreeing to something without pressure, force, or manipulation. Consent must be:\n• Given freely (not forced)\n• Informed (you understand what you\'re agreeing to)\n• Reversible (you can change your mind at any time)\n• Enthusiastic (you actually want to)\n\nIf someone pressures you, that is NOT consent. You can always reach out to a trusted adult or Childline Kenya at 116.' },
          { type: 'pullquote', content: 'Your body, your rules. No one has the right to pressure you into anything.' },
          { type: 'insight_prompt', prompt: 'In your own words, what does consent mean to you?' },
          { type: 'quiz', question: 'What is TRUE about consent?', options: ['Once given, it can never be taken back', 'It must be given freely and can be changed at any time', 'Silence means consent'], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    id: 'healthy-choices',
    title: 'Healthy Choices',
    description: 'Learn to make informed decisions about substances and peer pressure.',
    icon: '🛡️',
    min_age: 13,
    is_sensitive: true,
    brothers_keepers_variant: false,
    lessons: 5,
    duration: '30 min',
    competency: 'Critical Thinking',
    difficulty: 'Intermediate',
    content: [
      {
        id: 1,
        title: 'Understanding Peer Pressure',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Peer pressure is the influence your friends and classmates have on your decisions. It can be positive (encouraging you to study) or negative (pushing you to do things you\'re not comfortable with).\n\nIn Kenya, peer pressure often involves alcohol (changaa, beer), smoking (cigarettes, shisha), or drug use (miraa, bhang). It can feel impossible to say no when everyone around you is doing it.\n\nBut here\'s the truth: most people overestimate how many of their peers are actually doing these things. Studies show the majority of Kenyan youth are making healthy choices.' },
          { type: 'pullquote', content: 'The strongest people are not those who never face pressure — they\'re the ones who face it and still choose what\'s right.' },
          { type: 'insight_prompt', prompt: 'Have you ever felt pressured to do something you didn\'t want to? How did you handle it?' },
          { type: 'quiz', question: 'What is the best way to handle peer pressure?', options: ['Give in so people like you', 'Have a prepared response and stick to your values', 'Avoid all friendships'], correctIndex: 1 },
        ],
      },
      {
        id: 2,
        title: 'Making Informed Decisions',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Making healthy choices isn\'t about being "boring" — it\'s about being in control of your own life.\n\nThe STOP method helps with tough decisions:\n• S - Stop and pause before acting\n• T - Think about the consequences\n• O - Options — what are your choices?\n• P - Pick the best option and act on it\n\nEvery decision you make today shapes your tomorrow. You don\'t have to be perfect, but you do have the power to choose wisely.' },
          { type: 'pullquote', content: 'Between stimulus and response, there is a space. In that space lies your freedom to choose.' },
          { type: 'insight_prompt', prompt: 'Think of a recent decision you made. If you used the STOP method, would you have decided differently?' },
          { type: 'quiz', question: 'What does the "T" in STOP stand for?', options: ['Talk to a friend', 'Think about the consequences', 'Try everything once'], correctIndex: 1 },
        ],
      },
    ],
  },
];

export const COUNTIES = [
  'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa', 'Wajir',
  'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos',
  'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', "Murang'a", 'Kiambu', 'Turkana', 'West Pokot',
  'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia',
  'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia',
  'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi',
];

export const GOAL_OPTIONS = [
  'Build confidence',
  'Improve grades',
  'Find my career path',
  'Manage stress',
  'Understand my rights',
  'Build healthy habits',
  'Make better decisions',
  'Understand relationships',
  'Learn about money',
  'Improve communication',
  'Find a mentor',
  'Support my mental health',
];
