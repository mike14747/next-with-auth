import NextAuth, { DefaultSession } from 'next-auth';

declare module "next-auth" {
    interface User {
        _id: string;
        name: string;
        role: string;
        id?: string | number;
    }

    interface Session extends DefaultSession {
        user?: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        role: string;
    }
}