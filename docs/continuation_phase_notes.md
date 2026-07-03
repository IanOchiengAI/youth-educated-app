# Youth Educated Continuation Notes

Last updated: 2026-06-21

This document is a handoff note for continuing the offline learning, freemium, and AI improvement work in `F:\Work\App\YE\youth-educated-app`.

## Current Goal

Prepare Youth Educated for team testing only after the agreed improvement phases have been completed, not immediately after the first debug APK.

The broader direction is:

1. Make `/learn` a real offline course library.
2. Make freemium content packaging more real.
3. Improve returning-user offline behavior.
4. Add local knowledge grounding before any heavier offline AI work.
5. Add an AI provider abstraction.
6. Later explore Android AICore / Gemini Nano capability checks.
7. Much later explore optional LiteRT/offline model packs.
8. Only after product fundamentals are stable, consider fine-tuning.
9. Harden safeguarding across every online and offline AI path.
10. Run Android release-readiness testing.

## Important Project Rules

- Read `AGENTS.md` before coding.
- Read `docs/offline_freemium_ai_implementation_plan.md` before continuing these phases.
- Do not casually touch `src/lib/safeguarding.ts`.
- Do not call Gemini directly from the frontend.
- Do not put `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `ELEVENLABS_API_KEY` in any `VITE_` variable.
- Keep the base APK small. Do not bundle LLM model files.
- Free users must reliably access eligible free learning content offline.
- Premium gating in React is not real security by itself.
- There are unrelated pre-existing uncommitted files. Do not revert them.
- Android debug build has previously passed using JDK 21.

## Phase 1: Offline Course Library

Status: implemented and validated.

Files changed:

- `src/pages/Learn.tsx`
- `src/lib/i18n.ts`

What was done:

- `/learn` now has two tabs: `Courses` and `Life Kit`.
- Courses tab lists modules from `useModules()`.
- Life Kit tab preserves the existing article browser, including categories, tags, grouped view, search, and article routing.
- Course cards show:
  - module icon
  - title
  - description
  - lesson count
  - duration
  - Free or YE+ badge
  - age-gated badge when locked
  - offline-ready badge
  - progress bar when progress exists in `state.modules.moduleProgress`
- Free eligible modules navigate to `/learn/{module.id}`.
- Premium eligible modules also navigate to `ModuleView`, so existing `PremiumGate` handles the lock.
- Age-gated modules do not open from the course library.

Validation already passed after Phase 1:

- `npm.cmd run lint`
- `npm.cmd test`
- `npm.cmd run build`
- `npx.cmd cap sync android`
- Android debug build:
  - From `android/`
  - `$env:JAVA_HOME='C:\tmp\paddock-tools\jdk-21-complete\jdk-21.0.11+10'; $env:PATH="$env:JAVA_HOME\bin;$env:PATH"; .\gradlew.bat assembleDebug --no-daemon --stacktrace`

APK path:

- `android/app/build/outputs/apk/debug/app-debug.apk`

## Phase 2: Freemium Content Packaging

Status: partially implemented, validation in progress.

This phase is intended to make freemium more real by separating free bundled lesson bodies from premium metadata and creating a premium pack/cache path.

Files changed so far:

- `src/data/modules.ts`
- `src/data/freeModules.ts`
- `src/data/premiumModules.ts`
- `src/data/moduleMetadata.ts`
- `src/hooks/useContent.ts`
- `src/lib/db.ts`
- `src/lib/contentPacks.ts`
- `src/pages/ModuleView.tsx`
- `src/lib/i18n.ts`
- `public/content-packs/premium-pack.manifest.json`
- `public/sw.js`

What has been done so far:

- Split module data:
  - `FREE_MODULES` contains free modules with full lesson bodies.
  - `PREMIUM_MODULES` contains premium module bodies.
  - `PREMIUM_MODULE_METADATA` contains premium module metadata with empty `content`.
  - `MODULES` now exports free module bodies plus premium metadata.
- Removed static re-export of `PREMIUM_MODULES` from `src/data/modules.ts`.
- Added a dynamic premium content pack path in `src/lib/contentPacks.ts`.
- Added Dexie tables:
  - `contentPacks`
  - `entitlementCache`
- Added a premium entitlement grace-window helper:
  - Online premium status can refresh the entitlement cache.
  - Offline access depends on a still-fresh cached entitlement.
- Updated `useModules()`:
  - Free/non-premium users get free bodies plus premium metadata only.
  - Premium users can hydrate premium bodies through the content pack path.
  - Offline premium access requires cached entitlement.
- Added a `ModuleView` empty-content guard:
  - If a module is accessible but its content body is unavailable, it shows a clean “Course pack needed” state instead of rendering an empty lesson.
- Added content pack manifest:
  - `public/content-packs/premium-pack.manifest.json`
- Bumped service worker cache:
  - `public/sw.js`: `CACHE_VERSION` from `v4` to `v5`.

Known limitation of current Phase 2 state:

- `src/data/premiumModules.ts` is still part of the source tree and Vite builds it as a lazy chunk when dynamically imported.
- This is better than exposing premium bodies through the default module list, but it is not final security.
- A later Phase 2 step should move premium pack delivery out of the base app bundle entirely, behind a real entitlement-checked download path.

Validation already passed after Phase 2 partial work:

- `npm.cmd run lint`
- `npm.cmd test`
- `npm.cmd run build`

Build observation:

- Production build created a separate lazy chunk for premium content:
  - `dist/assets/premiumModules-*.js`
- Main `index` bundle became smaller, which suggests the split is working structurally.

Validation still needed before continuing:

1. Run `npx.cmd cap sync android`.
2. Run Android debug build from `android/`:

```powershell
$env:JAVA_HOME='C:\tmp\paddock-tools\jdk-21-complete\jdk-21.0.11+10'
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
.\gradlew.bat assembleDebug --no-daemon --stacktrace
```

3. Confirm APK path:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Recommended next code review before moving to Phase 3:

- Check that no file other than `src/lib/contentPacks.ts` imports `../data/premiumModules`.
- Check `/learn` still shows all premium modules as cards using metadata.
- Check free users still get `PremiumGate` if they tap a YE+ module.
- Check a premium user online can hydrate premium module content.
- Check a premium user offline without cached entitlement does not unlock premium bodies.
- Check a premium user offline with fresh cached entitlement can access downloaded/cached premium bodies.
- Consider replacing the temporary `bundled-development-pack` behavior with a real pack download before calling Phase 2 complete.

## Phase 3: Improve Offline Auth and Returning User Flow

Status: not started.

Goal:

- A returning signed-in student should be able to reopen the app offline and access dashboard plus free learning content.
- A first-time offline user should see a clear setup message.

Tasks:

1. Review `AppContext.tsx` hydration.
2. Confirm cached signed-in users can reach `/dashboard` offline.
3. Confirm no Supabase call blocks page rendering when offline.
4. Add clear offline setup state if no cached user exists:
   - “Connect once to set up this device.”
5. Keep OTP first login online only. Do not fake first-time auth.

Acceptance criteria:

- First-time offline user sees setup message.
- Returning offline user can open dashboard.
- Returning offline user can open free course content.
- No auth loop or blank screen offline.

## Phase 4: Local Knowledge Grounding

Status: not started.

Goal:

- Make Jabari able to answer basic questions from Youth Educated content before adding heavier AI infrastructure.

Recommended first version:

- Simple local keyword/BM25-style search.
- Do not start with embeddings/vector search on-device.

Create:

- `src/lib/localKnowledge.ts`

Suggested exports:

- `buildKnowledgeIndex()`
- `searchKnowledge(query, options)`
- `formatKnowledgeForPrompt(results)`

Content sources:

- module titles/descriptions/lesson sections
- Life Kit articles
- safeguarding public resources/copy
- career mapper guidance
- opportunities metadata

Acceptance criteria:

- Offline Jabari can answer basic course/content questions.
- Responses mention relevant module/article when possible.
- No local AI model required.
- Safeguarding behavior unchanged.

## Phase 5: AI Provider Abstraction

Status: not started.

Goal:

- Prepare cloud, local RAG, AICore, LiteRT, and canned fallback without rewriting chat screens.

Create:

- `src/api/aiProvider.ts`

Suggested types:

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

1. Online: cloud.
2. Offline with local knowledge result: local-rag.
3. Android AICore available: aicore.
4. LiteRT pack installed and capable: litert.
5. Otherwise: canned.

Acceptance criteria:

- `Chat.tsx`, `VoiceChat.tsx`, and `FloatingAssistant.tsx` do not directly care which provider answered.
- Existing cloud Jabari behavior remains unchanged.
- Provider can be shown internally for debugging if needed.

## Phase 6: Android AICore / Gemini Nano Capability Checks

Status: not started.

Goal:

- Detect support before trying any on-device AI.
- Do not increase APK size.

Tasks:

1. Add a Capacitor plugin only for capability checks first.
2. Android Kotlin methods:
   - `isAICoreAvailable()`
   - `getDeviceMemoryClass()`
   - `getFreeStorageBytes()`
   - `getAndroidSdkVersion()`
3. Expose wrapper:
   - `src/lib/androidCapabilities.ts`
4. Gate UI:
   - Show offline smart Jabari only on supported devices.
   - Hide/disable on unsupported devices.

Acceptance criteria:

- Unsupported phones still work.
- No large model downloaded.
- APK remains small.

## Phase 7: Optional LiteRT Offline AI Pack

Status: not started.

Do not start before Phases 1-6.

Goal:

- Optional, explicit opt-in offline model pack for stronger offline AI.

Requirements:

- Explicit opt-in.
- Wi-Fi recommended warning.
- Battery/storage warning.
- Pause/resume download.
- Checksum validation.
- Delete model option.
- Device compatibility gate.

Acceptance criteria:

- App works without this pack.
- Low-end phones are not punished.
- User can remove pack and return to small offline mode.
- Safeguarding still runs before inference.

## Phase 8: Fine-Tuning Strategy

Status: not started.

Do not start by fine-tuning.

Prerequisites:

- Prompting stable.
- Local knowledge grounding stable.
- Safeguarding strong.
- Human-reviewed dataset exists.

Dataset target:

- 500-1000 human-reviewed examples minimum.

Include:

- Kenyan English
- Kiswahili
- Sheng
- rural and urban contexts
- school pressure
- family pressure
- money/M-Pesa examples
- careers
- confidence
- relationships
- SRH
- safe refusal/escalation examples

Evaluation set:

- 100 normal mentoring prompts
- 100 curriculum-grounded prompts
- 100 safeguarding prompts
- 50 Sheng/Kiswahili mixed prompts
- 50 adversarial/evasive prompts

Fine-tuning path:

1. Prompt engineering.
2. Local RAG.
3. LoRA fine-tune.
4. Quantize/convert for LiteRT-LM.
5. Pilot only.

## Phase 9: Safeguarding Hardening

Status: not started.

Goal:

- Safeguarding must be consistent across every online and offline response path.

Relevant files:

- `src/lib/safeguarding.ts`
- `src/lib/safeguarding.test.ts`
- `src/pages/Chat.tsx`
- `src/pages/VoiceChat.tsx`
- `src/components/FloatingAssistant.tsx`
- `src/pages/Circles.tsx`
- `src/components/MoodTracker.tsx`

Tasks:

1. Centralize AI preflight.
2. Ensure Category A/B never reaches any model.
3. Queue offline safeguarding flags in Dexie.
4. Sync queued flags to `safeguarding_flags` when online.
5. Add tests for:
   - English
   - Kiswahili
   - Sheng
   - typos
   - spacing/punctuation tricks

Acceptance criteria:

- Category A/B never reaches cloud, local RAG, AICore, LiteRT, or canned response generation.
- Safeguarding tests pass.
- Offline flags sync later.

## Phase 10: Android Test Plan

Status: not started for final improved APK.

Run before sharing broadly:

1. Web checks:
   - `npm.cmd run lint`
   - `npm.cmd test`
   - `npm.cmd run build`
2. Capacitor:
   - `npx.cmd cap sync android`
3. Android:
   - from `android/`
   - `.\gradlew.bat assembleDebug --no-daemon --stacktrace`
4. Manual device checks:
   - fresh install
   - install over previous APK
   - first login online
   - reopen offline
   - free course offline
   - premium gate offline
   - premium entitlement refresh
   - premium content offline during grace period
   - expired entitlement does not unlock premium content
   - Life Kit filters/search
   - module progress offline then sync online
   - Jabari cloud online
   - Jabari offline fallback
   - safeguarding offline
   - app restart offline

Target devices:

- Tecno Spark/Camon
- Infinix Hot/Note
- Samsung A-series
- Xiaomi Redmi
- One older 3 GB RAM Android device if possible

## Immediate Resume Checklist

When continuing from this note:

1. Read `AGENTS.md`.
2. Read `docs/offline_freemium_ai_implementation_plan.md`.
3. Read this file.
4. Inspect current changed files, especially:
   - `src/hooks/useContent.ts`
   - `src/lib/contentPacks.ts`
   - `src/lib/db.ts`
   - `src/data/modules.ts`
   - `src/data/freeModules.ts`
   - `src/data/premiumModules.ts`
   - `src/data/moduleMetadata.ts`
   - `src/pages/ModuleView.tsx`
5. Run or confirm:
   - `npm.cmd run lint`
   - `npm.cmd test`
   - `npm.cmd run build`
6. Continue validation:
   - `npx.cmd cap sync android`
   - Android `assembleDebug`
7. Then decide whether Phase 2 needs one more hardening step before marking complete:
   - Best next hardening step: move premium pack delivery out of the base bundle rather than relying on a lazy chunk.

