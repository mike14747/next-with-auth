import PropTypes from 'prop-types';
import ClientSession from './components/ClientSession';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import SkipToMain from './components/SkipToMain';
import { getUnprotectedData } from '../lib/api';

import '../styles/globals.css';

// I need to test getting data via a serverless function here
async function getData() {
    return await getUnprotectedData().catch(error => console.log(error.message));
}

export default async function RootLayout({ children, session }) {
    const data = await getData().catch(error => console.log(error.message));

    return (
        <html lang='en'>
            <head />
            <body id="appWrapper">
                <ClientSession session={session}>
                    <SkipToMain />
                    <Header testInfo={data?.[1].name} />
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
