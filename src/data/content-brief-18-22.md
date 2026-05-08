# Youth Educated — 18–22 Content Research Brief

## Your job
Research and write content for the **Youth Educated** app targeting Kenyan youth aged **18–22**.
This is a life-skills and mentorship app. Content must be:
- Grounded in the **Kenyan context** (KCSE → university/polytechnic/TVET transition, unemployment, urban-rural, M-Pesa, family pressure, etc.)
- Written like a **trusted older sibling or mentor** — warm, direct, no jargon, no lectures
- **Practical** — every piece should leave the reader with something they can do today
- Available in **English** (primary) with a Kiswahili version of the title (secondary)

---

## Where to put the output

### 1. Life Kit Articles → `src/data/lifekit.ts`

Append new articles to the `LIFEKIT_ARTICLES` array. Use this exact TypeScript format:

```typescript
{
  id: 'string',           // Format: category-prefix + number, e.g. 'ya-1', 'ya-2' (ya = young adult)
  title: 'string',        // English title (plain sentence, not a question format)
  title_sw: 'string',     // Kiswahili title
  category: 'string',     // One of: 'mentor-stories' | 'school' | 'mental-health' | 'relationships' | 'safety' | 'future' | 'money'
  tags: string[],         // 1–3 tags from: 'Exams','Friendship','Stress','Confidence','Money','Career','MentalHealth','School','Safety','Future','Decisions','Technology'
  emoji: 'string',        // Single emoji that fits the topic
  readTime: 'string',     // e.g. '4 min'
  body: 'string',         // Full article body in English — 300–500 words. Use **bold** for emphasis. Use numbered or bulleted lists where helpful. Write in first-person mentor voice.
  body_sw: 'string',      // Kiswahili translation of body — same length and structure
  month: 1                // Set to 2 (Month 2 content)
}
```

### 2. Modules → `src/data/modules.ts`

If you write a full module (see format below), append it to the `MODULES` array. A module is deeper than a Life Kit article — it has multiple lessons with sections.

```typescript
{
  id: 'string',                        // e.g. 'adulting-basics'
  title: 'string',                     // Module title
  description: 'string',               // 1-sentence description
  icon: 'string',                      // Single emoji
  min_age: 18,                         // For 18-22 content
  is_sensitive: false,
  brothers_keepers_variant: false,
  isPremium: true,                     // All 18-22 modules are YE+ content
  lessons: number,                     // Count of lessons
  duration: 'string',                  // e.g. '45 min'
  competency: 'string',                // Core skill being built
  difficulty: 'string',                // 'Intermediate' or 'Advanced'
  content: [
    {
      id: 1,
      title: 'string',
      duration: 'string',
      sections: [
        { type: 'text', content: 'string' },
        { type: 'pullquote', content: 'string' },
        { type: 'insight_prompt', prompt: 'string' },
        { type: 'quiz', question: 'string', options: ['A','B','C'], correctIndex: 0 }
      ]
    }
  ]
}
```

---

## Research questions and content to produce

### Priority 1 — Life Kit Articles (18–22)

Write **14 articles** across these categories. Research each topic using Kenyan statistics, KNBS data, and relevant NGO/government reports where helpful. Every article must be culturally specific to Kenya.

**Been There, Learnt That (Mentor Stories)**
- `ya-ms-1`: "I graduated with a degree and had no job for 2 years. Here is what I did"
  - Cover: the emotional reality of graduate unemployment in Kenya, practical steps (internships, gig economy, freelancing), mindset shift from certificate-hunting to skill-building
- `ya-ms-2`: "Moving out for the first time nearly broke me. What I wish I knew"
  - Cover: rental deposits, bedsitter life, cooking, loneliness, managing without family safety net, practical budgeting for Nairobi/Mombasa/Kisumu

**School & Transition**
- `ya-sl-1`: "KCSE results are out. Now what? A real guide to your options"
  - Cover: university vs TVET vs polytechnic vs gap year, JAB applications, HELB loans, skills-based routes that pay well (coding, plumbing, hairdressing), how to talk to parents about your choice
- `ya-sl-2`: "How to survive your first year at university or college without losing yourself"
  - Cover: adjusting from high school structure, managing freedom, study strategies for university, budgeting your HELB loan, finding community

