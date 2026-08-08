import { type NextRequest, NextResponse } from 'next/server';
import { PIN_COOKIE_NAME } from '@/constants/auth';
import { AUTH_ROUTES, DEFAULT_AUTHENTICATED_ROUTE, PUBLIC_ROUTES } from '@/constants/routes';
import { verifyPinToken } from '@/lib/auth/pin-token';

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const unlocked = await verifyPinToken(request.cookies.get(PIN_COOKIE_NAME)?.value);
  const isPublic = isPublicRoute(pathname);
  const isAuth = isAuthRoute(pathname);

  if (isAuth && unlocked) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_AUTHENTICATED_ROUTE;
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (!unlocked && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
