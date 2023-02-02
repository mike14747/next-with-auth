import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api/user';

export default NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials) return null;

                const { username, password } = credentials;
                const user = await getUserForSignin(username, password);

                // I'm adding _id, username and role to the user object... which need to also be added to the token and session below in the callback functions
                return user ? { _id: user._id, name: user.username, role: user.role } : null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 90 * (24 * 60 * 60), // 24 * 60 * 60 is 1 day
    },
    pages: {
        signIn: '/login',
    },
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
            if (token._id && session.user) session.user._id = token._id;
            if (token.role && session.user) session.user.role = token.role;
            return session;
        },
    },
});