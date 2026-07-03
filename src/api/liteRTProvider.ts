import { checkSafeguarding } from '../lib/safeguarding';
import { registerPlugin } from '@capacitor/core';
import type { AIRequest } from './aiProvider';
import { getModelPackStatus } from '../lib/modelPackManager';

export interface LiteRTInferencePlugin {
  runInference(options: { prompt: string; modelPath: string }): Promise<{ text: string }>;
}

const LiteRTInference = registerPlugin<LiteRTInferencePlugin>('LiteRTInference', {
  web: {
    runInference: async () => ({ text: 'Smart Jabari inference — web fallback.' }),
  },
});

export async function runLiteRTInference(request: AIRequest): Promise<string> {
  // 1. Safeguarding pre-check (defense-in-depth)
  const safeguardCheck = checkSafeguarding(
    request.message,
    request.user?.ageBracket ?? '',
    request.user?.id,
    'litert'
  );
  if (safeguardCheck.triggered && (safeguardCheck.category === 'A' || safeguardCheck.category === 'B')) {
    return safeguardCheck.escalationText ?? 'Please speak to a trusted adult. Childline Kenya: 116';
  }

  // 2. Get local model path
  const modelStatus = await getModelPackStatus();
  if (!modelStatus || modelStatus.status !== 'downloaded' || !modelStatus.storagePath) {
    throw new Error('LiteRT model pack not installed');
  }

  // 3. Call native plugin
  try {
    const res = await LiteRTInference.runInference({
      prompt: request.message,
      modelPath: modelStatus.storagePath,
    });
    return res.text;
  } catch (err: any) {
    console.error('[liteRTProvider] Native inference failed:', err);
    throw new Error('Native inference error: ' + err.message);
  }
}
