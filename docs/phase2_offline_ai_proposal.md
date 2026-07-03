# Youth Educated — Phase 2 Proposal: On-Device AI

> **"A Mentor in Every Pocket — Even Without Internet"**

> [!NOTE]
> This document is a technical and financial proposal for **Phase 2** of the Youth Educated platform. Phase 1 (MVP) has been completed: the app is live with cloud-based AI mentoring (Jabari), offline-first content, gamification, safeguarding, and human mentorship pairing. Phase 2 brings the AI **onto the device itself**, making Jabari and Amara work without any internet connection.

---

## Executive Summary

Youth Educated is a life-skills and mentorship platform for Kenyan youth aged 10–22. We won the Chai Hackathon and have built a working MVP with AI mentoring powered by Google Gemini 2.0 Flash.

**The problem:** Our AI mentor (Jabari) currently requires an internet connection. For students in rural Kenya — our core audience — this means losing access to their AI mentor exactly when they need it most: after school, on weekends, and during holidays when data is expensive or unavailable.

**The solution:** Deploy a lightweight, fine-tuned AI model directly on students' phones. The model downloads once (like a game update) and then works forever — no internet required.

**The cost:** Under $5,000 to develop. Under $500/year to serve 10,000 students. The model file is only ~400MB — smaller than a single Netflix episode.

---

## What We Have Today (Phase 1 — Complete ✅)

| Feature | Status | Technology |
|---------|--------|------------|
| AI Mentor Chat (Jabari) | ✅ Working | Google Gemini 2.0 Flash via Supabase Edge Functions |
| Voice Mode | ✅ Working | Web Speech API + optional ElevenLabs |
| 8 Life Skills Modules (33 lessons) | ✅ Complete | Offline-cacheable content |
| Gamification (points, tiers, streaks) | ✅ Working | Swahili-named tier system |
| Safeguarding System | ✅ Working | Keyword detection → DSL escalation |
| Human Mentorship Pairing | ✅ Working | Mentor profiles, scheduling, endorsements |
| Career Mapper | ✅ Working | CBC pathway alignment |
| Peer Circles | ✅ Working | County-scoped discussions |
| Offline Sync | ✅ Working | Dexie (IndexedDB) → Supabase queue |
| Android App | ✅ Working | Capacitor 8 |

**Current limitation:** When a student goes offline, Jabari falls back to pre-written canned responses stored in a JSON file. These are static, not personalised, and don't feel like a real conversation. The student loses their AI mentor the moment they lose signal.

---

## What Phase 2 Delivers

### The Hybrid AI Architecture

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│    Student opens chat with Jabari or Amara               │
│                        │                                 │
│                   Has internet?                          │
│                   ╱          ╲                            │
│                 YES           NO                         │
│                  │             │                          │
│     ┌────────────┴──┐  ┌──────┴─────────────┐           │
│     │  Gemini 2.0   │  │  On-Device Model   │           │
│     │  Flash (Cloud) │  │  (Gemma 4 E2B)     │           │
│     │               │  │  + Local RAG        │           │
│     │  Full power   │  │  + YE Knowledge     │           │
│     │  600 tokens   │  │  Base               │           │
│     └───────────────┘  └────────────────────┘           │
│                   ╲          ╱                            │
│                    ╲        ╱                             │
│                     ╲      ╱                              │
│              Safeguarding check                          │
│              (always local, always on)                   │
│                        │                                 │
│                   Response to                            │
│                    student                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**When online:** The app works exactly as it does today — full-power Gemini 2.0 Flash via the cloud.

**When offline:** The app seamlessly switches to an on-device AI model that has been fine-tuned to sound and behave exactly like Jabari (or Amara). It has access to all of Youth Educated's life-skills content via a local knowledge base (RAG).

**The student never notices the switch.** The experience is seamless.

### Jabari & Amara — Same Brain, Different Voice

Jabari and Amara are the same underlying AI model with different **system prompts** (personality instructions):

| Aspect | Jabari | Amara |
|--------|--------|-------|
| Gender presentation | Male | Female |
| Voice (TTS) | Male African voice | Female African voice |
| Personality | Trusted older brother | Trusted older sister |
| Tone | "Bro, you've got this" | "Sis, I believe in you" |
| Model underneath | Gemma 4 E2B (shared) | Gemma 4 E2B (shared) |
| Download | Same model file | Same model file |

