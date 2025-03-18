import { NextResponse } from "next/server";

export function middleware(req) {
    const spt = req.cookies.get("spt");
    const ct = req.cookies.get("ct");

    const { pathname } = req.nextUrl;

    // 🔹 If neither token exists & user tries to access a protected route, redirect to "/"
    if (!spt && !ct && (pathname === "/serviceproviderdashboard" || pathname === "/customerdashboard")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 🔹 If service provider token exists, ensure they are on the right page
    if (spt && pathname !== "/serviceproviderdashboard") {
        return NextResponse.redirect(new URL("/serviceproviderdashboard", req.url));
    }

    // 🔹 If customer token exists, ensure they are on the right page
    if (ct && pathname !== "/customerdashboard") {
        return NextResponse.redirect(new URL("/customerdashboard", req.url));
    }

    return NextResponse.next(); // Allow access if everything is fine
}

// Apply middleware to protected routes
export const config = {
    matcher: ["/","/serviceproviderdashboard", "/customerdashboard", "/customer/signin","/serviceprovider/signin"],
};
