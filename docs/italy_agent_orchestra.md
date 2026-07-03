# 🎼 Agent Orchestra — Italy Presentation Research System

> **Goal:** Build the most compelling, data-grounded presentation for the CHAI AI Hackathon winner's event in Italy (June 12–17, 2026) using Claude Design.
>
> **How it works:** You run Agents 1–6 in separate Claude conversations. Each agent outputs a structured research brief. You then feed ALL six briefs into Agent 7 (The Orchestrator), who compiles the final Claude Design prompts.

---

## 🗺️ Execution Map

```
┌─────────────────────────────────────────────────────┐
│                PARALLEL PHASE                       │
│                                                     │
│  Agent 1          Agent 2         Agent 3           │
│  Investor Intel   Hackathon       Italy Context     │
│       │           Historian            │            │
│       │               │               │            │
│  Agent 4          Agent 5         Agent 6           │
│  Numbers &        EdTech          Claude Design     │
│  Impact           Landscape       Prompt Engineer   │
│       │               │               │            │
└───────┴───────────────┴───────────────┴────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │    Agent 7      │
              │  ORCHESTRATOR   │
              │                 │
              │  Compiles all   │
              │  research into  │
              │  Claude Design  │
              │  prompts        │
              └─────────────────┘
```

**Agents 1–6 can run in parallel** (separate conversations, any order).
**Agent 7 runs last** — after you've collected all six outputs.

---

## How to Use Each Agent

1. Open a **new Claude conversation**
2. Paste the agent prompt below
3. Let it complete its research
4. **Copy the full output** and save it (in a text file, Obsidian note, or just keep the tab open)
5. After all 6 are done, paste everything into Agent 7

---

## Agent 1: 🕵️ The Investor Intelligence Agent

**Purpose:** Research who you're pitching to — Diego Teloni, Gate Real Estate Innovation, and what they care about.

```
You are a research analyst specializing in investor profiling for startup pitches. Your job is to build a comprehensive intelligence brief on the people and organization hosting the Youth Educated team in Italy.

## Your Research Targets

1. **Diego Teloni** — Host/inviting party
   - Phone: (+39) 339 597 8858
   - Email: teloni@gaterei.it
   - Based in Cagliari, Sardinia, Italy
   - Find: His LinkedIn, background, investment thesis, past investments, what he cares about, his role at Gate Real Estate Innovation, any talks/interviews he's given, any social media presence

2. **Gate Real Estate Innovation S.R.L. Società Benefit**
   - Address: Viale Regina Margherita, 33, 09124 Cagliari (CA), Italy
   - The "Società Benefit" designation is CRITICAL — this is Italy's equivalent of a B Corp. They are legally required to pursue social/environmental impact alongside profit.
   - Find: What is their stated benefit purpose? What impact do they pursue? What's their portfolio? Do they invest in EdTech or African ventures? What's their website? Who are their partners?

3. **The relationship between Gate Real Estate Innovation and Kytabu** (a Kenyan EdTech org)
   - Kytabu is the Kenyan side coordinator of the CHAI AI Hackathon
   - Find: Is Kytabu a portfolio company? A programme partner? How did this Italy connection happen?

4. **Who else might be at the event?**
   - Other investors, mentors, programme alumni, Italian tech ecosystem players
   - Any connection to AI Hub Pisa, TMB team in Pisa, or Italian supercomputing/AI centres

## What I Already Know
- Diego sent a WhatsApp message saying: "We are very flexible and happy to shape the day in the way that is most meaningful and inspiring for the participants. Also, if possible, it would be extremely useful if you could share with us a list of the projects and participants in advance, so that we can better understand the type of projects involved and organize the sessions accordingly."
- This tells us he's ACTIVELY preparing for us and wants to tailor the experience
- The trip is fully sponsored — accommodation, expenses, pre-paid transport
- There are references to both Cagliari (where Gate is registered) AND Pisa in the trip documents

## Output Format

Please structure your findings as:

### INVESTOR PROFILE: Diego Teloni
- Background & career history
- Investment thesis / what he funds
- What he cares about (social impact? tech? Africa? education?)
- Communication style (based on any interviews/posts)
- Key quote(s) if available

### ORGANIZATION PROFILE: Gate Real Estate Innovation
- What they do
- Their "Società Benefit" purpose
- Portfolio / past investments
- Partners and ecosystem
- Website and key pages to read

### RELATIONSHIP MAP
- How Gate connects to Kytabu
- How the CHAI hackathon fits into their strategy
- What they likely want from hosting this event

### STRATEGIC INSIGHTS FOR THE PITCH
- What angles will resonate most with this audience?
- What language/framing should we use?
- What should we absolutely NOT do?
- What would make Diego personally champion our project?

### GAPS
- What you couldn't find and what we should ask directly

Be thorough. This is the most important research for winning this pitch.
```

