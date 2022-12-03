// import { NextResponse } from 'next/server';

// export function middleware(req) {
//     console.log('inside the middleware file (' + req.nextUrl + ')');

//     const url = req.nextUrl.clone();
//     url.pathname = '/protected';

//     return NextResponse.rewrite(url);
// }

// export const config = {
//     matcher: '/public',
// };

import { withAuth } from 'next-auth/middleware';

export default withAuth(
    function middleware(req) {
        // console.log('token:', req.nextauth.token);
    },
    {
        callbacks: {
            // authorized: ({ token }) => token?.role === 'user',
            authorized({ req, token }) {
                if (token) return true;
            },
        },
        pages: {
            signIn: '/login',
        },
    },
);

export const config = { matcher: ['/protected2'] };
