import Link from 'next/link';
import Authbar from './Authbar';

import styles from './Header.module.css';

export default function Header() {
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
                </div>

                <div className={styles.rightDiv}>
                    <Authbar />
                </div>

            </header>
        </div>
    );
}
