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
      {
        id: 3,
        title: 'Your Inner Critic',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'That voice in your head telling you "You can\'t do this" or "Everyone is judging you" is called the inner critic. We all have it, even the most confident people. The trick is not to let it drive the matatu of your life.\n\nWhen your inner critic says "You\'ll fail this exam," don\'t argue with it. Just say, "Maybe, but I\'m going to try my best anyway." Treat it like an annoying passenger — you hear them, but you don\'t have to follow their directions.\n\nIn Kenya, we face so much pressure from family and society to succeed. It\'s perfectly normal to feel doubt. True confidence is doing the work even when the doubt is loud.' },
          { type: 'pullquote', content: 'Don\'t believe everything you think. Your inner critic is loud, but it is rarely accurate.' },
          { type: 'insight_prompt', prompt: 'What is one negative thing your inner critic often tells you? How can you reframe it?' },
          { type: 'quiz', question: 'What is the best way to deal with your inner critic?', options: ['Try to never have negative thoughts', 'Acknowledge the thought but choose to act anyway', 'Listen to it because it is usually right'], correctIndex: 1 },
        ],
      },
      {
        id: 4,
        title: 'Body Language & Confidence',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Did you know that changing your posture can actually change how your brain feels? When you stand tall with your shoulders back, your brain releases chemicals that make you feel more powerful.\n\nThink about how athletes like Faith Kipyegon carry themselves before a race. Good posture, steady eye contact, and taking up space all signal confidence to others—and to yourself.\n\nNext time you walk into a room, a classroom, or even just down the street, imagine a string pulling you up from the top of your head. Walk with purpose. You belong in every room you enter.' },
          { type: 'pullquote', content: 'Stand tall, even on the days you feel small. Your body can teach your mind how to be brave.' },
          { type: 'insight_prompt', prompt: 'Notice your posture right now. How does it change the way you feel when you sit up straight?' },
          { type: 'quiz', question: 'How does body language affect confidence?', options: ['It only changes how others see you', 'It has no real effect', 'It changes both how others see you and how you feel inside'], correctIndex: 2 },
        ],
      },
      {
        id: 5,
        title: 'Public Speaking Basics',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Public speaking is one of the most common fears in the world, stronger than the fear of spiders or heights! Whether it\'s reading a verse in church, presenting a project, or leading a school club, speaking up matters.\n\nThe secret is preparation. Knowing your material is 80% of the battle. The other 20% is remembering to breathe. When we get nervous, we talk fast. Take a deep breath, and slow down your words.\n\nRemember, no one is waiting for you to fail. They actually want you to succeed. Speak loud enough for the person in the back row to hear you. They need your voice!' },
          { type: 'pullquote', content: 'Your voice matters. Don\'t hide it because you\'re afraid it might shake.' },
          { type: 'insight_prompt', prompt: 'What is the scariest part of speaking in front of a group for you?' },
          { type: 'quiz', question: 'What is the most important thing to remember when public speaking?', options: ['Talk as fast as possible to finish quickly', 'Slow down, breathe, and speak clearly', 'Memorize every single word perfectly'], correctIndex: 1 },
        ],
      },
      {
        id: 6,
        title: 'Handling Rejection',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Everybody faces rejection. Maybe you didn\'t make the football team, a friend ignored your text, or you didn\'t get selected for a program. It stings, but it\'s a completely normal part of life.\n\nIn Sheng, we say "Kuja na yako" – bring your own. Sometimes an opportunity isn\'t the right fit, and that just means you need to create your own path. Rejection is rarely about you being "not good enough"; it\'s usually just about timing and fit.\n\nLupita Nyong\'o faced countless rejections before winning an Oscar. She didn\'t let a "No" define her worth. A "No" is just a detour, not a dead end.' },
          { type: 'pullquote', content: 'Rejection is redirection. When one door closes, it means you\'re meant to walk through a different one.' },
          { type: 'insight_prompt', prompt: 'Think of a time you faced a "No" that ended up being a good thing. What happened?' },
          { type: 'quiz', question: 'How should you view rejection?', options: ['As proof that you are not good enough', 'As a detour and a chance to learn', 'As a reason to stop trying'], correctIndex: 1 },
        ],
      },
      {
        id: 7,
        title: 'Celebrating Your Wins',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'We are often so focused on where we are going that we forget to celebrate how far we have come. Celebrating your wins, even the tiny ones, builds your confidence engine.\n\nYou don\'t need a huge party or a graduation ceremony to celebrate. Did you finish your homework? Safi! Did you help your parents without being asked? Good job! Did you handle a tough situation calmly? Be proud of yourself.\n\nTake time at the end of every week to list three things that went well. This simple habit trains your brain to notice success, making you more confident for the challenges ahead.' },
          { type: 'pullquote', content: 'Don\'t wait until you reach the mountain top to enjoy the view. Celebrate the steps you take every day.' },
          { type: 'insight_prompt', prompt: 'What is one small win you had this week that you haven\'t celebrated yet?' },
          { type: 'quiz', question: 'Why is it important to celebrate small wins?', options: ['It trains your brain to notice success and builds confidence', 'It makes other people jealous', 'It means you don\'t have to work hard anymore'], correctIndex: 0 },
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
      {
        id: 3,
        title: 'Your Support Network',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Nobody gets through life alone. A support network is your team—the people you can lean on when things get tough. This could be a trusted teacher, an auntie, your church youth leader, or a close friend.\n\nIn Kenya, we have the spirit of Harambee, which means "let\'s pull together." When one person is struggling, the community steps in to help. Have you built your own personal Harambee team?\n\nIt takes courage to ask for help. It is not a sign of weakness; it is a sign that you are smart enough to know when the load is too heavy for one person.' },
          { type: 'pullquote', content: 'Asking for help is not giving up. It is refusing to give up.' },
          { type: 'insight_prompt', prompt: 'Name three people in your life you could call if you were in trouble right now.' },
          { type: 'quiz', question: 'What is the purpose of a support network?', options: ['To do all your work for you', 'To provide help and encouragement when things are difficult', 'To give you money whenever you ask'], correctIndex: 1 },
        ],
      },
      {
        id: 4,
        title: 'Dealing with Loss',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Loss comes in many forms. It could be losing a loved one, a friendship ending, or failing a crucial exam like the KCSE. Grief is the natural response to loss, and it doesn\'t follow a neat schedule.\n\nSometimes people will tell you to "just get over it" or "be strong." But true strength is allowing yourself to feel the sadness. It is okay to cry. It is okay to not be okay for a while.\n\nHealing happens slowly. You don\'t forget what you lost, but over time, you learn how to carry it. Be gentle with yourself on the heavy days.' },
          { type: 'pullquote', content: 'Grief is just love with nowhere to go. Give yourself the grace to feel it.' },
          { type: 'insight_prompt', prompt: 'What is one healthy way you comfort yourself when you are feeling sad?' },
          { type: 'quiz', question: 'What is a healthy response to experiencing loss?', options: ['Pretending it doesn\'t bother you', 'Allowing yourself to feel sad and taking time to heal', 'Getting angry at everyone around you'], correctIndex: 1 },
        ],
      },
      {
        id: 5,
        title: 'Stress Management',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'School, family expectations, chores, and friendships—Kenyan youth carry a lot of stress. When you\'re stressed, your body goes into "fight or flight" mode. Your heart beats faster, and your mind races.\n\nTo manage stress, you have to signal to your body that it is safe. The fastest way to do this is through your breath. Try the 4-7-8 method: breathe in for 4 seconds, hold for 7, and exhale slowly for 8 seconds.\n\nOther great ways to manage stress are physical activity—like playing football or taking a walk—and journaling. Get the stressful thoughts out of your head and onto a piece of paper.' },
          { type: 'pullquote', content: 'You don\'t have to have it all figured out today. Just take the next small step.' },
          { type: 'insight_prompt', prompt: 'When you feel overwhelmed, where do you feel the tension in your body?' },
          { type: 'quiz', question: 'Which of the following is an effective way to lower stress levels quickly?', options: ['Scrolling on social media for hours', 'Deep, slow breathing exercises', 'Drinking energy drinks'], correctIndex: 1 },
        ],
      },
      {
        id: 6,
        title: 'Turning Setbacks into Comebacks',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'A setback is just a setup for a comeback. Look at some of the most successful Kenyans. Many businesses fail before one succeeds. Many athletes lose before they win gold.\n\nWhen a setback happens, ask yourself: "What can I learn from this?" If you failed a test, did you study the wrong material? If a friendship ended, what did it teach you about your boundaries?\n\nDon\'t let a bad moment convince you that you have a bad life. Adjust your strategy, dust yourself off, and try again tomorrow. Your story is far from over.' },
          { type: 'pullquote', content: 'The master has failed more times than the beginner has even tried.' },
          { type: 'insight_prompt', prompt: 'Think of a time you failed at something. What is one lesson you learned from that experience?' },
          { type: 'quiz', question: 'How should you view a setback?', options: ['As an opportunity to learn and try again', 'As a clear sign that you should give up completely', 'As somebody else\'s fault'], correctIndex: 0 },
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
      {
        id: 3,
        title: 'Conflict Resolution',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Conflict is a normal part of any relationship. Whether it\'s a disagreement with a sibling or an argument with a friend, the goal shouldn\'t be to "win" the fight. The goal is to solve the problem.\n\nWhen tempers flare, we often say things we don\'t mean. If you feel yourself getting too angry, take a timeout. Say, "I need a few minutes to cool down before we talk about this."\n\nWhen you return, use "I" statements instead of "You" statements. Focus on the issue, not the person. Instead of "You are so selfish," try "I felt hurt when you didn\'t share with me." Attack the problem, not the person.' },
          { type: 'pullquote', content: 'Peace is not the absence of conflict; it is the ability to handle conflict by peaceful means.' },
          { type: 'insight_prompt', prompt: 'Think of a recent argument you had. How could you have handled it differently using an "I" statement?' },
          { type: 'quiz', question: 'What is the best goal when resolving a conflict?', options: ['To prove that the other person is completely wrong', 'To solve the problem and understand each other', 'To shout the loudest so they listen to you'], correctIndex: 1 },
        ],
      },
      {
        id: 4,
        title: 'Digital Communication',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Texting, WhatsApp, and social media have completely changed how we talk. But digital communication misses a lot of context—like tone of voice and body language. That is why a simple "K" or "Sawa" can sometimes feel rude!\n\nBefore you hit send, read your message out loud. Ask yourself: "Could this be misunderstood?" If you\'re discussing something emotional or complicated, a phone call or a voice note is usually better than a long paragraph of texts.\n\nAlso, remember the digital permanence rule: Never text or post anything you wouldn\'t want printed on the front page of the Daily Nation. Digital words live forever.' },
          { type: 'pullquote', content: 'Text carefully. Tone is easily lost through a screen, and words typed in anger cannot be unread.' },
          { type: 'insight_prompt', prompt: 'Have you ever had a misunderstanding with a friend over a text message? What happened?' },
          { type: 'quiz', question: 'Which situation is best handled through a phone call rather than a text message?', options: ['Sharing a funny meme', 'Discussing a complicated or emotional problem', 'Asking what time a meeting starts'], correctIndex: 1 },
        ],
      },
      {
        id: 5,
        title: 'Saying No Respectfully',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Many of us are people-pleasers. We say "yes" to things we don\'t have time for because we don\'t want to disappoint anyone. But every time you say yes to something you don\'t want to do, you are saying no to your own peace.\n\nYou can say no without being rude. Try these phrases:\n• "I don\'t have the capacity for that right now."\n• "I\'d love to help, but I\'m swamped with schoolwork."\n• "That sounds fun, but I need some quiet time today."\n\nSaying no is a muscle. The first time you use it, it feels uncomfortable. But the more you use it, the easier it gets to protect your time and energy.' },
          { type: 'pullquote', content: '\'No\' is a complete sentence. You do not need to provide a long list of excuses.' },
          { type: 'insight_prompt', prompt: 'What is something you recently said \'yes\' to, but you really wished you had said \'no\'?' },
          { type: 'quiz', question: 'What is a respectful way to say no?', options: ['Just ignore their request completely', '"I would love to help, but I don\'t have the time right now."', '"Are you crazy? I am way too busy for you!"'], correctIndex: 1 },
        ],
      },
      {
        id: 6,
        title: 'Storytelling & Persuasion',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Humans are wired for stories. If you want to persuade someone—whether you\'re convincing your parents to let you go on a trip, or convincing an employer to hire you—facts tell, but stories sell.\n\nA good story has a clear structure: the setup (who and where), the conflict (the problem), and the resolution (how it was fixed). Next time you are trying to make a point, frame it as a story.\n\nUsing local context makes your stories stronger. When you compare a challenge to navigating the Nairobi traffic jam, or finding a seat in a full matatu, people instantly understand exactly what you mean.' },
          { type: 'pullquote', content: 'Storytelling is the most powerful way to put ideas into the world today.' },
          { type: 'insight_prompt', prompt: 'Think of a time you convinced someone of something. What did you say that changed their mind?' },
          { type: 'quiz', question: 'Why is storytelling effective for persuasion?', options: ['Because people prefer listening to facts and statistics', 'Because humans connect emotionally to stories better than raw facts', 'Because it makes the conversation shorter'], correctIndex: 1 },
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
      {
        id: 3,
        title: 'Needs vs. Wants',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Before you spend money, ask yourself: Is this a need or a want? Needs are things you literally cannot survive without, or things necessary for school and work—like food, shelter, school fees, and transport fare.\n\nWants are things that make life enjoyable but aren\'t necessary—like the latest smartphone, expensive sneakers, or eating out every day. It\'s okay to spend money on wants, but only after your needs are met.\n\nA great trick is the 48-hour rule. When you see a "want" that you really want to buy, wait 48 hours. Usually, the urge to buy passes, and you realise you didn\'t really need it in the first place.' },
          { type: 'pullquote', content: 'Don\'t go broke trying to look rich. Real wealth is what you save, not what you spend.' },
          { type: 'insight_prompt', prompt: 'What is one \'want\' you recently spent money on that you could have saved instead?' },
          { type: 'quiz', question: 'What is the 48-hour rule?', options: ['Waiting 48 hours before buying something you want', 'Working for 48 hours straight', 'Ignoring your needs for 48 hours'], correctIndex: 0 },
        ],
      },
      {
        id: 4,
        title: 'Starting a Side Hustle',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'A side hustle is a small business you run alongside school or a main job. It\'s a great way to build extra income and learn valuable skills. In Kenya, young people are the kings and queens of the hustle.\n\nYou don\'t need a lot of capital to start. You can offer services like tutoring younger students, graphic design, social media management, or selling thrift clothes (mitumba). The key is to find a problem you can solve for people, and charge for it.\n\nStart small. Test your idea with a few customers before spending all your savings. Remember, every big business in Nairobi started as a small idea.' },
          { type: 'pullquote', content: 'The best time to start thinking like an entrepreneur is right now.' },
          { type: 'insight_prompt', prompt: 'What is one skill you have right now that you could turn into a side hustle?' },
          { type: 'quiz', question: 'What is the best way to start a side hustle?', options: ['Get a huge bank loan immediately', 'Start small and test your idea with a few customers', 'Drop out of school to focus on it full-time'], correctIndex: 1 },
        ],
      },
      {
        id: 5,
        title: 'Understanding Debt & Loans',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Debt can be a useful tool if used to build wealth—like taking a loan to buy equipment for a business. But consumer debt—like borrowing to buy clothes or go to a party—is a trap.\n\nIn Kenya, mobile loan apps like Fuliza, M-Shwari, and Tala are everywhere. They make borrowing so easy that many young people find themselves caught in a cycle of debt. If you borrow Ksh 1,000 to buy something today, the interest means you are actually paying much more for it tomorrow.\n\nBefore taking any loan, always ask: How will this loan make me money? If it won\'t make you money, it\'s usually better to just save up for it.' },
          { type: 'pullquote', content: 'Interest on debt is a tax you pay to your future self. Borrow wisely.' },
          { type: 'insight_prompt', prompt: 'Why do you think mobile loan apps are so popular, despite the high interest rates?' },
          { type: 'quiz', question: 'Which type of debt is generally considered a \'good\' use of a loan?', options: ['Borrowing to buy new clothes', 'Borrowing to invest in equipment for a business', 'Borrowing to go to a concert'], correctIndex: 1 },
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
      {
        id: 3,
        title: 'Skills vs. Degrees',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'For a long time in Kenya, having a degree was the only way to get a good job. Today, things are changing. Employers still respect degrees, but what they really want to know is: What can you actually do?\n\nA skill is something you know how to execute—like coding a website, repairing a car engine, or managing a social media page. Focus on building "hard skills" (technical abilities) and "soft skills" (communication, teamwork).\n\nYou can start building skills today for free using YouTube, Coursera, or local TVET programs. Your dream job cares more about your portfolio than your paper.' },
          { type: 'pullquote', content: 'A degree gets you the interview; your skills get you the job.' },
          { type: 'insight_prompt', prompt: 'What is one skill you could start learning online this week for free?' },
          { type: 'quiz', question: 'What do modern employers value most?', options: ['Only a university degree', 'Practical skills and what you can actually do', 'Who your parents are'], correctIndex: 1 },
        ],
      },
      {
        id: 4,
        title: 'Networking for Young People',
        duration: '6 min',
        sections: [
          { type: 'text', content: '"Your network is your net worth." You\'ve probably heard this before. Networking isn\'t about using people—it\'s about building genuine relationships with people who can help you grow, and who you can help in return.\n\nAs a young person, your network starts right now. It is your teachers, your classmates, your older cousins, and guest speakers at school events. Don\'t be afraid to introduce yourself!\n\nA great networking question for someone you admire is: "What advice would you give to someone my age who wants to do what you do?" People love sharing their journey.' },
          { type: 'pullquote', content: 'The deepest connections are built on genuine curiosity, not transactions.' },
          { type: 'insight_prompt', prompt: 'Name one person whose career you admire. How could you politely reach out to them?' },
          { type: 'quiz', question: 'What is the best way to start networking?', options: ['Asking someone for a job immediately', 'Building genuine relationships and asking for advice', 'Ignoring people until you need something from them'], correctIndex: 1 },
        ],
      },
      {
        id: 5,
        title: 'Writing a CV',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'A Curriculum Vitae (CV) is simply your professional story on paper. At your age, you might think you have nothing to put on it. But you do! \n\nInstead of job experience, highlight your school clubs (e.g., debate team, drama club), volunteering at church, or any small side hustles you\'ve done. These show leadership, responsibility, and initiative.\n\nKeep your CV clean and simple. Use a clear font, check for spelling mistakes, and make sure your contact information (phone number and an appropriate email address) is at the very top.' },
          { type: 'pullquote', content: 'Your CV is your first impression. Make sure it represents the best version of you.' },
          { type: 'insight_prompt', prompt: 'If you had to write a CV today, what is one non-academic achievement you would include?' },
          { type: 'quiz', question: 'If you don\'t have formal job experience, what should you include on a CV?', options: ['Nothing, just leave it blank', 'School clubs, volunteering, and side projects', 'Make up fake jobs to look impressive'], correctIndex: 1 },
        ],
      },
      {
        id: 6,
        title: 'The Job Interview',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'A job interview is just a conversation to see if you and the company are a good fit. It is normal to feel nervous. The best way to beat the nerves is preparation. \n\nResearch the company beforehand. Know what they do. Practice common questions like "Tell me about yourself" and "What are your strengths and weaknesses?" Prepare one or two smart questions to ask them at the end.\n\nFinally, remember the basics of Kenyan professionalism: dress neatly, arrive 15 minutes early, make eye contact, and offer a firm, confident handshake (or polite greeting).' },
          { type: 'pullquote', content: 'An interview is not an interrogation. It is an opportunity to share your story.' },
          { type: 'insight_prompt', prompt: 'How would you answer the interview question: "Tell me about yourself"?' },
          { type: 'quiz', question: 'What is a key step in preparing for an interview?', options: ['Arriving exactly on time, not a minute earlier', 'Researching the company and practicing common questions', 'Complaining about your previous teachers or bosses'], correctIndex: 1 },
        ],
      },
      {
        id: 7,
        title: 'Freelancing & Digital Work',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'You no longer need to be in an office to make money. The digital economy has opened up the world. Freelancing means working for different clients on a project basis, rather than being employed by one company.\n\nKenyans are heavily involved in digital work on platforms like Upwork and Fiverr. Common freelance jobs include writing, graphic design, video editing, and virtual assistance.\n\nTo succeed in digital work, you need two things: a solid internet connection and high discipline. When you are your own boss, you have to manage your time and ensure you meet client deadlines.' },
          { type: 'pullquote', content: 'The internet has removed borders. The world is your potential employer.' },
          { type: 'insight_prompt', prompt: 'What is one digital service you could learn to offer online?' },
          { type: 'quiz', question: 'What is required to succeed as a freelancer?', options: ['An office in the city centre', 'Working the exact same hours every single day', 'High self-discipline and time management'], correctIndex: 2 },
        ],
      },
      {
        id: 8,
        title: 'Entrepreneurship in Kenya',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Taking the leap into entrepreneurship means creating a business to solve a problem. In Kenya, our informal sector (the Jua Kali sector) is massive and full of incredible innovation.\n\nBeing an entrepreneur requires resilience. You will face challenges like raising capital, finding the right customers, and dealing with competition. But the reward is building something that is entirely yours.\n\nRemember, you don\'t need a groundbreaking new invention to be an entrepreneur. You just need to offer a product or service better, faster, or more reliably than others. Start small, solve a local problem, and grow from there.' },
          { type: 'pullquote', content: 'Entrepreneurs don\'t wait for opportunities. They create them.' },
          { type: 'insight_prompt', prompt: 'What is a problem in your community that a small business could solve?' },
          { type: 'quiz', question: 'What is the core goal of entrepreneurship?', options: ['To avoid having to work hard', 'To copy what everyone else is doing', 'To solve a problem by offering a product or service'], correctIndex: 2 },
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
      {
        id: 3,
        title: 'Friendship Red Flags',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Not everyone who calls you a friend is actually acting like one. A "red flag" is a warning sign that a friendship might be toxic. Recognising them early can save you a lot of heartache.\n\nRed flags include: teasing you about your insecurities, getting jealous when you succeed, pressuring you to break rules, or only calling you when they need something (like money or help with homework).\n\nA true friendship feels balanced. They celebrate your wins just as loudly as their own. If hanging out with someone constantly leaves you feeling drained or bad about yourself, it might be time to create some distance.' },
          { type: 'pullquote', content: 'Surround yourself with people who mention your name in a room full of opportunities, not gossip.' },
          { type: 'insight_prompt', prompt: 'Have you ever noticed a red flag in a friendship? How did you handle it?' },
          { type: 'quiz', question: 'Which of the following is a red flag in a friendship?', options: ['They disagree with you respectfully', 'They pressure you to do things you are uncomfortable with', 'They are busy and cannot always hang out'], correctIndex: 1 },
        ],
      },
      {
        id: 4,
        title: 'Family Dynamics',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Family relationships can be the most rewarding, and the most complicated. In many Kenyan homes, there is an expectation of strict obedience. But as you grow older, it is normal to want more independence.\n\nDisagreements with parents or guardians are normal. What matters is how you handle them. When you feel misunderstood, try waiting until everyone is calm before talking. Approach them with respect, but clearly explain your perspective.\n\nSometimes, family situations are genuinely difficult or unsafe. Remember that you are not responsible for fixing adult problems. If things at home are dangerous, reach out to a trusted teacher or call Childline Kenya at 116.' },
          { type: 'pullquote', content: 'You cannot choose your family, but you can choose how you respond to them and how you protect your own peace.' },
          { type: 'insight_prompt', prompt: 'What is one topic that often causes tension at home? How could you discuss it more peacefully?' },
          { type: 'quiz', question: 'What is the best way to handle a disagreement with a parent or guardian?', options: ['Shout to make sure your voice is heard', 'Wait until everyone is calm and communicate respectfully', 'Run away from home immediately'], correctIndex: 1 },
        ],
      },
      {
        id: 5,
        title: 'Respecting Differences',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Kenya is a beautiful, diverse country with over 40 distinct tribes, various religions, and people of all abilities. Respecting differences means understanding that our diversity is a strength, not a weakness.\n\nPrejudice (judging someone without knowing them) often comes from fear or ignorance. If you catch yourself believing a stereotype about a certain tribe or group, challenge that thought. Ask yourself: "Is this true for individuals, or is it just a rumor?"\n\nTrue respect goes beyond just "tolerating" someone. It means actively listening to their stories and celebrating what makes them unique.' },
          { type: 'pullquote', content: 'Our diversity is a beautiful mosaic. Every piece is different, but together they make a masterpiece.' },
          { type: 'insight_prompt', prompt: 'When was a time you learned something new from someone whose background was different from yours?' },
          { type: 'quiz', question: 'What is the best way to overcome prejudice?', options: ['Only interacting with people exactly like yourself', 'Believing stereotypes without questioning them', 'Actively learning about and respecting different backgrounds'], correctIndex: 2 },
        ],
      },
      {
        id: 6,
        title: 'Online Relationships & Safety',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Meeting people online can be exciting, but it requires serious caution. People are not always who their profile pictures claim they are. This is called "catfishing."\n\nThere are predators online who target young people by pretending to be their age or offering them gifts and money. Never share personal details like your exact location, school, or phone number with someone you have only met online.\n\nIf someone online asks you for inappropriate photos, pressures you, or makes you feel uncomfortable, block them immediately. You do not owe an online stranger politeness. Tell a trusted adult what happened.' },
          { type: 'pullquote', content: 'The internet is written in ink. Protect your privacy and your peace.' },
          { type: 'insight_prompt', prompt: 'What rules do you follow to stay safe when using social media?' },
          { type: 'quiz', question: 'What is the safest action if an online stranger asks for your personal information?', options: ['Give it to them if they seem nice', 'Block them and do not share any personal details', 'Ask for their information first'], correctIndex: 1 },
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
      {
        id: 3,
        title: 'HIV & STI Prevention',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'HIV and Sexually Transmitted Infections (STIs) remain a serious reality in Kenya. According to the National Syndemic Disease Control Council (NSDCC), young people aged 15-34 account for over 70% of new HIV infections in the country. This means the youth are the most vulnerable.\n\nThe most effective way to prevent HIV and STIs is abstinence (choosing not to have sex). If a person chooses to be sexually active, using condoms consistently and correctly is the best line of defense. Remember, you cannot tell if someone has an STI or HIV just by looking at them.\n\nTesting is free and confidential at government health facilities. Knowing your status is powerful. If tested positive, treatment (ARVs) is free and allows you to live a long, healthy life.' },
          { type: 'pullquote', content: 'Knowing your HIV status is not a reason to panic; it is the power to take control of your health.' },
          { type: 'insight_prompt', prompt: 'Why do you think HIV infections are still high among young people in Kenya today?' },
          { type: 'quiz', question: 'According to recent data, which age group accounts for the majority of new HIV infections in Kenya?', options: ['Older adults above 50 years', 'Young people aged 15 to 34 years', 'Only children under 10 years'], correctIndex: 1 },
        ],
      },
      {
        id: 4,
        title: 'Menstrual Health',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Menstruation (having a period) is a completely natural biological process. Half the world goes through it! Yet, many girls in Kenya still face stigma, shame, or lack of access to sanitary towels.\n\nLet\'s break the myths: You can absolutely wash your hair, exercise, cook, and participate in sports while on your period. A period is not a disease. Tracking your cycle helps you understand your body better and prepare ahead of time.\n\nBoys, this is for you too. Understanding menstrual health makes you a better brother, friend, and future partner. Period shaming should have no place in our schools or communities.' },
          { type: 'pullquote', content: 'A period is a sign of health, not a source of shame. Let\'s normalize talking about it.' },
          { type: 'insight_prompt', prompt: 'What is one common myth about periods you used to believe?' },
          { type: 'quiz', question: 'Which of the following is true about menstruation?', options: ['You should avoid any physical activity or sports', 'It is a natural, healthy biological process', 'It is a sign that you are unwell'], correctIndex: 1 },
        ],
      },
      {
        id: 5,
        title: 'Family Planning Basics',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Family planning simply means having the power to decide if, when, and how many children to have. Information about contraception is a right, not a secret.\n\nThere are many methods of avoiding unplanned pregnancies. Some are hormonal (like pills, implants, or injections), which stop the body from releasing an egg. Others are barrier methods (like condoms), which physically block sperm and also protect against STIs.\n\nMyths about family planning are common—like the false idea that contraceptives make you permanently infertile. If you or someone you know wants accurate information, local clinics provide free and confidential counseling. Always get medical advice from a professional, not from social media rumors.' },
          { type: 'pullquote', content: 'Having access to accurate health information is your basic human right.' },
          { type: 'insight_prompt', prompt: 'Why is access to family planning information important for young people\'s futures?' },
          { type: 'quiz', question: 'What is a dual benefit of using condoms?', options: ['They prevent pregnancy and protect against STIs', 'They offer permanent family planning', 'They are 100% effective 100% of the time'], correctIndex: 0 },
        ],
      },
      {
        id: 6,
        title: 'Where to Get Help',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Taking care of your sexual and reproductive health means knowing where to go when you need help, advice, or medical care. You do not have to figure everything out on your own.\n\nFor immediate support, you can call free, confidential hotlines: Childline Kenya at 116 handles all issues related to youth protection, and the national GBV hotline 1195 is available 24/7 if you or someone you know experiences gender-based violence.\n\nGovernment health centers, youth-friendly clinics, and organizations like Marie Stopes offer free or low-cost counseling, STI testing, and contraceptives. Find a trusted adult—like a school counselor, favorite auntie, or church youth leader—who can help you access these services safely.' },
          { type: 'pullquote', content: 'Asking for help is the bravest thing you can do for your health.' },
          { type: 'insight_prompt', prompt: 'If a friend confided in you that they needed health advice, who is a trusted adult you would direct them to?' },
          { type: 'quiz', question: 'What is the national toll-free hotline for reporting Gender-Based Violence (GBV) in Kenya?', options: ['116', '1195', '911'], correctIndex: 1 },
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
      {
        id: 3,
        title: 'Understanding Substances',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'In Kenya, substances like alcohol, miraa, shisha, and bhang are often seen at parties or in certain communities. Sometimes, young people use them to fit in, escape stress, or just because "everyone else is doing it."\n\nHowever, your brain is still developing until your mid-20s. Introducing strong substances during this time can permanently affect your memory, motivation, and mental health. The short-term "high" is rarely worth the long-term cost.\n\nIt is okay to be the person who says "No thanks." Real friends will respect your choice. If you or a friend is struggling with substance use, remember that addiction is a health issue, not a moral failure. Seek help from a counselor or a trusted adult.' },
          { type: 'pullquote', content: 'Protect your brain. It is the only one you have, and it has to last you a lifetime.' },
          { type: 'insight_prompt', prompt: 'What is one polite but firm way you could say \'no\' if someone offered you a substance you didn\'t want?' },
          { type: 'quiz', question: 'Why is substance use particularly risky for teenagers and young adults?', options: ['Because their brains are still developing', 'Because they might get caught by their parents', 'Because substances are too expensive'], correctIndex: 0 },
        ],
      },
      {
        id: 4,
        title: 'Social Media & Mental Health',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'We spend hours scrolling on TikTok, Instagram, and WhatsApp. It is a great way to stay connected, but it can also be a trap. Social media shows a filtered "highlight reel" of other people\'s lives, which can make you feel like your own life isn\'t good enough.\n\nConstant comparison breeds anxiety. Have you ever logged off feeling worse than when you logged on? That is a sign it\'s time to set digital boundaries.\n\nTry implementing a "screen-free hour" before bed. Unfollow accounts that make you feel bad about your body, your life, or your finances. Curate your feed so that it inspires you instead of draining you.' },
          { type: 'pullquote', content: 'Don\'t compare your behind-the-scenes with someone else\'s highlight reel.' },
          { type: 'insight_prompt', prompt: 'Look at your screen time today. How much time did you spend on social media, and how did it make you feel?' },
          { type: 'quiz', question: 'What is a healthy social media habit?', options: ['Scrolling through feeds right before going to sleep', 'Unfollowing accounts that make you feel negative or anxious', 'Checking notifications every 5 minutes during class'], correctIndex: 1 },
        ],
      },
      {
        id: 5,
        title: 'Building Healthy Habits',
        duration: '6 min',
        sections: [
          { type: 'text', content: 'Health isn\'t just about avoiding bad things; it is about actively doing good things for your body and mind. The three pillars of health are sleep, nutrition, and exercise.\n\nAs a young person, you need about 8-10 hours of sleep per night for your brain to process what you learned that day. For nutrition, aim for a balanced diet—local foods like sukuma wiki, beans, and healthy grains are powerful fuel.\n\nFinally, move your body! You don\'t need a fancy gym. Walking, playing football with friends, or dancing to Gengetone all count as exercise. Small daily choices build a massive foundation for your future health.' },
          { type: 'pullquote', content: 'Take care of your body. It is the only place you have to live.' },
          { type: 'insight_prompt', prompt: 'Which of the three pillars (sleep, nutrition, exercise) do you struggle with the most, and why?' },
          { type: 'quiz', question: 'Which of the following is considered one of the three main pillars of physical health?', options: ['Having the latest smartphone', 'Watching television every day', 'Getting 8-10 hours of sleep per night'], correctIndex: 2 },
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
