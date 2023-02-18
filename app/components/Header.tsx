import Link from 'next/link';
import Authbar from './Authbar';

import styles from '../../styles/Header.module.css';

export default function Header({ topInfoActive = false, topInfoText = '' }: { topInfoActive: boolean, topInfoText: string }) {
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
