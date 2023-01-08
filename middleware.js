import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        // console.log('token:', req.nextauth.token);
        // console.log('req.nextUrl.pathname:', req.nextUrl.pathname);

        // if a user is trying navigate to the /admin page without being logged in with a role of admin, redirect them to the homepage
        if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'admin') {
            console.log('---You do not have permission to view the admin page!---');
            return NextResponse.redirect(`${req.nextUrl.origin}/`);
        }
    },
    {
        callbacks: {
            // authorized: ({ token }) => token?.role === 'user',
            authorized({ token }) {
                // console.log({ token });
                return !!token;
            },
        },
    },
);

export const config = { matcher: ['/protected', '/admin'] };