Students choose their AI companion during onboarding. They can switch at any time in Settings. **No additional model download is required** — the personality is defined by a text prompt, not a separate model.

---

## The Technology

### Model Selection: Gemma 4 E2B

We will use **Google Gemma 4 E2B** — released April 2026 under the Apache 2.0 open-source licence.

| Specification | Detail |
|--------------|--------|
| Parameters | ~2 billion (effective) |
| Quantized file size | **~300 MB** (Q4_K_M quantization) |
| RAM required | < 1.5 GB |
| Context window | 128,000 tokens |
| Capabilities | Text, images, audio (on-device) |
| Speed | 4x faster than predecessor (Gemma 3n) |
| Battery impact | 60% less drain than predecessor |
| Licence | Apache 2.0 — fully open, commercial use allowed |
| Inference engine | Google AI Edge / LiteRT (native Android) |

**Why this model:**
- It's the smallest model that's genuinely good at conversation
- Built by Google specifically for mobile phones
- Uses less than 1.5GB RAM — fits on a 4GB phone (the Kenyan standard)
- Apache 2.0 means zero licensing fees, forever
- Native Android support through Google's own inference engine

### RAG: Making the AI Know Your Curriculum

RAG (Retrieval-Augmented Generation) means the AI doesn't need to memorise all of Youth Educated's content — it **looks it up** from a local database on the phone, just like a student opening their textbook.

| Component | Purpose | Size |
|-----------|---------|------|
| sqlite-vec | Local vector database (SQLite extension) | ~5 MB |
| Embedding model | Converts text to searchable vectors | ~50 MB |
| YE Knowledge Base | All 33 lessons, career info, opportunities, safeguarding resources — pre-embedded | ~50-80 MB |

**How it works:**
1. Student asks: *"How do I prepare for a job interview?"*
2. The embedding model converts this into a vector (a list of numbers)
3. sqlite-vec finds the closest matching content in the YE knowledge base
4. The relevant lesson content is fed to Gemma 4 E2B as context
5. Gemma generates a personalised, curriculum-grounded response

**This means the AI always gives answers based on YOUR curriculum**, not random internet knowledge. It speaks Youth Educated.

### The Download Experience

Like PUBG Mobile and other large games, the AI is delivered as a **post-install update**:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Step 1: Student installs app from Play Store       │
│          App size: ~15-20 MB                        │
│          (App works normally — cloud AI only)       │
│                                                     │
│  Step 2: App prompts "Download Offline AI"          │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │  🤖 Unlock Jabari Offline!               │ │  │
│  │  │                                          │ │  │
│  │  │  Download the AI update to chat with     │ │  │
│  │  │  Jabari even without internet.           │ │  │
│  │  │                                          │ │  │
│  │  │  Size: 420 MB                            │ │  │
│  │  │  ⚠️  We recommend using Wi-Fi            │ │  │
│  │  │                                          │ │  │
│  │  │  [████████████░░░░] 67%                  │ │  │
│  │  │                                          │ │  │
│  │  │  [Download Now]  [Later]                 │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Step 3: AI downloads in background                 │
│          Supports pause/resume                      │
│          Wi-Fi recommended (default setting)        │
│                                                     │
│  Step 4: Done! Jabari/Amara works offline forever   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Total download: ~400-450 MB** (model + knowledge base + embedding model)

For context:
- A single WhatsApp video call: ~25 MB per minute
- An episode of a show on Netflix mobile: ~250 MB
- PUBG Mobile initial update: ~1.5 GB
- **Youth Educated AI: ~420 MB — smaller than 20 minutes of WhatsApp video calling**

---

## Fine-Tuning: Teaching the Model to Be Jabari

The base Gemma 4 E2B model is a general-purpose AI. To make it behave like Jabari — warm, Kenyan, Socratic, curriculum-aligned — we need to **fine-tune** it.

### What Fine-Tuning Means

Think of it like hiring a talented teacher and then training them specifically on Youth Educated's curriculum and mentoring style. The base model is the talented teacher. Fine-tuning is the training programme.

### Step-by-Step Process

#### Step 1: Generate Training Data (Week 1-2)

Use our existing Gemini 2.0 Flash (which already knows how to be Jabari) as the **"teacher"** to generate thousands of example conversations.

