# Deliverable 2: CLAUDE DESIGN PROMPTS

> **Instructions:** Paste these prompts into Claude (claude.ai) one at a time, in order.
> - **Prompt 1** creates the presentation shell and slides 1–4.
> - **Prompt 2** adds slides 5–8 (say "Now add slides 5–8" and paste).
> - **Prompt 3** adds slides 9–12 (say "Now add slides 9–12" and paste).
> - **Prompt 4** is a polish/export pass.
>
> After each prompt, review the output before proceeding. If something needs adjustment, tell Claude specifically what to change before moving on.

---

## PROMPT 1: Shell + Slides 1–4 (The Human Story)

```text
Act as an expert UX/UI designer and React developer. Create an interactive, investor-ready presentation deck as a single React component.

CONTEXT: This is for "Youth Educated" — a life-skills and mentorship app for Kenyan youth (ages 10–22) that won the CHAI AI Hackathon. We are presenting to Italian impact investors at Gate Real Estate Innovation, a Società Benefit (Italy's legally binding B Corp equivalent). The audience cares about sustainable human capital development, ESG impact reporting, and Italy's Piano Mattei initiative for Africa.

FORMAT & TECH STACK:
- Single-file React component
- Tailwind CSS for all styling
- lucide-react for icons (Shield, Users, Smartphone, BookOpen, Heart, TrendingUp, Globe, Award, ChevronLeft, ChevronRight, Target, DollarSign, BarChart3, Zap)
- recharts for data visualizations (used in later slides)

DESIGN SYSTEM — "Sartorial" Italian Impact Aesthetic:
- This must look like it was designed in Milan for a sustainability conference. Clean, structured, elegant. Generous whitespace. No chaos.
- Background: Deep navy #0B3D91 for the title slide, transitioning to off-white #F7FAFC for content slides
- Primary brand color: Deep navy #0B3D91
- Accent color: Warm gold #FFD700 (use sparingly — for key stats, highlights, and interactive elements)
- Text on light backgrounds: #1F2933
- Text on dark backgrounds: #F7FAFC
- Typography: Use tracking-tight for all headings (large, bold, impactful). Use leading-relaxed and text-slate-600 for body text.
- Card style: White cards with rounded-2xl corners, very subtle shadow (shadow-sm), generous padding (p-8)
- Slide transitions: 400ms fade-in with slight translateY (slide up into view)
- Spacing: Every element should breathe. Minimum p-8 on slide containers, gap-6 between elements.

NAVIGATION UX:
- Keyboard navigation: Left/Right arrow keys
- A thin, elegant progress bar at the very top of the viewport (gold #FFD700 fill on slate-200 track)
- Small, floating circular prev/next buttons at the left and right edges (semi-transparent, visible on hover)
- Slide counter in bottom-right: "1 / 12" style, small and unobtrusive
- Total slides: 12 (we will add slides 5–12 in follow-up prompts)

NOW GENERATE SLIDES 1–4:

SLIDE 1 — TITLE SLIDE
Background: Deep navy #0B3D91, full bleed
Center-aligned content:
- Top: Small gold badge/pill that says "CHAI AI Hackathon Winners 2025"
- Main: "Youth Educated" in large white text (text-5xl font-bold tracking-tight)
- Below: The tagline "Conversation. Choice. Change." in gold #FFD700 (text-2xl, italic)
- Below that: "A Mentor in Every Pocket — Even Without Internet" in white/70% opacity (text-lg)
- Bottom section: Team names "Ian · Dylan · Blixen · Sheila" in small white text
- Very bottom: "Presented to Gate Real Estate Innovation · Società Benefit" in small, elegant white text with 50% opacity
- Add a subtle, slow-pulsing radial gradient overlay (navy to slightly lighter navy) for visual depth

SLIDE 2 — THE HUMAN STORY
Background: Off-white #F7FAFC
Layout: Two-column (60/40 split)
Left column:
- Headline: "Meet Amani" in navy #0B3D91, text-4xl, font-bold
- Subhead: "She's 15. She lives in Kisumu County." in text-xl text-slate-500
- Body text (text-base, text-slate-600, leading-relaxed): "Amani wants to be an engineer. But her school has no guidance counselor — just an overworked teacher who was assigned 'counseling' as an unpaid extra duty. She has no internet at home. She shares a phone with her brother. Her parents never went to university and can't advise on the new CBC career pathways. Amani isn't failing — the system is failing Amani."
Right column:
- Create a warm, abstract SVG illustration: a silhouette of a young person holding a glowing phone, with subtle connecting lines radiating outward (representing mentorship connections). Use navy and gold colors.
- Below the SVG, a single callout stat in a gold-bordered card: "In Kenya, counseling is an unpaid 'extra duty' given to untrained teachers." — with a small Heart icon from lucide-react

SLIDE 3 — THE CRISIS
Background: Off-white #F7FAFC
Layout: Three large stat cards in a row, each one a white rounded-2xl card with shadow-sm
- Card 1: Large gold number "67%" + text below "Youth unemployment rate in Kenya" + TrendingUp icon
- Card 2: Large gold number "0" + text below "Standardized school counselor-to-student ratio" + Users icon  
- Card 3: Large gold number "27.6%" + text below "Of Kenya's budget goes to education — zero for life skills or mental health" + DollarSign icon
Below the cards, a single line of context text in text-slate-500, italic:
"The new Competency-Based Curriculum mandates life skills teaching. But 80% of teachers were trained in rote memorization and have no tools to deliver it."

SLIDE 4 — THE SOLUTION
Background: Off-white #F7FAFC  
Headline: "A Mentor in Every Pocket" in navy, text-4xl, font-bold
Subhead: "Not a chatbot. Not a textbook. An ecosystem." in text-slate-500
Layout: Three equal columns, each a white card with rounded-2xl, shadow-sm, p-8, with a colored top border (3px, gold)
- Column 1: Smartphone icon (lucide) + "Jabari — AI Mentor" as title + body: "Powered by Gemini 2.0 Flash. Voice mode. Bilingual English and Kiswahili. Available 24/7. Works completely offline."
- Column 2: Users icon + "Human Mentors" as title + body: "Paired mentorship with real people. Scheduled sessions. Handles crisis escalation (Categories C and D). AI augments — never replaces — human connection."
- Column 3: BookOpen icon + "Life Skills Curriculum" as title + body: "9 modules. 52 lessons. Aligned to Kenya's CBC. Gamified with Swahili-named tiers: Mchanga, Mwanafunzi, Jasiri, Mwalimu, Kiongozi."
Bottom: A subtle horizontal line, then small text: "Integrated: Career Mapper · Peer Circles (county-scoped) · Offline Sync · OTP SMS Auth · Android App"

Remember: ONE key message per slide. Let the whitespace do the work. This should feel premium and elegant — like a sustainability report from a European foundation, not a Silicon Valley pitch deck.
```

