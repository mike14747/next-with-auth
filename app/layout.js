import PropTypes from 'prop-types';
import ClientSessionProvider from './components/ClientSession';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import SkipToMain from './components/SkipToMain';
import { getSettings } from '../lib/api';

import '../styles/globals.css';

async function getSettingsData() {
    return await getSettings().catch(error => console.log(error.message));
}

export default async function RootLayout({ children, session, ...props }) {
    const settingsData = await getSettingsData().catch(error => console.log(error.message));

    props.params.numInitialNewsItems = settingsData?.numInitialNewsItems || 20;
    props.params.newsItemIncrement = settingsData?.newsItemIncrement || 50;

    return (
        <html lang='en'>
            <head />
            <body id="appWrapper">
                <ClientSessionProvider session={session}>
                    <SkipToMain />
                    <Header topInfoActive={settingsData?.topInfoActive} topInfoText={settingsData?.topInfoText} />
                    <Navbar />

                    <main id="main" className="main-container">
                        {children}
                        <ScrollTop />
                    </main>
                    <Footer contactEmail={settingsData?.contactEmail} />
                </ClientSessionProvider>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
    session: PropTypes.object,
};
