'use client';

import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export default function ClientSession({ children, session }: { children: ReactNode, session: Session }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}
