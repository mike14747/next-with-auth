import PropTypes from 'prop-types';
import Link from 'next/link';
import Authbar from './Authbar';

import styles from '../../styles/Header.module.css';

export default function Header({ testInfo = '' }) {
    return (
        <div className={styles.headerContainer}>
            <header className={styles.header + ' container'}>
                <div className={styles.leftDiv}>
                    <h1 className={styles.h1} >next-with-auth</h1>

                    <p>
                        <Link href="/">
                            Home
                        </Link>
                    </p>

                    <p>
                        {testInfo}
                    </p>
                </div>

                <div className={styles.rightDiv}>
                    <Authbar />
                </div>

            </header>
        </div>
    );
}

Header.propTypes = {
    testInfo: PropTypes.string,
};
