import PropTypes from 'prop-types';
import SkipToMain from './SkipToMain';
import ScrollTop from './ScrollTop';

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <>
            <SkipToMain />
            <Header />

            <main id="main" className="main-container">
                {children}
                <ScrollTop />
            </main>

            <Footer />
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default Layout;
