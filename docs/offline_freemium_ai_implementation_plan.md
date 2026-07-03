# Youth Educated Offline, Freemium, and AI Implementation Plan

Purpose: make Youth Educated succeed as a small Android-first app for Kenyan/African students with reliable offline learning, freemium content, safeguarding, and a future optional offline AI path.

## Core Rules

- Keep the base Android APK small. Do not bundle LLM model files in the APK.
- Free students must reliably access all free eligible learning content offline.
- Premium students must reliably access unlocked premium learning content offline after download.
- Safeguarding must run before every AI response path: cloud, offline canned, AICore, LiteRT, or RAG.
- Do not expose `GEMINI_API_KEY`, service role keys, or premium entitlement secrets in frontend `VITE_` variables.
- Do not rely on React-only `isPremium` checks as real protection for premium content.

## Current Baseline

- Android debug APK builds successfully.
- APK path: `android/app/build/outputs/apk/debug/app-debug.apk`
- Current APK size: about 7 MB.
- Static fallback learning data exists in:
  - `src/data/modules.ts`
  - `src/data/lifekit.ts`
  - `src/data/opportunities.ts`
  - `src/data/careerQuestions.ts`
  - `src/data/jabariOffline.json`
- Current `Learn.tsx` is mostly a Life Kit article browser, not a complete course library.
- Premium gate exists in `src/components/PremiumGate.tsx`.
- Module access check exists in `src/pages/ModuleView.tsx`.
- Content fallback logic exists in `src/hooks/useContent.ts`.

## Phase 1: Make Offline Learning Reliable

Goal: any signed-in student can open the Android app offline and access eligible learning content.

Tasks:

1. Build a proper Course Library screen.
   - File: `src/pages/Learn.tsx`
   - Show two sections: `Courses` and `Life Kit`.
   - Courses must list modules from `useModules()`.
   - Life Kit must list articles from `LIFEKIT_ARTICLES`.
   - Each module card should show:
     - title
     - description
     - lesson count
     - duration
     - free/premium badge
     - age-gated badge if applicable
     - offline availability badge

2. Preserve current article browsing.
   - Do not remove Life Kit article filtering.
   - If needed, use tabs: `Courses` and `Life Kit`.

3. Add module routing from the Course Library.
   - Free eligible module card click: `navigate('/learn/' + module.id)`.
   - Premium locked module click: show existing `PremiumGate` or a compact locked state.
   - Age-ineligible module: show locked/age-appropriate message, do not open.

4. Confirm static learning data is available offline.
   - `useModules()` already falls back to `MODULES`.
   - `useLifeKitArticles()` already falls back to `LIFEKIT_ARTICLES`.
   - Make `Learn.tsx` use these hooks consistently where possible.

Acceptance criteria:

- Free user offline can see all free modules.
- Premium user offline can see premium modules if entitlement is cached.
- Life Kit article list still works.
- Module detail page works offline for bundled modules.
- `npm run lint`, `npm test`, and `npm run build` pass.

## Phase 2: Fix Freemium Content Packaging

Goal: make freemium real, not only a UI lock.

Current issue: premium module content is currently bundled in `src/data/modules.ts`, so a technical user could inspect it.

Recommended structure:

- Base bundle:
  - free modules
  - public Life Kit articles
  - basic career questions
  - safeguarding copy
  - canned offline Jabari replies

- Premium content pack:
  - finance module
  - career module
  - SRH module
  - healthy choices module
  - adulting module
  - premium Life Kit items if added later

Implementation steps:

1. Split module data.
   - Create `src/data/freeModules.ts`.
   - Create `src/data/moduleMetadata.ts`.
   - Move premium module bodies out of the base bundle later.
   - Keep metadata visible so free users can see what premium unlocks.

2. Add a premium pack manifest.
   - File suggestion: `public/content-packs/premium-pack.manifest.json`
   - Include:
     - `packId`
     - `version`
     - `contentVersion`
     - `sizeBytes`
     - `sha256`
     - `moduleIds`
     - `downloadUrl`

3. Add local pack storage.
   - Use Dexie in `src/lib/db.ts`.
   - Add table: `contentPacks`.
   - Fields:
     - `packId`
     - `version`
     - `status`
     - `downloadedAt`
     - `expiresAt`
     - `checksum`
     - `payload`

