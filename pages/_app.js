import PropTypes from 'prop-types';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';

import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.any,
};

export default MyApp;
