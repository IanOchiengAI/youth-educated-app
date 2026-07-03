# 🎨 Phase 2 Presentation Guide — Tool Comparison & Ready-to-Use Prompts

> How to turn the Phase 2 proposal into a clean, professional, investor-ready presentation.

---

## Tool Comparison — Ranked for Your Use Case

### 🥇 1. Gamma (gamma.app) — BEST OVERALL PICK

**Why this is #1 for you:**
- Paste in your proposal document → get a full deck in under 2 minutes
- Web-native = looks modern, scrollable, interactive — not boring PowerPoint
- **Investor analytics** — you can see who viewed your deck, how long they spent on each section
- Free tier available (with watermark)
- Best for async sharing (send a link, don't need to present live)

| Spec | Detail |
|------|--------|
| Price | Free (watermark) / $10-12/month Pro |
| Best output | Web link (shareable deck) |
| PPTX export | ⚠️ Works but may need cleanup |
| PDF export | ✅ Good |
| From document | ✅ Paste text or upload file |
| Analytics | ✅ Track who viewed and engagement |

**When to use:** When sending the proposal to investors/partners who will read it on their own time. The analytics are gold — you'll know who actually looked at it.

---

### 🥈 2. Claude Design (claude.ai/design) — BEST FOR CUSTOM LOOK

**Why this is strong:**
- You already use Claude — zero learning curve
- You can iterate slide-by-slide ("make the cost table more visual", "add Youth Educated brand colors")
- Can generate a full interactive HTML presentation as an Artifact
- Most control over the narrative — you're in a conversation with it
- Can export to code or generate a python-pptx script for PowerPoint

| Spec | Detail |
|------|--------|
| Price | Included in your Claude subscription |
| Best output | HTML artifact (interactive) / Code export |
| PPTX export | Via python-pptx script (needs manual step) |
| PDF export | ✅ Screenshot or print |
| From document | ✅ Paste the full proposal |
| Analytics | ❌ No tracking |

**When to use:** When you want full creative control and are willing to iterate. Best if you want a unique, custom look that doesn't scream "template." Also great for creating a one-page executive summary or a micro-site.

---

### 🥉 3. Loveable (lovable.dev) — BEST FOR INTERACTIVE WEB EXPERIENCE

**Why this is interesting:**
- Instead of a "deck," build a **mini website** for the proposal
- Interactive scrolling experience — like a modern startup landing page
- Generates real React + Tailwind code — you could even host it
- You already used Loveable for the hackathon prototype

| Spec | Detail |
|------|--------|
| Price | Free tier / Credits-based |
| Best output | Fully hosted website |
| PPTX export | ❌ Not applicable |
| PDF export | ❌ Not applicable |
| From document | ✅ Paste as prompt |
| Analytics | Via hosting platform (Vercel, etc.) |

**When to use:** When you want to WOW — a scrolling, animated, interactive proposal website is way more impressive than a slide deck. Best for showcase events and online sharing. Not for boardroom PowerPoint situations.

---

### 4. Canva — BEST FOR DESIGN TEMPLATES

| Spec | Detail |
|------|--------|
| Price | Free / Pro $13/month |
| Best output | PPTX, PDF, web link |
| From document | ✅ Magic Design from text |
| Analytics | ✅ Pro only |

**When to use:** If you need polished templates fast and want maximum export flexibility. Good "safe" option.

---

### 5. Google Gemini + Slides — BEST FOR GOOGLE ECOSYSTEM

| Spec | Detail |
|------|--------|
| Price | Google Workspace / One AI Premium |
| Best output | Google Slides (native) |
| From document | ✅ Upload PDF, prompt in Canvas |
| Analytics | ❌ Basic |

**When to use:** If your investors expect Google Slides specifically, or if you need real-time collaboration with your team.

---

### 6. Beautiful.ai — BEST FOR "NON-DESIGNER" SAFETY

| Spec | Detail |
|------|--------|
| Price | $12/month annual / $45 one-off |
| Best output | Web + PPTX |
| Smart Slides | ✅ Auto-adjusts layout |
| From document | ✅ Prompt-based |

**When to use:** If you're worried about making design mistakes — its "Smart Slides" literally prevent ugly layouts.

---

### 7. Presentations.AI — BEST FOR PPTX EXPORT

| Spec | Detail |
|------|--------|
| Price | Free starter / $198/year Pro |
| Best output | PPTX (highest quality export) |
| From document | ✅ Upload or prompt |
| Analytics | ✅ Pro |

**When to use:** If the final deliverable MUST be a clean PowerPoint file for a formal boardroom setting.

---

## My Recommendation: Use Two Tools

> [!IMPORTANT]
> **Primary (for the showcase):** Use **Gamma** or **Loveable** for a modern, impressive web-based presentation that you share via link.
>
> **Secondary (for investors):** Use **Claude Design** or **Canva** to create a clean PDF/PPTX version that people can download and review offline.

The showcase is about making an impression → Gamma or Loveable.
The investor follow-up is about providing substance → PDF/PPTX.

---

## Ready-to-Use Prompts

### Prompt for Gamma

Paste this into Gamma's "Generate" feature, along with the proposal document:

```
Create a professional pitch deck for Youth Educated — a life-skills 
and mentorship app for Kenyan youth aged 10-22.

This deck is presenting Phase 2 of our product: deploying an offline 
AI mentor (Jabari/Amara) directly on students' phones so it works 
without internet.

Audience: Investors and showcase judges — both technical and 
non-technical. Explain decisions clearly with the "why" behind 
each choice.

Brand colors:
- Primary: Deep navy #0B3D91
- Accent: Warm yellow #FFD700
- Background: Off-white #F7FAFC
- Text: Dark #1F2933

Fonts: Poppins for headings, clean sans-serif for body.

Tone: Confident, human, Kenyan-rooted. Not corporate jargon. 
The audience should feel like they're investing in something 
real, not a tech experiment.

Structure the deck as:
1. Title — "A Mentor in Every Pocket — Even Without Internet"
2. The Story — Why offline AI matters for Kenyan students
3. What We Built (Phase 1) — The working MVP
4. The Problem — Cloud AI requires internet. Students lose 
   their mentor when they lose signal.
5. The Solution — Hybrid architecture: cloud when online, 
   on-device when offline
6. Jabari & Amara — Same AI, two voices. Students choose their 
   mentor personality.
7. How It Works — Simple visual of the hybrid flow
8. The Technology — Gemma 4 E2B, RAG, sqlite-vec 
   (explain each in plain English)
9. The Download Experience — PUBG-style, 420MB, Wi-Fi recommended
10. Device Compatibility — 128GB storage is now standard in Kenya
11. The Numbers — Cost per student: $0.76/year at 10K students
12. Cost Breakdown — Table showing 1K / 5K / 10K scale
13. Cloud Savings — Phase 2 cuts cloud costs by 50%
14. Timeline — 10 weeks to launch
15. Risk & Mitigation — How we handle edge cases
16. The Ask — What we need to execute
17. Closing — "76 cents. That's what it costs to give a student 
    an AI mentor for a year."

Use the attached document as the source material for all data, 
numbers, and technical details.
```

---

### Prompt for Claude Design

Use this on claude.ai/design or in Claude with artifacts enabled:

```
I need you to create a beautiful, professional pitch deck as an 
interactive HTML presentation. This is for Youth Educated — we're 
presenting Phase 2 of our app to investors.

Here are the brand requirements:
- Colors: Navy #0B3D91, Yellow #FFD700, Off-white #F7FAFC
- Fonts: Poppins headings, Inter body
- Style: Modern, clean, warm — not corporate. Think "African 
  social enterprise" not "Silicon Valley startup"
- Each slide should have ONE key message
- Use large, bold numbers for impact stats
- Include simple diagrams (not programmer flowcharts)

Please create these slides:

SLIDE 1 - TITLE
"A Mentor in Every Pocket — Even Without Internet"
Youth Educated • Phase 2 Proposal

SLIDE 2 - THE PROBLEM
"When a student in Kisumu loses signal, they lose their AI mentor."
Show: 94% of Kenyan phones are Android. Average storage: 128GB.
Average data cost: KES 99/GB.

SLIDE 3 - WHAT WE BUILT (PHASE 1)
Show the MVP features as a clean grid:
✅ AI Mentor (Jabari) — Gemini 2.0 Flash
✅ 33 Life Skills Lessons — offline-cacheable
✅ Safeguarding System — keyword → DSL escalation
✅ Human Mentorship — pairing, scheduling
✅ Gamification — Swahili-named tiers
✅ Android App — Capacitor 8

SLIDE 4 - THE SOLUTION
"Hybrid AI: Full power online. Smart offline."
Show a simple two-path diagram:
Has internet? → Cloud AI (full power)
No internet? → On-device AI (works forever)

SLIDE 5 - MEET JABARI & AMARA
"Same brain. Two voices. Students choose."
Jabari: Male, trusted older brother, "Bro, you've got this"
Amara: Female, trusted older sister, "Sis, I believe in you"
One model download. Two personalities via system prompt.

SLIDE 6 - THE TECHNOLOGY (PLAIN ENGLISH)
Show 3 cards:
Card 1: "The Brain" — Gemma 4 E2B. 300MB. Runs on any modern phone.
Card 2: "The Library" — Your curriculum, searchable on-device. 
The AI looks up answers from YOUR lessons.
Card 3: "The Safety Net" — Same safeguarding system. 
Works identically offline.

SLIDE 7 - THE DOWNLOAD
"Like PUBG, but for education."
App installs at 15MB → Student downloads AI update (420MB) over Wi-Fi
→ Jabari/Amara work offline forever.
420MB = less than 20 minutes of WhatsApp video calling.

SLIDE 8 - THE NUMBERS
Big bold: "$0.76 per student per year"
At 10,000 students.
Show the scale table:
1,000 students → $4.88/student/year
5,000 students → $1.16/student/year
10,000 students → $0.76/student/year

SLIDE 9 - CLOUD SAVINGS
"Phase 2 doesn't just add offline — it cuts cloud costs by 50%"
Offline students = zero API calls = zero marginal cost.

SLIDE 10 - DEVELOPMENT COST
Total: Under $6,000
GPU training: $10-20
CDN hosting (1K students): $4/month
Developer: $3,000-5,000 (10 weeks)

SLIDE 11 - TIMELINE
10-week roadmap as a clean horizontal timeline:
Weeks 1-2: Training data
Weeks 2-3: Fine-tuning
Week 3-4: Knowledge base
Weeks 4-8: Native plugin
Weeks 8-10: Kenya testing

SLIDE 12 - THE ASK
What we need and what it delivers.

SLIDE 13 - CLOSING
"76 cents. That's what it costs to give a student 
an AI mentor for a year."
Youth Educated tagline: "Conversation. Choice. Change."

Make the presentation navigable with arrow keys. Include 
smooth slide transitions. Make it look premium.
```

---

### Prompt for Loveable (Interactive Proposal Website)

Use this on lovable.dev:

```
Build a beautiful, single-page scrolling proposal website for 
"Youth Educated — Phase 2: On-Device AI."

This is a proposal we're presenting to investors for a life-skills 
app for Kenyan youth. The design should feel warm, modern, and 
African — not Silicon Valley corporate.

Brand:
- Navy: #0B3D91
- Yellow/Gold: #FFD700  
- Off-white background: #F7FAFC
- Dark text: #1F2933
- Fonts: Poppins headings, Inter body
- Subtle animations on scroll (fade-in, slide-up)

Sections (scrolling, full-width):

1. HERO SECTION
   Large headline: "A Mentor in Every Pocket — Even Without Internet"
   Subhead: "Youth Educated • Phase 2 Proposal"
   Tagline: "Conversation. Choice. Change."
   Navy background, white/gold text.

2. THE PROBLEM
   "When students lose signal, they lose their AI mentor."
   Show 3 stat cards with icons:
   - 94% Android market share in Kenya
   - 128GB standard storage on affordable phones
   - KES 99/GB data cost
   
3. WHAT WE BUILT (Phase 1)
   Grid of 6 feature cards with checkmarks:
   AI Mentor (Jabari), 33 Lessons, Safeguarding, 
   Human Mentorship, Gamification, Android App

4. THE SOLUTION — Hybrid AI
   Two-column layout:
   Left: "Online → Cloud AI (Gemini 2.0 Flash)"
   Right: "Offline → On-Device AI (Gemma 4 E2B)"
   Center connector: "Seamless switching. Student never notices."

5. JABARI & AMARA
   Two character cards side by side:
   Jabari (navy card): Male, older brother, "Bro, you've got this"
   Amara (gold card): Female, older sister, "Sis, I believe in you"
   Footer: "Same model. Two personalities. One download."

6. HOW IT WORKS (3 steps)
   Step 1: Download app (15MB) from Play Store
   Step 2: Download AI update (420MB) over Wi-Fi
   Step 3: Chat with Jabari/Amara — anywhere, anytime, no internet

7. THE NUMBERS
   Big number: "$0.76" with subtitle "per student per year at scale"
   Animated counter or big bold text.
   Below: cost comparison table at 1K / 5K / 10K students.

8. DEVELOPMENT COST
   Clean breakdown:
   Total: Under $6,000
   Timeline: 10 weeks
   Show as a minimal timeline/roadmap

9. THE ASK
   What we need to make this happen.
   CTA button style.

10. FOOTER
    "Conversation. Choice. Change."
    Youth Educated logo area.
    "Phase 1: Complete ✅ | Phase 2: Ready to Build"

Make it responsive. Add smooth scroll-triggered animations.
Use glassmorphism for cards. Make it feel premium and alive.
```

---

### Prompt for Canva

In Canva → Create Design → Presentation → Magic Design:

```
Create a 15-slide professional pitch deck.

Topic: Youth Educated Phase 2 — deploying an offline AI mentor 
on students' phones in Kenya.

Audience: Investors and showcase judges.

Style: Modern, warm, confident. Use dark navy (#0B3D91) as primary, 
gold (#FFD700) as accent, off-white (#F7FAFC) background. 
Poppins font for headings.

Key slides needed:
1. Title: "A Mentor in Every Pocket — Even Without Internet"
2. Problem: Students lose AI mentor when offline
3. Phase 1 recap: Working MVP features
4. Solution: Hybrid cloud + on-device AI
5. Meet Jabari & Amara (two AI personalities)
6. Technology explained simply
7. The download experience (420MB, like a game update)
8. Cost: $0.76/student/year at 10K
9. Cost breakdown table
10. Development cost: under $6,000
11. 10-week timeline
12. Risk and mitigation
13. The ask
14. Closing with tagline
15. Contact / team

Make it visually striking. One key message per slide. 
Use large, bold numbers for financial data.
```

---

## Which Tool for Which Situation?

| Situation | Best Tool | Why |
|-----------|-----------|-----|
| **Showcase/demo day** | **Loveable** (website) | Most impressive — scrolling, animated, interactive |
| **Send to investors (async)** | **Gamma** | Analytics tell you who viewed it and for how long |
| **Boardroom presentation** | **Canva** or **Beautiful.ai** | Clean PPTX export, projector-friendly |
| **Quick iteration** | **Claude Design** | You're already in Claude, iterate conversationally |
| **Google Slides collaboration** | **Gemini Canvas** | Native integration, team editing |
| **Maximum control** | **Claude Design** → code export | Full HTML/CSS, host anywhere |

---

## Final Recommendation

For your showcase, I'd go with this combo:

> [!TIP]
> ### The Winning Combo
> 1. **Loveable** → Build the interactive scrolling proposal website. Host it. Share the link. This is your "wow factor" piece.
> 2. **Gamma** → Create the slide deck version with analytics. Send this link to investors who want to read at their own pace.
> 3. **Canva or Claude** → Generate a PDF version for anyone who asks "can you just send me the deck?"
>
> Three formats, one proposal, maximum reach.
