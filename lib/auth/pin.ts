import {
  APP_PIN,
  PIN_COOKIE_MAX_AGE,
  PIN_COOKIE_NAME,
  PIN_COOKIE_VALUE,
} from '@/constants/auth';

export function verifyPin(pin: string): boolean {
  return pin.trim() === APP_PIN;
}

export function setPinUnlockedCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = [
    `${PIN_COOKIE_NAME}=${PIN_COOKIE_VALUE}`,
    'path=/',
    `max-age=${PIN_COOKIE_MAX_AGE}`,
    'SameSite=Lax',
  ].join('; ');
}

export function clearPinUnlockedCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${PIN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
