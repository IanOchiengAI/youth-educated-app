export const MODULES = [
  {
    id: "confidence",
    title: "Confidence Building",
    difficulty: "Beginner",
    lessons: 7,
    duration: "42 min",
    competency: "Self-Efficacy",
    icon: "⚡",
    description: "Learn to believe in your abilities and take bold steps towards your future.",
    content: [
      {
        id: 1,
        title: "What is Confidence?",
        text: "Confidence is not about being perfect; it's about trusting yourself even when you make mistakes. In this lesson, we explore the roots of self-belief.",
        quote: "Confidence is a muscle. The more you use it, the stronger it gets.",
        insightPrompt: "Think of a time you felt scared but did it anyway. How did you feel after?",
        quiz: {
          question: "Which of these is a sign of healthy confidence?",
          options: [
            "Never admitting you are wrong",
            "Trying new things even if you are scared",
            "Comparing yourself to others on social media"
          ],
          correctIndex: 1
        }
      }
    ]
  },
  {
    id: "resilience",
    title: "Resilience",
    difficulty: "Beginner",
    lessons: 6,
    duration: "36 min",
    competency: "Learning to Learn",
    icon: "🌿",
    description: "Develop the strength to bounce back from challenges and keep moving forward.",
    content: [
      {
        id: 1,
        title: "Bouncing Back",
        text: "Resilience is the ability to recover quickly from difficulties. It's like a spring that gets compressed but always returns to its shape.",
        quote: "It's not how many times you fall, but how many times you get back up.",
        insightPrompt: "What is one challenge you are facing right now? How can you 'bounce back'?",
        quiz: {
          question: "What is the best way to build resilience?",
          options: [
            "Avoiding all difficult situations",
            "Learning from failures and trying again",
            "Waiting for someone else to fix your problems"
          ],
          correctIndex: 1
        }
      }
    ]
  },
  {
    id: "career",
    title: "Career Clarity",
    difficulty: "Intermediate",
    lessons: 8,
    duration: "48 min",
    competency: "Critical Thinking",
    icon: "🎯",
    description: "Discover your passions and map out a path to your dream career.",
    content: []
  },
  {
    id: "finance",
    title: "Financial Basics",
    difficulty: "Beginner",
    lessons: 5,
    duration: "30 min",
    competency: "Self-Efficacy",
    icon: "💰",
    description: "Master the fundamentals of saving, budgeting, and managing money wisely.",
    content: []
  },
  {
    id: "communication",
    title: "Communication Skills",
    difficulty: "Intermediate",
    lessons: 6,
    duration: "36 min",
    competency: "Communication & Collaboration",
    icon: "🗣️",
    description: "Learn to express yourself clearly and listen effectively to others.",
    content: []
  },
  {
    id: "sustainable-leadership",
    title: "Sustainable Leadership",
    difficulty: "Advanced",
    lessons: 10,
    duration: "60 min",
    competency: "Global Citizenship",
    icon: "🌍",
    description: "Master the core principles of community building and sustainable global impact.",
    content: []
  }
];

export const COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans-Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

export const GOAL_OPTIONS = [
  { title: "Start a Business", icon: "🚀" },
  { title: "Get into University", icon: "🎓" },
  { title: "Support My Family", icon: "🏠" },
  { title: "Develop Confidence", icon: "💪" },
  { title: "Find My Career Path", icon: "🧭" },
  { title: "Learn to Lead", icon: "👑" },
  { title: "Improve Communication", icon: "🗣️" },
  { title: "Build Resilience", icon: "🌿" },
  { title: "Manage Money", icon: "💰" },
  { title: "Give Back to Community", icon: "🤝" },
  { title: "Develop Digital Skills", icon: "💻" },
  { title: "Find a Mentor", icon: "👨‍🏫" }
];

export const CHAT_TREE = [
  { prompt: "How do I start a business?", response: "Starting a business begins with identifying a problem you can solve for your community. Have you noticed any needs in your area?" },
  { prompt: "I feel discouraged.", response: "It's okay to feel that way. Resilience is about acknowledging the feeling and then finding one small step forward. What's one thing you're grateful for today?" },
  { prompt: "How can I save money?", response: "The best way to save is to start small. Even 10 shillings a day adds up! Do you have a specific goal you're saving for?" },
];
