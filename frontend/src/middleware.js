import { NextResponse } from 'next/server';

export function middleware(req) {
    // Get cookies from the request
    const token = req.cookies.get('token11');

    // Protected routes
    const protectedRoutes = ['/serviceproviderdashboard', '/customerdashboard'];

    // If token is missing and the user is trying to access a protected route, redirect to "/"
    if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', req.url));
    }


    return NextResponse.next(); // Allow access if token exists
}

// Apply middleware only to protected routes
export const config = {
    matcher: ['/serviceproviderdashboard', '/customerdashboard'],
};
