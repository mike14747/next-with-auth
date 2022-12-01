import { NextResponse } from 'next/server';

export function middleware(req) {
    console.log('inside the middleware file (' + req.nextUrl + ')');

    const url = req.nextUrl.clone();
    url.pathname = '/protected';

    return NextResponse.rewrite(url);
}

export const config = {
    matcher: '/public',
};