| Task | Detail |
|------|--------|
| Generate 3,000-5,000 conversation pairs | Jabari-style Q&A covering all 8 modules |
| Include safeguarding examples | Correct escalation responses |
| Include bilingual examples | English, Kiswahili, and mixed Sheng |
| Include roleplay scenarios | Mr. Otieno (interview), Mama K. (parent talk), Jakes (peer pressure) |
| Include CBC context | Career pathways, TVET, KUCCPS, county-specific info |
| Quality review | Human review of 500 random samples for tone, accuracy, safety |

**Cost: $50-100** (Gemini API calls to generate synthetic training data)

#### Step 2: Fine-Tune with LoRA (Week 2-3)

LoRA (Low-Rank Adaptation) is a technique that fine-tunes only ~1-2% of the model's parameters. This is dramatically cheaper and faster than full fine-tuning.

| Resource | Option A (Budget) | Option B (Comfortable) |
|----------|-------------------|----------------------|
| GPU rental | RunPod A100 (80GB) | Lambda Labs A100 |
| Cost per hour | ~$1.50/hr | ~$2.00/hr |
| Training time | 4-8 hours | 4-8 hours |
| Total GPU cost | **$6-12** | **$8-16** |
| Tool | Unsloth (2x faster training) | HuggingFace TRL |
| VRAM needed | 24GB minimum | 40GB comfortable |

**Total fine-tuning cost: $10-20**

#### Step 3: Quantize the Model (Week 3)

Convert the fine-tuned model from full precision to Q4_K_M (4-bit) format for mobile deployment.

| Before quantization | After quantization |
|--------------------|-------------------|
| ~4 GB (FP16) | ~300 MB (Q4_K_M) |
| Needs 8GB+ RAM | Needs <1.5GB RAM |
| Too large for phones | Fits on any modern phone |
| Quality: 100% | Quality: ~95% (negligible loss) |

**Cost: $0** (runs on any laptop in ~30 minutes)

#### Step 4: Build the RAG Knowledge Base (Week 3-4)

Pre-process all Youth Educated content into vector embeddings.

| Content source | Items | Purpose |
|---------------|-------|---------|
| Life Skills modules (all 8) | 33 lessons | Core curriculum knowledge |
| Career Mapper questions & pathways | ~50 items | Career guidance |
| Opportunities database | ~30 entries | Scholarships, jobs, programmes |
| Life Kit articles | ~20 articles | Supplementary reading |
| Safeguarding resources | ~10 items | Emergency contacts, protocols |
| CBC framework info | ~15 items | TVET, KUCCPS, competencies |
| Offline prompt trees | ~30 prompts | Morning/evening check-ins |

**Cost: $5-10** (embedding API calls, or free if using on-device model)

#### Step 5: Build the Native Bridge (Week 4-8)

Create a custom Capacitor plugin that connects the web app to the native AI inference engine.

| Component | What it does | Effort |
|-----------|-------------|--------|
| Capacitor plugin (TypeScript API) | Exposes `runInference()`, `downloadModel()`, `checkModelStatus()` to the web layer | 2 weeks |
| Native Android module (Kotlin) | Wraps Google AI Edge / LiteRT for Gemma 4 E2B inference | 2 weeks |
| Download manager | Background download with progress, pause/resume, checksum validation | 1 week |
| Integration with jabari.ts | Route offline queries to on-device model instead of Supabase Edge Function | 1 week |
| sqlite-vec integration | Local vector search for RAG | 1 week |

**Developer cost: 6-10 weeks of Android/AI development**

#### Step 6: Test on Real Devices in Kenya (Week 8-10)

| Test | Target devices | What we're measuring |
|------|---------------|---------------------|
| Inference speed | Tecno Spark, Infinix Hot, Samsung A-series | Time to first token, tokens per second |
| RAM usage | 4GB RAM phones | Peak RAM during inference |
| Battery drain | 5,000 mAh battery | % drain per 30-minute chat session |
| Download reliability | Safaricom 4G, school Wi-Fi | Resume after interruption, checksum validation |
| Response quality | N/A | Blind comparison vs. cloud Jabari by 10 students |
| Safeguarding | N/A | All keyword triggers work identically offline |

---

## Cost Analysis

### One-Time Development Costs

