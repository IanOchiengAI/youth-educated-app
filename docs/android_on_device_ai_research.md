# Android On-Device AI Research

Date: 2026-06-20

## Current Android Baseline

- The Capacitor Android project builds successfully after syncing the current `dist` bundle.
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Current debug APK size: about 7.0 MB.
- No on-device LLM is bundled in the APK, which is the correct baseline for a small install.

## Recommendation

Keep the Play Store APK small and make offline AI an optional post-install capability.

The app should use this priority order:

1. Cloud Jabari through the existing Supabase `jabari-chat` Edge Function when online.
2. Android AICore / Gemini Nano through ML Kit GenAI Prompt API on supported devices.
3. Optional downloaded LiteRT-LM model pack for users who explicitly want full offline AI.
4. Existing canned `jabariOffline.json` fallback for low-end or unsupported devices.

Safeguarding must stay outside the model path. `checkSafeguarding()` should run before cloud, AICore, LiteRT-LM, or canned fallback responses.

## Why Not Bundle The Model In The APK

Google's MediaPipe LLM Inference Android guide says LLM models are too large to bundle in an APK and should be hosted and downloaded at runtime for deployment:
https://developers.google.com/edge/mediapipe/solutions/genai/llm_inference/android

The current LiteRT Community Gemma 4 E2B package is listed at about 2,583 MB on disk for Android benchmarks, with Android memory measurements around 676 MB on GPU and 1,733 MB on CPU in the published S26 Ultra benchmark:
https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm

That means the older "300-450 MB offline AI pack" assumption in the Phase 2 proposal should be treated as stale. A 2-3 GB optional pack may be viable for some users, but it should not be part of the base APK.

## Best Android Paths

### AICore / Gemini Nano

Use this first where available. AICore lets Android manage the Gemini Nano model and updates, which avoids app storage and model distribution burden. The Android docs describe this as the production path for on-device foundation model access:
https://developer.android.com/ai/gemini-nano

ML Kit's Prompt API is beta, but it gives customizable prompt access to Gemini Nano for text or image+text input:
https://developers.google.com/ml-kit/genai/prompt/android

Tradeoff: availability depends on device support, and the app cannot rely on our own fine-tuned model weights.

### LiteRT-LM Optional Pack

Use this when we need our own downloaded model. LiteRT-LM has a Kotlin Android API, supports GPU/NPU backends, streaming responses, conversations, multimodality, and tool calling:
https://developers.google.com/edge/litert-lm/android

Tradeoff: this requires a native Capacitor plugin, runtime model download, storage checks, checksum validation, background loading, and real-device performance testing.

### RAG / Knowledge Grounding

Use local RAG to make Jabari answer from Youth Educated content without needing to fine-tune every fact into the model. Google's AI Edge RAG guide shows an Android pipeline using local embeddings and SQLite vector storage, though the RAG SDK is marked deprecated:
https://developers.google.com/edge/mediapipe/solutions/genai/rag/android

For a production path, prefer a small local vector database with precomputed YE content embeddings, and use model prompts to inject the top relevant chunks. This keeps the offline knowledge pack much smaller than model fine-tuning.

## Fine-Tuning Strategy

Do not start with full fine-tuning.

Phase 1 should use prompt engineering plus local RAG. This gives us:

- Small base APK.
- Faster Android test cycle.
- Lower safety risk.
- Easier updates to curriculum content.

Phase 2 can test LoRA or fine-tuned LiteRT-LM only after we have:

- 500-1000 reviewed Jabari/Amara training examples.
- A safety evaluation set for English, Kiswahili, and Sheng.
- Real-device benchmarks on Kenyan target phones.
- A clear model-hosting and update policy.

## Android Implementation Plan

1. Keep the current web/Supabase Jabari flow as the default.
2. Add a TypeScript AI provider abstraction:
   - `cloud`
   - `aicore`
   - `litert`
   - `canned-offline`
3. Add a native Android Capacitor plugin only for capability checks first:
   - `isAICoreAvailable()`
   - `getDeviceMemoryClass()`
   - `getFreeStorageBytes()`
4. Gate offline AI in the UI behind device compatibility and explicit user consent.
5. Add the actual LiteRT-LM inference bridge after the APK/device baseline is stable.
6. Test on a physical Android device before investing in model-pack UX.

## Product Decision

For Youth Educated, the strongest near-term approach is:

- Small Android APK now.
- Cloud Jabari when online.
- Better canned offline response plus local content search for all phones.
- AICore/Gemini Nano experiment for supported Android devices.
- LiteRT-LM optional pack only for a later pilot group.

This protects the target users from a giant mandatory download while still keeping the long-term "mentor in every pocket" path open.
