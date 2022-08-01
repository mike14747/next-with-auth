import Link from 'next/link';
import Authbar from './Authbar';

import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        // to make the header full width, just omit the container class
        <div className={styles.header + ' container'}>
            <div className={styles.leftDiv}>
                <p>This is the Header component.</p>

                <p>
                    <Link href="/">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            Home
                        </a>
                    </Link>
                </p>
            </div>

            <div className={styles.rightDiv}>
                <Authbar />
            </div>
        </div>
    );
}
