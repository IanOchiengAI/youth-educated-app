// Synchronous encryption utility for Dexie IndexedDB tables.
// Employs RC4 with a random 8-character IV (salted key) to prevent keystream reuse.
// Keys are derived using the local PIN hash from localStorage.

const PREFIX = '_enc_:';

function rc4(key: string, str: string): string {
  const s: number[] = [];
  let j = 0;
  let x: number;
  let res = '';

  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }

  let i = 0;
  j = 0;
  for (let y = 0; y < str.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}

export function encryptText(text: string, pinHash: string): string {
  if (!text) return text;
  // If already encrypted, return as-is
  if (text.startsWith(PREFIX)) return text;
  
  // Generate a random 8-character hex IV
  const chars = '0123456789abcdef';
  let iv = '';
  for (let i = 0; i < 8; i++) {
    iv += chars.charAt(Math.floor(Math.random() * 16));
  }

  const saltedKey = pinHash + iv;
  const cipher = rc4(saltedKey, text);

  // Convert ciphertext bytes to hex
  let cipherHex = '';
  for (let i = 0; i < cipher.length; i++) {
    cipherHex += cipher.charCodeAt(i).toString(16).padStart(2, '0');
  }

  return PREFIX + iv + cipherHex;
}

export function decryptText(cipherTextWithIv: string, pinHash: string): string {
  if (!cipherTextWithIv || !cipherTextWithIv.startsWith(PREFIX)) {
    return cipherTextWithIv;
  }

  const raw = cipherTextWithIv.substring(PREFIX.length);
  if (raw.length < 8) return cipherTextWithIv;

  const iv = raw.substring(0, 8);
  const cipherHex = raw.substring(8);
  const saltedKey = pinHash + iv;

  // Convert hex back to ciphertext bytes
  let cipher = '';
  for (let i = 0; i < cipherHex.length; i += 2) {
    cipher += String.fromCharCode(parseInt(cipherHex.substring(i, i + 2), 16));
  }

  try {
    return rc4(saltedKey, cipher);
  } catch (err) {
    console.error('[crypto] Decryption failed:', err);
    return '';
  }
}
