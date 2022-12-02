import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api/user';

export default NextAuth({
    providers: [
        Credentials({
            name: 'username/password',

            // the credentials property is not needed since we are using a custom login page, but I've left it here anyway
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                const user = await getUserForSignin(credentials.username, credentials.password);

                // I'm adding user id, username and role to the user object... which need to also be added to the token and session below in the callback ffunctions
                return user ? { _id: user._id, name: user.username, role: user.role } : null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 * 24 * 60 * 60 is 30 days
    },
    // pages: {
    //     signIn: '/login',
    // },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // I'm adding some extra properties to the jwt... this is where you must add them
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.role) token.role = user.role;
            return token;
        },
        // I'm adding some extra properties to the session... this is where you must add them
        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            if (token?.role) session.user.role = token.role;
            return session;
        },
    },
});