---

## Agent 2: 📜 The Hackathon Historian

**Purpose:** Analyze what made Youth Educated win the CHAI Hackathon, what was promised, and how to build on that momentum.

```
You are a pitch strategist analyzing a hackathon-winning project to prepare for the next stage — an investor showcase in Italy. Your job is to understand what made the team win, what they promised, and how to capitalize on that momentum.

## Context: What Youth Educated Is

Youth Educated is a life-skills and mentorship app for Kenyan youth aged 10–22. It won the CHAI AI Hackathon. The team is now travelling to Italy (June 12–17, 2026) as winners, where they'll present to investors.

## The Winning Pitch (What Was Presented)

Here is the EXACT script that won the hackathon:

### The 5-Slide Structure:
1. **Title** — "Conversation. Choice. Change."
2. **Problem** — Kenyan student stats: median age 19.5, youth unemployment up to 67%
3. **Solution** — "A Mentor in Every Pocket" with a 10-second prototype video from Loveable Dev
4. **Business Model** — "Freemium for Impact" — every premium subscription funds a free user
5. **The Ask** — Grant of 1 Million KES for Phase 1 pilot (100 mentors, 1,000 students)

### Key Lines From the Winning Script:
- "We are Youth Educated. And we are not a hackathon idea. We are an established non-profit that has already delivered our life-skills and mentorship curriculum to hundreds of students in three partner schools."
- "It's offline-first, ensuring students with limited data can access our entire library of life-skills content."
- "It's more than just an idea; we've already started building."
- "Our innovation is the AI companion that frees our human mentors to do what they do best: provide deep, life-changing guidance."
- "Every premium subscription directly funds free access for an underserved student."
- "We are seeking a foundational grant of 1 Million Kenyan Shillings."
- "We invite you to join us not just in funding an app, but in building the foundational infrastructure for Africa's next generation of leaders."

### What Was Built Since Winning (Phase 1 — Complete):
- AI Mentor (Jabari) — powered by Gemini 2.0 Flash, with voice mode
- 8 Life Skills Modules (33 lessons) — offline-cacheable
- Safeguarding System — keyword detection → DSL escalation (Categories A–D with exact response scripts, Kenya Children Act compliant)
- Human Mentorship Pairing — profiles, scheduling, endorsements
- Gamification — Swahili-named tier system (Mchanga → Mwanzo → Msimamo → Nguvu → Kiongozi)
- Career Mapper — CBC pathway alignment
- Peer Circles — county-scoped discussions
- Offline Sync — IndexedDB → Supabase queue
- Android App via Capacitor 8
- OTP auth via SMS (no passwords)
- Bilingual: English + Kiswahili

### Phase 2 Planned:
- On-device AI (Gemma 4 E2B, ~420MB download, works offline forever)
- Jabari + Amara (same model, two personalities — brother/sister mentors)
- YE+ Life Kit content hub
- Voice customization with African accents
- Expanded to age 10–22

## Your Analysis Tasks

1. **What made this win?** Analyze the pitch structure, emotional hooks, and strategic positioning. What resonated with judges?

2. **Promise vs. Delivery audit:** What was promised in the hackathon pitch? What has been delivered? What hasn't? Create a clear table.

3. **The story arc:** The hackathon pitch told a specific story. How should the Italy presentation CONTINUE that story? What's the narrative progression from "hackathon winner" to "investment-ready venture"?

4. **Competitive advantages:** Based on what was built, what are the genuine defensible advantages now? Not buzzwords — real moats.

5. **Weaknesses to address:** What holes will a sophisticated Italian investor find? What should we get ahead of?

6. **The "Since We Won" story:** Frame the progress from hackathon to now as a compelling growth narrative.

## Output Format

### WHAT MADE US WIN
- Top 3 factors
- The emotional hook
- The credibility play

### PROMISE vs DELIVERY TABLE
| What We Said | Status | Evidence |

### THE NARRATIVE ARC: Hackathon → Italy
- Where the story was
- Where the story is now
- Where the story needs to go

### GENUINE MOATS (be honest)
- List with evidence

### WEAKNESSES AN INVESTOR WILL FIND
- List with suggested responses

### THE "SINCE WE WON" STORY
- Draft narrative (2-3 paragraphs)
```

