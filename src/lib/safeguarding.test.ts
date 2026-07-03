import { describe, it, expect, vi } from 'vitest';
import { checkSafeguarding } from './safeguarding';

vi.mock('./db', () => {
  let items: any[] = [];
  const syncQueueMock = {
    add: vi.fn().mockImplementation(async (item) => {
      items.push(item);
      return items.length;
    }),
    clear: vi.fn().mockImplementation(async () => {
      items = [];
    }),
    toArray: vi.fn().mockImplementation(async () => {
      return [...items];
    }),
  };
  return {
    db: {
      syncQueue: syncQueueMock,
    },
  };
});

describe('checkSafeguarding', () => {
  describe('Category A — immediate risk', () => {
    it('triggers on self-harm keywords', () => {
      const result = checkSafeguarding('I want to hurt myself', '16-18');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('A');
      expect(result.escalationText).toContain('116');
    });

    it('triggers on Kiswahili self-harm keywords', () => {
      const result = checkSafeguarding('nataka kujiua', '16-18');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('A');
    });

    it('triggers on homelessness risk keyword', () => {
      const result = checkSafeguarding('I have nowhere to sleep tonight', '13-15');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('A');
    });

    it('triggers on abuse disclosure', () => {
      const result = checkSafeguarding('he is hurting me', '16-18');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('A');
    });
  });

  describe('Category B — serious concern', () => {
    it('triggers on coercion keyword', () => {
      const result = checkSafeguarding('I am being forced to do things', '16-18');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('B');
    });

    it('escalates Category B to A for age 10-12', () => {
      const result = checkSafeguarding('someone is giving me money to', '10-12');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('A');
    });
  });

  describe('Category C — emotional distress', () => {
    it('triggers on severe loneliness', () => {
      const result = checkSafeguarding('I feel completely alone', '16-18');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('C');
      expect(result.escalationText).toBeNull();
    });

    it('escalates Category C to B for age 10-12', () => {
      const result = checkSafeguarding("I can't cope anymore", '10-12');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('B');
    });
  });

  describe('Category D — SRH topics for minors', () => {
    it('triggers for under-16 on SRH keywords', () => {
      const result = checkSafeguarding('I think I might be pregnant', '13-15');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('D');
      expect(result.escalationText).toBeTruthy();
    });

    it('does NOT trigger for 16-18 on SRH keywords', () => {
      const result = checkSafeguarding('I have a question about condoms', '16-18');
      expect(result.triggered).toBe(false);
    });

    it('triggers for Kiswahili SRH keyword', () => {
      const result = checkSafeguarding('nimepata mimba', '13-15');
      expect(result.triggered).toBe(true);
      expect(result.category).toBe('D');
    });
  });

  describe('safe messages', () => {
    it('does not trigger on normal conversation', () => {
      const result = checkSafeguarding('I did well on my math test today!', '16-18');
      expect(result.triggered).toBe(false);
      expect(result.category).toBeNull();
    });

    it('does not trigger on partial keyword matches', () => {
      // "sex" inside "textbook" should not match
      const result = checkSafeguarding('I need a new textbook', '13-15');
      expect(result.triggered).toBe(false);
    });
  });

  describe('priority ordering', () => {
    it('Category A takes priority over B keywords in the same message', () => {
      const result = checkSafeguarding('I want to hurt myself and being forced to', '16-18');
      expect(result.category).toBe('A');
    });
  });

  describe('Sheng variations and boundaries', () => {
    it('triggers on Sheng/Swahili self-harm variations', () => {
      const result1 = checkSafeguarding('nataka kujidhuru', '16-18');
      expect(result1.triggered).toBe(true);
      expect(result1.category).toBe('A');

      const result2 = checkSafeguarding('siku moja nitajiua', '16-18');
      expect(result2.triggered).toBe(true);
      expect(result2.category).toBe('A');
    });

    it('does NOT trigger on general complaints without keyword matches', () => {
      const result1 = checkSafeguarding('vitu ni ngumu sana leo', '16-18');
      expect(result1.triggered).toBe(false);

      const result2 = checkSafeguarding('sijui nifanye nini na hali hii', '16-18');
      expect(result2.triggered).toBe(false);
    });

    it('successfully triggers on spaced out or leetspeak bypass attempts', () => {
      const result1 = checkSafeguarding('want to k i l l myself', '16-18');
      expect(result1.triggered).toBe(true);
      expect(result1.category).toBe('A');

      const result2 = checkSafeguarding('w4nt t0 k1ll mys3lf', '16-18');
      expect(result2.triggered).toBe(true);
      expect(result2.category).toBe('A');

      const result3 = checkSafeguarding('n i t a j i u a', '16-18');
      expect(result3.triggered).toBe(true);
      expect(result3.category).toBe('A');
    });

    it('verifies that unrelated normal words do not trigger false positives', () => {
      const result = checkSafeguarding('want 2 kill some time today', '16-18');
      expect(result.triggered).toBe(false);
    });
  });
});

import { runAIPreflight } from './aiPreflight';
import { db } from './db';

describe('runAIPreflight integration', () => {
  it('blocks Category A/B messages and queues offline safeguarding flags when offline', async () => {
    // Clear sync queue first
    await db.syncQueue.clear();

    const mockUser = { id: 'test-user-id-123', ageBracket: '16-18' };
    const preflight = await runAIPreflight('I want to kill myself', mockUser, 'chat_test', true);

    expect(preflight.blocked).toBe(true);
    expect(preflight.safeguarding.category).toBe('A');
    expect(preflight.responseText).toContain('116');

    // Verify it is queued in Dexie syncQueue
    const queued = await db.syncQueue.toArray();
    expect(queued).toHaveLength(1);
    expect(queued[0].userId).toBe('test-user-id-123');
    expect(queued[0].actionType).toBe('SAFEGUARDING_FLAG');
    expect(queued[0].payload.category).toBe('A');
    expect(queued[0].payload.message).toBe('[REDACTED SAFEGUARDING DISCLOSURE]');
    expect(queued[0].payload.source).toBe('chat_test');
    expect(queued[0].payload.status).toBe('pending');
  });

  it('allows safe messages through and does not queue anything', async () => {
    await db.syncQueue.clear();

    const mockUser = { id: 'test-user-id-123', ageBracket: '16-18' };
    const preflight = await runAIPreflight('Habari, mambo vipi?', mockUser, 'chat_test', true);

    expect(preflight.blocked).toBe(false);
    expect(preflight.safeguarding.triggered).toBe(false);

    const queued = await db.syncQueue.toArray();
    expect(queued).toHaveLength(0);
  });

  it('allows Category D messages with a guidance prefix for under-16 users', async () => {
    const mockUser = { id: 'test-user-id-123', ageBracket: '13-15' };
    const preflight = await runAIPreflight('I think I might be pregnant', mockUser, 'chat_test', false);

    expect(preflight.blocked).toBe(false);
    expect(preflight.safeguarding.category).toBe('D');
    expect(preflight.safeguarding.guidancePrefix).toContain('trusted adult');
  });
});
