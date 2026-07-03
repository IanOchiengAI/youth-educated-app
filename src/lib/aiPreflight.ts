import { checkSafeguarding, REDACTED_SAFEGUARDING_MESSAGE, type SafeguardingResult } from './safeguarding';
import { db } from './db';

export interface PreflightResult {
  blocked: boolean;
  safeguarding: SafeguardingResult;
  responseText?: string; // set if blocked — return this to the user
}

export async function runAIPreflight(
  message: string,
  user: { id?: string; ageBracket?: string } | null,
  source: string,
  isOffline: boolean
): Promise<PreflightResult> {
  const result = checkSafeguarding(
    message,
    user?.ageBracket ?? '',
    user?.id,
    source
  );

  if (!result.triggered) {
    return { blocked: false, safeguarding: result };
  }

  // Category A or B — block entirely
  if (result.category === 'A' || result.category === 'B') {
    // Queue flag for offline sync
    if (isOffline && user?.id && result.category) {
      await queueOfflineSafeguardingFlag(user.id, result.category, message, source);
    }
    return {
      blocked: true,
      safeguarding: result,
      responseText: result.escalationText ?? 'Please speak to a trusted adult. Childline Kenya: 116',
    };
  }

  // Category C — allow through but prefix response (handled by caller if online, or logged here if offline)
  if (result.category === 'C') {
    if (isOffline && user?.id) {
      await queueOfflineSafeguardingFlag(user.id, result.category, message, source);
    }
    return { blocked: false, safeguarding: result };
  }

  if (result.category === 'D') {
    return {
      blocked: false,
      safeguarding: {
        ...result,
        guidancePrefix: result.guidancePrefix ?? result.escalationText ?? undefined,
      },
    };
  }

  return { blocked: false, safeguarding: result };
}

async function queueOfflineSafeguardingFlag(
  userId: string,
  category: string,
  _message: string,
  source: string
) {
  await db.syncQueue.add({
    userId,
    actionType: 'SAFEGUARDING_FLAG',
    payload: { category, message: REDACTED_SAFEGUARDING_MESSAGE, source, status: 'pending' },
    createdAt: new Date().toISOString(),
    synced: false,
  });
}
