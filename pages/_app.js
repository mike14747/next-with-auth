import PropTypes from 'prop-types';
import Layout from '../components/Layout';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
            <Layout>
                <Component {...pageProps} />
            </Layout>
    );
}

MyApp.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.any,
};

export default MyApp;