---

## PROMPT 2: Slides 5–8 (The Proof)

```text
Now add slides 5 through 8 to the existing presentation. Maintain the EXACT same design system, navigation, component structure, and Tailwind styling. Update the total slide count to reflect all slides.

SLIDE 5 — THE SAFEGUARDING PROMISE (This is the MOST important slide in the deck)
Background: Off-white #F7FAFC
Headline: "Before We Built an AI Mentor, We Built a Shield" in navy, text-4xl, font-bold
Subhead: Shield icon (lucide, in gold) next to "Deterministic. Offline-capable. Mapped to the Kenya Children Act."
Layout: Four horizontal tiers/steps, displayed as a vertical flow diagram or stacked cards with connecting lines/arrows:
- Tier A — Green left border: "Informational" — Example: "What is peer pressure?" — Response: "Jabari handles normally with curriculum content" — Shield icon small
- Tier B — Yellow/amber left border: "Sensitive" — Example: "I feel sad and alone" — Response: "AI provides resources + flags for mentor review within 24 hours" — Heart icon small
- Tier C — Orange left border: "Crisis" — Example: "I'm being hurt at home" — Response: "AI STOPS generating. Hardcoded response displayed. Immediate mentor alert triggered." — AlertTriangle icon small
- Tier D — Red left border: "Emergency" — Example: "Suicide or abuse keywords detected" — Response: "Bypasses AI entirely. Emergency contacts displayed. Kenya Childline 116 shown. GPS-nearest help center." — Phone icon small
Below the tiers, a gold-background callout box: "This system is deterministic, not probabilistic. It does not rely on the AI model's judgment. It works fully offline. It is the foundation everything else is built on."

SLIDE 6 — SINCE WE WON
Background: Off-white #F7FAFC
Headline: "We Promised a Foundation. We Built an Engine." in navy, text-4xl, font-bold
Subhead: Award icon + "CHAI AI Hackathon → 6 Months Later" in text-slate-500
Layout: A clean two-column comparison table/grid. Left column header: "What We Promised" (text-slate-400). Right column header: "What We Delivered" (navy, bold). Each row is a subtle card:
- Row 1: "8 modules, 33 lessons" → "9 modules, 52 lessons ✨ Over-delivered by 57%"
- Row 2: "AI Mentor prototype" → "Production Jabari with voice mode ✅"
- Row 3: "Offline concept" → "Enterprise-grade IndexedDB → Supabase sync queue ✅"
- Row 4: "Safeguarding idea" → "4-tier deterministic escalation system ✅"
- Row 5: "Gamification concept" → "Swahili-named tiers with streak tracking ✅"
- Row 6: "Career guidance" → "CBC-aligned Career Mapper (STEM, Arts, TVET) ✅"
Use green checkmarks and gold sparkle emoji. Make the "delivered" column visually stronger (bolder text, slight highlight).
Bottom right corner: A small callout — "Built by a team of 4 in 6 months."

SLIDE 7 — DIGITAL EQUITY (Phase 2)
Background: Off-white #F7FAFC
Headline: "What If AI Didn't Need the Internet?" in navy, text-4xl, font-bold
Subhead: "We call this Phase 2. We call it digital equity." in text-slate-500, italic
Layout: Two sections.
Top section — Context card with Globe icon: "42% of Kenyans have no reliable internet access. For rural students, cloud-based AI is a promise that cannot be kept. Phase 2 eliminates this barrier entirely."
Middle — Simple visual diagram (use SVG or styled divs): Show two states connected by a double arrow:
  Left: Cloud icon ☁️ + "Online Mode" + "Gemini 2.0 Flash via API" + "Full cloud features"
  Right: Smartphone icon 📱 + "Offline Mode" + "Gemma 4 on-device (420MB)" + "Works with zero connectivity"
  Center arrow: "Seamless hybrid switching"
Bottom section — Three small metric cards in a row:
  Card 1: Zap icon + "$0.76/student/year" + "Current cost at 10K students"
  Card 2: Zap icon + "$0.15/student/year" + "Cost at scale with on-device AI" 
  Card 3: Zap icon + "< $6,000" + "Total Phase 2 development cost"
Note at bottom in small text: "Runs on phones students already own: Tecno Spark, Infinix Hot, Samsung A-series (4GB+ RAM)"

SLIDE 8 — THE 76 CENTS
Background: Off-white #F7FAFC
Headline: "Less Than a Cup of Tea" in navy, text-4xl, font-bold
Layout: Use a recharts horizontal BarChart to make this visually dramatic.
Data for the bar chart (horizontal bars, sorted from most expensive to least):
  { name: "1 Secondary Textbook", cost: 10, color: "#94a3b8" }  (display as "$3.80 – $16.00")
  { name: "1 Hour Private Tutor", cost: 5, color: "#94a3b8" }
  { name: "Traditional EdTech License", cost: 5, color: "#94a3b8" } (display as "~$5.00/yr, requires broadband")
  { name: "School Counselor", cost: 0, color: "#ef4444" } (display as "N/A — doesn't exist", use a red "✗" )
  { name: "Youth Educated AI Mentor", cost: 0.76, color: "#FFD700" } (this bar should be gold and visually tiny compared to others)
Below the chart, a gold-bordered callout card: "For $0.76 per year, a student gets: 24/7 AI mentor · 52 life-skills lessons · crisis safeguarding · career guidance · offline access · bilingual support. All for less than the cost of a single cup of chai."
Make the Youth Educated bar glow or have a subtle animation to draw the eye.
```

