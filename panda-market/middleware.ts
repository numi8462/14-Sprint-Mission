// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호할 경로 정의
const protectedRoutes = ['/addboard'];
// 인증이 필요하지 않은 경로
// const publicRoutes = ['/', '/boards'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 토큰 확인
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // 로그아웃, 로그인, 회원가입 경로는 건너뛰기
  if (
    pathname.startsWith('/api/logout') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return NextResponse.next();
  }

  // 보호된 라우트에 접근하려고 하는 경우
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // 액세스 토큰이 없고 리프레시 토큰만 있는 경우 -> 토큰 새로고침 시도
    if (!accessToken && refreshToken) {
      // 클라이언트에서 리디렉션하여 토큰 새로고침
      return NextResponse.redirect(new URL('/api/refresh', request.url));
    }

    // 액세스 토큰과 리프레시 토큰이 모두 없는 경우 -> boards 페이지로 리디렉션
    if (!accessToken && !refreshToken) {
      const url = new URL('/boards', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (
    (pathname === '/login' || pathname === '/register') &&
    (accessToken || refreshToken)
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// 미들웨어를 적용할 경로 지정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
