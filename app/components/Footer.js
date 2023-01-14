import PropTypes from 'prop-types';
import Link from 'next/link';

import styles from '../../styles/Footer.module.css';

export default function Footer({ contactEmail }) {
    return (
        <div className={styles.footerContainer}>
            <footer className={styles.footer + ' container'}>
                <p className={styles.copyright}>&copy; 2022 next-with-auth</p>

                {contactEmail &&
                    <address className="text-center">
                        Contact me at:<> </>
                        <Link href={`mailto:${contactEmail}`}>
                            {contactEmail}
                        </Link>
                    </address>
                }
            </footer>
        </div>
    );
}

Footer.propTypes = {
    contactEmail: PropTypes.string,
};
