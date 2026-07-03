import type { User } from '../AppContext';
import { sendCloudMessage, InteractionMode, RoleplayScenario } from './jabari';
import offlineResponses from '../data/jabariOffline.json';
import { getDeviceCapabilities } from '../lib/capabilityStore';
import { isAICoreCapable, isDeviceAICapable } from '../lib/androidCapabilities';

export type AIProviderId = 'cloud' | 'local-rag' | 'aicore' | 'litert' | 'canned';

export interface AIRequest {
  message: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
  user: User | null;
  mode: InteractionMode;
  persona: 'amara' | 'jabari';
  scenario?: RoleplayScenario;
  isOffline: boolean;
}

export interface AIResponse {
  text: string;
  provider: AIProviderId;
  offline: boolean;
  queued?: boolean;
}

export async function runAICoreInference(_request: AIRequest): Promise<string> {
  throw new Error('AICore provider not yet implemented');
}

export async function runLiteRTInference(_request: AIRequest): Promise<string> {
  throw new Error('LiteRT provider not yet implemented');
}

export async function routeAIRequest(request: AIRequest): Promise<AIResponse> {
  const { message, history, user, mode, persona, scenario, isOffline } = request;

  // 1. If online: call cloud path
  if (!isOffline) {
    try {
      const text = await sendCloudMessage(message, history, user, mode, scenario, persona);
      return { text, provider: 'cloud', offline: false };
    } catch (err) {
      console.warn('[aiProvider] Cloud request failed, attempting offline fallback:', err);
    }
  }

  // 2. If offline (or cloud failed): try local-rag path
  try {
    const { getKnowledgeIndex } = await import('../lib/knowledgeStore');
    const { searchKnowledge, formatKnowledgeForPrompt } = await import('../lib/localKnowledge');

    const index = getKnowledgeIndex();
    const results = searchKnowledge(message, index, { maxResults: 3, minScore: 1 });

    if (results.length > 0) {
      const contextBlock = formatKnowledgeForPrompt(results);
      const lowerMessage = message.toLowerCase();
      const cannedFallback = (offlineResponses as { triggers: string[]; response: string }[]).find(r =>
        r.triggers.some(t => lowerMessage.includes(t))
      );
      const personaName = persona === 'jabari' ? 'Jabari' : 'Amara';
      let baseResponse = cannedFallback
         ? cannedFallback.response
         : "Mambo! I'm in offline mode, but I found something relevant for you. 😊";
      
      baseResponse = baseResponse.replace(/\{\{persona\}\}/g, personaName);
      
      return {
        text: contextBlock + '\n\n' + baseResponse,
        provider: 'local-rag',
        offline: true
      };
    }
  } catch (err) {
    console.error('[aiProvider] Offline RAG lookup failed:', err);
  }

  // 2.5 Try AICore if available (stub — Phase 6 gates, Phase 7 implements inference)
  try {
    const caps = getDeviceCapabilities();
    if (caps && isAICoreCapable(caps)) {
      // AICore capability confirmed — inference to be implemented in Phase 7
      // For now, fall through to canned
    }
  } catch (err) {
    console.error('[aiProvider] AICore capability check failed:', err);
  }

  // 2.7 Try LiteRT pack if available
  try {
    const caps = getDeviceCapabilities();
    const { getModelPackStatus } = await import('../lib/modelPackManager');
    const modelStatus = await getModelPackStatus();
    if (modelStatus?.status === 'downloaded' && caps && isDeviceAICapable(caps)) {
      const { runLiteRTInference } = await import('./liteRTProvider');
      const liteRTText = await runLiteRTInference(request);
      return { text: liteRTText, provider: 'litert', offline: true };
    }
  } catch (err) {
    console.error('[aiProvider] LiteRT inference failed:', err);
  }

  // 3. Fallback to canned responses
  const lowerMessage = message.toLowerCase();
  const fallback = (offlineResponses as { triggers: string[]; response: string }[]).find(r =>
    r.triggers.some(t => lowerMessage.includes(t))
  );
  
  const personaName = persona === 'jabari' ? 'Jabari' : 'Amara';
  let cannedText = fallback?.response;
  let queued = false;

  if (!fallback) {
    // Complex question: Tell the user we're queueing it
    cannedText = `I'm offline right now so I can't think deeply about this, but I've saved your question! The next time your phone catches a signal, I'll get the answer for you.`;
    queued = true;
  } else {
    cannedText = cannedText.replace(/\{\{persona\}\}/g, personaName);
  }
  
  return {
    text: cannedText,
    provider: 'canned',
    offline: true,
    queued
  };
}
