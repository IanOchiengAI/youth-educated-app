import type { Module } from './modules';

export const FREE_MODULES: Module[] = [
  {
    "id": "confidence",
    "title": "Confidence Building",
    "description": "Learn to believe in your abilities and take bold steps towards your future.",
    "icon": "⚡",
    "min_age": 10,
    "is_sensitive": false,
    "brothers_keepers_variant": false,
    "lessons": 7,
    "duration": "42 min",
    "competency": "Self-Efficacy",
    "difficulty": "Beginner",
    "content": [
      {
        "id": 1,
        "title": "What is Confidence?",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Confidence is not about being perfect — it's about trusting yourself even when you make mistakes. Think about a matatu conductor who calls out stops confidently even in heavy traffic. That confidence comes from doing it over and over, not from knowing everything.\n\nIn Kenya, many young people feel pressure to have all the answers. But real confidence means being okay with not knowing and still stepping forward. It's the voice inside that says \"I can figure this out.\""
          },
          {
            "type": "pullquote",
            "content": "Confidence is a muscle. The more you use it, the stronger it gets."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of a time you felt scared but did it anyway. How did you feel after?"
          },
          {
            "type": "quiz",
            "question": "Which of these is a sign of healthy confidence?",
            "options": [
              "Never admitting you are wrong",
              "Trying new things even if you are scared",
              "Comparing yourself to others on social media"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Building Your Confidence Daily",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Confidence grows through small daily actions. Every time you speak up in class, help a friend, or try something new, you're building the muscle.\n\nStart with something small today: greet someone new, answer a question in class even if you're not 100% sure, or share your opinion with a friend. Each small step adds up.\n\nRemember Wangari Maathai — she started by planting one tree. That one act of courage changed the whole of Kenya and inspired millions around the world."
          },
          {
            "type": "pullquote",
            "content": "You cannot plant a tree and expect it to grow tall overnight. The same is true for confidence."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one small thing you can do today to step outside your comfort zone?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to build daily confidence?",
            "options": [
              "Wait until you feel ready",
              "Take small consistent actions every day",
              "Only do things you are already good at"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "Your Inner Critic",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "That voice in your head telling you \"You can't do this\" or \"Everyone is judging you\" is called the inner critic. We all have it, even the most confident people. The trick is not to let it drive the matatu of your life.\n\nWhen your inner critic says \"You'll fail this exam,\" don't argue with it. Just say, \"Maybe, but I'm going to try my best anyway.\" Treat it like an annoying passenger — you hear them, but you don't have to follow their directions.\n\nIn Kenya, we face so much pressure from family and society to succeed. It's perfectly normal to feel doubt. True confidence is doing the work even when the doubt is loud."
          },
          {
            "type": "pullquote",
            "content": "Don't believe everything you think. Your inner critic is loud, but it is rarely accurate."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one negative thing your inner critic often tells you? How can you reframe it?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to deal with your inner critic?",
            "options": [
              "Try to never have negative thoughts",
              "Acknowledge the thought but choose to act anyway",
              "Listen to it because it is usually right"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 4,
        "title": "Body Language & Confidence",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Did you know that changing your posture can actually change how your brain feels? When you stand tall with your shoulders back, your brain releases chemicals that make you feel more powerful.\n\nThink about how athletes like Faith Kipyegon carry themselves before a race. Good posture, steady eye contact, and taking up space all signal confidence to others—and to yourself.\n\nNext time you walk into a room, a classroom, or even just down the street, imagine a string pulling you up from the top of your head. Walk with purpose. You belong in every room you enter."
          },
          {
            "type": "pullquote",
            "content": "Stand tall, even on the days you feel small. Your body can teach your mind how to be brave."
          },
          {
            "type": "insight_prompt",
            "prompt": "Notice your posture right now. How does it change the way you feel when you sit up straight?"
          },
          {
            "type": "quiz",
            "question": "How does body language affect confidence?",
            "options": [
              "It only changes how others see you",
              "It has no real effect",
              "It changes both how others see you and how you feel inside"
            ],
            "correctIndex": 2
          }
        ]
      },
      {
        "id": 5,
        "title": "Public Speaking Basics",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Public speaking is one of the most common fears in the world, stronger than the fear of spiders or heights! Whether it's reading a verse in church, presenting a project, or leading a school club, speaking up matters.\n\nThe secret is preparation. Knowing your material is 80% of the battle. The other 20% is remembering to breathe. When we get nervous, we talk fast. Take a deep breath, and slow down your words.\n\nRemember, no one is waiting for you to fail. They actually want you to succeed. Speak loud enough for the person in the back row to hear you. They need your voice!"
          },
          {
            "type": "pullquote",
            "content": "Your voice matters. Don't hide it because you're afraid it might shake."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is the scariest part of speaking in front of a group for you?"
          },
          {
            "type": "quiz",
            "question": "What is the most important thing to remember when public speaking?",
            "options": [
              "Talk as fast as possible to finish quickly",
              "Slow down, breathe, and speak clearly",
              "Memorize every single word perfectly"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 6,
        "title": "Handling Rejection",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Everybody faces rejection. Maybe you didn't make the football team, a friend ignored your text, or you didn't get selected for a program. It stings, but it's a completely normal part of life.\n\nIn Sheng, we say \"Kuja na yako\" – bring your own. Sometimes an opportunity isn't the right fit, and that just means you need to create your own path. Rejection is rarely about you being \"not good enough\"; it's usually just about timing and fit.\n\nLupita Nyong'o faced countless rejections before winning an Oscar. She didn't let a \"No\" define her worth. A \"No\" is just a detour, not a dead end."
          },
          {
            "type": "pullquote",
            "content": "Rejection is redirection. When one door closes, it means you're meant to walk through a different one."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of a time you faced a \"No\" that ended up being a good thing. What happened?"
          },
          {
            "type": "quiz",
            "question": "How should you view rejection?",
            "options": [
              "As proof that you are not good enough",
              "As a detour and a chance to learn",
              "As a reason to stop trying"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 7,
        "title": "Celebrating Your Wins",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "We are often so focused on where we are going that we forget to celebrate how far we have come. Celebrating your wins, even the tiny ones, builds your confidence engine.\n\nYou don't need a huge party or a graduation ceremony to celebrate. Did you finish your homework? Safi! Did you help your parents without being asked? Good job! Did you handle a tough situation calmly? Be proud of yourself.\n\nTake time at the end of every week to list three things that went well. This simple habit trains your brain to notice success, making you more confident for the challenges ahead."
          },
          {
            "type": "pullquote",
            "content": "Don't wait until you reach the mountain top to enjoy the view. Celebrate the steps you take every day."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one small win you had this week that you haven't celebrated yet?"
          },
          {
            "type": "quiz",
            "question": "Why is it important to celebrate small wins?",
            "options": [
              "It trains your brain to notice success and builds confidence",
              "It makes other people jealous",
              "It means you don't have to work hard anymore"
            ],
            "correctIndex": 0
          }
        ]
      }
    ]
  },
  {
    "id": "resilience",
    "title": "Resilience",
    "description": "Develop the strength to bounce back from challenges and keep moving forward.",
    "icon": "🌿",
    "min_age": 10,
    "is_sensitive": false,
    "brothers_keepers_variant": false,
    "lessons": 6,
    "duration": "36 min",
    "competency": "Learning to Learn",
    "difficulty": "Beginner",
    "content": [
      {
        "id": 1,
        "title": "Bouncing Back",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Resilience is the ability to recover quickly from difficulties. Think of it like a spring — it gets compressed, but it always returns to its shape.\n\nIn Kenya, many young people face tough situations: family challenges, exam pressure, financial difficulties. Resilience doesn't mean these things don't affect you. It means you find a way through them.\n\nEliud Kipchoge failed many races before becoming a world champion. Each failure taught him something new. That's resilience — learning from the fall, not avoiding it."
          },
          {
            "type": "pullquote",
            "content": "It's not how many times you fall, but how many times you get back up."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one challenge you are facing right now? How can you \"bounce back\"?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to build resilience?",
            "options": [
              "Avoiding all difficult situations",
              "Learning from failures and trying again",
              "Waiting for someone else to fix your problems"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "The Growth Mindset",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "A growth mindset means believing you can improve through effort and practice. When you say \"I can't do math,\" try adding \"yet\" — \"I can't do math yet.\"\n\nPeople with a growth mindset see challenges as opportunities. A bad grade isn't the end — it's feedback telling you what to work on next.\n\nIn many Kenyan communities, we have a saying: \"Haraka haraka haina baraka\" — hurry hurry has no blessing. Growth takes time, and that's perfectly fine."
          },
          {
            "type": "pullquote",
            "content": "The word \"yet\" is the most powerful word in the English language. Add it to any limitation."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is something you believe you \"can't\" do? Try adding \"yet\" and write how that feels different."
          },
          {
            "type": "quiz",
            "question": "Someone with a growth mindset would say:",
            "options": [
              "\"I'm just not smart enough\"",
              "\"This is hard, but I can learn if I keep trying\"",
              "\"Some people are just naturally talented\""
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "Your Support Network",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Nobody gets through life alone. A support network is your team—the people you can lean on when things get tough. This could be a trusted teacher, an auntie, your church youth leader, or a close friend.\n\nIn Kenya, we have the spirit of Harambee, which means \"let's pull together.\" When one person is struggling, the community steps in to help. Have you built your own personal Harambee team?\n\nIt takes courage to ask for help. It is not a sign of weakness; it is a sign that you are smart enough to know when the load is too heavy for one person."
          },
          {
            "type": "pullquote",
            "content": "Asking for help is not giving up. It is refusing to give up."
          },
          {
            "type": "insight_prompt",
            "prompt": "Name three people in your life you could call if you were in trouble right now."
          },
          {
            "type": "quiz",
            "question": "What is the purpose of a support network?",
            "options": [
              "To do all your work for you",
              "To provide help and encouragement when things are difficult",
              "To give you money whenever you ask"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 4,
        "title": "Dealing with Loss",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Loss comes in many forms. It could be losing a loved one, a friendship ending, or failing a crucial exam like the KCSE. Grief is the natural response to loss, and it doesn't follow a neat schedule.\n\nSometimes people will tell you to \"just get over it\" or \"be strong.\" But true strength is allowing yourself to feel the sadness. It is okay to cry. It is okay to not be okay for a while.\n\nHealing happens slowly. You don't forget what you lost, but over time, you learn how to carry it. Be gentle with yourself on the heavy days."
          },
          {
            "type": "pullquote",
            "content": "Grief is just love with nowhere to go. Give yourself the grace to feel it."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one healthy way you comfort yourself when you are feeling sad?"
          },
          {
            "type": "quiz",
            "question": "What is a healthy response to experiencing loss?",
            "options": [
              "Pretending it doesn't bother you",
              "Allowing yourself to feel sad and taking time to heal",
              "Getting angry at everyone around you"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 5,
        "title": "Stress Management",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "School, family expectations, chores, and friendships—Kenyan youth carry a lot of stress. When you're stressed, your body goes into \"fight or flight\" mode. Your heart beats faster, and your mind races.\n\nTo manage stress, you have to signal to your body that it is safe. The fastest way to do this is through your breath. Try the 4-7-8 method: breathe in for 4 seconds, hold for 7, and exhale slowly for 8 seconds.\n\nOther great ways to manage stress are physical activity—like playing football or taking a walk—and journaling. Get the stressful thoughts out of your head and onto a piece of paper."
          },
          {
            "type": "pullquote",
            "content": "You don't have to have it all figured out today. Just take the next small step."
          },
          {
            "type": "insight_prompt",
            "prompt": "When you feel overwhelmed, where do you feel the tension in your body?"
          },
          {
            "type": "quiz",
            "question": "Which of the following is an effective way to lower stress levels quickly?",
            "options": [
              "Scrolling on social media for hours",
              "Deep, slow breathing exercises",
              "Drinking energy drinks"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 6,
        "title": "Turning Setbacks into Comebacks",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "A setback is just a setup for a comeback. Look at some of the most successful Kenyans. Many businesses fail before one succeeds. Many athletes lose before they win gold.\n\nWhen a setback happens, ask yourself: \"What can I learn from this?\" If you failed a test, did you study the wrong material? If a friendship ended, what did it teach you about your boundaries?\n\nDon't let a bad moment convince you that you have a bad life. Adjust your strategy, dust yourself off, and try again tomorrow. Your story is far from over."
          },
          {
            "type": "pullquote",
            "content": "The master has failed more times than the beginner has even tried."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of a time you failed at something. What is one lesson you learned from that experience?"
          },
          {
            "type": "quiz",
            "question": "How should you view a setback?",
            "options": [
              "As an opportunity to learn and try again",
              "As a clear sign that you should give up completely",
              "As somebody else's fault"
            ],
            "correctIndex": 0
          }
        ]
      }
    ]
  },
  {
    "id": "communication",
    "title": "Communication Skills",
    "description": "Learn to express yourself clearly and listen effectively to others.",
    "icon": "🗣️",
    "min_age": 10,
    "is_sensitive": false,
    "brothers_keepers_variant": false,
    "lessons": 6,
    "duration": "36 min",
    "competency": "Communication & Collaboration",
    "difficulty": "Intermediate",
    "content": [
      {
        "id": 1,
        "title": "The Power of Listening",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Most people think communication is about speaking well. But the best communicators are actually the best listeners.\n\nActive listening means giving your full attention when someone is speaking — not planning what you'll say next, not checking your phone, but truly hearing them.\n\nIn Kenyan culture, elders teach us \"Sikia kwanza, sema baadaye\" — listen first, speak later. This wisdom applies in friendships, school, and future careers."
          },
          {
            "type": "pullquote",
            "content": "You have two ears and one mouth. Use them in that proportion."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of someone who makes you feel truly heard. What do they do differently?"
          },
          {
            "type": "quiz",
            "question": "What is active listening?",
            "options": [
              "Waiting for your turn to speak",
              "Giving your full attention and understanding the speaker",
              "Agreeing with everything the other person says"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Expressing Yourself Clearly",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Clear communication is about saying what you mean in a way others can understand. This doesn't mean using big words — it means being honest and direct.\n\nThe \"I feel... when... because...\" framework is powerful:\n• I feel frustrated when my ideas are ignored because I have good contributions.\n• I feel happy when people ask my opinion because it shows respect.\n\nPractice this with a friend or family member today."
          },
          {
            "type": "pullquote",
            "content": "Clarity is kindness. When you say what you mean, you help everyone around you."
          },
          {
            "type": "insight_prompt",
            "prompt": "Write an \"I feel... when... because...\" statement about something in your life right now."
          },
          {
            "type": "quiz",
            "question": "Which is the clearest way to express a feeling?",
            "options": [
              "\"You always ignore me!\"",
              "\"I feel frustrated when my ideas aren't heard because I want to contribute\"",
              "\"Whatever, it doesn't matter\""
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "Conflict Resolution",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Conflict is a normal part of any relationship. Whether it's a disagreement with a sibling or an argument with a friend, the goal shouldn't be to \"win\" the fight. The goal is to solve the problem.\n\nWhen tempers flare, we often say things we don't mean. If you feel yourself getting too angry, take a timeout. Say, \"I need a few minutes to cool down before we talk about this.\"\n\nWhen you return, use \"I\" statements instead of \"You\" statements. Focus on the issue, not the person. Instead of \"You are so selfish,\" try \"I felt hurt when you didn't share with me.\" Attack the problem, not the person."
          },
          {
            "type": "pullquote",
            "content": "Peace is not the absence of conflict; it is the ability to handle conflict by peaceful means."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of a recent argument you had. How could you have handled it differently using an \"I\" statement?"
          },
          {
            "type": "quiz",
            "question": "What is the best goal when resolving a conflict?",
            "options": [
              "To prove that the other person is completely wrong",
              "To solve the problem and understand each other",
              "To shout the loudest so they listen to you"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 4,
        "title": "Digital Communication",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Texting, WhatsApp, and social media have completely changed how we talk. But digital communication misses a lot of context—like tone of voice and body language. That is why a simple \"K\" or \"Sawa\" can sometimes feel rude!\n\nBefore you hit send, read your message out loud. Ask yourself: \"Could this be misunderstood?\" If you're discussing something emotional or complicated, a phone call or a voice note is usually better than a long paragraph of texts.\n\nAlso, remember the digital permanence rule: Never text or post anything you wouldn't want printed on the front page of the Daily Nation. Digital words live forever."
          },
          {
            "type": "pullquote",
            "content": "Text carefully. Tone is easily lost through a screen, and words typed in anger cannot be unread."
          },
          {
            "type": "insight_prompt",
            "prompt": "Have you ever had a misunderstanding with a friend over a text message? What happened?"
          },
          {
            "type": "quiz",
            "question": "Which situation is best handled through a phone call rather than a text message?",
            "options": [
              "Sharing a funny meme",
              "Discussing a complicated or emotional problem",
              "Asking what time a meeting starts"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 5,
        "title": "Saying No Respectfully",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Many of us are people-pleasers. We say \"yes\" to things we don't have time for because we don't want to disappoint anyone. But every time you say yes to something you don't want to do, you are saying no to your own peace.\n\nYou can say no without being rude. Try these phrases:\n• \"I don't have the capacity for that right now.\"\n• \"I'd love to help, but I'm swamped with schoolwork.\"\n• \"That sounds fun, but I need some quiet time today.\"\n\nSaying no is a muscle. The first time you use it, it feels uncomfortable. But the more you use it, the easier it gets to protect your time and energy."
          },
          {
            "type": "pullquote",
            "content": "'No' is a complete sentence. You do not need to provide a long list of excuses."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is something you recently said 'yes' to, but you really wished you had said 'no'?"
          },
          {
            "type": "quiz",
            "question": "What is a respectful way to say no?",
            "options": [
              "Just ignore their request completely",
              "\"I would love to help, but I don't have the time right now.\"",
              "\"Are you crazy? I am way too busy for you!\""
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 6,
        "title": "Storytelling & Persuasion",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Humans are wired for stories. If you want to persuade someone—whether you're convincing your parents to let you go on a trip, or convincing an employer to hire you—facts tell, but stories sell.\n\nA good story has a clear structure: the setup (who and where), the conflict (the problem), and the resolution (how it was fixed). Next time you are trying to make a point, frame it as a story.\n\nUsing local context makes your stories stronger. When you compare a challenge to navigating the Nairobi traffic jam, or finding a seat in a full matatu, people instantly understand exactly what you mean."
          },
          {
            "type": "pullquote",
            "content": "Storytelling is the most powerful way to put ideas into the world today."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of a time you convinced someone of something. What did you say that changed their mind?"
          },
          {
            "type": "quiz",
            "question": "Why is storytelling effective for persuasion?",
            "options": [
              "Because people prefer listening to facts and statistics",
              "Because humans connect emotionally to stories better than raw facts",
              "Because it makes the conversation shorter"
            ],
            "correctIndex": 1
          }
        ]
      }
    ]
  },
  {
    "id": "relationships",
    "title": "Healthy Relationships",
    "description": "Build meaningful connections based on respect, trust, and communication.",
    "icon": "💛",
    "min_age": 10,
    "is_sensitive": false,
    "brothers_keepers_variant": true,
    "lessons": 6,
    "duration": "36 min",
    "competency": "Communication & Collaboration",
    "difficulty": "Intermediate",
    "content": [
      {
        "id": 1,
        "title": "What Makes a Healthy Relationship?",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Healthy relationships — whether friendships, family bonds, or romantic relationships — are built on three things: respect, trust, and communication.\n\nRespect means valuing someone's feelings, boundaries, and choices — even when you disagree. Trust is built through consistency — doing what you say you'll do. And communication means being honest and listening.\n\nUnhealthy relationships often involve control, put-downs, or pressure. If someone makes you feel small, pressured, or unsafe, that's not love — that's a red flag."
          },
          {
            "type": "pullquote",
            "content": "A relationship should make you feel safe enough to be yourself, not scared of being yourself."
          },
          {
            "type": "insight_prompt",
            "prompt": "Think of your closest friendship. What makes it healthy? What could be better?"
          },
          {
            "type": "quiz",
            "question": "Which is a sign of a healthy relationship?",
            "options": [
              "One person makes all the decisions",
              "Both people feel respected and heard",
              "You change who you are to make them happy"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 2,
        "title": "Setting Boundaries",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Boundaries are the limits you set to protect your wellbeing. They're not selfish — they're necessary.\n\n\"No\" is a complete sentence. You don't have to explain why you don't want to do something. Healthy people respect boundaries.\n\nExamples of healthy boundaries:\n• \"I'm not comfortable with that\"\n• \"I need some time alone right now\"\n• \"Please don't go through my phone\"\n• \"I'm not ready for that\""
          },
          {
            "type": "pullquote",
            "content": "Setting boundaries is not about building walls — it's about building doors that only open with your permission."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one boundary you wish you could set? What stops you from setting it?"
          },
          {
            "type": "quiz",
            "question": "What should you do when someone doesn't respect your boundary?",
            "options": [
              "Give in to keep the peace",
              "Restate your boundary clearly and firmly",
              "Get angry and shout at them"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 3,
        "title": "Friendship Red Flags",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Not everyone who calls you a friend is actually acting like one. A \"red flag\" is a warning sign that a friendship might be toxic. Recognising them early can save you a lot of heartache.\n\nRed flags include: teasing you about your insecurities, getting jealous when you succeed, pressuring you to break rules, or only calling you when they need something (like money or help with homework).\n\nA true friendship feels balanced. They celebrate your wins just as loudly as their own. If hanging out with someone constantly leaves you feeling drained or bad about yourself, it might be time to create some distance."
          },
          {
            "type": "pullquote",
            "content": "Surround yourself with people who mention your name in a room full of opportunities, not gossip."
          },
          {
            "type": "insight_prompt",
            "prompt": "Have you ever noticed a red flag in a friendship? How did you handle it?"
          },
          {
            "type": "quiz",
            "question": "Which of the following is a red flag in a friendship?",
            "options": [
              "They disagree with you respectfully",
              "They pressure you to do things you are uncomfortable with",
              "They are busy and cannot always hang out"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 4,
        "title": "Family Dynamics",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Family relationships can be the most rewarding, and the most complicated. In many Kenyan homes, there is an expectation of strict obedience. But as you grow older, it is normal to want more independence.\n\nDisagreements with parents or guardians are normal. What matters is how you handle them. When you feel misunderstood, try waiting until everyone is calm before talking. Approach them with respect, but clearly explain your perspective.\n\nSometimes, family situations are genuinely difficult or unsafe. Remember that you are not responsible for fixing adult problems. If things at home are dangerous, reach out to a trusted teacher or call Childline Kenya at 116."
          },
          {
            "type": "pullquote",
            "content": "You cannot choose your family, but you can choose how you respond to them and how you protect your own peace."
          },
          {
            "type": "insight_prompt",
            "prompt": "What is one topic that often causes tension at home? How could you discuss it more peacefully?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to handle a disagreement with a parent or guardian?",
            "options": [
              "Shout to make sure your voice is heard",
              "Wait until everyone is calm and communicate respectfully",
              "Run away from home immediately"
            ],
            "correctIndex": 1
          }
        ]
      },
      {
        "id": 5,
        "title": "Respecting Differences",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Kenya is a beautiful, diverse country with over 40 distinct tribes, various religions, and people of all abilities. Respecting differences means understanding that our diversity is a strength, not a weakness.\n\nPrejudice (judging someone without knowing them) often comes from fear or ignorance. If you catch yourself believing a stereotype about a certain tribe or group, challenge that thought. Ask yourself: \"Is this true for individuals, or is it just a rumor?\"\n\nTrue respect goes beyond just \"tolerating\" someone. It means actively listening to their stories and celebrating what makes them unique."
          },
          {
            "type": "pullquote",
            "content": "Our diversity is a beautiful mosaic. Every piece is different, but together they make a masterpiece."
          },
          {
            "type": "insight_prompt",
            "prompt": "When was a time you learned something new from someone whose background was different from yours?"
          },
          {
            "type": "quiz",
            "question": "What is the best way to overcome prejudice?",
            "options": [
              "Only interacting with people exactly like yourself",
              "Believing stereotypes without questioning them",
              "Actively learning about and respecting different backgrounds"
            ],
            "correctIndex": 2
          }
        ]
      },
      {
        "id": 6,
        "title": "Online Relationships & Safety",
        "duration": "6 min",
        "sections": [
          {
            "type": "text",
            "content": "Meeting people online can be exciting, but it requires serious caution. People are not always who their profile pictures claim they are. This is called \"catfishing.\"\n\nThere are predators online who target young people by pretending to be their age or offering them gifts and money. Never share personal details like your exact location, school, or phone number with someone you have only met online.\n\nIf someone online asks you for inappropriate photos, pressures you, or makes you feel uncomfortable, block them immediately. You do not owe an online stranger politeness. Tell a trusted adult what happened."
          },
          {
            "type": "pullquote",
            "content": "The internet is written in ink. Protect your privacy and your peace."
          },
          {
            "type": "insight_prompt",
            "prompt": "What rules do you follow to stay safe when using social media?"
          },
          {
            "type": "quiz",
            "question": "What is the safest action if an online stranger asks for your personal information?",
            "options": [
              "Give it to them if they seem nice",
              "Block them and do not share any personal details",
              "Ask for their information first"
            ],
            "correctIndex": 1
          }
        ]
      }
    ]
  }
];
