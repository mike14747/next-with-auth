'use client';

import PropTypes from 'prop-types';
import { SessionProvider } from 'next-auth/react';

export default function ClientSession({ children, session }) {
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
