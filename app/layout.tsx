import PropTypes from 'prop-types';
import { ReactNode } from 'react';
import ClientSessionProvider from './components/ClientSessionProvider';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import SkipToMain from './components/SkipToMain';
import { getSettings } from '../lib/api';
import { Session } from 'next-auth';

import '../styles/mg_base.css';
import '../styles/globals.css';

type RootLayoutProps = {
    children: ReactNode;
    session: Session;
    params: {
        numInitialNewsItems: number;
        newsItemIncrement: number;
    },
};

async function getSettingsData() {
    return await getSettings().catch(error => console.log(error.message));
}

export default async function RootLayout({ children, session, params }: RootLayoutProps) {
    const settingsData = await getSettingsData().catch(error => console.log(error.message));

    params.numInitialNewsItems = settingsData?.numInitialNewsItems || 20;
    params.newsItemIncrement = settingsData?.newsItemIncrement || 50;

    return (
        <html lang='en'>
            <head />
            <body id="appWrapper">
                <ClientSessionProvider session={session}>
                    <SkipToMain />
                    <Header topInfoActive={settingsData?.topInfoActive} topInfoText={settingsData?.topInfoText} />
                    <Navbar />

                    <div className="page-container">
                        {children}
                        <ScrollTop />
                    </div>

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
