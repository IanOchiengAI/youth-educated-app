import type { Module } from '../data/modules';
import { PREMIUM_MODULE_IDS } from '../data/moduleMetadata';
import { db, type LocalEntitlementCache } from './db';

export const PREMIUM_PACK_ID = 'ye-premium-modules';
export const PREMIUM_PACK_VERSION = '1.0.0';
export const PREMIUM_CONTENT_VERSION = '2026-06-21';
export const PREMIUM_ENTITLEMENT_GRACE_DAYS = 30;

export const PREMIUM_PACK_MANIFEST = {
  packId: PREMIUM_PACK_ID,
  version: PREMIUM_PACK_VERSION,
  contentVersion: PREMIUM_CONTENT_VERSION,
  sizeBytes: 43189,
  sha256: '06d3014bb23192e1a17ae4994d4f0adcb04c764edbaaf9e25a8573c179a83689',
  moduleIds: PREMIUM_MODULE_IDS,
  downloadUrl: '',
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isFreshPremiumEntitlement(
  entitlement: LocalEntitlementCache | undefined,
  now = new Date()
) {
  return Boolean(
    entitlement?.isPremium && new Date(entitlement.expiresAt).getTime() > now.getTime()
  );
}

export async function cachePremiumEntitlement(userId: string, isPremium: boolean) {
  const now = new Date();
  await db.entitlementCache.put({
    userId,
    isPremium,
    lastCheckedAt: now.toISOString(),
    expiresAt: isPremium ? addDays(now, PREMIUM_ENTITLEMENT_GRACE_DAYS).toISOString() : now.toISOString(),
  });
}

export async function getCachedPremiumEntitlement(userId?: string) {
  if (!userId) return undefined;
  return db.entitlementCache.get(userId);
}

export async function hasPremiumPackAccess(
  userId?: string,
  isPremiumNow?: boolean,
  options: { canRefreshEntitlement?: boolean } = {}
) {
  if (options.canRefreshEntitlement && userId && typeof isPremiumNow === 'boolean') {
    await cachePremiumEntitlement(userId, isPremiumNow);
    return isPremiumNow;
  }

  return isFreshPremiumEntitlement(await getCachedPremiumEntitlement(userId));
}

export async function loadPremiumModulesFromPack(): Promise<Module[]> {
  const cached = await db.contentPacks.get(PREMIUM_PACK_ID);
  if (cached?.status === 'downloaded' && Array.isArray(cached.payload?.modules)) {
    return cached.payload.modules as Module[];
  }
  // Pack not present — return empty. Caller (useModules) will strip premium bodies.
  return [];
}

export function mergeModuleBodies(baseModules: Module[], fullModules: Module[]) {
  const fullById = new Map(fullModules.map((module) => [module.id, module]));
  return baseModules.map((module) => fullById.get(module.id) ?? module);
}
