const STORAGE_KEY = 'ye_pin_hash';
const SALT = 'ye-app-2024';

async function sha256(value: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(value + SALT));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function isPinSet(): boolean {
  return !!localStorage.getItem(STORAGE_KEY);
}

export async function savePin(pin: string): Promise<void> {
  localStorage.setItem(STORAGE_KEY, await sha256(pin));
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return true;
  return (await sha256(pin)) === stored;
}

export function clearPin(): void {
  localStorage.removeItem(STORAGE_KEY);
}