| Item | Cost (USD) | Notes |
|------|-----------|-------|
| Training data generation (Gemini API) | $50-100 | 3,000-5,000 conversation pairs |
| GPU rental for fine-tuning | $10-20 | 4-8 hours on A100 |
| RAG knowledge base creation | $5-10 | Embedding generation |
| Developer time (6-10 weeks) | $3,000-5,000 | Assuming 1 mid-level developer |
| Testing devices (2 phones) | $200-300 | Tecno Spark + Infinix Hot |
| **Total one-time cost** | **$3,265-5,430** | |

### Ongoing Monthly Costs — By Scale

#### Model Hosting (CDN for downloads)

Students download the model file once. We host it on a CDN.

| Scale | Monthly Downloads | CDN Storage | CDN Bandwidth | Monthly Cost |
|-------|------------------|-------------|---------------|-------------|
| **100 students** | ~100 | 500 MB | ~42 GB | **$0.42** |
| **1,000 students** | ~1,000 | 500 MB | ~420 GB | **$4.20** |
| **5,000 students** | ~5,000 | 500 MB | ~2.1 TB | **$21.00** |
| **10,000 students** | ~10,000 | 500 MB | ~4.2 TB | **$42.00** |

> [!TIP]
> Using Cloudflare R2 ($0.015/GB egress) or Backblaze B2 ($0.01/GB). After the initial wave of downloads, monthly costs drop dramatically because existing users don't re-download.

#### Cloud AI Costs (Gemini — for online users)

This is the **existing** cost that we already pay. Phase 2 actually **reduces** this cost because offline users no longer hit the cloud API.

| Scale | Avg. messages/day/user | Monthly API calls | Gemini Cost/month | With Phase 2 (50% offline) |
|-------|----------------------|-------------------|-------------------|-----------------------------|
| **100 students** | 5 | 15,000 | ~$3 | ~$1.50 |
| **1,000 students** | 5 | 150,000 | ~$30 | ~$15 |
| **5,000 students** | 5 | 750,000 | ~$150 | ~$75 |
| **10,000 students** | 5 | 1,500,000 | ~$300 | ~$150 |

> [!IMPORTANT]
> **Phase 2 cuts cloud AI costs by up to 50%** because students who are offline use the on-device model at zero marginal cost.

#### Total Monthly Running Costs (Year 1 Projection)

| Scale | CDN | Cloud AI (reduced) | Supabase | Total/month | Total/year |
|-------|-----|--------------------|----------|-------------|-----------|
| **1,000 students** | $4 | $15 | $25 | **$44/month** | **$528/year** |
| **5,000 students** | $21 | $75 | $25 | **$121/month** | **$1,452/year** |
| **10,000 students** | $42 | $150 | $75 | **$267/month** | **$3,204/year** |

> [!NOTE]
> CDN costs front-load in the first 1-3 months as students download the model, then drop to near-zero for maintenance. The Year 1 figures above assume all downloads happen within the first 3 months.

### Cost Per Student Per Year

| Scale | Total Annual Cost | Cost Per Student Per Year |
|-------|------------------|--------------------------|
| 1,000 students | $528 + $4,350 dev = **$4,878** | **$4.88** |
| 5,000 students | $1,452 + $4,350 dev = **$5,802** | **$1.16** |
| 10,000 students | $3,204 + $4,350 dev = **$7,554** | **$0.76** |

**At 10,000 students, the cost of giving every student an AI mentor — online and offline — is 76 cents per year.**

---

## Kenyan Device Compatibility

### The Phones Our Students Actually Have

| Spec | Typical Affordable Phone (2025-2026) | Phase 2 Requirement |
|------|--------------------------------------|---------------------|
| Storage | 128 GB | 420 MB (~0.3% of storage) ✅ |
| RAM | 4-8 GB | <1.5 GB ✅ |
| Battery | 5,000-6,000 mAh | Moderate drain during use ✅ |
| Processor | Octa-core MediaTek Helio G | Supported by LiteRT ✅ |
| OS | Android (94% market share in Kenya) | Android 10+ ✅ |
| Brands | Tecno, Infinix, Itel, Samsung, Xiaomi | All compatible ✅ |

### What About Older/Cheaper Phones?

