import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const cookieStore = request.cookies;
  const token = cookieStore.get('_sess_auth')?.value;

  // Check CMS routes
  if (request.nextUrl.pathname.startsWith('/cms')) {
    try {
      if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const verified = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
      );

      const payload = verified.payload as any;
      if (!payload.roleId || payload.roleName !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Token verification error:', error);
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Check API POST requests
  if (request.nextUrl.pathname.startsWith('/api') && request.method === 'POST') {
    // List of public API endpoints that don't require authentication
    const publicPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/uploadthing'  // Add uploadthing to public paths
    ];

    // Skip authentication for public endpoints
    if (publicPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }

    try {
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized - No token provided' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const verified = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
      );

      console.log('Token payload:', verified.payload);

      const payload = verified.payload as any;
      // Remove the admin role check to allow all authenticated users to make POST requests
      return NextResponse.next();
      
    } catch (error) {
      console.error('Token verification error:', error);
      return new NextResponse(JSON.stringify({ error: 'Unauthorized - Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cms/:path*', '/api/:path*']
};