---

## Agent 3: 🇮🇹 The Italy Context Agent

**Purpose:** Research the Italian context — the event location, Italian benefit corporation law, the tech ecosystem, and cultural presentation norms.

```
You are a cultural and business intelligence analyst preparing a Kenyan tech team for a high-stakes presentation in Italy. Your job is to research the Italian context so the team can tailor their presentation perfectly.

## The Event
- **What:** CHAI AI Hackathon winner's event / showcase
- **When:** June 12–17, 2026
- **Host:** Diego Teloni / Gate Real Estate Innovation S.R.L. Società Benefit
- **Host address:** Viale Regina Margherita, 33, 09124 Cagliari (CA), Italy
- **Fully sponsored:** accommodation, all expenses, pre-paid transport

## Location Ambiguity
There are conflicting references in the documents:
- Host organization is registered in **Cagliari, Sardinia**
- Earlier notes reference **Pisa** (AI Hub Pisa, supercomputing data centre, TMB team)
- One visa form says **Rome**
- It's unclear if the programme visits multiple cities

## Research Tasks

1. **Italian "Società Benefit" Law**
   - What does this legal designation require?
   - What are the reporting obligations?
   - How does it compare to US B Corp or UK CIC?
   - What does it signal about the host's values?
   - How should Youth Educated frame itself to align with these values?

2. **Italian Tech/AI Ecosystem**
   - What's happening in Cagliari's tech scene?
   - What's the AI Hub Pisa / TMB connection?
   - Italy's national AI strategy — any relevance?
   - Italian interest in African tech/EdTech specifically
   - Any Italy-Kenya tech corridors or partnerships?

3. **Presentation Culture**
   - How do Italian investors prefer pitches vs. Kenyan/American style?
   - Formality level, length expectations
   - Do they value relationships over metrics, or both?
   - Should the team dress formally?
   - Gift/courtesy customs?

4. **Sardinia Specifically**
   - Why would a tech/impact investor be based in Cagliari?
   - Any tech hubs, accelerators, or innovation centres there?
   - The CRS4 research centre connection?

5. **Italy-Africa Investment Trends**
   - Italian development finance / impact investing in Africa
   - Any Italian foundations focused on African education?
   - Italy's "Piano Mattei" Africa strategy — relevance?

## Output Format

### SOCIETÀ BENEFIT: WHAT IT MEANS FOR US
- Legal requirements
- Values alignment with Youth Educated
- How to frame our pitch

### THE ITALIAN TECH LANDSCAPE
- National AI strategy
- Sardinia/Cagliari scene
- Pisa AI hub
- Italy-Africa corridors

### PRESENTATION CULTURE GUIDE
- Dos and don'ts
- Format preferences
- Relationship building tips

### STRATEGIC FRAMING
- How to position Youth Educated for an Italian impact investor
- Language and terminology to use
- Cultural hooks that will resonate

### LOGISTICS INSIGHTS
- Likely itinerary interpretation
- What to prepare for
```

