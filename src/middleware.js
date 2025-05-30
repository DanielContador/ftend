import { NextResponse } from 'next/server';
import { getCookie } from './shared/utils/session';

export default async function middleware(req) {
    const token = getCookie('authToken', req);
    const { pathname } = req.nextUrl;
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login page
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Routes to match
};