---

## PROMPT 3: Slides 9–12 (The Opportunity)

```text
Now add slides 9 through 12 to the existing presentation. Maintain the EXACT same design system, navigation, component structure, and Tailwind styling. These are the final slides. Update the total slide count to 12.

SLIDE 9 — THE MARKET
Background: Off-white #F7FAFC
Headline: "The Opportunity" in navy, text-4xl, font-bold
Subhead: "11.6 million students. $7.3 billion market. Zero competitors in our lane." in text-slate-500
Layout: Two sections side by side (55/45 split).
Left — Use a recharts FunnelChart or vertical BarChart to show the TAM/SAM/SOM funnel:
  { name: "TAM: Kenya Youth (10-19)", value: 11600000, displayLabel: "11.6M" }
  { name: "SAM: Secondary Students", value: 4320000, displayLabel: "4.32M across 10,755 schools" }
  { name: "SOM Year 3", value: 200000, displayLabel: "200K active users (4.6% of SAM)" }
Use graduated navy shades (darkest for TAM, lightest for SOM). Gold accent for the SOM bar.
Right — A card with the expansion story:
  - Globe icon
  - "Expansion TAM" as header
  - "830 Million" in large gold text  
  - "Youth aged 15-35 across Sub-Saharan Africa" as subtext
  - "The SSA EdTech market is valued at $7.33B and growing 9-11% annually"
  - Small note: "Immediate expansion markets: Uganda, Tanzania, Nigeria (same phone ecosystem, similar demographics)"
Below both sections, a positioning callout in italic: "Every major Kenyan EdTech — Zeraki, Eneza, M-Shule — focuses on academic test prep. None address life skills, mentorship, or child safeguarding."

SLIDE 10 — THE BUSINESS MODEL
Background: Off-white #F7FAFC
Headline: "Freemium for Impact" in navy, text-4xl, font-bold
Subhead: "Every premium subscription funds a free user." in text-slate-500, italic
Layout: Two sections.
Top — Use a recharts stacked BarChart showing revenue by stream across 3 years:
  Year 1: B2B Schools $15K, CSR Sponsorships $25K, Grants $50K = Total $90K
  Year 2: B2B Schools $120K, CSR Sponsorships $75K, Grants $50K = Total $245K
  Year 3: B2B Schools $400K, CSR Sponsorships $150K, Grants $0 = Total $550K
Use these colors: B2B Schools = navy #0B3D91, CSR = gold #FFD700, Grants = slate #94a3b8
Include a legend. Add a small annotation arrow pointing to Year 2 saying "Breakeven: ~45K premium seats"
Bottom — Four small metric cards in a row:
  Card 1: "LTV:CAC" + "24:1" in large gold text + "Exceptional ratio via B2B block purchasing"
  Card 2: "B2B Price" + "$3/student/yr" in large text + "Unlocks analytics, parent portal, admin sync"
  Card 3: "CAC per Student" + "$0.37" in large text + "Via institutional block purchasing"
  Card 4: "Phase 2 Dev Cost" + "< $6,000" in large gold text + "10-week build timeline"

SLIDE 11 — THE TEAM
Background: Off-white #F7FAFC
Headline: "Built in Kenya. For Kenya. By Kenya." in navy, text-4xl, font-bold
Subhead: "We are not a hackathon team. We are an established non-profit that won a hackathon." in text-slate-500, italic
Layout: Top section — Four team member cards in a row. Each card: a circular placeholder with the person's initial (styled as a large letter in a navy circle with gold border), their name below, and a one-line role:
  "I" — Ian — Tech Lead & Product
  "D" — Dylan — Operations & Partnerships  
  "B" — Blixen — Community & Mentorship
  "S" — Sheila — Education & Curriculum
Bottom section — A full-width card with three columns showing the ecosystem:
  Column 1: Award icon + "Credibility" + "CHAI AI Hackathon Winners · Kytabu/CHAI Ecosystem · Endorsed by Italian Ambassador to Kenya"
  Column 2: Users icon + "Network" + "Established NGO · Partner schools · Existing mentor network · County-level peer communities"
  Column 3: Shield icon + "Technical Moats" + "Deterministic safeguarding · True offline-first architecture · Cultural localization engine · On-device AI pipeline"

SLIDE 12 — THE PARTNERSHIP (Final Slide)
Background: Deep navy #0B3D91, full bleed (matching the title slide to create a visual bookend)
Layout: Center-aligned, generous whitespace
- Top: A subtle gold horizontal line/divider
- Main headline: "An Invitation to Build Together" in white, text-5xl, font-bold, tracking-tight
- Below: Two columns on a semi-transparent white card (bg-white/10, backdrop-blur, rounded-2xl, p-8):
  Left column header: "What We Bring" in gold
    - "Proven technology — production-ready, not prototype"
    - "Local networks — schools, mentors, communities"  
    - "CBC alignment — government-mandated curriculum fit"
    - "Scalable impact — measurable, reportable, SB-compatible"
  Right column header: "What We're Seeking" in gold
    - "Strategic partnership within the GATE ecosystem"
    - "Integration into the Tuscany Mediterranean Bridge program"
    - "Pathway to Società Benefit-compatible impact reporting"
    - "Partners to scale to 1 million students"
- Below the card: "Youth Educated is the ideal vehicle for Piano Mattei's education pillar — African-built AI solving African challenges, with European standards of impact measurement." in white, text-lg, italic, max-w-3xl, centered
- Bottom: The tagline "Conversation. Choice. Change." in gold #FFD700, text-3xl, font-bold
- Very bottom: Small white text with contact info
```

