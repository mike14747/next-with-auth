'use client';

import PropTypes from 'prop-types';
import { SessionProvider } from 'next-auth/react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import SkipToMain from './SkipToMain';

import './globals.css';

export default function RootLayout({ children, session }) {
    return (
        <html lang='en'>
            <head />
            <body>
                <SessionProvider session={session}>
                    <SkipToMain />
                    <Header />
                    <Navbar />

                    <main id="main" className="main-container">
                        {children}
                        <ScrollTop />
                    </main>

                    <Footer />
                </SessionProvider>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
    session: PropTypes.object,
};
