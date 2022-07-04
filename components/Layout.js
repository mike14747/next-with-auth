import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <>
            <Header />

            <main className="main-container">
                {children}
            </main>

            <Footer />
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default Layout;