---

## PROMPT 4: Polish & Export Pass

```text
Review the complete 12-slide presentation for these improvements:

1. VISUAL POLISH:
   - Ensure all slide transitions use a smooth 400ms fade-in with a subtle translateY(10px) → translateY(0) animation
   - Add hover:scale-[1.02] and transition-transform to all cards
   - Soften all shadows to shadow-sm (nothing harsh)
   - Ensure the progress bar at the top animates smoothly between slides
   - Add a subtle gradient overlay to the two navy slides (1 and 12): from navy to a slightly lighter navy-blue

2. RESPONSIVE CHECK:
   - Ensure it looks excellent at 1920x1080 (presentation mode)
   - Ensure it's readable at 1024x768 (smaller screens/PDF)
   - All charts from recharts should be wrapped in ResponsiveContainer

3. ACCESSIBILITY:
   - Ensure all text meets WCAG contrast requirements
   - All interactive elements should have clear focus states
   - Add aria-labels to navigation buttons

4. PRINT/PDF OPTIMIZATION:
   - Add a @media print CSS block that:
     - Removes navigation controls
     - Shows each slide as a full page
     - Ensures backgrounds print correctly (use -webkit-print-color-adjust: exact)

5. FINAL CHECK:
   - Verify all 12 slides are present and navigable
   - Verify the slide counter shows "X / 12" correctly
   - Verify keyboard navigation works for all slides
   - Ensure no slide has more than ONE main headline and THREE supporting points

After polishing, give me instructions to export this as a standalone HTML file I can open offline in Chrome (no build tools needed). Use Tailwind via CDN and include React/ReactDOM via CDN with Babel standalone for JSX transformation.
```