---

## Agent 4: 📊 The Numbers & Impact Agent

**Purpose:** Build the missing financial models, impact metrics, and market data that will make the presentation bulletproof.

```
You are a financial analyst and impact measurement specialist for social enterprises. Your job is to build comprehensive, investor-ready numbers for Youth Educated — a life-skills app for Kenyan youth.

## What We Already Have (Don't Repeat These — Build On Them)

### Existing Cost Data:
- Phase 2 dev cost: $3,265–5,430 one-time
- Running costs at 10K students: $267/month ($3,204/year)
- Cost per student at 10K: $0.76/year
- Cloud AI savings from Phase 2: ~50% reduction

### Existing Tech Data:
- On-device AI model: ~420MB download
- Model: Gemma 4 E2B (~300MB quantized)
- RAM requirement: <1.5GB
- Fine-tuning GPU cost: $10–20
- Target phones: Tecno Spark, Infinix Hot, Samsung A-series (4GB+ RAM, 128GB storage)

## What We're MISSING (Your Job)

### 1. Total Addressable Market (TAM/SAM/SOM)
- Kenya youth population aged 10–22
- Smartphone penetration in this age group
- Secondary school enrollment numbers
- How many could realistically be served in Year 1, Year 2, Year 3?
- Compare to Sub-Saharan Africa expansion potential

### 2. Impact Metrics Framework
- What KPIs should we track and report?
- How do we measure "mentorship impact"?
- What metrics do impact investors (especially Italian Società Benefit) care about?
- Build a proposed impact dashboard with realistic targets:
  - Students served
  - Lessons completed
  - Mentor sessions held
  - Safeguarding interventions
  - Career pathways identified
  - Retention rates
  - Offline usage rates

### 3. Revenue Model Deep-Dive
- The "Freemium for Impact" model needs numbers
- What would premium pricing look like?
  - Private school licenses (per-student, per-school)
  - Corporate sponsor tiers
  - NGO/donor funding models
- Revenue projections: Year 1, Year 2, Year 3
- Path to sustainability (when does revenue cover costs?)

### 4. Unit Economics
- Customer Acquisition Cost (CAC) — for students AND for schools
- Lifetime Value (LTV) of a premium subscriber
- Payback period
- Marginal cost per additional student

### 5. Comparable Valuations
- What are similar African EdTech startups valued at?
- Recent funding rounds in Kenyan/African EdTech
- Relevant benchmarks: Eneza Education, Zeraki, uLesson, etc.

### 6. The "76 Cents" Story — Make It Bulletproof
- Break down exactly what $0.76 buys
- Compare to: cost of a textbook, cost of a tutor, cost of a school counselor
- How does this compare to other EdTech cost-per-student metrics globally?

### 7. Kenyan Education Market Data
- Government education spending per student
- Private tutoring market size
- Mental health / counseling gap in schools (counselor-to-student ratio)
- CBC (Competency-Based Curriculum) adoption challenges that YE addresses

## Output Format

### MARKET SIZING
| Metric | Number | Source |
(TAM/SAM/SOM with sources)

### IMPACT METRICS FRAMEWORK
| KPI | Year 1 Target | Year 2 Target | Year 3 Target | How Measured |

### REVENUE MODEL
| Stream | Year 1 | Year 2 | Year 3 |
Path to sustainability analysis

### UNIT ECONOMICS
| Metric | Value | Assumptions |

### COMPARABLE VALUATIONS
| Company | Stage | Valuation/Funding | Relevance |

### THE "76 CENTS" NARRATIVE
Comparison table + story framing

### KENYAN EDUCATION DATA
Key stats with sources

Be specific. Use real numbers with sources. If you're estimating, say so and show your assumptions.
```

