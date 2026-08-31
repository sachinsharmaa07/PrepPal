import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

const protectedRoutes = ['/dashboard', '/interview', '/problems', '/student', '/recruiter'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) => path.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    
    // Role-based routing can be added here
    if (path.startsWith('/recruiter') && payload.role !== 'RECRUITER' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (path.startsWith('/student') && payload.role !== 'STUDENT' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
};
