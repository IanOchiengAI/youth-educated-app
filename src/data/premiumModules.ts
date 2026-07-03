import type { Module } from './modules';

export const PREMIUM_MODULES: Module[] = [
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
    "content": [
      {
        "id": 1,
        "title": "Why Saving Matters",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Saving money isn't about being stingy — it's about being prepared. Even saving Ksh 10 a day adds up to Ksh 3,650 in a year. That could pay for school supplies, a new phone, or even start a small business.\n\nM-Pesa makes saving easier than ever. Many Kenyans are now using M-Shwari and KCB M-Pesa to save small amounts regularly.\n\nThe secret isn't saving a lot — it's saving consistently. Start with whatever you can, even if it feels small."
          },
          {
            "type": "pullquote",
            "content": "Kidogo kidogo hujaza kibaba — little by little fills the measure."
          },
          {
            "type": "insight_prompt",
            "prompt": "If you saved Ksh 20 every day for one year, what would you use that money for?"
          },
          {
            "type": "quiz",
            "question": "What is the best saving strategy?",
            "options": [
              "Save only when you have a lot of money",
              "Save a small amount consistently every day",
              "Keep all your money in cash at home"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Making a Simple Budget",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "A budget is a plan for your money. It helps you know where every shilling goes.\n\nTry the 50-30-20 rule:\n• 50% for needs (food, transport, school)\n• 30% for wants (entertainment, snacks, clothes)\n• 20% for savings and future goals\n\nEven if your income is small — pocket money, a side hustle, or chama contributions — a budget gives you control. Write down everything you spend for one week and see where your money really goes."
          },
          {
            "type": "pullquote",
            "content": "A budget is not about restricting yourself — it's about giving yourself permission to spend wisely."
          },
          {
            "type": "insight_prompt",
            "prompt": "Track everything you spend for the next 3 days. What surprised you about your spending?"
          },
          {
            "type": "quiz",
            "question": "In the 50-30-20 rule, what percentage should go to savings?",
            "options": [
              "50%",
              "30%",
              "20%"
            ],
            "correctIndex": 2
          }
        ]
      },
      {
        "id": 3,
        "title": "Needs vs. Wants",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Before you spend money, ask yourself: Is this a need or a want? Needs are things you literally cannot survive without, or things necessary for school and work—like food, shelter, school fees, and transport fare.\n\nWants are things that make life enjoyable but aren't necessary—like the latest smartphone, expensive sneakers, or eating out every day. It's okay to spend money on wants, but only after your needs are met.\n\nA great trick is the 48-hour rule. When you see a \"want\" that you really want to buy, wait 48 hours. Usually, the urge to buy passes, and you realise you didn't really need it in the first place."
          },
          {
            "type": "pullquote",
            "content": "Don't go broke trying to look rich. Real wealth is what you save, not what you spend."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one 'want' you recently spent money on that you could have saved instead?"
          },
          {
            "type": "quiz",
            "question": "What is the 48-hour rule?",
            "options": [
              "Waiting 48 hours before buying something you want",
              "Working for 48 hours straight",
              "Ignoring your needs for 48 hours"
            ],
            "correctIndex": 0
          }
        ]
      },
      {
        "id": 4,
        "title": "Starting a Side Hustle",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "A side hustle is a small business you run alongside school or a main job. It's a great way to build extra income and learn valuable skills. In Kenya, young people are the kings and queens of the hustle.\n\nYou don't need a lot of capital to start. You can offer services like tutoring younger students, graphic design, social media management, or selling thrift clothes (mitumba). The key is to find a problem you can solve for people, and charge for it.\n\nStart small. Test your idea with a few customers before spending all your savings. Remember, every big business in Nairobi started as a small idea."
          },
          {
            "type": "pullquote",
            "content": "The best time to start thinking like an entrepreneur is right now."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one skill you have right now that you could turn into a side hustle?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to start a side hustle?",
            "options": [
              "Get a huge bank loan immediately",
              "Start small and test your idea with a few customers",
              "Drop out of school to focus on it full-time"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 5,
        "title": "Understanding Debt & Loans",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Debt can be a useful tool if used to build wealth—like taking a loan to buy equipment for a business. But consumer debt—like borrowing to buy clothes or go to a party—is a trap.\n\nIn Kenya, mobile loan apps like Fuliza, M-Shwari, and Tala are everywhere. They make borrowing so easy that many young people find themselves caught in a cycle of debt. If you borrow Ksh 1,000 to buy something today, the interest means you are actually paying much more for it tomorrow.\n\nBefore taking any loan, always ask: How will this loan make me money? If it won't make you money, it's usually better to just save up for it."
          },
          {
            "type": "pullquote",
            "content": "Interest on debt is a tax you pay to your future self. Borrow wisely."
          },
          {
            "type": "insight_prompt",
            "prompt": "Why do you think mobile loan apps are so popular, despite the high interest rates?"
          },
          {
            "type": "quiz",
            "question": "Which type of debt is generally considered a 'good' use of a loan?",
            "options": [
              "Borrowing to buy new clothes",
              "Borrowing to invest in equipment for a business",
              "Borrowing to go to a concert"
            ],
            "correctIndex": 1
          }
        ]
      }
    ]
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
    "content": [
      {
        "id": 1,
        "title": "Discovering What You Love",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Career clarity starts with knowing yourself. What activities make you lose track of time? When do you feel most alive?\n\nIn Kenya's CBC system, students can follow four pathways: STEM, Arts & Sports, Social Sciences, or TVET. There's no \"best\" pathway — only the one that fits YOU.\n\nDon't let anyone tell you that only medicine, law, or engineering are \"good careers.\" Kenya needs plumbers, designers, farmers, content creators, and so much more."
          },
          {
            "type": "pullquote",
            "content": "The best career is not the one that pays the most — it's the one that lets you be the most YOU."
          },
          {
            "type": "insight_prompt",
            "prompt": "List 3 activities that make you lose track of time. What do they have in common?"
          },
          {
            "type": "quiz",
            "question": "How many senior school pathways exist in the CBC system?",
            "options": [
              "2",
              "3",
              "4"
            ],
            "correctIndex": 2
          }
        ]
      },
      {
        "id": 2,
        "title": "Exploring Kenyan Careers",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Kenya's economy is growing fast, creating new opportunities every day. Here are some fast-growing sectors:\n\n• Technology: Software development, data science, cybersecurity\n• Agriculture: Agritech, organic farming, food processing\n• Creative: Content creation, graphic design, music production\n• Healthcare: Nursing, pharmacy, community health\n• TVET: Electrical engineering, automotive repair, welding\n\nMany of these careers don't require a university degree. TVET institutions and online courses can get you started."
          },
          {
            "type": "pullquote",
            "content": "The future belongs to those who prepare for it today."
          },
          {
            "type": "insight_prompt",
            "prompt": "Which career sector interests you most? Why?"
          },
          {
            "type": "quiz",
            "question": "Which statement about TVET careers is true?",
            "options": [
              "They are less important than university careers",
              "They offer practical skills for high-demand jobs",
              "They are only for students who fail exams"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "Skills vs. Degrees",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "For a long time in Kenya, having a degree was the only way to get a good job. Today, things are changing. Employers still respect degrees, but what they really want to know is: What can you actually do?\n\nA skill is something you know how to execute—like coding a website, repairing a car engine, or managing a social media page. Focus on building \"hard skills\" (technical abilities) and \"soft skills\" (communication, teamwork).\n\nYou can start building skills today for free using YouTube, Coursera, or local TVET programs. Your dream job cares more about your portfolio than your paper."
          },
          {
            "type": "pullquote",
            "content": "A degree gets you the interview; your skills get you the job."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one skill you could start learning online this week for free?"
          },
          {
            "type": "quiz",
            "question": "What do modern employers value most?",
            "options": [
              "Only a university degree",
              "Practical skills and what you can actually do",
              "Who your parents are"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 4,
        "title": "Networking for Young People",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "\"Your network is your net worth.\" You've probably heard this before. Networking isn't about using people—it's about building genuine relationships with people who can help you grow, and who you can help in return.\n\nAs a young person, your network starts right now. It is your teachers, your classmates, your older cousins, and guest speakers at school events. Don't be afraid to introduce yourself!\n\nA great networking question for someone you admire is: \"What advice would you give to someone my age who wants to do what you do?\" People love sharing their journey."
          },
          {
            "type": "pullquote",
            "content": "The deepest connections are built on genuine curiosity, not transactions."
          },
          {
            "type": "insight_prompt",
            "prompt": "Name one person whose career you admire. How could you politely reach out to them?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to start networking?",
            "options": [
              "Asking someone for a job immediately",
              "Building genuine relationships and asking for advice",
              "Ignoring people until you need something from them"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 5,
        "title": "Writing a CV",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "A Curriculum Vitae (CV) is simply your professional story on paper. At your age, you might think you have nothing to put on it. But you do! \n\nInstead of job experience, highlight your school clubs (e.g., debate team, drama club), volunteering at church, or any small side hustles you've done. These show leadership, responsibility, and initiative.\n\nKeep your CV clean and simple. Use a clear font, check for spelling mistakes, and make sure your contact information (phone number and an appropriate email address) is at the very top."
          },
          {
            "type": "pullquote",
            "content": "Your CV is your first impression. Make sure it represents the best version of you."
          },
          {
            "type": "insight_prompt",
            "prompt": "If you had to write a CV today, what is one non-academic achievement you would include?"
          },
          {
            "type": "quiz",
            "question": "If you don't have formal job experience, what should you include on a CV?",
            "options": [
              "Nothing, just leave it blank",
              "School clubs, volunteering, and side projects",
              "Make up fake jobs to look impressive"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 6,
        "title": "The Job Interview",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "A job interview is just a conversation to see if you and the company are a good fit. It is normal to feel nervous. The best way to beat the nerves is preparation. \n\nResearch the company beforehand. Know what they do. Practice common questions like \"Tell me about yourself\" and \"What are your strengths and weaknesses?\" Prepare one or two smart questions to ask them at the end.\n\nFinally, remember the basics of Kenyan professionalism: dress neatly, arrive 15 minutes early, make eye contact, and offer a firm, confident handshake (or polite greeting)."
          },
          {
            "type": "pullquote",
            "content": "An interview is not an interrogation. It is an opportunity to share your story."
          },
          {
            "type": "insight_prompt",
            "prompt": "How would you answer the interview question: \"Tell me about yourself\"?"
          },
          {
            "type": "quiz",
            "question": "What is a key step in preparing for an interview?",
            "options": [
              "Arriving exactly on time, not a minute earlier",
              "Researching the company and practicing common questions",
              "Complaining about your previous teachers or bosses"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 7,
        "title": "Freelancing & Digital Work",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "You no longer need to be in an office to make money. The digital economy has opened up the world. Freelancing means working for different clients on a project basis, rather than being employed by one company.\n\nKenyans are heavily involved in digital work on platforms like Upwork and Fiverr. Common freelance jobs include writing, graphic design, video editing, and virtual assistance.\n\nTo succeed in digital work, you need two things: a solid internet connection and high discipline. When you are your own boss, you have to manage your time and ensure you meet client deadlines."
          },
          {
            "type": "pullquote",
            "content": "The internet has removed borders. The world is your potential employer."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one digital service you could learn to offer online?"
          },
          {
            "type": "quiz",
            "question": "What is required to succeed as a freelancer?",
            "options": [
              "An office in the city centre",
              "Working the exact same hours every single day",
              "High self-discipline and time management"
            ],
            "correctIndex": 2
          }
        ]
      },
      {
        "id": 8,
        "title": "Entrepreneurship in Kenya",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Taking the leap into entrepreneurship means creating a business to solve a problem. In Kenya, our informal sector (the Jua Kali sector) is massive and full of incredible innovation.\n\nBeing an entrepreneur requires resilience. You will face challenges like raising capital, finding the right customers, and dealing with competition. But the reward is building something that is entirely yours.\n\nRemember, you don't need a groundbreaking new invention to be an entrepreneur. You just need to offer a product or service better, faster, or more reliably than others. Start small, solve a local problem, and grow from there."
          },
          {
            "type": "pullquote",
            "content": "Entrepreneurs don't wait for opportunities. They create them."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is a problem in your community that a small business could solve?"
          },
          {
            "type": "quiz",
            "question": "What is the core goal of entrepreneurship?",
            "options": [
              "To avoid having to work hard",
              "To copy what everyone else is doing",
              "To solve a problem by offering a product or service"
            ],
            "correctIndex": 2
          }
        ]
      }
    ]
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
    "content": [
      {
        "id": 1,
        "title": "Understanding Your Body",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Your body goes through many changes during adolescence. These changes are completely normal and happen to everyone — though at different rates.\n\nUnderstanding how your body works helps you make informed decisions about your health. This includes knowing about puberty, hygiene, and how to take care of yourself.\n\nIt's okay to have questions. In fact, it's important. The more you understand, the better choices you can make for your own wellbeing."
          },
          {
            "type": "pullquote",
            "content": "Knowledge about your own body is not something to be embarrassed about — it's something to be empowered by."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one question about your health or body that you wish you could ask without feeling embarrassed?"
          },
          {
            "type": "quiz",
            "question": "Why is it important to understand your body during adolescence?",
            "options": [
              "It's not important",
              "It helps you make informed decisions about your health",
              "Only adults need to know about their bodies"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Your Rights and Consent",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "You have the right to say no. You have the right to change your mind. You have the right to feel safe.\n\nConsent means freely agreeing to something without pressure, force, or manipulation. Consent must be:\n• Given freely (not forced)\n• Informed (you understand what you're agreeing to)\n• Reversible (you can change your mind at any time)\n• Enthusiastic (you actually want to)\n\nIf someone pressures you, that is NOT consent. You can always reach out to a trusted adult or Childline Kenya at 116."
          },
          {
            "type": "pullquote",
            "content": "Your body, your rules. No one has the right to pressure you into anything."
          },
          {
            "type": "insight_prompt",
            "prompt": "In your own words, what does consent mean to you?"
          },
          {
            "type": "quiz",
            "question": "What is TRUE about consent?",
            "options": [
              "Once given, it can never be taken back",
              "It must be given freely and can be changed at any time",
              "Silence means consent"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "HIV & STI Prevention",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "HIV and Sexually Transmitted Infections (STIs) remain a serious reality in Kenya. According to the National Syndemic Disease Control Council (NSDCC), young people aged 15-34 account for over 70% of new HIV infections in the country. This means the youth are the most vulnerable.\n\nThe most effective way to prevent HIV and STIs is abstinence (choosing not to have sex). If a person chooses to be sexually active, using condoms consistently and correctly is the best line of defense. Remember, you cannot tell if someone has an STI or HIV just by looking at them.\n\nTesting is free and confidential at government health facilities. Knowing your status is powerful. If tested positive, treatment (ARVs) is free and allows you to live a long, healthy life."
          },
          {
            "type": "pullquote",
            "content": "Knowing your HIV status is not a reason to panic; it is the power to take control of your health."
          },
          {
            "type": "insight_prompt",
            "prompt": "Why do you think HIV infections are still high among young people in Kenya today?"
          },
          {
            "type": "quiz",
            "question": "According to recent data, which age group accounts for the majority of new HIV infections in Kenya?",
            "options": [
              "Older adults above 50 years",
              "Young people aged 15 to 34 years",
              "Only children under 10 years"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 4,
        "title": "Menstrual Health",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Menstruation (having a period) is a completely natural biological process. Half the world goes through it! Yet, many girls in Kenya still face stigma, shame, or lack of access to sanitary towels.\n\nLet's break the myths: You can absolutely wash your hair, exercise, cook, and participate in sports while on your period. A period is not a disease. Tracking your cycle helps you understand your body better and prepare ahead of time.\n\nBoys, this is for you too. Understanding menstrual health makes you a better brother, friend, and future partner. Period shaming should have no place in our schools or communities."
          },
          {
            "type": "pullquote",
            "content": "A period is a sign of health, not a source of shame. Let's normalize talking about it."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one common myth about periods you used to believe?"
          },
          {
            "type": "quiz",
            "question": "Which of the following is true about menstruation?",
            "options": [
              "You should avoid any physical activity or sports",
              "It is a natural, healthy biological process",
              "It is a sign that you are unwell"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 5,
        "title": "Family Planning Basics",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Family planning simply means having the power to decide if, when, and how many children to have. Information about contraception is a right, not a secret.\n\nThere are many methods of avoiding unplanned pregnancies. Some are hormonal (like pills, implants, or injections), which stop the body from releasing an egg. Others are barrier methods (like condoms), which physically block sperm and also protect against STIs.\n\nMyths about family planning are common—like the false idea that contraceptives make you permanently infertile. If you or someone you know wants accurate information, local clinics provide free and confidential counseling. Always get medical advice from a professional, not from social media rumors."
          },
          {
            "type": "pullquote",
            "content": "Having access to accurate health information is your basic human right."
          },
          {
            "type": "insight_prompt",
            "prompt": "Why is access to family planning information important for young people's futures?"
          },
          {
            "type": "quiz",
            "question": "What is a dual benefit of using condoms?",
            "options": [
              "They prevent pregnancy and protect against STIs",
              "They offer permanent family planning",
              "They are 100% effective 100% of the time"
            ],
            "correctIndex": 0
          }
        ]
      },
      {
        "id": 6,
        "title": "Where to Get Help",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Taking care of your sexual and reproductive health means knowing where to go when you need help, advice, or medical care. You do not have to figure everything out on your own.\n\nFor immediate support, you can call free, confidential hotlines: Childline Kenya at 116 handles all issues related to youth protection, and the national GBV hotline 1195 is available 24/7 if you or someone you know experiences gender-based violence.\n\nGovernment health centers, youth-friendly clinics, and organizations like Marie Stopes offer free or low-cost counseling, STI testing, and contraceptives. Find a trusted adult—like a school counselor, favorite auntie, or church youth leader—who can help you access these services safely."
          },
          {
            "type": "pullquote",
            "content": "Asking for help is the bravest thing you can do for your health."
          },
          {
            "type": "insight_prompt",
            "prompt": "If a friend confided in you that they needed health advice, who is a trusted adult you would direct them to?"
          },
          {
            "type": "quiz",
            "question": "What is the national toll-free hotline for reporting Gender-Based Violence (GBV) in Kenya?",
            "options": [
              "116",
              "1195",
              "911"
            ],
            "correctIndex": 1
          }
        ]
      }
    ]
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
    "content": [
      {
        "id": 1,
        "title": "Understanding Peer Pressure",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Peer pressure is the influence your friends and classmates have on your decisions. It can be positive (encouraging you to study) or negative (pushing you to do things you're not comfortable with).\n\nIn Kenya, peer pressure often involves alcohol (changaa, beer), smoking (cigarettes, shisha), or drug use (miraa, bhang). It can feel impossible to say no when everyone around you is doing it.\n\nBut here's the truth: most people overestimate how many of their peers are actually doing these things. Studies show the majority of Kenyan youth are making healthy choices."
          },
          {
            "type": "pullquote",
            "content": "The strongest people are not those who never face pressure — they're the ones who face it and still choose what's right."
          },
          {
            "type": "insight_prompt",
            "prompt": "Have you ever felt pressured to do something you didn't want to? How did you handle it?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to handle peer pressure?",
            "options": [
              "Give in so people like you",
              "Have a prepared response and stick to your values",
              "Avoid all friendships"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Making Informed Decisions",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Making healthy choices isn't about being \"boring\" — it's about being in control of your own life.\n\nThe STOP method helps with tough decisions:\n• S - Stop and pause before acting\n• T - Think about the consequences\n• O - Options — what are your choices?\n• P - Pick the best option and act on it\n\nEvery decision you make today shapes your tomorrow. You don't have to be perfect, but you do have the power to choose wisely."
          },
          {
            "type": "pullquote",
            "content": "Between stimulus and response, there is a space. In that space lies your freedom to choose."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of a recent decision you made. If you used the STOP method, would you have decided differently?"
          },
          {
            "type": "quiz",
            "question": "What does the \"T\" in STOP stand for?",
            "options": [
              "Talk to a friend",
              "Think about the consequences",
              "Try everything once"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "Understanding Substances",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "In Kenya, substances like alcohol, miraa, shisha, and bhang are often seen at parties or in certain communities. Sometimes, young people use them to fit in, escape stress, or just because \"everyone else is doing it.\"\n\nHowever, your brain is still developing until your mid-20s. Introducing strong substances during this time can permanently affect your memory, motivation, and mental health. The short-term \"high\" is rarely worth the long-term cost.\n\nIt is okay to be the person who says \"No thanks.\" Real friends will respect your choice. If you or a friend is struggling with substance use, remember that addiction is a health issue, not a moral failure. Seek help from a counselor or a trusted adult."
          },
          {
            "type": "pullquote",
            "content": "Protect your brain. It is the only one you have, and it has to last you a lifetime."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one polite but firm way you could say 'no' if someone offered you a substance you didn't want?"
          },
          {
            "type": "quiz",
            "question": "Why is substance use particularly risky for teenagers and young adults?",
            "options": [
              "Because their brains are still developing",
              "Because they might get caught by their parents",
              "Because substances are too expensive"
            ],
            "correctIndex": 0
          }
        ]
      },
      {
        "id": 4,
        "title": "Social Media & Mental Health",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "We spend hours scrolling on TikTok, Instagram, and WhatsApp. It is a great way to stay connected, but it can also be a trap. Social media shows a filtered \"highlight reel\" of other people's lives, which can make you feel like your own life isn't good enough.\n\nConstant comparison breeds anxiety. Have you ever logged off feeling worse than when you logged on? That is a sign it's time to set digital boundaries.\n\nTry implementing a \"screen-free hour\" before bed. Unfollow accounts that make you feel bad about your body, your life, or your finances. Curate your feed so that it inspires you instead of draining you."
          },
          {
            "type": "pullquote",
            "content": "Don't compare your behind-the-scenes with someone else's highlight reel."
          },
          {
            "type": "insight_prompt",
            "prompt": "Look at your screen time today. How much time did you spend on social media, and how did it make you feel?"
          },
          {
            "type": "quiz",
            "question": "What is a healthy social media habit?",
            "options": [
              "Scrolling through feeds right before going to sleep",
              "Unfollowing accounts that make you feel negative or anxious",
              "Checking notifications every 5 minutes during class"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 5,
        "title": "Building Healthy Habits",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Health isn't just about avoiding bad things; it is about actively doing good things for your body and mind. The three pillars of health are sleep, nutrition, and exercise.\n\nAs a young person, you need about 8-10 hours of sleep per night for your brain to process what you learned that day. For nutrition, aim for a balanced diet—local foods like sukuma wiki, beans, and healthy grains are powerful fuel.\n\nFinally, move your body! You don't need a fancy gym. Walking, playing football with friends, or dancing to Gengetone all count as exercise. Small daily choices build a massive foundation for your future health."
          },
          {
            "type": "pullquote",
            "content": "Take care of your body. It is the only place you have to live."
          },
          {
            "type": "insight_prompt",
            "prompt": "Which of the three pillars (sleep, nutrition, exercise) do you struggle with the most, and why?"
          },
          {
            "type": "quiz",
            "question": "Which of the following is considered one of the three main pillars of physical health?",
            "options": [
              "Having the latest smartphone",
              "Watching television every day",
              "Getting 8-10 hours of sleep per night"
            ],
            "correctIndex": 2
          }
        ]
      }
    ]
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
    "content": [
      {
        "id": 1,
        "title": "Lesson 1: The M-Pesa Black Hole",
        "duration": "15 min",
        "sections": [
          {
            "type": "text",
            "content": "Managing money as a young adult in Kenya can feel like a trap. One minute you have KES 2,000, and the next, it has vanished into transaction fees, buying airtime to browse Instagram, and sending \"small small\" amounts to friends.\n\nThe biggest financial trap for young Kenyans today is instant mobile loans like Fuliza. While it seems convenient to borrow KES 200 for lunch, the daily interest rates compound quickly. It creates a cycle where your future money is already spent before you even earn it. To build wealth, you must break the debt cycle.\n\nStart by tracking every coin you spend for a week. You will be surprised at how much goes to things you do not even remember buying. Second, build an emergency fund before you buy anything flashy. Your peace of mind is worth more than a new pair of sneakers."
          },
          {
            "type": "pullquote",
            "content": "Do not save what is left after spending; spend what is left after saving."
          },
          {
            "type": "insight_prompt",
            "prompt": "Look at your M-Pesa statement for the last 3 days. What was your most unnecessary expense?"
          },
          {
            "type": "quiz",
            "question": "What is the biggest risk of using mobile loans like Fuliza for daily expenses?",
            "options": [
              "They make your phone slower",
              "They trap you in a cycle of high-interest debt",
              "They report you to the police"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Lesson 2: Navigating Relationships and \"Tuma Fare\"",
        "duration": "15 min",
        "sections": [
          {
            "type": "text",
            "content": "Dating in your late teens and early twenties is complicated. There is intense social pressure to be in a relationship, but very little guidance on what a healthy one looks like. A lot of modern dating culture revolves around transactional relationships — where money, gifts, and paying for transport (\"tuma fare\") are expected to prove love.\n\nA healthy relationship is not transactional. If someone only values you for what you can buy them, or if someone expects physical intimacy because they bought you dinner, that is manipulation, not love.\n\nSet your boundaries early. It is okay to go on cheap or free dates like walking in a public park. It is okay to say, \"I am broke right now.\" A partner who genuinely likes you will respect your boundaries and build with you, rather than draining you."
          },
          {
            "type": "pullquote",
            "content": "Your 20s are for partnership, not sponsorship. Build together."
          },
          {
            "type": "insight_prompt",
            "prompt": "Have you ever felt pressured to spend money you didn't have just to impress someone?"
          },
          {
            "type": "quiz",
            "question": "What is a sign of a transactional relationship?",
            "options": [
              "Supporting each other's career goals",
              "Expecting gifts or money as proof of love",
              "Having honest conversations about being broke"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "Lesson 3: Securing the Bag (Skills & Hustle)",
        "duration": "15 min",
        "sections": [
          {
            "type": "text",
            "content": "The Kenyan job market is tough. A university degree or college diploma is no longer a guaranteed ticket to employment. So, how do you stand out when hundreds of people are applying for the same entry-level job?\n\nThe secret is in \"proof of work.\" Employers do not just want to see a certificate; they want to see what you can DO. If you want to be a graphic designer, build a portfolio of sample posters. If you want to be in sales, start by selling small items online and document your process.\n\nWhile you wait for your dream job, embrace the gig economy. Online writing, social media management, tutoring, or selling second-hand clothes (mitumba) teaches you negotiation, discipline, and customer service. Swallow your pride and start small. The hustle you start today could be the business that employs others tomorrow."
          },
          {
            "type": "pullquote",
            "content": "Your degree is just the foundation. Your skills and hustle build the house."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one practical skill you could start learning on YouTube this week?"
          },
          {
            "type": "quiz",
            "question": "What do modern employers value most when looking at entry-level candidates?",
            "options": [
              "The prestige of your high school",
              "Proof of work and practical skills",
              "How many followers you have on social media"
            ],
            "correctIndex": 1
          }
        ]
      }
    ]
  }
];
