import { NextResponse } from 'next/server';
import { PIN_COOKIE_MAX_AGE, PIN_COOKIE_NAME } from '@/constants/auth';
import { createPinToken, verifyAppPin } from '@/lib/auth/pin-token';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const pin = typeof body?.pin === 'string' ? body.pin : '';

  let valid: boolean;
  try {
    valid = verifyAppPin(pin);
  } catch {
    return NextResponse.json({ error: 'Server chưa cấu hình PIN' }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: 'Mã PIN không đúng' }, { status: 401 });
  }

  const token = await createPinToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: PIN_COOKIE_MAX_AGE,
  });
  return response;
}
