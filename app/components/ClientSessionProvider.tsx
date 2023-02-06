'use client';

import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type ClientSessionProps = {
    children: ReactNode;
    session: Session;
}

export default function ClientSession({ children, session }: ClientSessionProps) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}

ClientSession.propTypes = {
    children: PropTypes.node,
    session: PropTypes.object,
};
