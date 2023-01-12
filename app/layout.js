import PropTypes from 'prop-types';
import ClientSession from './components/ClientSession';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import SkipToMain from './components/SkipToMain';

import '../styles/globals.css';

export default function RootLayout({ children, session }) {
    return (
        <html lang='en'>
            <head />
            <body id="appWrapper">
                <ClientSession session={session}>
                    <SkipToMain />
                    <Header />
                    <Navbar />

                    <main id="main" className="main-container">
                        {children}
                        <ScrollTop />
                    </main>
                    <Footer />
                </ClientSession>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
    session: PropTypes.object,
};
