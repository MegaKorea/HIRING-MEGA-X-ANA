import { NextResponse } from 'next/server';
import { PIN_COOKIE_NAME } from '@/constants/auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PIN_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}
