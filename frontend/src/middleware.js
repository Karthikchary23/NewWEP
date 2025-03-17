import { NextResponse } from 'next/server';

export function middleware(req) {
    // Get cookies from the request
    const spt = req.cookies.get('spt');
    const ct =req.cookies.get('ct')

    // Protected routes
    const { pathname } = req.nextUrl;
    // If token is missing and the user is trying to access a protected route, redirect to "/"
    if (!spt && !ct && pathname!=='/') {
        return NextResponse.redirect(new URL('/', req.url));
    }
    else if (spt && pathname !== '/serviceproviderdashboard') {
        return NextResponse.redirect(new URL('/serviceproviderdashboard', req.url));
    }

    else if (ct && pathname !== '/customerdashboard') {
        return NextResponse.redirect(new URL('/customerdashboard', req.url));
    }
    if (spt && pathname == '/') {
        return NextResponse.redirect(new URL('/serviceproviderdashboard', req.url));
    }

    return NextResponse.next(); // Allow access if token exists
}

// Apply middleware only to protected routes
export const config = {
    matcher: ['/serviceproviderdashboard', '/customerdashboard'],
};
