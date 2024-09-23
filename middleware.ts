// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/profile'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if the route is protected
  if (protectedRoutes.includes(pathname)) {
    const token = req.cookies.get('token'); // Example: Use cookies for auth tokens

    if (!token) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/signin', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next(); // Proceed with the request
}

export const config = {
  matcher: ['/dashboard', '/profile'], // Define the paths to apply middleware
};