4. Add entitlement cache.
   - Store cached `isPremium`, `lastCheckedAt`, and `expiresAt`.
   - Suggested grace period: 14-30 days.
   - If offline and entitlement is still valid, allow premium content.
   - If expired offline, show “Connect to refresh premium access.”

Acceptance criteria:

- Free content remains bundled.
- Premium content can be downloaded only after entitlement check.
- Premium access works offline during grace period.
- Expired entitlement does not unlock premium content indefinitely.

## Phase 3: Improve Offline Auth and First Launch

Goal: avoid blocking returning students when internet is unavailable.

Tasks:

1. Keep OTP for first-time login.
   - Supabase SMS OTP requires internet.
   - Do not fake first-time auth.

2. Cache returning profile locally.
   - Current state hydration uses localStorage in `AppContext.tsx`.
   - Make sure cached signed-in users can reach `/dashboard` offline.

3. Add clear offline states.
   - If no cached user and offline: show “Connect once to set up this device.”
   - If cached user and offline: allow app access.

Acceptance criteria:

- First-time offline user sees a clear setup message.
- Returning offline user can open dashboard and free learning content.
- No Supabase calls block page rendering when offline.

## Phase 4: Local Knowledge Grounding

Goal: make Jabari answer from Youth Educated content before full fine-tuning.

Recommended first version: lightweight local search, not vector RAG yet.

Tasks:

1. Build a local knowledge index from:
   - module titles/descriptions/lesson sections
   - Life Kit articles
   - safeguarding public resources
   - career mapper guidance
   - opportunities metadata

2. Create file:
   - `src/lib/localKnowledge.ts`

3. Export functions:
   - `buildKnowledgeIndex()`
   - `searchKnowledge(query, options)`
   - `formatKnowledgeForPrompt(results)`

4. Use simple keyword/BM25-style search first.
   - This is smaller and easier than embeddings.
   - Later replace with vector search if needed.

5. Connect to offline Jabari.
   - File: `src/api/jabari.ts`
   - If offline:
     - run safeguarding first in caller
     - search local knowledge
     - if result exists, return guided response using relevant snippets
     - else use `jabariOffline.json`

Acceptance criteria:

- Offline Jabari can answer basic lesson/course questions from local content.
- Offline responses cite or mention the relevant module/article.
- No AI model needed yet.
- Safeguarding behavior unchanged.

## Phase 5: AI Provider Abstraction

Goal: prepare for cloud, AICore, LiteRT, and fallback without rewriting chat screens.

Create:

- `src/api/aiProvider.ts`

Types:

```ts
export type AIProviderId = 'cloud' | 'local-rag' | 'aicore' | 'litert' | 'canned';

export interface AIRequest {
  message: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
  user: User | null;
  mode: InteractionMode;
  persona: 'amara' | 'jabari';
}

export interface AIResponse {
  text: string;
  provider: AIProviderId;
  offline: boolean;
}
```

Routing order:

1. If online: `cloud`.
2. If offline and local knowledge can answer: `local-rag`.
3. If Android AICore available: `aicore`.
4. If LiteRT pack installed and device is capable: `litert`.
5. Else: `canned`.

Acceptance criteria:

- `Chat.tsx`, `VoiceChat.tsx`, and `FloatingAssistant.tsx` do not directly care which provider answered.
- Provider used can be shown internally for debugging.
- Existing cloud Jabari behavior remains unchanged.

## Phase 6: AICore / Gemini Nano Experiment

Goal: use Android-managed on-device AI where available, without increasing APK size.

Tasks:

1. Add a Capacitor plugin only for capability checks first.
   - Android Kotlin methods:
     - `isAICoreAvailable()`
     - `getDeviceMemoryClass()`
     - `getFreeStorageBytes()`
     - `getAndroidSdkVersion()`

2. Expose TypeScript wrapper:
   - `src/lib/androidCapabilities.ts`

3. Gate UI.
   - Show “Offline Smart Jabari available” only on supported devices.
   - Hide or disable on unsupported phones.

4. Only after capability checks work, add Prompt API integration.

Acceptance criteria:

- Unsupported phones still work.
- No large model is downloaded.
- APK size remains small.

## Phase 7: Optional LiteRT-LM Offline AI Pack

