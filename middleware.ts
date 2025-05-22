import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {

  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|register|forgot-password).*)',
  ],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // 如果未登录且访问的不是登录页，重定向到登录页
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 如果已登录且访问的是登录页，重定向到首页
  if (token && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/mine', request.url));
  }

  return NextResponse.next();
}
