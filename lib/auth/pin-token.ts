const TOKEN_PAYLOAD = 'hmx-pin-unlocked';
const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

export async function createPinToken(): Promise<string> {
  const secret = process.env.PIN_COOKIE_SECRET;
  if (!secret) {
    throw new Error('PIN_COOKIE_SECRET is not set');
  }
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(TOKEN_PAYLOAD));
  return toHex(signature);
}

export async function verifyPinToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expected = await createPinToken();
  return timingSafeEqual(token, expected);
}

export function verifyAppPin(pin: string): boolean {
  const appPin = process.env.APP_PIN;
  if (!appPin) {
    throw new Error('APP_PIN is not set');
  }
  return timingSafeEqual(pin.trim(), appPin);
}