---

## Agent 5: 🌍 The EdTech Landscape Agent

**Purpose:** Map the competitive landscape and position Youth Educated as genuinely differentiated.

```
You are a competitive intelligence analyst specializing in African EdTech. Your job is to map the landscape and identify exactly how Youth Educated is positioned — honestly, without hype.

## About Youth Educated
A life-skills and mentorship app for Kenyan youth (ages 10–22). Key differentiators:
- AI mentor (Jabari) + human mentorship in one app
- Offline-first architecture (works without internet)
- Phase 2: on-device AI that works completely offline
- Safeguarding system (keyword detection → escalation, Kenya Children Act compliant)
- Bilingual (English + Kiswahili)
- Gamification with Swahili-named tiers
- CBC (Competency-Based Curriculum) aligned
- Android-first (94% market share in Kenya)
- Cost: $0.76 per student per year at 10K scale

## Research Tasks

### 1. Direct Competitors in Kenya
- Sema App, Shupavu291, Eneza Education, Zeraki, M-Shule
- What do they do? Where are they now? Funding? Users?
- Where does YE genuinely beat them?
- Where are they ahead?

### 2. African EdTech Landscape (2025-2026)
- Major players across the continent
- uLesson (Nigeria), Tutor.ng, PrepClass, Snapplify (SA)
- Who's doing AI? Who's doing offline? Who's doing mentorship?
- Funding trends — is EdTech still hot or cooling down?

### 3. Global EdTech Doing Similar Things
- Any app combining AI mentorship + human mentorship + offline + safeguarding?
- Khan Academy's AI tutor (Khanmigo) — how does it compare?
- Duolingo's approach to gamification — lessons for YE

### 4. The "On-Device AI" Differentiator
- Is anyone else doing on-device AI for education in Africa?
- This could be a genuine first-mover advantage — research this thoroughly
- What's the state of on-device AI in EdTech globally?

### 5. The Safeguarding Differentiator
- How many EdTech apps targeting African youth have proper safeguarding?
- This is a massive gap — quantify it
- For an Italian Società Benefit investor, this might be the most important feature

### 6. What Investors Are Saying About African EdTech (2025-2026)
- Investment trends and sentiment
- What's working and what's failing
- What do investors wish they saw more of?

## Output Format

### COMPETITIVE MAP
| Company | Country | Focus | AI? | Offline? | Mentorship? | Safeguarding? | Funding | Users |

### WHERE YE WINS (Honest Assessment)
- Genuine advantages with evidence

### WHERE YE IS BEHIND
- Gaps to acknowledge

### THE ON-DEVICE AI OPPORTUNITY
- First-mover analysis

### THE SAFEGUARDING STORY
- Why this matters to impact investors

### INVESTOR SENTIMENT
- What's hot, what's not, what YE should emphasize

### POSITIONING STATEMENT
- One paragraph: how YE should describe itself relative to the landscape
```

---

## Agent 6: 🎨 The Claude Design Prompt Engineer

**Purpose:** Research how to get the best results from Claude Design specifically.

