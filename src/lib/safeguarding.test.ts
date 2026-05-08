import { describe, it, expect } from 'vitest';
import { checkSafeguarding } from './safeguarding';

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
});
