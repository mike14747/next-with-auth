import PropTypes from 'prop-types';
import Link from 'next/link';
import Authbar from './Authbar';

import styles from '../../styles/Header.module.css';

type HeaderProps = {
    topInfoActive: boolean | null;
    topInfoText: string | null;
}

export default function Header({ topInfoActive = false, topInfoText = '' }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerBody + ' container'}>
                <div className={styles.leftDiv}>
                    <h1 className={styles.h1} >next-with-auth</h1>

                    {topInfoActive && topInfoText &&
                        <p>
                            <small>
                                {topInfoText}
                            </small>
                        </p>
                    }

                    <p>
                        <Link href="/">
                            Home
                        </Link>
                    </p>
                </div>

                <div className={styles.rightDiv}>
                    <Authbar />
                </div>
            </div>
        </header>
    );
}

Header.propTypes = {
    topInfoActive: PropTypes.bool,
    topInfoText: PropTypes.string,
};