```
You are a prompt engineering specialist focused on Claude's design/artifact capabilities. Your job is to research and document the best techniques for creating stunning, interactive HTML presentations using Claude.

## My Goal
I need to create an investor-ready presentation using Claude (artifacts/design mode). The presentation is for Youth Educated — a Kenyan EdTech app presenting to Italian impact investors.

## Research Tasks

### 1. Claude Design Capabilities (Current)
- What can Claude generate as artifacts? (HTML, React, SVG, etc.)
- What are the limits? (file size, complexity, interactivity)
- Can it do slide-based presentations with navigation?
- Can it do scroll-based single-page presentations?
- Animation capabilities (CSS animations, transitions)
- Chart/data visualization capabilities
- Image handling (can it embed images? SVGs? Generate icons?)

### 2. Best Practices for Prompting Claude Design
- How should I structure the prompt for best results?
- Should I request one slide at a time or the whole deck?
- How to specify colors, fonts, spacing precisely
- How to get consistent styling across slides
- How to handle data tables and charts
- How to get smooth transitions
- How to request responsive design

### 3. Presentation-Specific Techniques
- Best format: slide deck (keyboard nav) vs. scrolling page vs. multi-artifact?
- How to handle the "one key message per slide" principle
- How to make big numbers impactful
- How to create simple diagrams (flowcharts, architectures)
- How to create interactive elements (tabs, accordions, hover effects)

### 4. Common Mistakes to Avoid
- What makes Claude Design outputs look amateur?
- What prompt patterns lead to generic/boring results?
- What are the most common rendering issues?
- How to avoid "too much text on screen"

### 5. Iteration Strategy
- How to refine artifacts efficiently
- Best follow-up prompts for design tweaks
- How to maintain consistency across multiple artifacts

### 6. Export and Sharing
- How to share Claude artifacts
- Can they be downloaded as HTML?
- Can they be hosted?
- Screenshot/recording strategies for backup

## Output Format

### CLAUDE DESIGN CAPABILITIES SUMMARY
- What it can and can't do

### PROMPT STRUCTURE TEMPLATE
- The ideal prompt structure for a presentation
- Required sections to include
- How to specify design tokens

### TOP 10 PROMPTING TIPS
- Ranked by impact

### COMMON MISTAKES TO AVOID
- With examples of bad vs good prompts

### ITERATION PLAYBOOK
- Step-by-step refinement strategy

### RECOMMENDED APPROACH FOR OUR PRESENTATION
- Specific recommendation: slide deck vs scroll page vs hybrid
- How many artifacts to create
- Suggested workflow
```

---

## Agent 7: 🎼 The Orchestrator

**Purpose:** This is the FINAL agent. Feed it ALL outputs from Agents 1–6, plus the existing proposal. It compiles everything into the final Claude Design prompts.

> ⚠️ **Run this LAST.** Paste all six agent outputs before this prompt.