**Mental Health**
- `ya-mh-1`: "Quarter-life crisis is real. Here is how to get through it"
  - Cover: the 18-25 identity confusion (Who am I? What am I doing?), Kenyan-specific pressures (family expectations, comparison culture, social media), practical grounding techniques
- `ya-mh-2`: "How to deal with family pressure about your choices"
  - Cover: parental expectations around careers, marriage, money, communication strategies that respect elders while asserting yourself, boundary-setting in a collectivist culture

**Relationships & Social Life**
- `ya-rs-1`: "Navigating romantic relationships when you are broke and ambitious"
  - Cover: money and romance in Kenya (who pays, dating costs, financial boundaries), keeping relationships healthy under stress, recognising when a relationship is holding you back
- `ya-rs-2`: "Friendships change after school. How to handle it"
  - Cover: why friendships drift, how to make new friends as an adult, toxic friendship patterns that emerge in early adulthood

**Safety & Life Skills**
- `ya-sa-1`: "Digital safety for young adults: protecting your M-Pesa, your data, and your reputation"
  - Cover: SIM-swap fraud, M-Pesa scams common in Kenya, safeguarding your online presence from future employers, sexting and digital coercion awareness
- `ya-sa-2`: "Signing your first contract or lease. What to check before you say yes"
  - Cover: employment contracts (probation, NSSF/NHIF, notice period), bedsitter/house lease red flags, what 'goodwill' means, tenant rights in Kenya

**Future & Career**
- `ya-fc-1`: "How to get your first job in Kenya when you have no connections"
  - Cover: using LinkedIn, cold-messaging, Fuzu, BrighterMonday, how to write a CV that gets read, the power of showing up in person, internship-to-hire strategies
- `ya-fc-2`: "Starting a small business with under KES 5,000"
  - Cover: low-capital business ideas that work in Kenya (mitumba, food delivery, M-Pesa agent, content creation), how to register with Biashara Kenya, avoiding common mistakes

**Money Basics**
- `ya-mb-1`: "Your first salary: how not to spend it all in the first week"
  - Cover: the 50/30/20 rule adapted for low Kenyan salaries, saving before spending, SACCO membership, why M-Pesa savings lock (lock savings) actually works
- `ya-mb-2`: "HELB loan, NHIF, NSSF: the Kenyan adulting paperwork you cannot ignore"
  - Cover: how HELB repayment works, consequences of defaulting, NHIF benefits and how to register, NSSF basics, what happens if you skip all of this

---

### Priority 2 — Full Module (Optional, high value)

Write one complete module if time allows:

**Module: "Adulting 101: Life Skills for 18–22"**
- `id`: `adulting-basics`
- Target: 18–22, min_age: 18, isPremium: true
- 6 lessons, ~45 min total
- Competency: Life Skills & Independence
- Lessons:
  1. "Managing money on a tight budget" (8 min) — budgeting, HELB, savings
  2. "Getting and keeping your first job" (8 min) — CV, interviews, workplace conduct
  3. "Understanding your rights" (7 min) — tenant rights, employment rights, NHIF/NSSF
  4. "Mental health for young adults" (8 min) — stress management, seeking help in Kenya
  5. "Relationships and boundaries" (7 min) — romantic, family, work boundaries
  6. "Building your future from zero" (7 min) — goal-setting, side hustles, long-term thinking

---

## Tone guide

Do NOT write like a textbook. Write like this:

> "Let me be real with you — I graduated from Kenyatta University in 2019 with a Second Class Honours and genuinely believed life was about to sort itself out. It did not. Not immediately. Here is what actually happened and what I learned from it."

NOT like this:

> "Young adults in Kenya face numerous socioeconomic challenges that require strategic navigation of available resources."

Every article should feel like something a smart, caring 28-year-old Kenyan who has been through it is saying directly to you.

---

## Output format

Paste the completed TypeScript objects directly into the files listed above.
- For Life Kit articles: add to the `LIFEKIT_ARTICLES` array in `src/data/lifekit.ts`
- For modules: add to the `MODULES` array in `src/data/modules.ts`

Do not change any other part of those files. Only append.