Goal: pilot a stronger fully offline model without forcing it on all students.

Do not do this before Phases 1-6.

Requirements:

- Explicit opt-in.
- Wi-Fi recommended.
- Battery/storage warning.
- Pause/resume download.
- Checksum validation.
- Delete model option.
- Device compatibility gate.

Minimum checks:

- Android version supported.
- Free storage greater than model size plus 1 GB.
- RAM/memory class acceptable.
- Battery not critically low.

Provider behavior:

- If installed and device capable, `litert` can answer offline.
- Still run safeguarding before inference.
- Still use local knowledge grounding in prompt.

Acceptance criteria:

- App works without this pack.
- Installing pack does not break low-end phones.
- User can remove pack and return to small offline mode.

## Phase 8: Fine-Tuning Strategy

Goal: make Jabari/Amara culturally distinct after product fundamentals are stable.

Do not start by fine-tuning.

Dataset first:

- 500-1000 human-reviewed examples minimum.
- Include:
  - Kenyan English
  - Kiswahili
  - Sheng
  - rural and urban contexts
  - school pressure
  - family pressure
  - money/M-Pesa examples
  - confidence, careers, relationships, SRH
  - safe refusal/escalation examples

Evaluation set:

- 100 normal mentoring prompts.
- 100 curriculum-grounded prompts.
- 100 safeguarding prompts.
- 50 Sheng/Kiswahili mixed prompts.
- 50 adversarial/evasive prompts.

Fine-tuning path:

1. Prompt engineering.
2. Local RAG.
3. LoRA fine-tune.
4. Quantize/convert for LiteRT-LM.
5. Pilot only.

Acceptance criteria:

- Fine-tuned model is better than prompt+RAG in blind review.
- Safeguarding tests pass before release.
- Android device benchmarks are acceptable.

## Phase 9: Safeguarding Hardening

Goal: make safeguarding consistent across online and offline modes.

Files:

- `src/lib/safeguarding.ts`
- `src/lib/safeguarding.test.ts`
- `src/pages/Chat.tsx`
- `src/pages/VoiceChat.tsx`
- `src/components/FloatingAssistant.tsx`
- `src/pages/Circles.tsx`
- `src/components/MoodTracker.tsx`

Tasks:

1. Centralize AI preflight.
   - One helper should run safeguarding before provider routing.

2. Queue offline flags.
   - If offline and Category A/B/C requires logging, save to Dexie queue.
   - Sync to `safeguarding_flags` when online.

3. Add more tests.
   - English.
   - Kiswahili.
   - Sheng.
   - typos.
   - spacing/punctuation tricks.

Acceptance criteria:

- Category A/B never reaches any model.
- Category A content remains redacted where required.
- Offline flags sync later.
- `npm test` passes.

## Phase 10: Android Test Plan

Run before release:

1. Web checks:
   - `npm run lint`
   - `npm test`
   - `npm run build`

2. Android checks:
   - `npx cap sync android`
   - `cd android`
   - `gradlew assembleDebug`

3. Manual device tests:
   - fresh install
   - first login online
   - reopen offline
   - free course offline
   - premium gate offline
   - premium pack download
   - premium content offline
   - module progress offline then sync online
   - Jabari cloud online
   - Jabari offline fallback
   - safeguarding offline
   - app restart offline

Target devices:

- Tecno Spark or Camon.
- Infinix Hot or Note.
- Samsung A-series.
- Xiaomi Redmi.
- One older 3 GB RAM Android if available.

## Build Order For Smaller Agents

Do this in order:

1. Course Library in `Learn.tsx`.
2. Offline eligibility badges and locked states.
3. Local entitlement cache.
4. Premium content pack manifest and Dexie table.
5. Local knowledge search.
6. AI provider abstraction.
7. Safeguarding preflight centralization.
8. Android capability plugin.
9. AICore experiment.
10. LiteRT optional pack.
11. Fine-tuning dataset and evaluation.

## Definition Of Success

- Base APK remains small.
- Free student can learn offline.
- Premium student can download and use premium content offline.
- Returning student can open the app offline.
- Jabari has a useful offline fallback.
- No AI path bypasses safeguarding.
- Low-end phones are not punished by mandatory AI downloads.
- Android debug APK builds cleanly.