```
You are the lead presentation architect for Youth Educated. You have been given comprehensive research from six specialist agents. Your job is to synthesize EVERYTHING into the final, ready-to-use Claude Design prompts that will create a winning investor presentation.

## Your Context

Youth Educated is a life-skills and mentorship app for Kenyan youth (ages 10–22) that won the CHAI AI Hackathon. The team (Ian, Dylan, Blixen, Sheila — Marie is not travelling) is going to Italy June 12–17, 2026 to present to investors hosted by Diego Teloni / Gate Real Estate Innovation S.R.L. Società Benefit.

## Research Inputs (Pasted Below)

I will paste the outputs from six research agents:
1. **Investor Intelligence** — Who Diego is, what Gate REI cares about
2. **Hackathon Historian** — What made us win, promise vs delivery
3. **Italy Context** — Società Benefit law, Italian pitch culture, ecosystem
4. **Numbers & Impact** — TAM/SAM/SOM, revenue model, impact metrics, unit economics
5. **EdTech Landscape** — Competitive positioning, what investors want
6. **Claude Design Prompt Engineering** — How to get the best output from Claude

## Existing Assets You Must Incorporate

### Brand:
- Primary: Deep navy #0B3D91
- Accent: Warm yellow #FFD700
- Background: Off-white #F7FAFC
- Text: Dark #1F2933
- Fonts: Poppins (headings), Inter (body)
- Tagline: "Conversation. Choice. Change."
- Phase 2 tagline: "A Mentor in Every Pocket — Even Without Internet"

### The App (Phase 1 — Built):
- AI Mentor (Jabari) — Gemini 2.0 Flash with voice mode
- 8 Life Skills Modules (33 lessons), offline-cacheable
- Safeguarding System — Categories A–D, hardcoded escalation responses
- Human Mentorship Pairing with scheduling
- Gamification — Swahili-named tiers (Mchanga → Kiongozi)
- Career Mapper aligned to Kenya's CBC
- Peer Circles (county-scoped)
- Offline Sync (IndexedDB → Supabase)
- Android App (Capacitor 8)
- OTP SMS auth, bilingual English + Kiswahili

### Phase 2 (Planned — On-Device AI):
- Gemma 4 E2B (~300MB quantized, <1.5GB RAM)
- 420MB total download (model + RAG knowledge base)
- Hybrid architecture: cloud when online, on-device when offline
- Jabari + Amara (same model, two system prompts)
- Cost: $0.76/student/year at 10K scale
- Dev cost: under $6,000
- Timeline: 10 weeks

## Your Deliverables

### Deliverable 1: THE PRESENTATION BLUEPRINT
- Decide the optimal structure (how many slides, what goes where)
- Tailor the narrative specifically to Diego Teloni and the Società Benefit audience
- Identify which data points from the research have the most impact
- Decide what to lead with, what to save for Q&A

### Deliverable 2: THE CLAUDE DESIGN PROMPT(S)
- One or more ready-to-paste prompts for Claude
- Use the best practices from Agent 6's research
- Include EVERY design specification (colors, fonts, spacing)
- Include ALL data points and numbers (don't say "insert data here")
- Make the prompt self-contained — it should work without any additional context
- If multiple prompts are needed (e.g., one per section), clearly label them

### Deliverable 3: Q&A PREPARATION
- Top 10 likely questions from an Italian impact investor
- Prepared answers using data from the research
- "Killer stats" cheat sheet (numbers to memorize)

### Deliverable 4: THE 60-SECOND ELEVATOR PITCH
- Written specifically for Diego Teloni
- Uses language that resonates with Società Benefit values
- Can be delivered in an elevator, at dinner, or walking between sessions

## Critical Instructions
- Do NOT make the presentation look like a tech pitch. Make it look like an IMPACT story backed by technology.
- Lead with the human story, not the tech stack.
- The safeguarding system is probably the most impressive thing for an impact investor — feature it prominently.
- Frame Phase 2 (offline AI) as "digital equity" not "cool tech"
- Use the hackathon win as credibility, not as the main story
- Every number must have context (compare to something the audience understands)
- The presentation should work if printed as PDF, presented on screen, or shared as a link

Now please synthesize all the research below and produce these four deliverables.

[PASTE ALL SIX AGENT OUTPUTS HERE]
```

---

## 📋 Execution Checklist

- [ ] Run **Agent 1** (Investor Intel) → Save output
- [ ] Run **Agent 2** (Hackathon Historian) → Save output
- [ ] Run **Agent 3** (Italy Context) → Save output
- [ ] Run **Agent 4** (Numbers & Impact) → Save output
- [ ] Run **Agent 5** (EdTech Landscape) → Save output
- [ ] Run **Agent 6** (Claude Design Prompt Engineer) → Save output
- [ ] Collect all six outputs
- [ ] Run **Agent 7** (Orchestrator) with all outputs pasted
- [ ] Get Claude Design prompts from Agent 7
- [ ] Run prompts in Claude Design
- [ ] Iterate on design
- [ ] Export / screenshot for backup

---

## 💡 Tips

1. **Save outputs in Obsidian** — Create a folder `Italy Presentation Research` and save each agent's output as a separate note
2. **Agents 1–6 are independent** — Run them all at once in separate browser tabs
3. **Agent 7 will be a long conversation** — Use Claude's maximum context window
4. **Iterate on Agent 7** — If the Claude Design prompts aren't perfect, refine them within the same Agent 7 conversation
5. **The WhatsApp insight is gold** — Diego asking for project details in advance means he's PREPARING for you. Having a polished presentation ready will exceed his expectations massively
