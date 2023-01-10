'use client';

import PropTypes from 'prop-types';
import { SessionProvider } from 'next-auth/react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import SkipToMain from './components/SkipToMain';

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