| Device tier | RAM | Storage | Phase 2 support |
|------------|-----|---------|-----------------|
| **Standard** (2024+) | 4-8 GB | 128 GB | ✅ Full on-device AI |
| **Budget** (2022-2023) | 3 GB | 64 GB | ⚠️ Cloud AI only — on-device model won't fit in RAM |
| **Ultra-budget** (pre-2022) | 2 GB | 32 GB | ❌ Cloud AI when online, canned responses when offline |

**Graceful degradation:** The app never breaks. Students with older phones simply continue using the current cloud-based experience. The offline AI is an **enhancement**, not a requirement.

### Data Costs for the Download

| Provider | 1 GB cost (Kenya, 2026) | AI download cost (~420 MB) |
|----------|------------------------|---------------------------|
| Safaricom | ~KES 99 (~$0.75) | ~KES 42 (~$0.32) |
| Airtel | ~KES 99 (~$0.75) | ~KES 42 (~$0.32) |
| School/Library Wi-Fi | Free | Free |

**Mitigations:**
- Default: download over Wi-Fi only
- Pause/resume support for interrupted downloads
- Partner with schools to offer download stations
- Option: pre-load model on SD cards for distribution events

---

## Timeline

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 1-2 | Training data generation | 3,000-5,000 Jabari-style conversation pairs |
| 2-3 | Fine-tuning | LoRA-adapted Gemma 4 E2B model |
| 3 | Quantization | Q4_K_M GGUF file (~300 MB) |
| 3-4 | RAG knowledge base | sqlite-vec database with all YE content |
| 4-6 | Native Capacitor plugin | Android bridge to LiteRT inference |
| 6-7 | Download manager | Background download UI with progress |
| 7-8 | Integration | jabari.ts routing logic (online ↔ offline) |
| 8-10 | Testing | Real-device testing in Kenya |
| 10 | **Launch** | **Phase 2 complete — Jabari/Amara work offline** |

**Total: ~10 weeks from start to launch**

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Model quality not matching Gemini | Medium | High | Extensive fine-tuning + RAG grounding. Blind testing with students before launch |
| 4GB phones struggling with inference | Low | Medium | Gemma 4 E2B specifically designed for <1.5GB. Thermal throttling handled by keeping responses short (600 token limit) |
| Students can't download 420MB | Medium | Medium | Wi-Fi-only default, pause/resume, school download stations, SD card option |
| Safeguarding gaps in offline mode | Low | Critical | Keyword detection is already 100% local. Escalation responses are hardcoded text. Zero change needed |
| Model produces harmful content | Low | Critical | Fine-tuning includes safety alignment. Existing safeguarding filter runs BEFORE all AI responses. Same architecture as cloud version |

---

## How This Connects to Our Vision

### From the Chai Hackathon pitch:

> *"It's more than just an idea; we've already started building."*

Phase 2 delivers on the promise made in our winning pitch:

| Promise | Phase 1 (Done) | Phase 2 (This Proposal) |
|---------|---------------|------------------------|
| *"Offline-first, ensuring students with limited data can access our entire library"* | ✅ Content works offline | ✅ **AI mentor works offline** |
| *"The AI companion that frees our human mentors to do what they do best"* | ✅ Jabari works online | ✅ **Jabari works everywhere** |
| *"A mentor in every pocket"* | ⚠️ Only with internet | ✅ **Truly in every pocket** |

### From the Project Specification:

> *"Use hosted LLM APIs (OpenAI / Anthropic) for phase 1 prototype, moving to local fine-tuned models for phase 2."*

**This was always the plan.** Phase 2 is the natural next step that was outlined from day one.

### From the Product Strategy Brief:

> *"The defensible moat isn't the AI — it's the combination of offline curriculum continuity + real human mentorship + Kenya-specific safeguarding in one loop."*

Phase 2 completes that moat. With on-device AI, no competitor can match our offline depth.

---

## The Ask

| Item | Amount |
|------|--------|
| Development (10 weeks, 1 developer) | $3,000-5,000 |
| Infrastructure (GPU, API, testing devices) | $265-430 |
| Year 1 operations (1,000 students) | $528 |
| **Total Phase 2 Investment** | **$3,793-5,958** |

For under $6,000, we give every student with a smartphone an AI mentor that works without internet — permanently.

At scale (10,000 students), the marginal cost is **76 cents per student per year**.

**That's the cost of giving a generation of Kenyan youth a mentor in their pocket.**
